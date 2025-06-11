const { DataTypes } = require('sequelize');
const Pet = require('./pet');
const Reserva = require('./reserva');
const db = require('../db/conn');

const BoletimComportamental = db.define('BoletimComportamental', {
    idBoletim: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ingestaoAgua: {
        type: DataTypes.ENUM('Normal', 'Bebeu mais que o normal', 'Bebeu menos que o normal'),
        allowNull: false,
    },
    apetite: {
        type: DataTypes.ENUM('Comeu normalmente', 'Comeu pouco', 'Comeu com vontade', 'Recusou a comida'),
        allowNull: false,
    },
    nivelEnergia: {
        type: DataTypes.ENUM('Calmo', 'Ativo', 'Muito agitado', 'Apático'),
        allowNull: false,
    },
    interacaoPessoas: {
        type: DataTypes.ENUM('Amigável', 'Medroso', 'Agitado', 'Indiferente', 'Agressivo'),
        allowNull: false,
    },
    interacaoAnimais: {
        type: DataTypes.ENUM('Sociável', 'Brincalhão', 'Dominante', 'Submisso', 'Reativo', 'Agressivo'),
        allowNull: false,
    },
    comportamentoPasseios: {
        type: DataTypes.ENUM('Puxa a guia', 'Cheira calmamente', 'Late para outros cães/pessoas', 'Medo de barulhos'),
        allowNull: false,
    },
    comportamentoAmbienteInterno: {
        type: DataTypes.ENUM('Destrutivo', 'Late excessivamente', 'Tranquilo', 'Carente'),
        allowNull: false,
    },
    brincadeirasPreferidas: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    data_criacao: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    cuidador_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    idPet: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pet,
            key: 'idPet',
        }
    },
    idReserva: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Reserva,
            key: 'idReserva',
        }
    }
}, {
    tableName: 'boletim_comportamental'
});

// Define associations
BoletimComportamental.belongsTo(Pet, { foreignKey: 'idPet' });
BoletimComportamental.belongsTo(Reserva, { 
    foreignKey: 'idReserva'
});

module.exports = BoletimComportamental;
