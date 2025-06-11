const express = require('express');
const router = express.Router();
const ServicosController = require('../controllers/servicosController');

// Rota para criar um serviço
router.post('/', ServicosController.createServico);

// Rota para obter todos os serviços
router.get('/', ServicosController.getAllServicos);

// Rota para obter um serviço específico
router.get('/:idServico', ServicosController.getServicoById);

// Rota para atualizar um serviço
router.put('/:idServico', ServicosController.updateServico);

// Rota para excluir um serviço
router.delete('/:idServico', ServicosController.deleteServico);

module.exports = router;
