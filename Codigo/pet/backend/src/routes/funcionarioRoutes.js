const express = require('express');
const router = express.Router();
const FuncionarioController = require('../controllers/funcionarioController');
const authorizeFuncionario = require("../middlewares/authorizeFuncionario");

// Rota para criar um funcionário
router.post('/', FuncionarioController.createFuncionario);

// Rota para obter todos os funcionários
router.get('/', FuncionarioController.getAllFuncionarios);

// Rota para obter um funcionário específico
router.get('/:idFuncionario', authorizeFuncionario, FuncionarioController.getFuncionarioById);

// Rota para atualizar um funcionário
router.put('/:idFuncionario', authorizeFuncionario, FuncionarioController.updateFuncionario);

// Rota para excluir um funcionário
router.delete('/:idFuncionario', authorizeFuncionario, FuncionarioController.deleteFuncionario);

module.exports = router;
