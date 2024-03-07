const resetData = require('../utils/reset-db-data');
const { getTodos, getTodoById, addTodo, deleteTodo, updateTodo } = require('./todoController');

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
      const mNext = jest.fn();

      // Act
      await getTodos(mReq, mRes, mNext);

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
    ])('should return an array containing a single todo object and status 200 when called with a param id of %s', async (id, task, completed) => {
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
      const mNext = jest.fn();

      // Act
      await getTodoById(mReq, mRes, mNext);

      // Assert
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json.mock.calls[0][0].length).toBe(1);
      expect(mRes.json.mock.calls[0][0][0]).toEqual({id, task, completed});
    })

    test.each([
      [2000, 'Todo with an id of 2000 was not found in the database', 404],
      ['dog', 'ID must be a number', 400],
    ])('should return an error message and appropriate status when the id param is %s', async (id, error, status) => {
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
      const mNext = jest.fn();

      // Act
      await getTodoById(mReq, mRes, mNext);

      // Assert
      expect(mNext).toHaveBeenCalledWith({ "message": error, "status": status });
      // NOTE: The following two assertions are another way to test the above assertion
      expect(mNext.mock.calls[0][0].message).toEqual(error);
      expect(mNext.mock.calls[0][0].status).toEqual(status);
      expect(mRes.status).not.toHaveBeenCalled();
      expect(mRes.json).not.toHaveBeenCalled();
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
      const mNext = jest.fn();

      // Act
      await addTodo(mReq, mRes, mNext);

      // Assert
      expect(mRes.status).toBeCalledWith(201);
      expect(mRes.json.mock.calls[0][0].length).toBe(1);
      expect(mRes.json.mock.calls[0][0][0]).toEqual({id: 4, task, completed: false});
    })
  })

  describe('deleteTodo()', () => {
    test.each([1, 2, 3])('should delete a todo and return the deleted object and status 200', async (id) => {
      // Arrange
      const mReq = {
        params: {id}
      };
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      const mNext = jest.fn();

      // Act
      await deleteTodo(mReq, mRes, mNext);

      // Assert
      expect(mRes.status).toBeCalledWith(200);
      expect(mRes.json.mock.calls[0][0].length).toBe(1);
      expect(mRes.json.mock.calls[0][0][0].id).toBe(id);
    })
  })

  describe('updateTodo()', () => {
    test.each([
      [1, 'Surf', undefined, 'Surf', true],
      [2, 'Snooze', true, 'Snooze', true],
      [3, undefined, true, 'Pray', true]
    ])('should update a todo and return the updated object and status 201', async (id, task, completed, updatedTask, updatedCompleted) => {
      // Arrange
      const mReq = {
        params: { id },
        body: {task, completed}
      };
      const mRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      const mNext = jest.fn();

      // Act
      await updateTodo(mReq, mRes, mNext);

      // Assert
      expect(mRes.status).toBeCalledWith(201);
      expect(mRes.json.mock.calls[0][0].length).toBe(1);
      expect(mRes.json.mock.calls[0][0][0].id).toBe(id);
      expect(mRes.json.mock.calls[0][0][0].task).toBe(updatedTask);
      expect(mRes.json.mock.calls[0][0][0].completed).toBe(updatedCompleted);
    })
  })
})