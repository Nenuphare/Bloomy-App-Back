const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
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

    // HASH BEFORE SAVING TO DB
    User.addHook('beforeSave', async (user) => {
        try {
            const algo = await bcrypt.genSalt(10);
            const hashPw = await bcrypt.hash(user.password, algo);
            user.password = hashPw;
        } catch (error) {
            throw new Error(error);
        }
    });

    return User;
}