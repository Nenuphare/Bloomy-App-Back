module.exports = (sequelize, DataTypes, User, Home) => {
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
    
    // SET RELATONS
    UserHomeModel.belongsTo(User, { foreignKey: 'id_user' });
    UserHomeModel.belongsTo(Home, { foreignKey: 'id_home' });

    return UserHomeModel;
}

