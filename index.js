const express = require('express');
const sequelize = require("sequelize");
const app = express();
const port = 3003;

const db = new sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: "db",
    dialect: "mysql"
  });