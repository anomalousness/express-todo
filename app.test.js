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

    test.each([
      [2000, 'Todo with an id of 2000 was not found in the database', 404],
      ['dog', 'ID must be a number', 400],
    ])('should return an error message and an appropriate status when id param is %s', async (id, errorMessage, status) => {
      // Act
      const response = await request(app).get(`/todos/${id}`);
      // Assert
      expect(response.status).toBe(status);
      expect(response.body.message).toBe(errorMessage)
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

    test.each(['', null, undefined])('should return an error message and an appropriate status when the req.body task property is "%s"', async (task) => {
      // Act
      const response = (await request(app).post('/todos').send({task}));
      // Assert
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('No task data provided')
    })
  })

  describe('DELETE /todos/:id', () => {
    test.each([1,2,3])('should delete a todo and return an array containing only the deleted todo object and status 200', async (id) => {
      // Act
      const response = (await request(app).delete(`/todos/${id}`));
      // Assert
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBe(id)
    })

    test.each([
      [2000, 'Todo with an id of 2000 was not found in the database', 404],
      ['dog', 'ID must be a number', 400],
    ])('should return an error message and an appropriate status', async (id, errorMessage, status) => {
      // Act
      const response = (await request(app).delete(`/todos/${id}`));
      // Assert
      expect(response.status).toBe(status);
      expect(response.body.message).toBe(errorMessage)
    })
  })

  describe('UPDATE /todos/:id', () => {
    test.each([
      [1, 'Surf', undefined, 'Surf', true],
      [2, 'Snooze', true, 'Snooze', true],
      [3, undefined, true, 'Pray', true]
    ])('should update a todo and return an array containing only the updated todo object and status 201', async (id, task, completed, updatedTask, updatedCompleted) => {
      // Act
      const response = (await request(app).put(`/todos/${id}`).send({task, completed}));
      // Assert
      expect(response.status).toBe(201);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toEqual({id, task: updatedTask, completed: updatedCompleted})
    })

    test.each([
      [2000, 'Todo with an id of 2000 was not found in the database', 404, 'Sit', true],
      ['dog', 'ID must be a number', 400, 'Sit', true],
      ['1', 'No update data provided', 400, undefined, undefined],
    ])('should return an error message and an appropriate status', async (id, errorMessage, status, task, completed) => {
      // Act
      const response = (await request(app).put(`/todos/${id}`).send({task, completed}));
      // Assert
      expect(response.status).toBe(status);
      expect(response.body.message).toBe(errorMessage)
    })
  })
});

