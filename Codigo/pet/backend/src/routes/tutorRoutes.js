const express = require('express');
const router = express.Router();
const TutorController = require('../controllers/tutorController');
const RegistrationController = require('../controllers/registrationController');

const verifyToken = require('../middlewares/verifyToken');

// Unified registration route (replaces the old createTutor route)
router.post('/', RegistrationController.createUser);

// Rota para obter todos os tutores
router.get('/', verifyToken, TutorController.getAllTutors);

// Rota para obter um tutor específico
router.get('/:idTutor', verifyToken, TutorController.getTutorById);

// Rota para atualizar um tutor
router.put('/:idTutor', verifyToken, TutorController.updateTutor);

// Rota para excluir um tutor
router.delete('/:idTutor', verifyToken, TutorController.deleteTutor);

module.exports = router;