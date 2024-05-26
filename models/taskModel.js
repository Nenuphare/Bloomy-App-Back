const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize with the database configuration
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: "127.0.0.1",
    dialect: "mariadb"
});

// Define the Task model
const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    setDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: true
    },
    finished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    id_type: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_room: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    recurrence: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'tasks',
    timestamps: true,
    underscored: true
});

// Import related models
const Type = require('./typeModel.js');
const User = require('./userModel.js');
const Room = require('./roomModel.js');

// Define relationships
Task.belongsTo(Type, { foreignKey: 'id_type' });
Task.belongsTo(User, { foreignKey: 'id_user' });
Task.belongsTo(Room, { foreignKey: 'id_room' });
