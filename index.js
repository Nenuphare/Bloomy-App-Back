const express = require('express');
const sequelize = require("sequelize");
const app = express();
const port = 3003;

const db = new sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: "db",
    dialect: "mysql"
  });

// Test de la connexion à la base de données
db.authenticate()
.then(() => {
  console.log("Connecté à la base de données MySQL!");
})
.catch(err => {
  console.error("Impossible de se connecter à la base de données:", err);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

// Démarrage du serveur
app.listen(port, () => {
  console.log(`L'application écoute sur le port ${port}`);
});