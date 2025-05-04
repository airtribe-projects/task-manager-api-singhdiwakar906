const taskManager = require('../data/managers/tasks');

module.exports.getTasksList = async (req, resp) => {
    try {
        const params = req.query
        const searchQuery = {}
        if(params.completed) {
            searchQuery.completed = params.completed == 'true' ? true : false
        }
        const tasks = await taskManager.getTasksList(searchQuery)
        // return resp.status(200).json({ success: true, data: tasks });
        return resp.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return resp.status(500).json({ success: false, message: 'Failed to fetch tasks' })
    }
};

module.exports.getTaskByPriority = async (req, resp) => {
    try {
        const params = req.params
        const searchQuery = {}
        if(params.level) {
            searchQuery.priority = params.level
        }
        const tasks = await taskManager.getTasksList(searchQuery)
        // return resp.status(200).json({ success: true, data: tasks });
        return resp.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return resp.status(500).json({ success: false, message: 'Failed to fetch tasks' })
    }
};

module.exports.getTaskDetails = async (req, resp) => {
    try {
        const params = req.params

        if (!params.id) return resp.status(400).json({ status: false, message: "request data missing" })
        const searchQuery = { id: parseInt(params.id) }
        const taskDetails = await taskManager.getTaskDetails(searchQuery)
        if (!taskDetails) {
            return resp.status(404).json({ success: false, message: 'Task not found' });
        }
        // return resp.status(200).json({ success: true, data: taskDetails });
        return resp.status(200).json(taskDetails);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return resp.status(500).json({ success: false, message: 'Failed to fetch tasks' })
    }
};

module.exports.createTask = async (req, resp) => {
    try {
        const params = req.body

        if (!params.title || !params.description || !params.hasOwnProperty('completed'))
            return resp.status(400).json({ status: false, message: "request data missing" })

        //type checks
        if ( typeof params.title !== 'string' || typeof params.description !== 'string' || typeof params.completed !== 'boolean') {
            return resp.status(400).json({ success: false, message: "Invalid request body. Ensure title/description are strings and completed is a boolean." });
        }

        const payload = {
            title: params.title,
            description: params.description,
            completed: params.completed,
            priority: params.priority || 'low'
        }
        
        const task = await taskManager.createTask(payload);
        // return resp.status(201).json({ success: true, message: "Task created successfully", data: task });
        return resp.status(201).json(task);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        resp.status(500).json({ success: false, message: 'Failed to fetch tasks' })
    }
};
module.exports.updateTask = async (req, resp) => {
    try {
        const id = parseInt(req.params.id)
        const params = req.body
        if (!id || !params.title || !params.description || !params.hasOwnProperty('completed')){
            return resp.status(400).json({ status: false, message: "request data missing" })
        }

        //type checks
        if ( typeof params.title !== 'string' || typeof params.description !== 'string' || typeof params.completed !== 'boolean') {
            return resp.status(400).json({ success: false, message: "Invalid request body. Ensure title/description are strings and completed is a boolean." });
        }

        const searchQuery = { 
            id
        }
        const task = await taskManager.getTaskDetails(searchQuery)
        if (!task) return resp.status(404).json({ success: false, message: 'Task not found' });

        const payload = {
            id: id,
            title: params.title,
            description: params.description,
            completed: params.completed,
            priority: params.priority || 'low'
        }
        const updatedTask = await taskManager.updateTask(payload)
        // return resp.status(200).json({ success: true, message: "Task updated successfully", data: updatedTask });
        return resp.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        return resp.status(500).json({ success: false, message: 'Failed to update task' })
    }
};

module.exports.deleteTask = async (req, resp) => {
    try {
        const params = req.params
        if (!params.id) return resp.status(400).json({ status: false, message: "request data missing" })

        const searchQuery = { 
            id: parseInt(params.id)
        }
        const task = await taskManager.getTaskDetails(searchQuery)
        if (!task) return resp.status(404).json({ success: false, message: 'Task not found' });

        await taskManager.deleteTask(searchQuery)
        return resp.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return resp.status(500).json({ success: false, message: 'Failed to fetch tasks' })
    }
};

