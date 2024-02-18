const resetData = require('../utils/reset-db-data');
const { getTodos, getTodoById } = require('./todoController');

describe('todoController', () => {
  beforeEach(async () => {
    await resetData();
  });

  describe('getTodos()', () => {
    test('should be a test', async () => {
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
    ])('should be a test', async (id, task, completed) => {
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
})