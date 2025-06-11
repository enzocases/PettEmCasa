const express = require('express');
const router = express.Router();
const EnderecoController = require('../controllers/enderecoController');

// Rota para criar um endereço
router.post('/', EnderecoController.createEndereco);

// Rota para obter todos os endereços
router.get('/', EnderecoController.getAllEnderecos);

// Rota para obter um endereço específico
router.get('/:idEndereco', EnderecoController.getEnderecoById);

// Rota para atualizar um endereço
router.put('/:idEndereco', EnderecoController.updateEndereco);

// Rota para excluir um endereço
router.delete('/:idEndereco', EnderecoController.deleteEndereco);

module.exports = router;
