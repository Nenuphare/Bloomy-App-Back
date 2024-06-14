const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router
    .route('/')
    .all(jwtMiddleware.verifyToken)
    .post(taskController.createTask);

router
    .route('/:id_task')
    .all(jwtMiddleware.verifyToken)
    .put(taskController.updateTask)
    .delete(taskController.deleteTask);

router
    .route('/:id_task/status')
    .all(jwtMiddleware.verifyToken)
    .patch(taskController.updateTaskStatus);

router
    .route('/homes/:id_home')
    .all(jwtMiddleware.verifyToken)
    .get(taskController.getHomeTasks);

router
    .route('/rooms/:id_room')
    .all(jwtMiddleware.verifyToken)
    .get(taskController.getRoomTasks);



module.exports = router;