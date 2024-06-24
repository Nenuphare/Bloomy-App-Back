const request = require('supertest');
const app = require('../index.js');

describe('User Controller', () => {
    it('should return a list of users', async () => {
      const response = await request(app).get('/users');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });