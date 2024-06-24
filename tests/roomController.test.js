const { describe, it, expect, beforeEach, afterEach } = require('@jest/globals');
const app = require('../index.js');
const { sequelize } = require('../models/index.js'); 

beforeEach(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database');
    await sequelize.sync({ force: false });
    console.log('All models synchronized with the database');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

afterEach(async () => {
  try {
    await sequelize.close();
    console.log('Disconnected from the database');
  } catch (error) {
    console.error('Error disconnecting from the database:', error);
  }
});

describe('Room Controller', () => {
  it('should return a list of users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});
