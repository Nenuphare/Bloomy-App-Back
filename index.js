const express = require('express');
const Sequelize = require("sequelize");
const app = express();
const port = 3003;
require('dotenv').config();

const cors = require('cors');
// app.use(cors());

app.use(cors({origin: true, credentials: true}));


const db = new Sequelize(process.env.MYSQL_URL
  , {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: console.log,
  connectTimeout: 10000, // increase timeout for remote connections
});

// Test de la connexion à la base de données
db.authenticate()
.then(() => {
  console.log("Connecté à la base de données MySql !");
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