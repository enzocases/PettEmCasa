
const express = require('express');
const router = express.Router();
const petUpdateController = require('../controllers/petUpdateController');

// Routes for Funcionarios
router.post('/', petUpdateController.createPetUpdate); // Create update for a pet
router.get('/active-pets', petUpdateController.getActivePets); // Get all pets in active reservations
router.put('/:idUpdate', petUpdateController.updatePetUpdate); // Update a specific update
router.delete('/:idUpdate', petUpdateController.deletePetUpdate); // Delete a specific update

// Routes accessible by Tutors
router.get('/my-pets', petUpdateController.getTutorPetUpdates); // Get all updates for tutor's pets
router.get('/pet/:idPet', petUpdateController.getPetUpdates); // Get updates for a specific pet

module.exports = router;