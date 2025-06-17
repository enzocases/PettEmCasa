const express = require('express');
const router = express.Router();
const boletimController = require("../controllers/boletimComportamentalController");

// Rotas específicas (devem vir antes das rotas com parâmetros dinâmicos)
router.get('/por-pet/:idPet', boletimController.getBoletinsByPet);
router.get('/por-tutor/:idTutor', boletimController.getBoletinsByTutor);

// Rotas base
router.post('/', boletimController.createBoletimComportamental);
router.get('/', boletimController.getAllBoletins);
router.get('/:idBoletim', boletimController.getBoletimById);
router.put('/:idBoletim', boletimController.updateBoletim);
router.delete('/:idBoletim', boletimController.deleteBoletim);

// Rota para obter boletins dos pets do tutor logado
router.get('/meus', require('../middlewares/verifyToken'), boletimController.getBoletinsDoTutorLogado);

module.exports = router;
