const { sequelize } = require('../models');

async function syncDatabase() {
    try {
        // This will drop all tables and recreate them
        await sequelize.sync({ force: true });
        console.log('Database synced successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error syncing database:', error);
        process.exit(1);
    }
}

syncDatabase(); 