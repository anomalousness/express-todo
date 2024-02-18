const { Router } = require('express');
const router = Router();

const { getTodos, getTodoById } = require('../controllers/todoController');

router.get('/', getTodos)

router.get('/:id', getTodoById)

module.exports = router;