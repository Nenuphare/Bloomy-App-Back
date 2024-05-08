const { Sequelize, DataTypes } = require('sequelize');
// const bcrypt = require('bcrypt');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: "db",
    dialect: "mysql"
});


const User = sequelize.define('User', {
    id_user: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'users',
    timestamps: true,
    underscored: true
});

// // Hash avant de sauvegarder en base de données
// User.addHook('beforeSave', async (user) => {
//   try {
//     // Valeur par défaut de l'algorithme de hashage : 10
//     const algo = await bcrypt.genSalt(10);
//     const hashPw = await bcrypt.hash(user.password, algo);
//     user.password = hashPw;
//   } catch (error) {
//     throw new Error(error);
//   }
// });


// Set relations
(async () => {
    try {
        await User.sync({ force: false });
        console.log("User: Model successfully synch to database");
    } catch (error) {
        console.error("User: Model synch error", error);
    }
})();

module.exports = User;