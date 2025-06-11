const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const Tutor = require("../models/tutor");
const Funcionario = require("../models/funcionario");

require("dotenv").config();

const router = express.Router();

console.log("JWT_SECRET:", process.env.JWT_SECRET);

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register/tutor", async (req, res) => {
  const { nome, telefone, email, contato_emergencia, senha } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(senha, 10);

    const tutor = await Tutor.create({
      nome,
      telefone,
      email,
      contato_emergencia,
      senha: hashedPassword,
    });

    res.status(201).json({ message: "Usuário registrado com sucesso", tutor });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro ao cadastrar usuário", details: err.message });
  }
});

router.post("/register/funcionario", async (req, res) => {
  const { nome, cargo, telefone, email, cpf, senha } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(senha, 10);

    const funcionario = await Funcionario.create({
      nome,
      cargo,
      telefone,
      email,
      cpf,
      senha: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "Funcionário registrado com sucesso", funcionario });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erro ao cadastrar Funcionário", details: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, senha, tipo } = req.body;

  if (!email || !senha || !tipo) {
    return res
      .status(400)
      .json({ error: "Email, senha e tipo são obrigatórios" });
  }

  try {
    let usuario;
    if (tipo === "tutor") {
      usuario = await Tutor.findOne({ where: { email } });
    } else if (tipo === "funcionario") {
      usuario = await Funcionario.findOne({ where: { email } });
    } else {
      return res.status(400).json({ error: "Tipo inválido" });
    }

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    const token = jwt.sign(
      {
        id: usuario.idTutor || usuario.idFuncionario,
        tipo,
        email: usuario.email,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login bem-sucedido", token });
  } catch (err) {
    res.status(500).json({ error: "Erro no login", details: err.message });
  }
});

module.exports = router;
