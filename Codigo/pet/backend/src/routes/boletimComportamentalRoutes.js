const express = require('express');
const router = express.Router();
const boletimController = require("../controllers/boletimComportamentalController");

// Rotas base
router.post('/', boletimController.createBoletimComportamental);
router.get('/', boletimController.getAllBoletins);
router.get('/:idBoletim', boletimController.getBoletimById);
router.put('/:idBoletim', boletimController.updateBoletim);
router.delete('/:idBoletim', boletimController.deleteBoletim);

// Rotas específicas
router.get('/por-pet/:idPet', boletimController.getBoletinsByPet);
router.get('/por-tutor/:idTutor', boletimController.getBoletinsByTutor);

module.exports = router;
