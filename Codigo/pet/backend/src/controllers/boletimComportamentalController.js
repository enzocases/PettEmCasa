const { BoletimComportamental, Pet, Reserva } = require('../models');

// Criar um boletim comportamental
exports.createBoletimComportamental = async (req, res) => {
    try {
        console.log('Dados recebidos:', req.body);
        const { 
            idPet, 
            idReserva, 
            cuidador_id, 
            descricao,
            ingestaoAgua,
            apetite,
            nivelEnergia,
            interacaoPessoas,
            interacaoAnimais,
            comportamentoPasseios,
            comportamentoAmbienteInterno,
            brincadeirasPreferidas
        } = req.body;

        // Verifica se já existe um boletim para esta reserva
        const boletimExistente = await BoletimComportamental.findOne({
            where: { idReserva }
        });

        if (boletimExistente) {
            return res.status(400).json({ error: 'Já existe um boletim para esta reserva' });
        }

        // Verifica se a reserva existe e pertence ao pet
        const reserva = await Reserva.findOne({
            where: { idReserva, idPet }
        });

        if (!reserva) {
            return res.status(404).json({ error: 'Reserva não encontrada ou não pertence ao pet informado' });
        }

        const boletim = await BoletimComportamental.create({
            idPet,
            idReserva,
            descricao,
            cuidador_id,
            ingestaoAgua,
            apetite,
            nivelEnergia,
            interacaoPessoas,
            interacaoAnimais,
            comportamentoPasseios,
            comportamentoAmbienteInterno,
            brincadeirasPreferidas
        });

        console.log('Boletim criado:', boletim);
        return res.status(201).json(boletim);
    } catch (error) {
        console.error('Erro detalhado ao criar boletim:', error);
        return res.status(500).json({ error: 'Erro ao criar boletim comportamental' });
    }
};

// Obter todos os boletins comportamentais
exports.getAllBoletins = async (req, res) => {
    try {
        console.log('Buscando todos os boletins...');
        const boletins = await BoletimComportamental.findAll({
            include: [
                { model: Pet },
                { model: Reserva }
            ]
        });
        console.log('Boletins encontrados:', boletins.length);
        
        const boletinsComDescricaoConvertida = boletins.map(boletim => {
            const boletimObj = boletim.get({ plain: true });
            try {
                boletimObj.descricao = JSON.parse(boletimObj.descricao);
            } catch (e) {
                console.error('Erro ao converter descrição:', e);
            }
            return boletimObj;
        });
        
        return res.status(200).json(boletinsComDescricaoConvertida);
    } catch (error) {
        console.error('Erro detalhado ao buscar boletins:', error);
        return res.status(500).json({ error: 'Erro ao buscar boletins' });
    }
};

// Obter um boletim comportamental por ID
exports.getBoletimById = async (req, res) => {
    try {
        const boletim = await BoletimComportamental.findByPk(req.params.idBoletim, {
            include: [
                { model: Pet },
                { model: Reserva }
            ]
        });
        if (!boletim) {
            return res.status(404).json({ error: 'Boletim comportamental não encontrado' });
        }
        const boletimObj = boletim.get({ plain: true });
        boletimObj.descricao = JSON.parse(boletimObj.descricao);
        return res.status(200).json(boletimObj);
    } catch (error) {
        console.error('Erro detalhado ao buscar boletim:', error);
        return res.status(500).json({ error: 'Erro ao buscar boletim comportamental' });
    }
};

// Atualizar um boletim comportamental
exports.updateBoletim = async (req, res) => {
    try {
        const boletim = await BoletimComportamental.findByPk(req.params.idBoletim);

        if (!boletim) {
            return res.status(404).json({ error: 'Boletim comportamental não encontrado' });
        }

        const { 
            idPet, 
            idReserva, 
            cuidador_id, 
            descricao,
            ingestaoAgua,
            apetite,
            nivelEnergia,
            interacaoPessoas,
            interacaoAnimais,
            comportamentoPasseios,
            comportamentoAmbienteInterno,
            brincadeirasPreferidas
        } = req.body;

        // Verifica se a reserva existe e pertence ao pet
        if (idReserva && idPet) {
            const reserva = await Reserva.findOne({
                where: { idReserva, idPet }
            });

            if (!reserva) {
                return res.status(404).json({ error: 'Reserva não encontrada ou não pertence ao pet informado' });
            }
        }

        await boletim.update({
            idPet: idPet || boletim.idPet,
            idReserva: idReserva || boletim.idReserva,
            descricao: descricao || boletim.descricao,
            cuidador_id: cuidador_id || boletim.cuidador_id,
            ingestaoAgua: ingestaoAgua || boletim.ingestaoAgua,
            apetite: apetite || boletim.apetite,
            nivelEnergia: nivelEnergia || boletim.nivelEnergia,
            interacaoPessoas: interacaoPessoas || boletim.interacaoPessoas,
            interacaoAnimais: interacaoAnimais || boletim.interacaoAnimais,
            comportamentoPasseios: comportamentoPasseios || boletim.comportamentoPasseios,
            comportamentoAmbienteInterno: comportamentoAmbienteInterno || boletim.comportamentoAmbienteInterno,
            brincadeirasPreferidas: brincadeirasPreferidas || boletim.brincadeirasPreferidas
        });

        return res.status(200).json(boletim);
    } catch (error) {
        console.error('Erro detalhado ao atualizar boletim:', error);
        return res.status(500).json({ error: 'Erro ao atualizar boletim comportamental' });
    }
};

// Excluir um boletim comportamental
exports.deleteBoletim = async (req, res) => {
    try {
        const boletim = await BoletimComportamental.findByPk(req.params.idBoletim);

        if (!boletim) {
            return res.status(404).json({ error: 'Boletim comportamental não encontrado' });
        }

        await boletim.destroy();

        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao excluir boletim comportamental' });
    }
};

// Obter boletins por Pet
exports.getBoletinsByPet = async (req, res) => {
    try {
        const { idPet } = req.params;
        const boletins = await BoletimComportamental.findAll({
            where: { idPet: idPet }
        });

        return res.status(200).json(boletins);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar boletins por pet' });
    }
};

// Obter boletins por Tutor
exports.getBoletinsByTutor = async (req, res) => {
    try {
        const { idTutor } = req.params;

        const pets = await Pet.findAll({
            where: { idTutor: idTutor },
            attributes: ['idPet']
        });

        const petIds = pets.map(pet => pet.idPet);

        const boletins = await BoletimComportamental.findAll({
            where: { idPet: petIds }
        });

        return res.status(200).json(boletins);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar boletins por tutor' });
    }
};
