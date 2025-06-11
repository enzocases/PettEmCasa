const { DataTypes } = require('sequelize');
const Tutor = require('./tutor');

const db = require('../db/conn');

const Endereco = db.define('Endereco', {
    idEndereco: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        
    },
    rua: {
        type: DataTypes.STRING(255),
        allowNull: false,
        required: true,
    },
    bairro: {
        type: DataTypes.STRING(100),
        allowNull: false,
        required: true,
    },
    cidade: {
        type: DataTypes.STRING(100),
        allowNull: false,
        required: true,
    },
    estado: {
        type: DataTypes.STRING(50),
        allowNull: false,
        required: true,
    },
    cep: {
        type: DataTypes.STRING(20),
        allowNull: false,
        required: true,
    },
    complemento: {
        type: DataTypes.STRING(255),
        allowNull: true,
        required: true,
    },
});

Endereco.belongsTo(Tutor, { foreignKey: 'idTutor' });

module.exports = Endereco;
