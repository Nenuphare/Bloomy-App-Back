module.exports = (sequelize, DataTypes) => {
    const Subscriber = sequelize.define('Subscriber', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
    }, {
        tableName: 'subscribers',
        timestamps: true,
    });

    return Subscriber;
};