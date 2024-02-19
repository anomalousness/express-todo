const { Router } = require('express');
const router = Router();

const { getTodos, getTodoById, addTodo } = require('../controllers/todoController');

router.get('/', getTodos)

router.get('/:id', getTodoById)

router.post('/', addTodo)

module.exports = router;