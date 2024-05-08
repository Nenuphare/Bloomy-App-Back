const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: "db",
    dialect: "mysql"
});

const Task = sequelize.define('Task', {
    id_task: {
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
    finished : {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    id_type:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_room:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_user:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    recurence: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'tasks',
    timestamps: true,
    underscored: true
});