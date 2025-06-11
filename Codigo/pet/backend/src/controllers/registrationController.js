const { Tutor, Funcionario } = require('../models');
const bcrypt = require('bcrypt');

// Unified registration for both Tutors and Funcionarios
exports.createUser = async (req, res) => {
    try {
        const { nome, telefone, email, contato_emergencia, tipo_usuario, senha, cpf, cargo } = req.body;

        // Check if email already exists in either table
        const existingTutor = await Tutor.findOne({ where: { email } });
        const existingFuncionario = await Funcionario.findOne({ where: { email } });
        
        if (existingTutor || existingFuncionario) {
            return res.status(400).json({ error: 'E-mail já cadastrado.' });
        }

        // Hash the password
        const senhaHash = await bcrypt.hash(senha, 10);

        let newUser;

        if (tipo_usuario === 'Tutor') {
            // Create Tutor
            newUser = await Tutor.create({
                nome, 
                telefone,
                email,
                contato_emergencia,
                senha: senhaHash,
                tipo_usuario: 'Tutor'
            });
            
            res.status(201).json({ 
                message: 'Tutor cadastrado com sucesso!', 
                userId: newUser.idTutor,
                tipo: 'Tutor'
            });
        } else if (tipo_usuario === 'Funcionario') {
            // For Funcionario, CPF and cargo are required
            if (!cpf || !cargo) {
                return res.status(400).json({ error: 'CPF e cargo são obrigatórios para funcionários.' });
            }

            // Create Funcionario
            newUser = await Funcionario.create({
                nome,
                telefone,
                email,
                cpf,
                cargo,
                senha: senhaHash,
                tipo_usuario: 'Funcionario'
            });
            
            res.status(201).json({ 
                message: 'Funcionário cadastrado com sucesso!', 
                userId: newUser.idFuncionario,
                tipo: 'Funcionario'
            });
        } else {
            return res.status(400).json({ error: 'Tipo de usuário inválido.' });
        }

    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro interno ao criar usuário.' });
    }
};