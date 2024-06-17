const { User, Type } = require('../models/index');


/*
 * Create a type
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


/*
 * Get all type
 */

exports.getAllType = async(req, res) => {  
    try {
        // Check if user exist
        const user = await User.findByPk(req.user.id_user);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const types = await Type.findAll();
        if(!types) return res.status(404).json({message: "No type was found"});

        res.status(201).json(types);

    } catch(error) {
        res.status(500).json({ message: 'Error processing data', error: error.message });
    }
}

/*
 * Update a type
 */

exports.updateAType = async(req, res) => {
    try {
        // Check if user exist
        const user = await User.findByPk(req.user.id_user);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if type exist
        const type = await Type.findByPk(req.params.id_type);
        if (!type) return res.status(404).json({ message: "This type doesn't exist" });
        
        // Check if name is not empty
        const { name } = req.body;
        if(!name) return res.status(400).json({message: "Type name cannot be empty"});
        
        await type.update({ name });
        res.status(201).json({ message: 'Type updated', type });

    } catch(error) {
        res.status(500).json({ message: 'Error processing data', error: error.message });
    }
}


/*
 * Delete a type
 */

exports.deleteType = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id_user);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if type exist
        const type = await Type.findByPk(req.params.id_type);
        if (!type) return res.status(404).json({ error: 'Type not found' });

        await type.destroy();
        res.status(200).json({message: "Type deleted"});
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete type', details: error.message });
    }
};