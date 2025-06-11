const { DataTypes } = require('sequelize');
const Pet = require('./pet');

const db = require('../db/conn');

const Pertence = db.define('Pertence', {
    idPertence: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cama: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    coberta: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    brinquedo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    vasilhaComida: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    vasilhaAgua: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    coleira: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    demaisPertences: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    idPet: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pet,
            key: 'idPet',
        }
    }
}, {
    tableName: 'pertences',
    timestamps: true
});

// Definindo relacionamento
Pertence.belongsTo(Pet, { 
    foreignKey: 'idPet',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

module.exports = Pertence; 