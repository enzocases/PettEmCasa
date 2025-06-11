const { Servicos } = require('../models');

// Criar um novo serviço
exports.createServico = async (req, res) => {
    try {
        const { idPet, idFuncionario, nomeServico, dataServico, valorServico } = req.body;

        const servico = await Servicos.create({
            idPet,
            idFuncionario,
            nomeServico,
            dataServico,
            valorServico,
        });

        return res.status(201).json(servico);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao criar serviço' });
    }
};

// Obter todos os serviços
exports.getAllServicos = async (req, res) => {
    try {
        const servicos = await Servicos.findAll();
        return res.status(200).json(servicos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar serviços' });
    }
};

// Obter um serviço específico
exports.getServicoById = async (req, res) => {
    try {
        const servico = await Servicos.findByPk(req.params.idServico);

        if (!servico) {
            return res.status(404).json({ error: 'Serviço não encontrado' });
        }

        return res.status(200).json(servico);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar serviço' });
    }
};

// Atualizar um serviço
exports.updateServico = async (req, res) => {
    try {
        const servico = await Servicos.findByPk(req.params.idServico);

        if (!servico) {
            return res.status(404).json({ error: 'Serviço não encontrado' });
        }

        await servico.update(req.body);

        return res.status(200).json(servico);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao atualizar serviço' });
    }
};

// Excluir um serviço
exports.deleteServico = async (req, res) => {
    try {
        const servico = await Servicos.findByPk(req.params.idServico);

        if (!servico) {
            return res.status(404).json({ error: 'Serviço não encontrado' });
        }

        await servico.destroy();

        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao excluir serviço' });
    }
};
