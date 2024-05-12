const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();


/*
 * Get a user
 */

exports.getAUser = async (req, res) => {
    try {
        // const user = await User.findByPk(req.user.id_user); user vient du middleware
        const user = await User.findByPk(req.body.id_user);

        // Check if user exist
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(201).json(user);

    } catch (error) {
        res.status(500).json({ message: 'Error processing data' });
    }
};


/*
 * Create a user
 */

exports.registerAUser = async (req, res) => {
    try {
        // Check if mail is already used
        const existingMail = await User.findOne({ where: { email: req.body.email } });
        if (existingMail) return res.status(400).json({ message: 'This email already exist.' });

        const newUser = await User.create(req.body);

        res.status(201).json({ message: `User n°${newUser.id_user} created : mail : ${newUser.email}` });
    }
    catch (error) {
        res.status(500).json({ message: 'Error processing data' });
    }
};


/*
 * Login a user
 */

exports.loginAUser = async (req, res) => {
    try {
        // Check if the user exist
        const user = await User.findOne({ where: { email: req.body.email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check password
        const password = await bcrypt.compare(req.body.password, user.password);

        if ( user && password ) {

            const userData = {
                id_user: user.id_user,
                email: user.email,
            };

            const token = await jwt.sign(userData, process.env.JWT_KEY, { expiresIn: "30d" });
            res.status(200).json({ token });

        } else {
            res.status(401).json({ message: 'Incorrect email or password.', err });
        }
        
    } catch (error) {
        res.status(500).json({ message: 'Error processing data.' });
    }
};



/*
 * Update a user
 */

exports.putAUser = async (req, res) => {
    try {
        let user = await User.findByPk(req.body.id_user);

        // Check if user exist
        if(!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });

        req.body.password = await bcrypt.hash(req.body.password, 10);

        await user.update({ 
            lastname: req.body.lastname,
            firstname: req.body.firstname,
            password: req.body.password,
        });

        
        res.status(201).json({ message: 'User updated successfully.' });

    } catch (error) {
        res.status(500).json({ message: 'Error processing data.' });
    }
};


/*
 * Delete a user
 */

exports.deleteAUser = async (req, res) => {
    try {
        const deletedUser = await User.destroy({
            where: { id_user: req.body.id_user}
        });
        
        // Check if user exist
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });

        res.status(201).json({ message: 'User successfully deleted.' });

    } catch (error) {
        res.status(500).json({message: "Error processing data."});
    }
};