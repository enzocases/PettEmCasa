const { DataTypes } = require('sequelize');
const Pet = require('./pet');

const db = require('../db/conn');

const FormularioEntrada = db.define('FormularioEntrada', {
    idForm: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      
    },
    qtdVezesAlimentacao: {
        type: DataTypes.INTEGER,
        allowNull: true,
        required: true,
    },
    castrado: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        required: true,
    },
    locaisDeNecessidades: {
        type: DataTypes.STRING(100),
        allowNull: true,
        required: true,
    },
    ambientesPreferenciais: {
        type: DataTypes.STRING(100),
        allowNull: true,
        required: true,
    },
    temperamento: {
        type: DataTypes.ENUM('Calmo', 'Bravo', 'Sistematico', 'Quieto', 'Brincalhao', 'Medroso', 'Agitado'),
        allowNull: true,
        required: true,
    },
    brinquedosPreferidos: {
        type: DataTypes.STRING(100),
        allowNull: true,
        required: true,
    },
    permissaoGramado: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        required: true,
    },
    conviveOutroPet: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        required: true,
    },
    permissaoConvivencia: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        required: true,
    },
    longeDosTutores: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        required: true,
    },
    usaMedicacao: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        required: true,
    },
    antipulgas: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        required: true,
    },
    medoDeFogoArtificio: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        required: true,
    },
    autorizaUsoImagem: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        required: true,
    },
    complementoConforto: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
});

FormularioEntrada.belongsTo(Pet, { foreignKey: 'idPet' });

module.exports = FormularioEntrada;
