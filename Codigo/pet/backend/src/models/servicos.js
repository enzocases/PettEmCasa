const { DataTypes } = require('sequelize');
const Pet = require('./pet');
const Funcionario = require('./funcionario');

const db = require('../db/conn');

const Servicos = db.define('Servicos', {
    idServico: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        
    },
    nomeServico: {
        type: DataTypes.STRING(100),
        allowNull: false,
        required: true,
    },
    dataServico: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        required: true,
    },
    valorServico: {
        type: DataTypes.FLOAT,
        allowNull: false,
        required: true,
    },
});

Servicos.belongsTo(Pet, { foreignKey: 'idPet' });
Servicos.belongsTo(Funcionario, { foreignKey: 'idFuncionario' });

module.exports = Servicos;
