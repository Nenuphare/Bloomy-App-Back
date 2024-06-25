const request = require('supertest');
const express = require('express');
const userRoutes = require('../../routes/userRoute');
const userController = require('../../controllers/userController');
const jwtMiddleware = require('../../middlewares/jwtMiddleware');

jest.mock('../../controllers/userController');
jest.mock('../../middlewares/jwtMiddleware');

const app = express();
app.use(express.json());
app.use('/user', userRoutes);

describe('User Routes', () => {
    beforeEach(() => {
        jwtMiddleware.verifyToken.mockImplementation((req, res, next) => next());
    });

    describe('POST /user/register', () => {
        it('should register a new user', async () => {
            userController.registerAUser.mockImplementation((req, res) => {
                res.status(201).json({ message: 'User created' });
            });

            const res = await request(app)
                .post('/user/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    firstname: 'John',
                    lastname: 'Doe'
                });

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('User created');
        });
    });

    describe('POST /user/login', () => {
        it('should log in a user', async () => {
            userController.loginAUser.mockImplementation((req, res) => {
                res.status(200).json({ message: 'Logged in', token: 'fakeToken' });
            });

            const res = await request(app)
                .post('/user/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Logged in');
            expect(res.body.token).toBe('fakeToken');
        });
    });

    describe('GET /user/homes', () => {
        it('should get user homes', async () => {
            userController.getUserHomes.mockImplementation((req, res) => {
                res.status(200).json([{ id_home: 1, homeName: 'Home1' }]);
            });

            const res = await request(app)
                .get('/user/homes')
                .set('Authorization', 'Bearer fakeToken');

            expect(res.status).toBe(200);
            expect(res.body).toEqual([{ id_home: 1, homeName: 'Home1' }]);
        });
    });

    describe('DELETE /user', () => {
        it('should delete a user', async () => {
            userController.deleteAUser.mockImplementation((req, res) => {
                res.status(201).json({ message: 'User deleted' });
            });

            const res = await request(app)
                .delete('/user')
                .set('Authorization', 'Bearer fakeToken')
                .send({ password: 'password123' });

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('User deleted');
        });
    });

    describe('PUT /user', () => {
        it('should update a user', async () => {
            userController.putAUser.mockImplementation((req, res) => {
                res.status(200).json({ message: 'User updated' });
            });

            const res = await request(app)
                .put('/user')
                .set('Authorization', 'Bearer fakeToken')
                .send({
                    oldPassword: 'oldPassword123',
                    newPassword: 'newPassword123',
                    firstname: 'Jane',
                    lastname: 'Doe',
                    email: 'jane@example.com'
                });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('User updated');
        });
    });

    describe('GET /user', () => {
        it('should get a user', async () => {
            userController.getAUser.mockImplementation((req, res) => {
                res.status(200).json({ id_user: 1, email: 'test@example.com' });
            });

            const res = await request(app)
                .get('/user')
                .set('Authorization', 'Bearer fakeToken');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ id_user: 1, email: 'test@example.com' });
        });
    });
});
