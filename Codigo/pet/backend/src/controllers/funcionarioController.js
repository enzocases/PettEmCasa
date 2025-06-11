const { Funcionario } = require('../models');

// Criar um novo funcionário
exports.createFuncionario = async (req, res) => {
    try {
        const { cpf, nome, cargo, telefone } = req.body;
        
        const funcionario = await Funcionario.create({
            cpf,
            nome,
            cargo,
            telefone,
        });

        return res.status(201).json(funcionario);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao criar funcionário' });
    }
};

// Obter todos os funcionários
exports.getAllFuncionarios = async (req, res) => {
    try {
        const funcionarios = await Funcionario.findAll();
        return res.status(200).json(funcionarios);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar funcionários' });
    }
};

// Obter um funcionário específico
exports.getFuncionarioById = async (req, res) => {
    try {
        const funcionario = await Funcionario.findByPk(req.params.idFuncionario);

        if (!funcionario) {
            return res.status(404).json({ error: 'Funcionário não encontrado' });
        }

        return res.status(200).json(funcionario);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar funcionário' });
    }
};

// Atualizar um funcionário
exports.updateFuncionario = async (req, res) => {
    try {
        const funcionario = await Funcionario.findByPk(req.params.idFuncionario);

        if (!funcionario) {
            return res.status(404).json({ error: 'Funcionário não encontrado' });
        }

        await funcionario.update(req.body);

        return res.status(200).json(funcionario);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao atualizar funcionário' });
    }
};

// Excluir um funcionário
exports.deleteFuncionario = async (req, res) => {
    try {
        const funcionario = await Funcionario.findByPk(req.params.idFuncionario);

        if (!funcionario) {
            return res.status(404).json({ error: 'Funcionário não encontrado' });
        }

        await funcionario.destroy();

        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao excluir funcionário' });
    }
};
