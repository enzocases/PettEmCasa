const { Tutor } = require('../models');
const bcrypt = require('bcrypt');


// Criar um novo tutor
exports.createTutor = async (req, res) => {
    try {
        const { nome, telefone, email, contato_emergencia, senha, tipo_tutor } = req.body;

        // Verifica se o e-mail já está cadastrado
        const tutorExistente = await Tutor.findOne({ where: { email } });
        if (tutorExistente) {
            return res.status(400).json({ error: 'E-mail já cadastrado.' });
        }

        // Criptografa a senha
        const senhaHash = await bcrypt.hash(senha, 10);

        // Cria o tutor
        const novoTutor = await Tutor.create({
            nome, 
            telefone,
            email,
            contato_emergencia,
            senha: senhaHash,
            tipo_tutor
        });

        res.status(201).json({ message: 'Tutor cadastrado com sucesso!', tutorId: novoTutor.idTutor });
    } catch (error) {
        console.error('Erro ao criar tutor:', error);
        res.status(500).json({ error: 'Erro interno ao criar tutor.' });
    }
};


// Obter todos os tutores
exports.getAllTutors = async (req, res) => {
    try {
        const tutors = await Tutor.findAll();
        return res.status(200).json(tutors);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar tutores' });
    }
};

// Obter um tutor específico
exports.getTutorById = async (req, res) => {
    try {
        const tutor = await Tutor.findByPk(req.params.idTutor);

        if (!tutor) {
            return res.status(404).json({ error: 'Tutor não encontrado' });
        }

        return res.status(200).json(tutor);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar tutor' });
    }
};

// Atualizar um tutor
exports.updateTutor = async (req, res) => {
    try {
        const tutor = await Tutor.findByPk(req.params.idTutor);

        if (!tutor) {
            return res.status(404).json({ error: 'Tutor não encontrado' });
        }

        if (req.body.senha) {
            req.body.senha = await bcrypt.hash(req.body.senha, 10);
        }

        // Atualiza os dados do tutor
        await tutor.update(req.body);

        return res.status(200).json(tutor);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao atualizar tutor' });
    }
};

// Excluir um tutor
exports.deleteTutor = async (req, res) => {
    try {
        const tutor = await Tutor.findByPk(req.params.idTutor);

        if (!tutor) {
            return res.status(404).json({ error: 'Tutor não encontrado' });
        }

        await tutor.destroy();

        return res.status(204).send();  // Retorna sucesso sem conteúdo
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao excluir tutor' });
    }
};
