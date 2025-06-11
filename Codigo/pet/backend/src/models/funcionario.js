const {DataTypes } = require('sequelize');

const db = require('../db/conn');

const Funcionario = db.define('Funcionario', {
    idFuncionario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cpf: {
        type: DataTypes.STRING(20),
        allowNull: false,
        required: true,
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
        required: true,
    },
    cargo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        required: true,
    },
    telefone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        required: true,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
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
        defaultValue: 'Funcionario',
    }
});

module.exports = Funcionario;