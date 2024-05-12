const Home = require('../models/homeModel');
const UserHome = require('../models/userHomeModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const jwtMiddleWare = require('../middlewares/jwtMiddleware');




/*
 * Create a group
 */

exports.createAHome = async (req, res) => {
    try {
        const { name } = req.body;

        // console.log('token', req.headers['authorization'])
        // const token = req.headers['authorization'];
        // const payload = jwtMiddleWare.decode(token);
        // const user = await User.findByPk(payload.id_user);

        // console.log('payload', payload);

        // // Check if user exist
        // if (!user) return res.status(404).json({ message: 'User not found' });


        // Check if home exist
        const existingHome = await Home.findOne({ where: { name } });
        if (existingHome) return res.status(400).json({ message: 'This home already exist.' });

        await Home.create({
            name,
        });

        const home = await Home.findOne({ where: { name } });

        await UserHome.create({
            id_home: home.id_home,
            id_user: 1,
        });

        res.status(201).json({ message: 'Home added successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error processing data.' });
    }
};