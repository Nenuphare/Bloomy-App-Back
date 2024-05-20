const Home = require('../models/homeModel');
const UserHome = require('../models/userHomeModel');
const User = require('../models/userModel');
const generateShareCode = require('../utils/shareCodeGenerator');
const jwt = require('jsonwebtoken');
const jwtMiddleWare = require('../middlewares/jwtMiddleware');




/*
 * Create a home
 */

exports.createAHome = async (req, res) => {
    try {        
        // Check if user exist
        const user = await User.findByPk(req.user.id_user); // req.user comes from middleware
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name } = req.body;

        // Generate a unique share code for the home
        const share_code = generateShareCode();

        // Create the new home
        const newHome = await Home.create({
            name,
            share_code
        });

        // Add the relation between user and home
        await UserHome.create({
            id_home: newHome.id_home,
            id_user: user.id_user,
        });

        res.status(201).json({ message: 'Home successfully added' });

    } catch (error) {
        res.status(500).json({ message: 'Error processing data', error: error.message });
    }
};


/*
 * Update a home
 */

exports.updateAHome = async(req, res) => {
    try {
        // Check if user exist
        const user = await User.findByPk(req.user.id_user);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if home exist
        const home = await Home.findByPk(req.params.id);
        if (!home) return res.status(404).json({ message: "This home doesn't exist" });
        
        // Update the home
        const { name } = req.body;
        await home.update({ name });
        
        res.status(201).json({ message: 'Home updated', home });

    } catch(error) {
        res.status(500).json({ message: 'Error processing data', error: error.message });
    }
}


/*
 * Delete a home
 */

exports.deleteAHome = async(req, res) =>{ 
    try {
        // Check if user exist
        const user = await User.findByPk(req.user.id_user);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if home exist
        const home = await Home.findByPk(req.params.id);
        if (!home) return res.status(404).json({ message: "This home doesn't exist" });

        // Check if the user is in the home
        const userHome = await UserHome.findOne({ where: { id_home: req.params.id, id_user: req.user.id_user } });
        if (!userHome) return res.status(403).json({ message: "You don't have permission to delete this home" });

        // Delete UserHome relation
        await UserHome.destroy({ where: { id_home: req.params.id } });
        // Delete the home
        await Home.destroy({ where: { id_home: req.params.id } });
        
        res.status(201).json({message: 'Home deleted'});

    } catch(error) {
        res.status(500).json({ message: 'Error processing data', error: error.message });
    }
}


/*
 * Get all home
 */

exports.getAllHome = async(req, res) => {  
    try {
        const Homes = await Home.findAll();
        res.status(201).json(Homes);

    } catch(error) {
        res.status(500).json({ message: 'Error processing data', error: error.message });
    }
}


/*
 * Join a home
 */

exports.joinAHome = async(req, res) =>{
    try {
        // Check if user exist
        const user = await User.findByPk(req.user.id_user);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if home exist
        const home = await Home.findOne({ where: { share_code: req.params.share_code } });
        if (!home) return res.status(404).json({ message: 'Home not found' });

        // Check if the user is already in the home
        const userHome = await UserHome.findOne({
            where: {
                id_user: req.user.id_user,
                id_home: home.id_home
            }
        });
        if (userHome) return res.status(400).json({ message: 'You are already in this home' });

        // Create the relation between user and home
        await UserHome.create({
            id_user: req.user.id_user,
            id_home: home.id_home
        });

        res.status(201).json({ message: `You successfully joined the ${home.name} home` });

    } catch (error) {
        res.status(500).json({ message: 'Error processing data', error: error.message });
    }
}