const { registerAUser } = require('../controllers/userController');
const { User } = require('../models/index');
const bcrypt = require('bcrypt');

jest.mock('../models/index');

describe('User Controller - registerAUser', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                password: 'password123',
                firstname: 'John',
                lastname: 'Doe'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should create a new user successfully', async () => {
        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue({ id_user: 1, email: 'test@example.com' });

        await registerAUser(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'User n°1 created: mail: test@example.com' });
    });

    it('should return 400 if email is already in use', async () => {
        User.findOne.mockResolvedValue({ email: 'test@example.com' });

        await registerAUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'This email already exists.' });
    });

    it('should return 500 if there is a server error', async () => {
        User.findOne.mockRejectedValue(new Error('Database error'));

        await registerAUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error processing data', error: 'Database error' });
    });
});