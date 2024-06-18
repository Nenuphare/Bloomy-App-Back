const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Error processing data
 */
router.route('/register').post(userController.registerAUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       400:
 *         description: Invalid email format
 *       401:
 *         description: Incorrect email or password
 *       404:
 *         description: User not found
 *       500:
 *         description: Error processing data
 */
router.route('/login').post(userController.loginAUser);

/**
 * @swagger
 * /users/homes:
 *   get:
 *     summary: Get the homes of a user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User homes retrieved successfully
 *       404:
 *         description: User or homes not found
 *       500:
 *         description: Error processing data
 */
router
  .route('/homes')
  .all(jwtMiddleware.verifyToken)
  .get(userController.getUserHomes);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Error processing data
 *   put:
 *     summary: Update a user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid request data
 *       403:
 *         description: Incorrect old password
 *       404:
 *         description: User not found
 *       500:
 *         description: Error processing data
 *   delete:
 *     summary: Delete a user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User deleted successfully
 *       403:
 *         description: Incorrect password
 *       404:
 *         description: User not found
 *       500:
 *         description: Error processing data
 */
router
  .route('/')
  .all(jwtMiddleware.verifyToken)
  .get(userController.getAUser)
  .put(userController.putAUser)
  .delete(userController.deleteAUser);

  
module.exports = router;