module.exports = (sequelize, DataTypes, Type, User, Room) => {
    const Task = sequelize.define('Task', {
        id_task: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        deadline: {
            type: DataTypes.DATE,
            allowNull: true
        },
        finished: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        id_type: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_room: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        recurrence: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        tableName: 'tasks',
        timestamps: true,
        underscored: true
    });

    // SET RELATONS
    Task.belongsTo(Type, { foreignKey: 'id_type' });
    Task.belongsTo(User, { foreignKey: 'id_user' });
    Task.belongsTo(Room, { foreignKey: 'id_room' });

    return Task;
}