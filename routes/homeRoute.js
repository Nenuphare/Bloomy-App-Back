const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');


router
    .route('/')
    .all(jwtMiddleware.verifyToken)
    .post(homeController.createAHome)
    .get(homeController.getAllHome)
    
    router
    .route('/:id')
    .all(jwtMiddleware.verifyToken)
    .put(homeController.updateAHome)
    .delete(homeController.deleteAHome)

    
module.exports = router;