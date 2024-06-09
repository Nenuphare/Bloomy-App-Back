const express = require('express');
const router = express.Router();
const subscriberController = require('../landing/subscriberController');
// const jwtMiddleware = require('../middlewares/jwtMiddleware');


router
    .route('/')
    .post(subscriberController.createSubscriber)

    
module.exports = router;