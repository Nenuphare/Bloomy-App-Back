const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: "127.0.0.1",
    dialect: "mariadb"
});


const Settings = sequelize.define('Settings', {
    id_setting: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    darkmode: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    notification: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'settings',
    timestamps: true,
    underscored: true
});


// Set relations
const User = require('./userModel');
Settings.belongsTo(User, { foreignKey: 'id_user' });


// Synchronizing the model with the database
(async () => {
    try {
        await Settings.sync({ force: false });
        console.log("Settings: Model successfully synch to database");
    } catch (error) {
        console.error("Settings: Model synch error", error);
    }
})();

module.exports = Settings;