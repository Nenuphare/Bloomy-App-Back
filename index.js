const express = require('express');
const Sequelize = require("sequelize");
const app = express();
const port = 3003;
require('dotenv').config();

const cors = require('cors');
// app.use(cors());

app.use(cors({origin: true, credentials: true}));


const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: 'mariadb',
  host: '100.20.92.101',
  database: 'bloomy_app',
  port: 3306,
  showWarnings: true,
  connectTimeout: 1000,
});

// Test de la connexion à la base de données
db.authenticate()
.then(() => {
  console.log("Connecté à la base de données MariaDB !");
})
.catch(err => {
  console.error("Impossible de se connecter à la base de données:", err);
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