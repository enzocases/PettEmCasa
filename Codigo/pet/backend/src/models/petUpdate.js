const { DataTypes } = require('sequelize');
const Pet = require('./pet');
const Funcionario = require('./funcionario');

const db = require('../db/conn');

const PetUpdate = db.define('PetUpdate', {
    idUpdate: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idPet: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pet,
            key: 'idPet',
        }
    },
    idFuncionario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Funcionario,
            key: 'idFuncionario',
        }
    },
    data_update: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    comeu_bem: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    tomou_banho: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    exercitou: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    brincou: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    descansou_bem: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    observacoes: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
   
}, {
    tableName: 'pet_updates',
    timestamps: true, // Adds createdAt and updatedAt automatically
});

// Relationships
PetUpdate.belongsTo(Pet, { 
    foreignKey: 'idPet',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

PetUpdate.belongsTo(Funcionario, { 
    foreignKey: 'idFuncionario',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

module.exports = PetUpdate;