const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');


router
    .route('/')
    .all(jwtMiddleware.verifyToken)
    // .delete(userController.deleteAHome)
    .post(homeController.createAHome)
    // .get(homeController.getAHome)

    
module.exports = router;