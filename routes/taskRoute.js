const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');


/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a task
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               deadline:
 *                 type: string
 *               id_type:
 *                 type: integer
 *               id_home:
 *                 type: integer
 *               id_room:
 *                 type: integer
 *               recurrence:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created
 *       400:
 *         description: Invalid type ID or missing data
 *       404:
 *         description: User not found
 *       500:
 *         description: Error creating task
 */
router
    .route('/')
    .all(jwtMiddleware.verifyToken)
    .post(taskController.createTask);

/**
 * @swagger
 * /tasks/{id_task}:
 *   put:
 *     summary: Update a task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_task
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               deadline:
 *                 type: string
 *               recurrence:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated
 *       400:
 *         description: Data cannot be empty
 *       404:
 *         description: Task not found
 *       500:
 *         description: Error updating task
 *   delete:
 *     summary: Delete a task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_task
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Error deleting task
 */
router
    .route('/:id_task')
    .all(jwtMiddleware.verifyToken)
    .put(taskController.updateTask)
    .delete(taskController.deleteTask);

/**
 * @swagger
 * /tasks/homes/{id_home}:
 *   get:
 *     summary: Get all tasks for a home
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_home
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of tasks
 *       404:
 *         description: Home not found
 *       500:
 *         description: Error retrieving tasks
 */
router
    .route('/homes/:id_home')
    .all(jwtMiddleware.verifyToken)
    .get(taskController.getHomeTasks);

    
module.exports = router;