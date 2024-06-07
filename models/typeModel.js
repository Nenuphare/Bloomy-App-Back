const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: "127.0.0.1",
    dialect: "mysql"
});

const Type = sequelize.define('Type', {
    id_type: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'types',
    timestamps: true,
    underscored: true
});


// Synchronisation du modèle avec la base de données
(async () => {
    try {
        await Type.sync({ force: false });
        console.log("Type: Model successfully synch to database");
    } catch (error) {
        console.error("Type: Model synch error", error);
    }
})();

module.exports = Type;