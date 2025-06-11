const express = require('express');
const router = express.Router();
const FormularioEntradaController = require('../controllers/formularioEntradaController');

// Rota para criar um formulário de entrada
router.post('/', FormularioEntradaController.createFormularioEntrada);

// Rota para obter todos os formulários de entrada
router.get('/', FormularioEntradaController.getAllFormularios);

// Rota para obter um formulário de entrada específico
router.get('/:idForm', FormularioEntradaController.getFormularioById);

// Rota para atualizar um formulário de entrada
router.put('/:idForm', FormularioEntradaController.updateFormularioEntrada);

// Rota para excluir um formulário de entrada
router.delete('/:idForm', FormularioEntradaController.deleteFormularioEntrada);

module.exports = router;
