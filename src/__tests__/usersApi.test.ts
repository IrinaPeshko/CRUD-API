import supertest from 'supertest';
import server from '../index';

const request = supertest(server);

describe('test endpoints', () => {
  let createdUserId = '';

  const newUser = {
    username: 'New user',
    age: 24,
    hobbies: ['Reading', 'Traveling'],
  };

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

describe('valid data', () => {
  it('returns 400 for invalid age', async () => {
    const invalidUser = {
      username: 'New user',
      age: 'invalid_age',
      hobbies: ['Reading', 'Traveling'],
    };

    const response = await request.post('/api/users').send(invalidUser);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Invalid age');
  });

  it('returns 400 for invalid name', async () => {
    const incompleteUser = {
      age: 24,
      hobbies: ['Reading', 'Traveling'],
    };

    const response = await request.post('/api/users').send(incompleteUser);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Invalid username');
  });

  it('returns 400 for invalid hobbies', async () => {
    const incompleteUser = {
      name: 'Irina',
      age: 24,
      hobbies: 'Reading',
    };

    const response = await request.post('/api/users').send(incompleteUser);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Invalid fields in user data');
  });
});

describe('error handling', () => {
  const userId = '94156b01-0258-4276-b542-5cc5bd527c8d';
  afterAll((done) => {
    server.close(done);
  });

  it('returns 404 when trying to get a non-existent user', async () => {
    const response = await request.get(`/api/users/${userId}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(
      `The user with id: '${userId}' not found`,
    );
  });

  it('returns 400 when trying to update a user with invalid data', async () => {
    const invalidUpdateData = {
      username: null,
      age: -5,
      hobbies: ['Reading', 123],
    };
    const response = await request
      .put(`/api/users/${userId}`)
      .send(invalidUpdateData);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it('returns 400 when trying to delete a user with invalid UUID', async () => {
    const response = await request.delete(`/api/users/${userId}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(
      "The user with id: '94156b01-0258-4276-b542-5cc5bd527c8d' not found",
    );
  });
});
