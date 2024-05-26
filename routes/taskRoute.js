const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router
.route('/')
.all(jwtMiddleware.verifyToken)
.post(taskController.createTask);