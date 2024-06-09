const express = require('express');
const { sequelize } = require('./models');
const app = express();
const port = 3003;
require('dotenv').config();

const cors = require('cors');
app.use(cors({ origin: true, credentials: true }));

// Test de la connexion à la base de données
sequelize.authenticate()
  .then(() => {
    console.log('Connecté à la base de données MariaDB !');
    // Synchroniser les modèles avec la base de données
    return sequelize.sync({ force: false }); // Ceci synchronisera tous les modèles avec la base de données
  })
  .then(() => {
    console.log('Tous les modèles synchronisés avec la base de données');
  })
  .catch((err) => {
    console.error("Impossible de se connecter à la base de données:", err);
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 


// ROUTES CONFIGURATIONS
const userRoute = require('./routes/userRoute'); 
const homeRoute = require('./routes/homeRoute'); 
const roomRoute = require('./routes/roomRoute'); 
const taskRoute = require('./routes/taskRoute'); 
const typeRoute = require('./routes/typeRoute');
const subscriberRoute = require('./landing/subscriberRoute'); 

app.use('/users', userRoute);
app.use('/homes', homeRoute);
app.use('/rooms', roomRoute);
app.use('/tasks', taskRoute);
app.use('/types', typeRoute);
app.use('/subscribe', subscriberRoute);


// SERVER STARTING
app.listen(port, () => {
  console.log(`L'application écoute sur le port ${port}`);
});