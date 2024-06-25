const request = require('supertest');
const express = require('express');
const homeRoutes = require('../../routes/homeRoute');
const homeController = require('../../controllers/homeController');
const jwtMiddleware = require('../../middlewares/jwtMiddleware');

jest.mock('../../controllers/homeController');
jest.mock('../../middlewares/jwtMiddleware');

const app = express();
app.use(express.json());
app.use('/home', homeRoutes);

describe('Home Routes', () => {
    beforeEach(() => {
        jwtMiddleware.verifyToken.mockImplementation((req, res, next) => next());
    });

    describe('POST /home', () => {
        it('should create a new home', async () => {
            homeController.createAHome.mockImplementation((req, res) => {
                res.status(201).json({ message: 'Home created' });
            });

            const res = await request(app)
                .post('/home')
                .send({
                    name: 'New Home'
                });

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('Home created');
        });
    });

    describe('GET /home/:id_home', () => {
        it('should get a home by id', async () => {
            homeController.getAHome.mockImplementation((req, res) => {
                res.status(200).json({ id_home: req.params.id_home, name: 'Home 1' });
            });

            const res = await request(app)
                .get('/home/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ id_home: '1', name: 'Home 1' });
        });
    });

    describe('PUT /home/:id_home', () => {
        it('should update a home by id', async () => {
            homeController.updateAHome.mockImplementation((req, res) => {
                res.status(200).json({ message: 'Home updated' });
            });

            const res = await request(app)
                .put('/home/1')
                .send({
                    name: 'Updated Home'
                });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Home updated');
        });
    });

    describe('DELETE /home/:id_home', () => {
        it('should delete a home by id', async () => {
            homeController.deleteAHome.mockImplementation((req, res) => {
                res.status(200).json({ message: 'Home deleted' });
            });

            const res = await request(app)
                .delete('/home/1');

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Home deleted');
        });
    });

    describe('DELETE /home/:id_home/exit', () => {
        it('should exit a home by id', async () => {
            homeController.exitAHome.mockImplementation((req, res) => {
                res.status(200).json({ message: 'Exited home' });
            });

            const res = await request(app)
                .delete('/home/1/exit');

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Exited home');
        });
    });

    describe('GET /home/:id_home/members', () => {
        it('should get members of a home by id', async () => {
            homeController.getHomeUsers.mockImplementation((req, res) => {
                res.status(200).json([{ id_user: 1, name: 'User 1' }]);
            });

            const res = await request(app)
                .get('/home/1/members');

            expect(res.status).toBe(200);
            expect(res.body).toEqual([{ id_user: 1, name: 'User 1' }]);
        });
    });

    describe('POST /home/join/:share_code', () => {
        it('should join a home by share code', async () => {
            homeController.joinAHome.mockImplementation((req, res) => {
                res.status(200).json({ message: 'Joined home' });
            });

            const res = await request(app)
                .post('/home/join/abc123');

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Joined home');
        });
    });
});
