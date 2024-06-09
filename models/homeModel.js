module.exports = (sequelize, DataTypes) => {
    const Home = sequelize.define('Home', {
        id_home: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        share_code: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'homes',
        timestamps: true,
        underscored: true
    });

    return Home;
}