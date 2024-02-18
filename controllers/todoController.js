const pool = require('../db');

const getTodos = async (req, res) => {
  const getAllTodosQuery = "SELECT * FROM todos";

  try {
    const results = await pool.query(getAllTodosQuery);
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(500).json({ message: error.message})
  }
}

const getTodoById = async (req, res) => {
  const {id} = req.params
  const getSingleTodoQuery = "SELECT * FROM todos WHERE id = $1";

  try {
    const results = await pool.query(getSingleTodoQuery, [id]);
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(500).json({ message: error.message})
  }
}

module.exports = {
  getTodos,
  getTodoById
};