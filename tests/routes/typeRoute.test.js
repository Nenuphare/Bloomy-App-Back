const request = require('supertest');
const express = require('express');
const typeRoutes = require('../../routes/typeRoute');
const typeController = require('../../controllers/typeController');
const jwtMiddleware = require('../../middlewares/jwtMiddleware');

jest.mock('../../controllers/typeController');
jest.mock('../../middlewares/jwtMiddleware');

const app = express();
app.use(express.json());
app.use('/types', typeRoutes);

describe('Type Routes', () => {
    beforeEach(() => {
        jwtMiddleware.verifyToken.mockImplementation((req, res, next) => next());
    });

    describe('POST /types', () => {
        it('should create a new type', async () => {
            typeController.createType.mockImplementation((req, res) => {
                res.status(201).json({ message: 'Type created' });
            });

            const res = await request(app)
                .post('/types')
                .send({ name: 'New Type' });

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('Type created');
        });
    });

    describe('GET /types', () => {
        it('should get all types', async () => {
            typeController.getAllType.mockImplementation((req, res) => {
                res.status(200).json([{ id_type: 1, name: 'Type 1' }]);
            });

            const res = await request(app).get('/types');

            expect(res.status).toBe(200);
            expect(res.body).toEqual([{ id_type: 1, name: 'Type 1' }]);
        });
    });

    describe('PUT /types/:id_type', () => {
        it('should update a type by id', async () => {
            typeController.updateAType.mockImplementation((req, res) => {
                res.status(200).json({ message: 'Type updated' });
            });

            const res = await request(app)
                .put('/types/1')
                .send({ name: 'Updated Type' });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Type updated');
        });
    });

    describe('DELETE /types/:id_type', () => {
        it('should delete a type by id', async () => {
            typeController.deleteType.mockImplementation((req, res) => {
                res.status(200).json({ message: 'Type deleted' });
            });

            const res = await request(app).delete('/types/1');

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Type deleted');
        });
    });
});
