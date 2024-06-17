const { Home, Room } = require('../models/index');
const { checkUserHome } = require('../policy/checkUserHome');


/*
 * Create a room
 */

exports.createRoom = async (req, res) => {
    try {
        const { id_home, name } = req.body;

        // Check if user is in home
        if (!checkUserHome(req.user.id_user, id_home)) 
            return res.status(403).json({ message: "You don't have permission to create a room here" });
        
        //check if id home or name is empty
        if(!id_home || !name) return res.status(400).json({message: "id_home or room name cannot be empty"})
        
        // Vérification si la maison existe
        const home = await Home.findByPk(id_home);
        if (!home) {
            return res.status(404).json({ error: 'Home not found' });
        }

        const newRoom = await Room.create({ id_home, name });
        res.status(201).json(newRoom);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create room', details: error.message });
    }
};


/*
 * Get all home rooms
 */

exports.getAllRoomsFromHome = async (req, res) => {
    try {
        const { id_home } = req.params;

        // Check if user is in home
        if (!checkUserHome(req.user.id_user, id_home)) 
            return res.status(403).json({ message: "You don't have permission to get rooms of this home" });

        // Check if home exsit
        const home = await Home.findByPk(id_home);
        if (!home) return res.status(404).json({ error: 'Home not found' });

        // Récupération des pièces associées à la maison
        const rooms = await Room.findAll({
            where: { id_home },
        });

        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve rooms', details: error.message });
    }
};


/*
 * Update a room
 */

exports.updateRoom = async (req, res) => {
    try {
        const { id_room } = req.params;
        const { name } = req.body;


        // Check if room exist 
        const room = await Room.findByPk(id_room);
        if (!room) return res.status(404).json({ error: 'Room not found' });


        // Check if user is in home
        if (!checkUserHome(req.user.id_user, room.id_home)) 
            return res.status(403).json({ message: "You don't have permission to update this room" });

        // Check if name is empty
        if(!name) return res.status(400).json({message: 'Room name cannot be empty'});
        

        // Vérification si le nouveau nom est identique à l'ancien
        if (room.name === name) {
            return res.status(400).json({ error: 'Room name must be different from previous' });
        }

        // Vérification si le nom est vide
        if (name == null || name == "") {
            return res.status(400).json({ error: 'Room name cannot be empty' });
        }

        // Mise à jour du nom de la pièce
        room.name = name;
        await room.save();

        // Réponse réussie avec les informations de la pièce mise à jour
        return res.status(200).json(room);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update room', details: error.message });
    }
};


/*
 * Delete a room
 */

exports.deleteRoom = async (req, res) => {
    try {
        // Check if room exist
        const room = await Room.findByPk(req.params.id_room);
        if (!room) return res.status(404).json({ error: 'Room not found' });

        // Check if user is in home
        if (!checkUserHome(req.user.id_user, room.id_home)) 
            return res.status(403).json({ message: "You don't have permission to delete this room" });

        await room.destroy();
        res.status(200).json({message: "Room deleted"});
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete room', details: error.message });
    }
};