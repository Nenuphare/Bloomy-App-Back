const Task = require('../models/taskModel');
const User = require('../models/userModel');
const Room = require('../models/roomModel');
const Home = require('../models/homeModel');


/*
 * Create Task
 */

exports.createTask = async (req, res) => {
    try {
        
        // Check if user exist
        const user = await User.findByPk(req.user.id_user);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { title, deadline, id_type, id_room, recurrence } = req.body;
        //check if content is not empty
        if(!title || !deadline || !id_type || !id_room || !recurrence) return res.status(400).json({message: 'Data Cannot be empty'});

        // Create the new task
        const task = await Task.create({
            title,
            deadline,
            id_type: id_type,
            id_room: id_room,
            id_user: req.user.id_user,
            recurrence,
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({message: 'Error creating task', error: error.message});
    }
}

/*
 * Get a task by id
 */

exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.taskId);
        if (!task) {
            return res.status(404).json({message: "Task not found"});
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({message: "Error retrieving task", error: error.message});
    }
}

/*
 * Get all home tasks
 */

exports.getHomeTasks = async (req, res) => {
    try {
        // Check if home exist
        const home = await Home.findByPk(req.body.id_home);
        if (!home) return res.status(404).json({ message: "This home doesn't exist" });

        // Get all rooms associated with the home
        const rooms = await Room.findAll({ where: { id_home: req.body.id_home }});

        // Extract room IDs
        const roomIds = rooms.map(room => room.id_room);

        // Get all tasks associated with the rooms of the home
        const homeTasks = await Task.findAll({
            where: { id_room: roomIds },
            include: [
                {
                    model: Room,
                    include: [Home]
                }
            ]
        });

        res.status(200).json(homeTasks);
    } catch (error) {
        res.status(500).json({message: "Error retrieving tasks", error: error.message});
    }
}

/*
 * Update a task
 */

exports.updateTask = async (req, res) => {
    try {
        // Check id app exist
        const task = await Task.findByPk(req.params.id_task);
        const { title, deadline, recurrence } = req.body;
        //check if task exist
        if (!task) return res.status(404).json({message: "Task not found"});
        //check if content is not empty
        if(!title || !deadline || !recurrence) return res.status(400).json({message: 'Data Cannot be empty'});

        const newTask = await task.update(req.body);

        res.status(200).json(newTask);
    } catch (error) {
        res.status(500).json({message: "Error updating task", error: error.message});
    }
}

/*
 * Delete a task
 */

exports.deleteTask = async (req, res) => {
    try {
        // Check if task exist
        const task = await Task.findByPk(req.params.id_task);
        if (!task) return res.status(404).json({message: "Task not found"});

        await task.destroy();

        res.status(200).json({message: "Task deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Error deleting task", error: error.message});
    }
}
