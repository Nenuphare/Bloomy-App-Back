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
    .route('/:id_home')
    .all(jwtMiddleware.verifyToken)
    .put(homeController.updateAHome)
    .post(homeController.exitAHome)
    .delete(homeController.deleteAHome)

router
    .route('/join/:share_code')
    .all(jwtMiddleware.verifyToken)
    .post(homeController.joinAHome)

    
module.exports = router;