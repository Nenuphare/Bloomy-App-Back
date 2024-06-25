const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: 'mysql',
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3003,
  showWarnings: true,
  connectTimeout: 1000,
});

module.exports = sequelize;
