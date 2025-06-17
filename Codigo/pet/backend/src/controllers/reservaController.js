const { Op } = require('sequelize');
const { Reserva, Pet } = require('../models');
const moment = require('moment');

// Criar uma nova reserva
exports.createReserva = async (req, res) => {
    try {
        const { idPet, dataEntrada, dataSaida, status, idFuncionario } = req.body;
        const idTutor = req.user.id;

        // Verifica se o pet pertence ao tutor
        const pet = await Pet.findOne({
            where: { idPet, idTutor }
        });

        if (!pet) {
            return res.status(403).json({ error: 'Pet não encontrado ou não pertence a você' });
        }

        const formattedDataEntrada = moment(dataEntrada).format('YYYY-MM-DD');
        const formattedDataSaida = moment(dataSaida).format('YYYY-MM-DD');

        if (new Date(dataEntrada) > new Date(dataSaida)) {
            return res.status(400).json({ error: "A data de entrada não pode ser posterior à data de saída." });
        }

        const novaReserva = await Reserva.create({
            idPet,
            idTutor, // Adiciona o idTutor
            data_entrada: formattedDataEntrada,
            data_saida: formattedDataSaida,
            status: status,
            idFuncionario
        });

        return res.status(201).json(novaReserva);
    } catch (error) {
        console.error("Erro ao criar reserva:", error);
        return res.status(500).json({ error: 'Erro ao criar reserva' });
    }
};

// Obter todas as reservas do tutor logado
exports.getAllReservas = async (req, res) => {
    try {
        const id = req.user.id;
        
        const reservas = await Reserva.findAll({
            where: {
                [Op.or]: [
                    { idTutor: id },
                    { idFuncionario: id }
                ]
            },
            include: [{
                model: Pet,
                attributes: ['idPet', 'nome']
            }],
            order: [['data_entrada', 'DESC']]
        });
        
        return res.status(200).json(reservas);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar reservas' });
    }
};

// Obter reservas apenas do tutor logado (para histórico do tutor)
exports.getReservasByTutor = async (req, res) => {
    try {
        const idTutor = req.user.id;
        
        const reservas = await Reserva.findAll({
            where: {
                idTutor: idTutor
            },
            include: [{
                model: Pet,
                attributes: ['idPet', 'nome', 'raca', 'porte']
            }],
            order: [['data_entrada', 'DESC']]
        });
        
        return res.status(200).json(reservas);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar reservas do tutor' });
    }
};

// Obter uma reserva específica (apenas se o pet pertencer ao tutor)
exports.getReservaById = async (req, res) => {
    try {
        const idTutor = req.user.id;
        
        const reserva = await Reserva.findOne({
            where: { idReserva: req.params.idReserva },
            include: [{
                model: Pet,
                where: { idTutor },
                attributes: ['idPet', 'nome']
            }]
        });
        
        if (!reserva) {
            return res.status(404).json({ error: 'Reserva não encontrada' });
        }

        // Formatar as datas para o formato 'YYYY-MM-DD' antes de retornar ao frontend
        reserva.dataEntrada = moment(reserva.data_entrada).format('YYYY-MM-DD');
        reserva.dataSaida = moment(reserva.data_saida).format('YYYY-MM-DD');

        return res.status(200).json(reserva);
    } catch (error) {
        console.error('Erro ao buscar reserva:', error);
        return res.status(500).json({ error: 'Erro ao buscar reserva' });
    }
};

// Atualizar a reserva (apenas se o pet pertencer ao tutor)
exports.updateReserva = async (req, res) => {
    console.log("Dados recebidos no backend:", req.body);
  
    try {
        const id = req.user.id;
        
        const reserva = await Reserva.findOne({
            where: { 
                idReserva: req.params.idReserva,
            },
            include: [{
                model: Pet,
            }]
        });
        
        if (!reserva) {
            return res.status(404).json({ error: "Reserva não encontrada" });
        }
  
        console.log("Reserva antes da atualização:", reserva.toJSON());

        if (new Date(req.body.dataEntrada) > new Date(req.body.dataSaida)) {
            return res.status(400).json({ error: "A data de entrada não pode ser posterior à data de saída." });
        }

        await reserva.update({
            data_entrada: req.body.dataEntrada,
            data_saida: req.body.dataSaida,
            status: req.body.status
        });
        
        console.log("Reserva após a atualização:", reserva.toJSON());
  
        res.json({ message: "Reserva atualizada com sucesso" });
    } catch (error) {
        console.error("Erro ao atualizar reserva:", error);
        res.status(500).json({ error: "Erro ao atualizar reserva" });
    }
};

