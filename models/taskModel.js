const { Sequelize, Datatypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: "db",
    dialect: "mysql"
});

const Task = sequelize.define('Task', {
    id_type: {
        type: Datatypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    setDate: {
        type: Datatypes.DATE,
        allowNull: false
    },
    title: {
        type: Datatypes.STRING,
        allowNull: false
    },
    deadline: {
        type: Datatypes.DATE,
        allowNull: true
    },
    finished: {
        type: Datatypes.BOOLEAN,
        defaultValue: false,
    },
    id_type: {
        type: Datatypes.INTEGER,
        allowNull: false
    },
    id_room: {
        type: Datatypes.INTEGER,
        allowNull: false
    },
    id_user: {
        type: Datatypes.INTEGER,
        allowNull: false
    },
    recurence: {
        type: Datatypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'tasks',
    timestamps: true,
    underscored: true
});


// Définition des relations
const Type = require('./typeModel.js');
Task.belongsTo(Type, { foreignKey: 'id_type' });
const User = require('./userModel.js');
Task.belongsTo(User, { foreignKey: 'id_user' });
const Room = require('./roomModel.js');
Task.belongsTo(Room, { foreignKey: 'id_room' });



// Synchronisation du modèle avec la base de données
(async () => {
    try {
        await type.sync({ force: false });
        console.log("Modèle type synchronisé avec la base de données.");
    } catch (error) {
        console.error("Erreur lors de la synchronisation du modèle type:", error);
    }
})();

module.exports = Task;