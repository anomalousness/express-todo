const pool = require('../db');

const getTodos = async (req, res, next) => {
  const getAllTodosQuery = "SELECT * FROM todos";

  try {
    const results = await pool.query(getAllTodosQuery);
    res.status(200).json(results.rows);
  } catch (error) {
    next (error)
  }
}

const getTodoById = async (req, res, next) => {
  const id = getIdNumber(req);
  const getSingleTodoQuery = "SELECT * FROM todos WHERE id = $1";

  try {
    const results = await pool.query(getSingleTodoQuery, [id]);
    console.log(results.rows)
    if (results.rows.length === 0) {
      console.log('Calling Next', results.rows)
      return next({status: 404, message: `Todo with an id of ${id} was not found in the database`})
    } 
    // if (results.rows.length === 0) res.status(404).json( {message: `Todo with an id of ${id} was not found in the database`})
    res.status(200).json(results.rows)
  } catch (error) {
    next (error)
  }
}

const addTodo = async (req, res, next) => {
  const { task } = req.body;
  if (!task) return next({ status: 400, message: 'No task data provided' });
  const addTodoQuery = "INSERT INTO todos (task, completed) VALUES ($1, false) RETURNING *";

  try {
    const results = await pool.query(addTodoQuery,[task]);
    res.status(201).json(results.rows)
  } catch (error) {
    next (error)
  }
}

const deleteTodo = async (req, res, next) => {
  const id = getIdNumber(req);
  if (typeof id !== 'number' || isNaN(id)) return next({ status: 400, message: "ID must be a number" });
  const deleteTodoQuery = "DELETE FROM todos WHERE id = $1 RETURNING *";

  try {
    const results = await pool.query(deleteTodoQuery, [id]);
    if (results.rows.length === 0) return next({status: 404, message: `Todo with an id of ${id} was not found in the database`})
    res.status(200).json(results.rows)
  } catch (error) {
    next (error)
  }
}

const updateTodo = async (req, res, next) => {
  const id = getIdNumber(req);
  if (typeof id !== 'number' || isNaN(id)) return next({ status: 400, message: "ID must be a number" });
  const idExists = await checkIdExists(id);
  if (!idExists) return next({ status: 404, message: `Todo with an id of ${id} was not found in the database` });
  const { task, completed } = req.body;
  const { query, params } = constructUpdateQuery(id, task, completed);
  // console.log(query, params)

  if (params.length < 2) return next({ status: 400, message: 'No update data provided' });

  try {
    const results = await pool.query(query, params);
    res.status(201).json(results.rows);
  } catch (error) {
    next (error)
  }
}

const getIdNumber = (req) => {
  const { id } = req.params;
  return Number(id);
}

const checkIdExists = async (id) => {
  const idCheckQuery = "SELECT COUNT(*) FROM todos WHERE id = $1";
  const results = await pool.query(idCheckQuery, [id]);
  return results.rows[0].count > 0;
}

const constructUpdateQuery = (id, task, completed) => {
  const params = [];
  const values = [];
  if (task) {
    params.push(task);
    values.push(`task = $${params.length}`);
  };
  if (completed !== undefined) {
    params.push(completed);
    values.push(`completed = $${params.length}`);
  };
  params.push(id);
  const query = `UPDATE todos SET ${values.join(', ')} WHERE id = $${params.length} RETURNING *`;

  return { query, params };
}

module.exports = {
  getTodos,
  getTodoById,
  addTodo,
  deleteTodo,
  updateTodo
};