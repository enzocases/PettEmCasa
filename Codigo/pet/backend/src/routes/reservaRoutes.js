const express = require('express');
const router = express.Router();
const ReservaController = require('../controllers/reservaController'); 
const authorizeFuncionario = require("../middlewares/authorizeFuncionario");

// Rota para obter pets com reservas ativas
router.get('/active-pets', ReservaController.getPetsWithActiveReservations);

// Rota para obter relatório de pets hospedados
router.get('/active-pets-report', ReservaController.getPetsWithActiveReservationsReport);

// Rota para criar uma reserva
router.post('/', ReservaController.createReserva);

// Rota para obter todas as reservas
router.get('/', ReservaController.getAllReservas);

// Rota para obter reservas do tutor logado
router.get('/tutor', ReservaController.getReservasByTutor);

// Rota para obter uma reserva específica
router.get('/:idReserva', ReservaController.getReservaById);

// Rota para atualizar uma reserva
router.put('/:idReserva', ReservaController.updateReserva);

// Rota para excluir uma reserva (acessível por tutores e funcionários)
router.delete('/:idReserva', ReservaController.deleteReserva);

module.exports = router;
