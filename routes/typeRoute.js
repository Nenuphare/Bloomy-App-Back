const express = require('express');
const router = express.Router();
const typeController = require('../controllers/typeController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router
    .route('/')
    .all(jwtMiddleware.verifyToken)
    .post(typeController.createType);


module.exports = router;