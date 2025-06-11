const express = require('express');
const router = express.Router();
const acomodacaoController = require('../controllers/acomodacaoController');

// Rotas para acomodações
router.get('/', acomodacaoController.listarAcomodacoes);
router.get('/:id', acomodacaoController.buscarAcomodacao);
router.post('/', acomodacaoController.criarAcomodacao);
router.put('/:id', acomodacaoController.atualizarAcomodacao);
router.delete('/:id', acomodacaoController.deletarAcomodacao);
router.put('/:id/ocupacao', acomodacaoController.atualizarOcupacao);

module.exports = router;
