const request = require('supertest');
const app = require('./app');
const resetData = require('./utils/reset-db-data');

describe('App', () => {
  beforeEach(async () => {
    await resetData();
  });
  describe('GET /', () => {
    test('should return a json message response and status 200', async () => {
      // Act
      const response = await request(app).get('/');
      // Assert
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("it's ok");
    })
  })

  describe('GET /todos', () => {
    test('should return an array of all todos and status 200', async () => {
      // Act
      const response = await request(app).get('/todos');
      // Assert
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(3);
      expect(response.body[0].task).toBe('Eat')
    })
  })

  describe('GET /todos/:id', () => {
    test.each([
      [1, 'Eat', true],
      [2, 'Sleep', false],
      [3, 'Pray', false]
    ])('should return an array with a single todo specified by ID and status 200', async (id, task, completed) => {
      // Act
      const response = await request(app).get(`/todos/${id}`);
      // Assert
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].task).toBe(task)
      expect(response.body[0].completed).toBe(completed)
    })
  })

  describe('POST /todos', () => {
    test.each(['Swim', 'Climb', 'Code'])('should return an array with a single todo specified by ID and status 200', async (task) => {
      // Act
      const response = (await request(app).post('/todos').send({task}));
      // Assert
      expect(response.status).toBe(201);
      expect(response.body.length).toBe(1);
      expect(response.body[0].task).toBe(task)
      expect(response.body[0].completed).toBe(false)
    })
  })
});