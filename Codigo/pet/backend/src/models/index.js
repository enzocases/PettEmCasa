const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

// Importação dos models
const Tutor = require('./tutor');
const Pet = require('./pet');
const PetUpdate = require('./petUpdate');
const Reserva = require('./reserva');
const Funcionario = require('./funcionario');
const Acomodacao = require('./acomodacao');
const BoletimComportamental = require('./boletimComportamental');
const FormularioEntrada = require('./formularioEntrada');
const Endereco = require('./endereco');
const Servicos = require('./servicos');
const Pertence = require('./pertence');

// Definição dos relacionamentos entre os models
// Um Tutor pode ter muitos Pets
Tutor.hasMany(Pet, { foreignKey: 'idTutor' });
Pet.belongsTo(Tutor, { foreignKey: 'idTutor' });

// Um Tutor pode ter muitas Reservas
Tutor.hasMany(Reserva, { foreignKey: 'idTutor' });
Reserva.belongsTo(Tutor, { foreignKey: 'idTutor' });

// Um Pet pode ter muitas Reservas
Pet.hasMany(Reserva, { foreignKey: 'idPet' });
Reserva.belongsTo(Pet, { foreignKey: 'idPet' });

// Um Pet pode ter varios Boletins Comportamentais
Pet.hasMany(BoletimComportamental, { foreignKey: 'idPet' });
BoletimComportamental.belongsTo(Pet, { foreignKey: 'idPet' });

// Um Pet pode ter um Formulário de Entrada
Pet.hasOne(FormularioEntrada, { foreignKey: 'idPet' });
FormularioEntrada.belongsTo(Pet, { foreignKey: 'idPet' });

// Um Funcionario pode ser responsável por muitas Reservas
Funcionario.hasMany(Reserva, { foreignKey: 'idFuncionario' });
Reserva.belongsTo(Funcionario, { foreignKey: 'idFuncionario' });

// Um Funcionario pode ser responsável por muitos Servicos
Funcionario.hasMany(Servicos, { foreignKey: 'idFuncionario' });
Servicos.belongsTo(Funcionario, { foreignKey: 'idFuncionario' });

// Um Pet pode ter muitos Serviços
Pet.hasMany(Servicos, { foreignKey: 'idPet' });
Servicos.belongsTo(Pet, { foreignKey: 'idPet' });

// Um Tutor pode ter um Endereço
Tutor.hasOne(Endereco, { foreignKey: 'idTutor' });
Endereco.belongsTo(Tutor, { foreignKey: 'idTutor' });

Pet.hasMany(PetUpdate, { foreignKey: 'idPet' });
PetUpdate.belongsTo(Pet, { foreignKey: 'idPet' });

Funcionario.hasMany(PetUpdate, { foreignKey: 'idFuncionario' });
PetUpdate.belongsTo(Funcionario, { foreignKey: 'idFuncionario' });

// Relacionamentos de Pertences
Pet.hasMany(Pertence, { foreignKey: 'idPet' });
Pertence.belongsTo(Pet, { foreignKey: 'idPet' });

// Exporta a instância do sequelize e os modelos
module.exports = { 
    sequelize, 
    Tutor, 
    Pet, 
    Reserva, 
    Funcionario, 
    Acomodacao, 
    BoletimComportamental, 
    FormularioEntrada, 
    Endereco, 
    PetUpdate, 
    Servicos, 
    Pertence,
    DataTypes 
};