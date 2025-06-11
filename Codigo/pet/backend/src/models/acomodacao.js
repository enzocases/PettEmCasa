const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Acomodacao = sequelize.define('Acomodacao', {
    idAcomodacao: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    capacidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: {
                args: [1],
                msg: 'A capacidade deve ser maior que zero'
            }
        }
    },
    ocupacaoAtual: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: {
                args: [0],
                msg: 'A ocupação atual não pode ser negativa'
            }
        }
    }
}, {
    tableName: 'acomodacoes',
    timestamps: true
});

module.exports = Acomodacao;
