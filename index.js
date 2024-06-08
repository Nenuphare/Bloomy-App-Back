const express = require('express');
const Sequelize = require("sequelize");
const app = express();
const port = 3003;
require('dotenv').config();

const cors = require('cors');
// app.use(cors());

app.use(cors({origin: true, credentials: true}));


const sequelize = new Sequelize(process.env.MYSQLDATABASE, process.env.MYSQLUSER, process.env.MYSQLPASSWORD, {
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  dialect: 'mysql'
});

// Test the connection to the database
sequelize.authenticate()
  .then(() => {
    console.log("Connected to the MySQL database!");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

// Configuration des routes
const userRoute = require('./routes/userRoute'); 
app.use('/users', userRoute);

const homeRoute = require('./routes/homeRoute'); 
app.use('/homes', homeRoute);

const roomRoute = require('./routes/roomRoute'); 
app.use('/rooms', roomRoute);

const taskRoute = require('./routes/taskRoute'); 
app.use('/tasks', taskRoute);

const typeRoute = require('./routes/typeRoute'); 
app.use('/types', typeRoute);

// Démarrage du serveur
app.listen(port, () => {
  console.log(`L'application écoute sur le port ${port}`);
});