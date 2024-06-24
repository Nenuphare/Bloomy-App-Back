const { describe, it, expect, beforeEach, afterEach } = require('@jest/globals');
const app = require('../index.js');
const { sequelize } = require('../models/index.js'); 

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database');
    await sequelize.sync({ force: false });
    console.log('All models synchronized with the database');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

describe('Room Controller - createRoom', () => {
  let user;
  let home;

  beforeEach(async () => {
    user = await User.create({ id_user: 1, username: 'testuser', password: 'password123' });
    home = await Home.create({ id_home: 1, name: 'Test Home' });
    await UserHome.create({ id_user: user.id_user, id_home: home.id_home });
  });

  const createRoom = async (body, token) => {
    return await request(app)
      .post('/rooms')
      .set('Authorization', `Bearer ${token}`)
      .send(body);
  };

  test('should create a new room', async () => {
    const response = await createRoom({ id_home: home.id_home, name: 'Living Room' }, 'valid_token');
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id_room');
    expect(response.body.name).toBe('Living Room');
  });

  test('should return 403 if user is not in home', async () => {
    const response = await createRoom({ id_home: home.id_home, name: 'Living Room' }, 'invalid_token');
    expect(response.status).toBe(403);
    expect(response.body.message).toBe("You don't have permission to create a room here");
  });

  test('should return 400 if id_home or name is empty', async () => {
    let response = await createRoom({ id_home: '', name: 'Living Room' }, 'valid_token');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('id_home or room name cannot be empty');

    response = await createRoom({ id_home: home.id_home, name: '' }, 'valid_token');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('id_home or room name cannot be empty');
  });

  test('should return 404 if home does not exist', async () => {
    const response = await createRoom({ id_home: 999, name: 'Living Room' }, 'valid_token');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Home not found');
  });

  test('should return 500 on server error', async () => {
    jest.spyOn(Room, 'create').mockImplementation(() => {
      throw new Error('Failed to create room');
    });
    const response = await createRoom({ id_home: home.id_home, name: 'Living Room' }, 'valid_token');
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Failed to create room');
    expect(response.body.details).toBe('Failed to create room');
  });
});
