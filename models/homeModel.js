const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: "127.0.0.1",
    dialect: "mysql"
});

const Home = sequelize.define('Home', {
    id_home: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    share_code: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'homes',
    timestamps: true,
    underscored: true
});


// Synchronisation du modèle avec la base de données
(async () => {
    try {
        await Home.sync({ force: false });
        console.log("Home: Model successfully synch to database");
    } catch (error) {
        console.error("Home: Model synch error", error);
    }
})();

module.exports = Home;