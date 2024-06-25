const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userController = require('../../controllers/userController');
const { User, Home, UserHome } = require('../../models/index');
const jwtMiddleware = require('../../middlewares/jwtMiddleware');

jest.mock('jsonwebtoken');
jest.mock('bcrypt');
jest.mock('../../models/index');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    req.user = { id_user: 1 };
    next();
});
app.get('/user', userController.getAUser);
app.post('/register', userController.registerAUser);
app.post('/login', userController.loginAUser);
app.put('/user', userController.putAUser);
app.delete('/user', userController.deleteAUser);
app.get('/user/homes', userController.getUserHomes);

describe('User Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /user', () => {
        it('should get a user by ID', async () => {
            User.findByPk.mockResolvedValue({ id_user: 1, email: 'test@test.com' });

            const res = await request(app).get('/user');

            expect(res.status).toBe(201);
            expect(res.body).toEqual({ id_user: 1, email: 'test@test.com' });
            expect(User.findByPk).toHaveBeenCalledWith(1);
        });

        it('should return 404 if user not found', async () => {
            User.findByPk.mockResolvedValue(null);

            const res = await request(app).get('/user');

            expect(res.status).toBe(404);
            expect(res.body.message).toBe('User not found');
        });
    });

    describe('POST /register', () => {
        it('should register a new user', async () => {
            const newUser = { id_user: 1, email: 'test@test.com' };
            User.create.mockResolvedValue(newUser);

            const res = await request(app).post('/register').send({
                email: 'test@test.com',
                password: 'password123',
                firstname: 'John',
                lastname: 'Doe'
            });

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('User n°1 created: mail: test@test.com');
            expect(User.create).toHaveBeenCalledWith({
                email: 'test@test.com',
                password: 'password123',
                firstname: 'John',
                lastname: 'Doe'
            });
        });

        it('should return 400 if email is invalid', async () => {
            const res = await request(app).post('/register').send({
                email: 'invalid-email',
                password: 'password123',
                firstname: 'John',
                lastname: 'Doe'
            });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Invalid email format');
        });

    });
    

    describe('POST /login', () => {
        it('should login a user with correct credentials', async () => {
            const user = { id_user: 1, email: 'test@test.com', password: 'hashedpassword' };
            User.findOne.mockResolvedValue(user);
            UserHome.findOne.mockResolvedValue({ id_user: 1, id_home: 1 });
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('token');

            const res = await request(app).post('/login').send({
                email: 'test@test.com',
                password: 'password123'
            });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Logged in');
            expect(res.body.token).toBe('token');
            expect(res.body.id_user).toBe(1);
            expect(res.body.id_home).toBe(1);
        });

        it('should return 401 if password is incorrect', async () => {
            const user = { id_user: 1, email: 'test@test.com', password: 'hashedpassword' };
            User.findOne.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(false);

            const res = await request(app).post('/login').send({
                email: 'test@test.com',
                password: 'wrongpassword'
            });

            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Incorrect email or password');
        });

        // Add more tests for other cases...
    });

    describe('PUT /user', () => {
        it('should update a user\'s details', async () => {
            const user = { id_user: 1, email: 'test@test.com', password: 'hashedpassword' };
            User.findByPk.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true);
            user.update = jest.fn().mockResolvedValue(user);

            const res = await request(app).put('/user').send({
                oldPassword: 'password123',
                firstname: 'Jane',
                lastname: 'Doe',
                email: 'jane@test.com',
                newPassword: 'newpassword123'
            });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('User updated successfully.');
            expect(user.update).toHaveBeenCalledWith({
                firstname: 'Jane',
                lastname: 'Doe',
                email: 'jane@test.com',
                password: 'newpassword123'
            });
        });

        it('should return 403 if old password is incorrect', async () => {
            const user = { id_user: 1, email: 'test@test.com', password: 'hashedpassword' };
            User.findByPk.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(false);

            const res = await request(app).put('/user').send({
                oldPassword: 'wrongpassword',
                firstname: 'Jane',
                lastname: 'Doe',
                email: 'jane@test.com',
                newPassword: 'newpassword123'
            });

            expect(res.status).toBe(403);
            expect(res.body.message).toBe('Incorrect old password');
        });

    });

    describe('DELETE /user', () => {
        it('should delete a user with correct password', async () => {
            const user = { id_user: 1, email: 'test@test.com', password: 'hashedpassword' };
            const userHomes = [{ id_home: 1 }];
            User.findByPk.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true);
            UserHome.findAll.mockResolvedValue(userHomes);
            UserHome.destroy.mockResolvedValue();
            Home.destroy.mockResolvedValue();
            User.destroy.mockResolvedValue();

            const res = await request(app).delete('/user').send({ password: 'password123' });

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('User successfully deleted');
            expect(UserHome.destroy).toHaveBeenCalledWith({ where: { id_user: 1 } });
            expect(User.destroy).toHaveBeenCalledWith({ where: { id_user: 1 } });
        });

        it('should return 403 if password is incorrect', async () => {
            const user = { id_user: 1, email: 'test@test.com', password: 'hashedpassword' };
            User.findByPk.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(false);

            const res = await request(app).delete('/user').send({ password: 'wrongpassword' });

            expect(res.status).toBe(403);
            expect(res.body.message).toBe('Password is incorrect');
        });

    });

    describe('GET /user/homes', () => {
        it('should get homes for a user', async () => {
            const user = { id_user: 1, email: 'test@test.com' };
            const homes = [{ id_home: 1, name: 'Home 1' }];
            User.findByPk.mockResolvedValue(user);
            UserHome.findAll.mockResolvedValue(homes);

            const res = await request(app).get('/user/homes');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(homes);
        });

        it('should return 404 if user not found', async () => {
            User.findByPk.mockResolvedValue(null);

            const res = await request(app).get('/user/homes');

            expect(res.status).toBe(404);
            expect(res.body.message).toBe('User not found');
        });

        it('should return 404 if no homes found for user', async () => {
            const user = { id_user: 1, email: 'test@test.com' };
            User.findByPk.mockResolvedValue(user);
            UserHome.findAll.mockResolvedValue([]);

            const res = await request(app).get('/user/homes');

            expect(res.status).toBe(404);
            expect(res.body.message).toBe('No homes found for this user');
        });

    });
});
