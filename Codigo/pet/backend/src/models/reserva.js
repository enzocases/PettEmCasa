const { DataTypes } = require('sequelize');
const Pet = require('./pet');
const Tutor = require('./tutor');
const Funcionario = require('./funcionario'); // Certifique-se de que essa tabela exista

const db = require('../db/conn');  

const Reserva = db.define('Reserva', {
    idReserva: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    data_entrada: {
        type: DataTypes.DATEONLY,
        allowNull: false,   
    },
    data_saida: {
        type: DataTypes.DATEONLY,
        allowNull: false,   
    },
    status: {
        type: DataTypes.ENUM('Pendente', 'Ativa', 'Finalizada', 'Cancelada', 'Recusada'),
        allowNull: false,   
    },
});

// Relacionamentos
Reserva.belongsTo(Pet, { foreignKey: 'idPet' }); // Relacionamento com Pet
Reserva.belongsTo(Funcionario, { foreignKey: 'idFuncionario' }); // Relacionamento com Funcionario
Reserva.belongsTo(Tutor, { foreignKey: 'idTutor' }); // Relacionamento com Tutor (se necessário)

module.exports = Reserva;
