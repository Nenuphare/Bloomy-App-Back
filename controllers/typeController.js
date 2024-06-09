const { Type } = require('../models/index');


/*
 * Create a type  A ENLEVER
 */

exports.createType = async (req, res) => {
    try {
        const { name } = req.body;

        const newType = await Type.create({ name });

        res.status(201).json(newType);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create type', details: error.message });
    }
};