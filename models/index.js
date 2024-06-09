const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

console.log(process.env.DB_NAME);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_HOST);
console.log(process.env.DB_PORT);

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: 'mysql',
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  showWarnings: true,
  connectTimeout: 1000,
});

const Subscriber = require('../landing/subscriberModel')(sequelize, DataTypes);
const User = require('./userModel')(sequelize, DataTypes);
const Home = require('./homeModel')(sequelize, DataTypes);
const Room = require('./roomModel')(sequelize, DataTypes, User);
const Type = require('./typeModel')(sequelize, DataTypes);
const Task = require('./taskModel')(sequelize, DataTypes, Type, User, Room);
const Setting = require('./settingModel')(sequelize, DataTypes, User);
const UserHome = require('./userHomeModel')(sequelize, DataTypes, User, Home);

module.exports = {
  sequelize,
  
  User,
  Home,
  Room,
  Task,
  Type,
  Setting,
  UserHome,
  Subscriber,
};