const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router
    .route('/')
    .all(jwtMiddleware.verifyToken)
    .post(roomController.createRoom);
    

router
    .route('/homes/:id_home')
    .all(jwtMiddleware.verifyToken)
    .get(roomController.getAllRoomsFromHome);

router
    .route('/:id_room')
    .all(jwtMiddleware.verifyToken)
    .put(roomController.updateRoom)
    .delete(roomController.deleteRoom);

module.exports = router;