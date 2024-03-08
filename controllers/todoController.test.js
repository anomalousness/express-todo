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
    test.each(['Code', 'Climb', 'Play'])('should add new todo with task value of %s to the db and return the new object and status 201', async (task) => {
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
    
    test.each([
      ['', 'No task data provided'],
      [null, 'No task data provided'],
      [undefined, 'No task data provided'],
      [212, 'Task must be a string'],
      [false, 'Task must be a string'],
      [true, 'Task must be a string'],
    ])('should return an error message and an appropriate status when the req.body task property is "%s"', async (task, error) => {
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
      expect(mNext).toHaveBeenCalledWith({ "message": error, "status": 400 });
      // NOTE: The following two assertions are another way to test the above assertion
      expect(mNext.mock.calls[0][0].message).toEqual(error);
      expect(mNext.mock.calls[0][0].status).toEqual(400);
      expect(mRes.status).not.toHaveBeenCalled();
      expect(mRes.json).not.toHaveBeenCalled();
    })
  })

  describe('deleteTodo()', () => {
    test.each([1, 2, 3])('should delete todo with id %s and return the deleted object and status 200', async (id) => {
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
    
    test.each([
      [2000, 'Todo with an id of 2000 was not found in the database', 404],
      ['dog', 'ID must be a number', 400],
      [undefined, 'ID must be a number', 400],
    ])('should return an error and status *** when attempting to delete params id %s', async (id, error, status) => {
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
      expect(mNext).toHaveBeenCalledWith({ "message": error, "status": status });
      // NOTE: The following two assertions are another way to test the above assertion
      expect(mNext.mock.calls[0][0].message).toEqual(error);
      expect(mNext.mock.calls[0][0].status).toEqual(status);
      expect(mRes.status).not.toHaveBeenCalled();
      expect(mRes.json).not.toHaveBeenCalled();
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
    
    test.each([
      [1, undefined, undefined, 400, "No update data provided"],
      [2000, 'Snooze', true, 404, "Todo with an id of 2000 was not found in the database"],
      [3, 'Snooze', "Cat", 400, "Completed must be a boolean"],
      [1, 212, false, 400, "Task must be a string"],
    ])('should update a todo and return the updated object and status 201', async (id, task, completed, status, error) => {
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
      expect(mNext).toHaveBeenCalledWith({ "message": error, "status": status });
      // NOTE: The following two assertions are another way to test the above assertion
      expect(mNext.mock.calls[0][0].message).toEqual(error);
      expect(mNext.mock.calls[0][0].status).toEqual(status);
      expect(mRes.status).not.toHaveBeenCalled();
      expect(mRes.json).not.toHaveBeenCalled();
    })
  })
})