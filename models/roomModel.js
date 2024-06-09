module.exports = (sequelize, DataTypes, Home) => {
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

    // SET RELATIONS
    Room.belongsTo(Home, { foreignKey: 'id_home' });

    return Room;
}