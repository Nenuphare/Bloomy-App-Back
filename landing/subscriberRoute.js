const express = require('express');
const router = express.Router();
const subscriberController = require('./subscriberController');
const authMiddleware = require('./subscriberJwtMiddleware');


router
    .route('/')
    .post(authMiddleware, subscriberController.createSubscriber)

    
module.exports = router;