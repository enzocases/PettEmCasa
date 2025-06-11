const Tutor = require('../models/tutor');
const Funcionario = require('../models/funcionario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-shh';

exports.loginTutor = async (req, res) => {
    const { email, senha, tipo_usuario } = req.body;

    try {
        let user;
        if (tipo_usuario === 'Tutor') {
            user = await Tutor.findOne({ where: { email } });
        } else if (tipo_usuario === 'Funcionario') {
            user = await Funcionario.findOne({ where: { email } });
        } else {
            return res.status(400).json({ error: 'Tipo de usuário inválido' });
        }

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const senhaCorreta = await bcrypt.compare(senha, user.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        if (user.tipo_usuario !== tipo_usuario) {
            return res.status(403).json({ error: 'Tipo de usuário inválido' });
        }

        const token = jwt.sign(
            {
                id: tipo_usuario === 'Tutor' ? user.idTutor : user.idFuncionario,
                email: user.email,
                tipo: tipo_usuario
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ 
            message: 'Login realizado com sucesso!',
            token,
            user: {
                id: tipo_usuario === 'Tutor' ? user.idTutor : user.idFuncionario,
                nome: user.nome,
                telefone: user.telefone,
                email: user.email,
                contato_emergencia: user.contato_emergencia,
                cpf: user.cpf,
                cargo: user.cargo,
                tipo: tipo_usuario
            }
        });

    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};