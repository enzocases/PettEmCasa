const { Endereco } = require('../models');

// Criar um novo endereço
exports.createEndereco = async (req, res) => {
    try {
        const { idTutor, rua, bairro, cidade, estado, cep, complemento } = req.body;

        const endereco = await Endereco.create({
            idTutor,
            rua,
            bairro,
            cidade,
            estado,
            cep,
            complemento,
        });

        return res.status(201).json(endereco);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao criar endereço' });
    }
};

// Obter todos os endereços
exports.getAllEnderecos = async (req, res) => {
    try {
        const enderecos = await Endereco.findAll();
        return res.status(200).json(enderecos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar endereços' });
    }
};

// Obter um endereço específico
exports.getEnderecoById = async (req, res) => {
    try {
        const endereco = await Endereco.findByPk(req.params.idEndereco);

        if (!endereco) {
            return res.status(404).json({ error: 'Endereço não encontrado' });
        }

        return res.status(200).json(endereco);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar endereço' });
    }
};

// Atualizar um endereço
exports.updateEndereco = async (req, res) => {
    try {
        const endereco = await Endereco.findByPk(req.params.idEndereco);

        if (!endereco) {
            return res.status(404).json({ error: 'Endereço não encontrado' });
        }

        await endereco.update(req.body);

        return res.status(200).json(endereco);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao atualizar endereço' });
    }
};

// Excluir um endereço
exports.deleteEndereco = async (req, res) => {
    try {
        const endereco = await Endereco.findByPk(req.params.idEndereco);

        if (!endereco) {
            return res.status(404).json({ error: 'Endereço não encontrado' });
        }

        await endereco.destroy();

        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao excluir endereço' });
    }
};
