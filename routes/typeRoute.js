const express = require('express');
const router = express.Router();
const typeController = require('../controllers/typeController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router
    .route('/')
    .all(jwtMiddleware.verifyToken)
    .get(typeController.getAllType)
    .post(typeController.createType);

router
    .route('/:id_type')
    .all(jwtMiddleware.verifyToken)
    .put(typeController.updateAType)
    .delete(typeController.deleteType);


module.exports = router;