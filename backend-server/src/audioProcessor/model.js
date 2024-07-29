const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:', // In-memory database for tests,
    logging: false // Disable SQL logging
});

const Audio = sequelize.define('Audio', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    filePath: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    correctedFilePath: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.ENUM('queued', 'processing', 'processed', 'failed'),
        defaultValue: 'queued',
    },
}, {
    timestamps: true,
});

// Sync database
const initializeDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); // Create tables and reset database
        console.log('In-memory database & tables created!');
    } catch (error) {
        console.error('Unable to initialize in-memory database:', error);
    }
};

module.exports = { Audio, sequelize, initializeDatabase };
