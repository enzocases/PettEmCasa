const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('pettemcasa', 'root', 'kmmRLQntECAkycZlRqXUiwlmqeYCKXwf', {
    host: 'trolley.proxy.rlwy.net',
    port: 59284,
    dialect: 'mysql',
    dialectOptions: {
        connectTimeout: 60000,
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 60000,
        idle: 10000
    }
})

try {
    sequelize.authenticate();
    console.log('Conectado com sucesso.');
}
catch (error) {
    console.error('Não foi possivel conectar:', error);
}

module.exports = sequelize;