const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

/**
 * @swagger
 * paths:
 *  /homes:
 *   post:
 *     summary: Create a home
 *     security:
 *       - bearerAuth: []
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
 *       201:
 *         description: Home successfully added
 *       400:
 *         description: Home name cannot be empty or wider than 30 characters
 *       500:
 *         description: Error processing data
 *   get:
 *     summary: Get all homes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of homes
 *       404:
 *         description: No home was found
 *       500:
 *         description: Error processing data
 */
router
    .route('/')
    .all(jwtMiddleware.verifyToken)
    .post(homeController.createAHome)
    .get(homeController.getAllHome)

/**
 * @swagger
 * /homes/{id_home}:
 *   put:
 *     summary: Update a home
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_home
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
 *       201:
 *         description: Home updated
 *       400:
 *         description: Home name cannot be empty
 *       404:
 *         description: User or home not found
 *       500:
 *         description: Error processing data
 *   post:
 *     summary: Exit a home
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_home
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Successfully left the home
 *       404:
 *         description: User or home not found, or user is not in the home
 *       500:
 *         description: Error processing data
 *   delete:
 *     summary: Delete a home
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_home
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Home deleted
 *       403:
 *         description: No permission to delete the home
 *       404:
 *         description: User or home not found
 *       500:
 *         description: Error processing data
 */
router
    .route('/:id_home')
    .all(jwtMiddleware.verifyToken)
    .put(homeController.updateAHome)
    .post(homeController.exitAHome)
    .delete(homeController.deleteAHome)

/**
 * @swagger
 * /homes/{id_home}/members:
 *   get:
 *     summary: Get the members of a home
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
 *         description: List of members
 *       404:
 *         description: User or home not found, or no members found
 *       500:
 *         description: Error processing data
 */
router
    .route('/:id_home/members')
    .all(jwtMiddleware.verifyToken)
    .get(homeController.getHomeUsers)


/**
 * @swagger
 * /homes/join/{share_code}:
 *   post:
 *     summary: Join a home
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: share_code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Successfully joined the home
 *       400:
 *         description: User is already in the home
 *       404:
 *         description: User or home not found
 *       500:
 *         description: Error processing data
 */
router
    .route('/join/:share_code')
    .all(jwtMiddleware.verifyToken)
    .post(homeController.joinAHome)

    
module.exports = router;