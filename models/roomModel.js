const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: "127.0.0.1",
    dialect: "mysql"
});

const Room = sequelize.define('Room', {
    id_room: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_home: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'rooms',
    timestamps: true,
    underscored: true
});



// Définition des relations
const Home = require('./homeModel.js');
Room.belongsTo(Home, { foreignKey: 'id_home' });



// Synchronisation du modèle avec la base de données
(async () => {
    try {
        await Room.sync({ force: false });
        console.log("Room: Model successfully synch to database");
    } catch (error) {
        console.error("Room: Model synch error", error);
    }
})();

module.exports = Room;