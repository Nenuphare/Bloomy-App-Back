const request = require('supertest');
const express = require('express');
const roomRoutes = require('../../routes/roomRoute');
const roomController = require('../../controllers/roomController');
const jwtMiddleware = require('../../middlewares/jwtMiddleware');

jest.mock('../../controllers/roomController');
jest.mock('../../middlewares/jwtMiddleware');

const app = express();
app.use(express.json());
app.use('/rooms', roomRoutes);

describe('Room Routes', () => {
    beforeEach(() => {
        jwtMiddleware.verifyToken.mockImplementation((req, res, next) => next());
    });

    describe('POST /rooms', () => {
        it('should create a new room', async () => {
            roomController.createRoom.mockImplementation((req, res) => {
                res.status(201).json({ message: 'Room created' });
            });

            const res = await request(app)
                .post('/rooms')
                .send({
                    name: 'New Room',
                    id_home: 1
                });

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('Room created');
        });
    });

    describe('GET /rooms/homes/:id_home', () => {
        it('should get all rooms from a home', async () => {
            roomController.getAllRoomsFromHome.mockImplementation((req, res) => {
                res.status(200).json([{ id_room: 1, name: 'Room 1', id_home: req.params.id_home }]);
            });

            const res = await request(app)
                .get('/rooms/homes/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual([{ id_room: 1, name: 'Room 1', id_home: '1' }]);
        });
    });

    describe('PUT /rooms/:id_room', () => {
        it('should update a room by id', async () => {
            roomController.updateRoom.mockImplementation((req, res) => {
                res.status(200).json({ message: 'Room updated' });
            });

            const res = await request(app)
                .put('/rooms/1')
                .send({
                    name: 'Updated Room'
                });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Room updated');
        });
    });

    describe('DELETE /rooms/:id_room', () => {
        it('should delete a room by id', async () => {
            roomController.deleteRoom.mockImplementation((req, res) => {
                res.status(200).json({ message: 'Room deleted' });
            });

            const res = await request(app)
                .delete('/rooms/1');

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Room deleted');
        });
    });
});