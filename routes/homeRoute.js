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
    .get(homeController.getAHome)
    .put(homeController.updateAHome)
    .delete(homeController.deleteAHome)

router
    .route('/:id_home/exit')
    .all(jwtMiddleware.verifyToken)
    .delete(homeController.exitAHome)
    
router
    .route('/:id_home/members')
    .all(jwtMiddleware.verifyToken)
    .get(homeController.getHomeUsers)

router
    .route('/join/:share_code')
    .all(jwtMiddleware.verifyToken)
    .post(homeController.joinAHome)

    
module.exports = router;