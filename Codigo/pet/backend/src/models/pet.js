const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');  // Arquivo de conexão com o banco de dados
const Tutor = require('./tutor');

const Pet = sequelize.define('Pet', {
  idPet: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  // Certifique-se de que é auto-increment
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  raca: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idade: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  porte: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  genero: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  idTutor: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Tutor,
      key: 'idTutor'
    }
  },
}, {
  tableName: 'pet', // Nome da tabela no banco de dados
});

// Definindo associações
Pet.belongsTo(Tutor, { foreignKey: 'idTutor' });

module.exports = Pet;
