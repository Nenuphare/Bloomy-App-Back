const Task = require('../models/taskModel');
const User = require('../models/userModel');


/*
 * Create Task
 */

exports.createTask = async (req, res) => {
    try {
        
        // Check if user exist
        const user = await User.findByPk(req.user.id_user);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { title, deadline, id_type, id_room, recurrence } = req.body;


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

// Get a Task by ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.taskId);
        if (!task) {
            return res.status(404).json({message: "Task not found"});
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({message: "Error retrieving task", error});
    }
}

// Get all Tasks
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({message: "Error retrieving tasks", error});
    }
}

// Update a Task by ID
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.taskId);
        if (!task) {
            return res.status(404).json({message: "Task not found"});
        }
        await task.update(req.body);
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({message: "Error updating task", error});
    }
}

// Delete a Task by ID
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.taskId);
        if (!task) {
            return res.status(404).json({message: "Task not found"});
        }
        await task.destroy();
        res.status(200).json({message: "Task deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Error deleting task", error});
    }
}
