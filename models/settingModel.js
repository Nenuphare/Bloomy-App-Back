module.exports = (sequelize, DataTypes, User) => {
    const Setting = sequelize.define('Setting', {
        id_setting: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        darkmode: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        notification: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'settings',
        timestamps: true,
        underscored: true
    });

    // SET RELATIONS
    Setting.belongsTo(User, { foreignKey: 'id_user' });

    return Setting;
}