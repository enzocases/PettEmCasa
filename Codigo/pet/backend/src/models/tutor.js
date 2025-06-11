const {DataTypes } = require('sequelize');

const db = require('../db/conn');   

const Tutor = db.define('Tutor', {
    idTutor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
       
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
        required: true,
    },
    telefone: {
        type: DataTypes.STRING(11),
        allowNull: false,
        required: true,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        required: true,
    },
    contato_emergencia: {
        type: DataTypes.STRING(20),
        allowNull: true,
        required: true,
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    },
    tipo_usuario: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'Tutor',
    }
});

module.exports = Tutor;
