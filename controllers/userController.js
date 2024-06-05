const User = require('../models/userModel');
const Home = require('../models/homeModel');
const UserHome = require('../models/userHomeModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();


/*
 * Get a user
 */

exports.getAUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id_user); // req.user comes from middleware

        // Check if user exist
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(201).json(user);

    } catch (error) {
        res.status(500).json({ message: 'Error processing data', error: error.message });
    }
};


/*
 * Create a user
 */

exports.registerAUser = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const existingMail = await User.findOne({ where: { email } });

        //check if email is not empty
        if(!email) return res.status(400).json({message: "Email cannot be empty"});
        
        // Check if mail is already used
        if (existingMail) return res.status(400).json({ message: 'This email already exist.' });
        
        //check if password is set and long
        if (password.length < 8){
            return res.status(400).json({message: "The password is not long enough"});
        }
        //check if other variable are not empty
        if(!firstname || !lastname) return res.status(400).json({message: "Firsname or lastname cannot be empty"});

        const newUser = await User.create(req.body);

        res.status(201).json({ message: `User n°${newUser.id_user} created : mail : ${newUser.email}` });
    }
    catch (error) {
        res.status(500).json({ message: 'Error processing data', error: error.message });
    }
};


/*
 * Login a user
 */

exports.loginAUser = async (req, res) => {
    try {
        
        const user = await User.findOne({ where: { email: req.body.email } });
        const home = await UserHome.findOne({where: {id_user: user.id_user}});
        
        // Check if the user exist
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        // Check password
        const password = await bcrypt.compare(req.body.password, user.password);

        if ( user && password ) {

            const userData = {
                id_user: user.id_user,
                email: user.email,
            };

            const token = jwt.sign(userData, process.env.JWT_KEY, { expiresIn: "30d" });
            res.status(200).json({ message: "Loged in", token: token, id_user: user.id_user, id_home: home?.id_home });

        } else {
            res.status(401).json({ message: 'Incorrect email or password.', err });
        }
        
    } catch (error) {
        res.status(500).json({ message: 'Error processing data', error: error.message });
    }
};



/*
 * Update a user
 */

exports.putAUser = async (req, res) => {
    try {
        // Check if the user exist
        const user = await User.findOne({ where: { id_user: req.user.id_user}});
        const password = req.body.password;
        const firstname = req.body.firstname;
        
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (!password && !firstname) return res.status(400).json({message: 'Password and Firstname cannot be both empty'});
        //if (!firstname) return res.status(400).json({message: 'Firstname cannot be empty'});


        req.body.password = await bcrypt.hash(req.body.password, 10);

        await user.update({ 
            lastname: req.body.lastname,
            firstname: req.body.firstname,
            password: req.body.password,
        });

        
        res.status(201).json({ message: 'User updated successfully.' });

    } catch (error) {
        res.status(500).json({ message: 'Error processing data', error: error.message });
    }
};


/*
 * Delete connected user
 */

exports.deleteAUser = async (req, res) => {
    try {
        // Check if user exist
        const user = await User.findByPk(req.user.id_user);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Get all UserHome relations for the user
        const userHomes = await UserHome.findAll({ where: { id_user: req.user.id_user } });

        // Delete UserHome relations
        await UserHome.destroy({ where: { id_user: req.user.id_user } });

        // Check and delete empty homes
        for (const userHome of userHomes) {
            // For each home get all user  
            const allUser = await UserHome.findAll({ where: { id_home: userHome.id_home } });
            // If no one left delete the home
            if (allUser.length < 1) await Home.destroy({ where: { id_home: userHome.id_home } });
        }

        // Delete user
        await User.destroy({ where: { id_user: req.user.id_user}});

        res.status(201).json({ message: 'User successfully deleted' });

    } catch (error) {
        res.status(500).json({ message: 'Error processing data', error: error.message });
    }
};


/*
 * Get the homes of a user
 */
exports.getUserHomes = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id_user);

        // Check if user exists
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Get user homes
        const userHomes = await UserHome.findAll({
            where: { id_user: user.id_user },
            include: [Home] // Include the Home model to get the related homes
        });

        // Check if homes exist
        if (!userHomes.length) return res.status(404).json({ message: 'No homes found for this user' });

        res.status(200).json(userHomes);
        
    } catch (error) {
        res.status(500).json({ message: 'Error processing data', error: error.message });
    }
};