const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: "127.0.0.1",
    dialect: "mariadb"
});


const UserHomeModel = sequelize.define('UserHomeModel', {
    id_user_home: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_home: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'users_homes',
    timestamps: true,
    underscored: true
});


// Set relations
const User = require('./userModel');
UserHomeModel.belongsTo(User, { foreignKey: 'id_user' });

const Home = require('./homeModel');
UserHomeModel.belongsTo(Home, { foreignKey: 'id_home' });

// Synchronizing the model with the database
(async () => {
    try {
        await UserHomeModel.sync({ force: false });
        console.log("UserHome: Model successfully synch to database");
    } catch (error) {
        console.error("UserHome: Model synch error", error);
    }
})();

module.exports = UserHomeModel;