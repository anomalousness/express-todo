const resetData = require('../utils/reset-db-data');
const { getTodos, getTodoById, addTodo } = require('./todoController');

describe('todoController', () => {
  beforeEach(async () => {
    await resetData();
  });

  describe('getTodos()', () => {
    test('should return an array of all todo objects and status 200', async () => {
      // Arrange
      const mReq = {};
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      // Act
      await getTodos(mReq, mRes);

      // Assert
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json.mock.calls[0][0].length).toBe(3);
      expect(mRes.json.mock.calls[0][0][0].task).toBe('Eat');
    })
  })

  describe('getTodoById()', () => {
    test.each([
      [1, 'Eat', true],
      [2, 'Sleep', false],
      [3, 'Pray', false]
    ])('should return an array containing a single todo object and status 200', async (id, task, completed) => {
      // Arrange
      const mReq = {
        params: {
          id
        }
      };
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      // Act
      await getTodoById(mReq, mRes);

      // Assert
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json.mock.calls[0][0].length).toBe(1);
      expect(mRes.json.mock.calls[0][0][0]).toEqual({id, task, completed});
    })
  })

  describe('addTodo()', () => {
    test.each(['Code', 'Climb', 'Play'])('should add new todo to the db and return the new object and status 201', async (task) => {
      // Arrange
      const mReq = {
        body: {task}
      };
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      // Act
      await addTodo(mReq, mRes);

      // Assert
      expect(mRes.status).toBeCalledWith(201);
      expect(mRes.json.mock.calls[0][0].length).toBe(1);
      expect(mRes.json.mock.calls[0][0][0]).toEqual({id: 4, task, completed: false});
    })
  })
})