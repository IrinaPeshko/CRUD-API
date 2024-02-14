import supertest from 'supertest';
import server from '../index';

const request = supertest(server);

describe('GET /api/users', () => {
  let createdUserId = '';

  const newUser = {
    username: 'New user',
    age: 24,
    hobbies: ['Reading', 'Traveling'],
  };

  afterAll((done) => {
    server.close(done);
  });

  it('return all users', async () => {
    const response = await request.get('/api/users');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(0);
  });

  it('create a new user and return the user data', async () => {
    const response = await request.post('/api/users').send(newUser);
    expect(response.statusCode).toBe(201);
    expect(response.body.username).toBe(newUser.username);
    expect(response.body.age).toBe(newUser.age);
    expect(response.body.hobbies).toEqual(
      expect.arrayContaining(newUser.hobbies),
    );
    createdUserId = response.body.id;
  });

  it('get the created user by id', async () => {
    const response = await request.get(`/api/users/${createdUserId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe(newUser.username);
    expect(response.body.age).toBe(newUser.age);
    expect(response.body.hobbies).toEqual(
      expect.arrayContaining(newUser.hobbies),
    );
  });

  it('update created user', async () => {
    const updateUser = {
      username: 'New user',
      hobbies: ['Playing boardgames', 'Reading'],
    };
    const response = await request
      .put(`/api/users/${createdUserId}`)
      .send(updateUser);
    expect(response.statusCode).toBe(201);
    expect(response.body.username).toBe(updateUser.username);
    expect(response.body.age).toBe(newUser.age);
    expect(response.body.hobbies).toEqual(
      expect.arrayContaining(updateUser.hobbies),
    );
    expect(response.body.id).toBe(createdUserId);
  });

  it('delete user', async () => {
    const response = await request.get(`/api/users/${createdUserId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(createdUserId);
    await request.delete(`/api/users/${createdUserId}`);
    const newResponse = await request.get(`/api/users/${createdUserId}`);
    expect(newResponse.statusCode).toBe(404);
    expect(newResponse.body.message).toBe(
      `The user with id: '${createdUserId}' not found`,
    );
  });
});
