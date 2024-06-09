module.exports = (sequelize, DataTypes) => {
    const Type = sequelize.define('Type', {
        id_type: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'types',
        timestamps: true,
        underscored: true
    });

    return Type;
}