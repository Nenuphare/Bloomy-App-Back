const request = require('supertest');
const express = require('express');
const taskRoutes = require('../../routes/taskRoute');
const taskController = require('../../controllers/taskController');
const jwtMiddleware = require('../../middlewares/jwtMiddleware');

jest.mock('../../controllers/taskController');
jest.mock('../../middlewares/jwtMiddleware');

const app = express();
app.use(express.json());
app.use('/tasks', taskRoutes);

describe('Task Routes', () => {
    beforeEach(() => {
        jwtMiddleware.verifyToken.mockImplementation((req, res, next) => next());
    });

    describe('POST /tasks', () => {
        it('should create a new task', async () => {
            taskController.createTask.mockImplementation((req, res) => {
                res.status(201).json({ message: 'Task created' });
            });

            const res = await request(app)
                .post('/tasks')
                .send({
                    title: 'New Task',
                    id_home: 1,
                    id_type: 1
                });

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('Task created');
        });
    });

    describe('GET /tasks/homes/:id_home', () => {
        it('should get all tasks for a home', async () => {
            taskController.getHomeTasks.mockImplementation((req, res) => {
                res.status(200).json([{ id_task: 1, title: 'Task 1', id_home: req.params.id_home }]);
            });

            const res = await request(app)
                .get('/tasks/homes/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual([{ id_task: 1, title: 'Task 1', id_home: '1' }]);
        });
    });

    describe('GET /tasks/rooms/:id_room', () => {
        it('should get all tasks for a room', async () => {
            taskController.getRoomTasks.mockImplementation((req, res) => {
                res.status(200).json([{ id_task: 1, title: 'Task 1', id_room: req.params.id_room }]);
            });

            const res = await request(app)
                .get('/tasks/rooms/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual([{ id_task: 1, title: 'Task 1', id_room: '1' }]);
        });
    });

    describe('PUT /tasks/:id_task', () => {
        it('should update a task by id', async () => {
            taskController.updateTask.mockImplementation((req, res) => {
                res.status(200).json({ message: 'Task updated' });
            });

            const res = await request(app)
                .put('/tasks/1')
                .send({
                    title: 'Updated Task'
                });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Task updated');
        });
    });

    describe('PATCH /tasks/:id_task', () => {
        it('should update a task title by id', async () => {
            taskController.updateTaskTitle.mockImplementation((req, res) => {
                res.status(200).json({ message: 'Task title updated' });
            });

            const res = await request(app)
                .patch('/tasks/1')
                .send({
                    title: 'Updated Task Title'
                });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Task title updated');
        });
    });

    describe('PATCH /tasks/:id_task/status', () => {
        it('should update a task status by id', async () => {
            taskController.updateTaskStatus.mockImplementation((req, res) => {
                res.status(200).json({ message: 'Task status updated' });
            });

            const res = await request(app)
                .patch('/tasks/1/status')
                .send({
                    finished: true
                });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Task status updated');
        });
    });

    describe('DELETE /tasks/:id_task', () => {
        it('should delete a task by id', async () => {
            taskController.deleteTask.mockImplementation((req, res) => {
                res.status(200).json({ message: 'Task deleted' });
            });

            const res = await request(app)
                .delete('/tasks/1');

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Task deleted');
        });
    });
});
