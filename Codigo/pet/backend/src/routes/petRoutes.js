const express = require('express');
const router = express.Router();
const PetController = require('../controllers/petController');

// Rota para criar um pet (requer autenticação)
router.post('/', PetController.createPet);

// Rota para obter todos os pets do tutor logado
router.get('/', PetController.getAllPets);

// Rota para obter histórico de acomodações dos pets do tutor
router.get('/accommodation-history', PetController.getPetAccommodationHistory);

// Rota para obter um pet específico
router.get('/:idPet', PetController.getPetById);

// Rota para atualizar um pet
router.put('/:idPet', PetController.updatePet);

// Rota para excluir um pet
router.delete('/:idPet', PetController.deletePet);

module.exports = router;