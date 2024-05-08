const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: "db",
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
        console.log("Modèle Room synchronisé avec la base de données.");
    } catch (error) {
        console.error("Erreur lors de la synchronisation du modèle Room:", error);
    }
})();

module.exports = Room;