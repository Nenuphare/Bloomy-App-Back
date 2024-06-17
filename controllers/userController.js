const { User, Home, UserHome } = require('../models/index');
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
        const { email, password, firstname, lastname } = req.body;

        // Ensure all required fields are present
        if (!email) return res.status(400).json({ message: "Email cannot be empty" });
        if (!password) return res.status(400).json({ message: "Password cannot be empty" });
        if (!firstname) return res.status(400).json({ message: "Firstname cannot be empty" });
        if (!lastname) return res.status(400).json({ message: "Lastname cannot be empty" });

        // Check if email is correctly formatted
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingMail = await User.findOne({ where: { email } });

        // Check if email is already used
        if (existingMail) return res.status(400).json({ message: 'This email already exists.' });

        // Check if password is set and long enough
        if (password.length < 8) {
            return res.status(400).json({ message: "The password is not long enough" });
        }

        // Check if firstname and lastname contain only letters
        const nameRegex = /^[A-Za-z]+$/;
        if (!nameRegex.test(firstname)) {
            return res.status(400).json({ message: "Firstname can only contain letters" });
        }
        if (!nameRegex.test(lastname)) {
            return res.status(400).json({ message: "Lastname can only contain letters" });
        }

        const newUser = await User.create(req.body);

        res.status(201).json({ message: `User n°${newUser.id_user} created: mail: ${newUser.email}` });
    } catch (error) {
        res.status(500).json({ message: 'Error processing data', error: error.message });
    }
};


/*
 * Login a user
 */

exports.loginAUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email is correctly formatted
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({ where: { email } });
        const home = await UserHome.findOne({ where: { id_user: user.id_user } });

        // Check if the user exists
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            const userData = {
                id_user: user.id_user,
                email: user.email,
            };

            const token = jwt.sign(userData, process.env.JWT_KEY, { expiresIn: "30d" });
            res.status(200).json({ message: "Logged in", token, id_user: user.id_user, id_home: home?.id_home });
        } else {
            res.status(401).json({ message: 'Incorrect email or password' });
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
        // Check if the user exists
        const user = await User.findByPk(req.user.id_user);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if the current password matches
        const passwordMatch = await bcrypt.compare(req.body.oldPassword, user.password);
        if (!passwordMatch) {
            return res.status(403).json({ message: 'Incorrect old password' });
        }

        const { firstname, lastname, email, newPassword } = req.body;
        const updates = {};

        // Check if firstname is provided and contains only letters
        if (firstname) {
            const nameRegex = /^[A-Za-z]+$/;
            if (!nameRegex.test(firstname)) {
                return res.status(400).json({ message: "Firstname can only contain letters" });
            }
            updates.firstname = firstname;
        }

        // Check if lastname is provided and contains only letters
        if (lastname) {
            const nameRegex = /^[A-Za-z]+$/;
            if (!nameRegex.test(lastname)) {
                return res.status(400).json({ message: "Lastname can only contain letters" });
            }
            updates.lastname = lastname;
        }

        // Check if email is provided and correctly formatted
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }
            updates.email = email;
        }

        // Check if new password is provided and meets length requirements
        if (newPassword) {
            if (newPassword.length < 8) {
                return res.status(400).json({ message: "The password is not long enough" });
            }
            updates.password = newPassword;
        }

        // Update the user with the provided fields
        await user.update(updates);

        res.status(200).json({ message: 'User updated successfully.' });
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

        const password = await bcrypt.compare(req.body.password, user.password);

        //check if passwords matches
        if(!password){
            return res.status(403).json({message: 'Password is incorrect'});
        }

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
        // Check if user exists
        const user = await User.findByPk(req.user.id_user);
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