// Excluir reserva (permitido para tutor dono do pet ou funcionário)
exports.deleteReserva = async (req, res) => {
    try {
        const { idReserva } = req.params;
        const userId = req.user.id;
        const userType = req.user.tipo;
        
        console.log('Tentando cancelar reserva:', { idReserva, userId, userType });

        // Validar parâmetros de entrada
        if (!idReserva) {
            return res.status(400).json({ error: 'ID da reserva não fornecido' });
        }

        if (!userId || !userType) {
            return res.status(401).json({ error: 'Informações do usuário não disponíveis' });
        }
        
        let reserva;
        
        try {
            if (userType === 'Tutor') {
                console.log('Usuário é Tutor, buscando reserva');
                reserva = await Reserva.findOne({
                    where: { 
                        idReserva,
                        idTutor: userId
                    }
                });
            } else if (userType === 'Funcionario') {
                console.log('Usuário é Funcionario, buscando reserva');
                reserva = await Reserva.findByPk(idReserva);
            } else {
                console.log('Tipo de usuário não reconhecido:', userType);
                return res.status(403).json({ error: 'Usuário não autorizado' });
            }
        } catch (dbError) {
            console.error('Erro ao buscar reserva no banco:', dbError);
            return res.status(500).json({ error: 'Erro ao buscar reserva no banco de dados' });
        }

        if (!reserva) {
            console.log('Reserva não encontrada');
            return res.status(404).json({ error: 'Reserva não encontrada ou você não tem permissão para cancelá-la' });
        }

        try {
            console.log('Atualizando status da reserva para Cancelada...');
            await reserva.update({ status: 'Cancelada' });
            console.log('Reserva cancelada com sucesso');
            return res.status(200).json({ message: 'Reserva cancelada com sucesso' });
        } catch (updateError) {
            console.error('Erro ao cancelar reserva:', updateError);
            return res.status(500).json({ error: 'Erro ao cancelar reserva no banco de dados' });
        }
    } catch (error) {
        console.error('Erro não tratado ao cancelar reserva:', error);
        return res.status(500).json({ 
            error: 'Erro interno ao processar o cancelamento da reserva',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Obter pets com reservas ativas
exports.getPetsWithActiveReservations = async (req, res) => {
    try {
        const reservas = await Reserva.findAll({
            where: {
                status: 'Ativa'
            },
            include: [{
                model: Pet,
                required: true,
                include: [{
                    model: require('../models/tutor'),
                    required: true,
                    attributes: ['nome']
                }]
            }]
        });

        if (!reservas || reservas.length === 0) {
            return res.status(200).json([]);
        }

        // Formatar a resposta para incluir apenas os dados necessários
        const petsAtivos = reservas.map(reserva => ({
            idPet: reserva.Pet.idPet,
            nome: reserva.Pet.nome,
            Reservas: [{
                Tutor: {
                    nome: reserva.Pet.Tutor.nome
                }
            }]
        }));

        return res.status(200).json(petsAtivos);
    } catch (error) {
        console.error('Erro ao buscar pets com reservas ativas:', error);
        return res.status(500).json({ error: 'Erro ao buscar pets com reservas ativas' });
    }
};

// Obter pets com reservas ativas para o relatório
exports.getPetsWithActiveReservationsReport = async (req, res) => {
    try {
        const hoje = new Date();
        hoje.setHours(23, 59, 59, 999); // Set to end of day
        
        const seteDiasAtras = new Date(hoje);
        seteDiasAtras.setDate(hoje.getDate() - 7);
        seteDiasAtras.setHours(0, 0, 0, 0); // Set to start of day

        const reservas = await Reserva.findAll({
            where: {
                [Op.or]: [
                    // Incluir todas as reservas ativas, independente da data
                    {
                        status: 'Ativa'
                    },
                    // Incluir reservas finalizadas dentro do período
                    {
                        [Op.and]: [
                            {
                                status: 'Finalizada'
                            },
                            {
                                [Op.or]: [
                                    // Reservas que começam no período
                                    {
                                        data_entrada: {
                                            [Op.between]: [seteDiasAtras, hoje]
                                        }
                                    },
                                    // Reservas que terminam no período
                                    {
                                        data_saida: {
                                            [Op.between]: [seteDiasAtras, hoje]
                                        }
                                    },
                                    // Reservas que englobam todo o período
                                    {
                                        [Op.and]: [
                                            {
                                                data_entrada: {
                                                    [Op.lte]: seteDiasAtras
                                                }
                                            },
                                            {
                                                data_saida: {
                                                    [Op.gte]: hoje
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            attributes: ['data_entrada', 'data_saida', 'status'],
            include: [{
                model: Pet,
                required: true,
                attributes: ['idPet', 'nome'],
                include: [{
                    model: require('../models/tutor'),
                    required: true,
                    attributes: ['nome']
                }]
            }]
        });

        if (!reservas || reservas.length === 0) {
            return res.status(200).json([]);
        }

        // Formatar a resposta para o relatório
        const relatorio = reservas.map(reserva => ({
            pet: {
                nome: reserva.Pet.nome
            },
            tutor: {
                nome: reserva.Pet.Tutor.nome
            },
            data_entrada: reserva.data_entrada,
            data_saida: reserva.data_saida,
            status: reserva.status
        }));

        return res.status(200).json(relatorio);
    } catch (error) {
        console.error('Erro ao buscar relatório de pets hospedados:', error);
        return res.status(500).json({ error: 'Erro ao gerar relatório de pets hospedados' });
    }
};

// Obter apenas as reservas do tutor logado
exports.getMinhasReservas = async (req, res) => {
    try {
        const idTutor = req.user.id;
        const reservas = await Reserva.findAll({
            where: { idTutor },
            include: [{
                model: Pet,
                attributes: ['idPet', 'nome', 'raca', 'porte']
            }],
            order: [['data_entrada', 'DESC']]
        });
        return res.status(200).json(reservas);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar suas reservas' });
    }
};