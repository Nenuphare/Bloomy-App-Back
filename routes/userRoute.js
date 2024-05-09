const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router
    .route('/register')
    .post(userController.registerAUser)

router
    .route('/login')
    .post(userController.loginAUser)

router
    .route('/')
    .all(jwtMiddleware.verifyToken)
    // .delete(userController.deleteAUser)
    // .put(userController.putAUser)
    .get(userController.getAUser)

    
module.exports = router;