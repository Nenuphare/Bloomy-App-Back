const express = require('express');
const { sequelize } = require('./models');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors({ origin: true, credentials: true }));

// TEST DATABASE CONNECTION
sequelize.authenticate()
  .then(() => {
    console.log('Connected to the database');
    return sequelize.sync({ force: false });
  })
  .then(() => {
    console.log('All models synchronized with the database');
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
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

// SWAGGER CONFIGURATION
const swaggerConfig = require('./swagger')(app);

// SERVER STARTING
app.listen(port, () => {
  console.log(`L'application écoute sur le port ${port}`);
});