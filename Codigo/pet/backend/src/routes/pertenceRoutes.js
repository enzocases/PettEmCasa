const express = require('express');
const router = express.Router();
const PertenceController = require('../controllers/PertenceController');

// Rotas para pertences
router.post('/', PertenceController.create);
router.get('/', PertenceController.getAll);
router.get('/pet/:idPet', PertenceController.getByPetId);
router.put('/:id', PertenceController.update);
router.delete('/:id', PertenceController.delete);

module.exports = router; 