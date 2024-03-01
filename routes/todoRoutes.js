const { Router } = require('express');
const router = Router();

const { getTodos, getTodoById, addTodo, deleteTodo, updateTodo } = require('../controllers/todoController');

router.get('/', getTodos)

router.get('/:id', getTodoById)

router.post('/', addTodo)

router.delete('/:id', deleteTodo)

router.put('/:id', updateTodo)

module.exports = router;