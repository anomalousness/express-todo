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

const addTodo = async (req, res) => {
  const { task } = req.body;
  const addTodoQuery = "INSERT INTO todos (task, completed) VALUES ($1, false) RETURNING *";

  try {
    const results = await pool.query(addTodoQuery,[task]);
    console.log(results.rows)
    res.status(201).json(results.rows)
  } catch (error) {
    res.status (500).json({message: error.message})
  }
}

module.exports = {
  getTodos,
  getTodoById,
  addTodo,
};