const { Task, User, Room, Home, Type, UserHome } = require('../models/index');
const { checkUserHome } = require('../policy/checkUserHome');


/*
 * Create Task
 */

exports.createTask = async (req, res) => {
    try {
        // Check if user exist
        const user = await User.findByPk(req.user.id_user);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        // Check if user is in home
        if (!checkUserHome(req.user.id_user, req.body.id_home)) 
            return res.status(403).json({ message: "You don't have permission to create a task in this home" });

        const { title, deadline, id_type, id_home, id_room, id_user, recurrence } = req.body;
        //check if content is not empty
        if(!title || !id_home) return res.status(400).json({message: 'Data Cannot be empty'});


        // Check if type exist
        const type = await Type.findByPk(id_type);
        if (!type) return res.status(400).json({ message: 'Invalid type ID' });

        // Create the new task
        const task = await Task.create({
            title,
            deadline,
            id_type: id_type,
            id_home: id_home,
            id_room: id_room,
            id_user: id_user,
            recurrence,
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({message: 'Error creating task', error: error.message});
    }
}


/*
 * Get all home tasks
 */

exports.getHomeTasks = async (req, res) => {
    try {
        // Check if home exist
        const home = await Home.findByPk(req.params.id_home);
        if (!home) return res.status(404).json({ message: "This home doesn't exist" });

        // Check if user is in home
        if (!checkUserHome(req.user.id_user, req.params.id_home)) 
            return res.status(403).json({ message: "You don't have permission to get a task of this home" });
        
        // Get all tasks associated with tis home
        const homeTasks = await Task.findAll({
            where: { 
                id_home: req.params.id_home,
                finished: false
            },
        });

        res.status(200).json(homeTasks);
    } catch (error) {
        res.status(500).json({message: "Error retrieving tasks", error: error.message});
    }
}


/*
 * Get all room tasks
 */

exports.getRoomTasks = async (req, res) => {
    try {
        
        // Check if home exist
        const room = await Room.findByPk(req.params.id_room);
        if (!room) return res.status(404).json({ message: "This room doesn't exist" });
        
        // Check if user is in home
        if (!checkUserHome(req.user.id_user, room.id_home)) 
            return res.status(403).json({ message: "You don't have permission to get these tasks" });

        // Get all tasks associated with this rooms
        const roomTasks = await Task.findAll({
            where: { 
                id_room: req.params.id_room,
                finished: false
            },
        });

        res.status(200).json(roomTasks);
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
        if (!title) return res.status(400).json({message: 'Data Cannot be empty'});

        const newTask = await task.update(req.body);

        res.status(200).json(newTask);
    } catch (error) {
        res.status(500).json({message: "Error updating task", error: error.message});
    }
}


/*
 * Update task status
 */

exports.updateTaskStatus = async (req, res) => {
    try {
        // Check if task exists
        const task = await Task.findByPk(req.params.id_task);
        if (!task) return res.status(404).json({ message: "Task not found" });

        // Check if user is in home
        if (!checkUserHome(req.user.id_user, task.id_home)) 
            return res.status(403).json({ message: "You don't have permission to update this task" });

        const { finished } = req.body;
        if (typeof finished !== 'boolean') return res.status(400).json({ message: 'Invalid completed status' });

        task.finished = finished;

        // Recurrence
        if (task.recurrence > 0 && task.finished) {
            const currentDate = task.deadline || new Date();
            const newDeadline = new Date(currentDate.setDate(currentDate.getDate() + task.recurrence));

            const formattedDeadline = newDeadline.toISOString().slice(0, 19).replace('T', ' ');
            task.deadline = formattedDeadline;
            task.finished = false;
        }

        await task.save();

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Error updating task status", error: error.message });
    }
};


/*
 * Update task title
 */

exports.updateTaskTitle = async (req, res) => {
    try {
        // Check if task exists
        const task = await Task.findByPk(req.params.id_task);
        if (!task) return res.status(404).json({ message: "Task not found" });

        // Check if user is in home
        if (!checkUserHome(req.user.id_user, task.id_home)) 
            return res.status(403).json({ message: "You don't have permission to update this title" });

        const { title } = req.body;
        if (!title) return res.status(400).json({ message: 'Title cannot be empty' });

        task.title = title;
        await task.save();

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Error updating task title", error: error.message });
    }
};


/*
 * Delete a task
 */

exports.deleteTask = async (req, res) => {
    try {
        // Check if task exist
        const task = await Task.findByPk(req.params.id_task);
        if (!task) return res.status(404).json({message: "Task not found"});

        // Check if user is in home
        if (!checkUserHome(req.user.id_user, task.id_home)) 
            return res.status(403).json({ message: "You don't have permission to delete this task" });

        await task.destroy();

        res.status(200).json({message: "Task deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Error deleting task", error: error.message});
    }
}
