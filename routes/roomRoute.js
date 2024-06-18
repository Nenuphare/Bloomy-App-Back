const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Create a room
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_home:
 *                 type: integer
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Room created
 *       400:
 *         description: id_home or room name cannot be empty
 *       404:
 *         description: Home not found
 *       500:
 *         description: Failed to create room
 */
router
    .route('/')
    .all(jwtMiddleware.verifyToken)
    .post(roomController.createRoom);

/**
 * @swagger
 * /rooms/homes/{id_home}:
 *   get:
 *     summary: Get all rooms from a home
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
 *         description: List of rooms
 *       404:
 *         description: Home not found
 *       500:
 *         description: Failed to retrieve rooms
 */
router
    .route('/homes/:id_home')
    .all(jwtMiddleware.verifyToken)
    .get(roomController.getAllRoomsFromHome);

/**
 * @swagger
 * /rooms/{id_room}:
 *   put:
 *     summary: Update a room
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_room
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
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Room updated
 *       400:
 *         description: Room name cannot be empty or must be different from previous
 *       404:
 *         description: Room not found
 *       500:
 *         description: Failed to update room
 *   delete:
 *     summary: Delete a room
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_room
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Room deleted
 *       404:
 *         description: Room not found
 *       500:
 *         description: Failed to delete room
 */
router
    .route('/:id_room')
    .all(jwtMiddleware.verifyToken)
    .put(roomController.updateRoom)
    .delete(roomController.deleteRoom);

module.exports = router;