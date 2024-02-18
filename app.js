const express = require('express');
const todoRoutes = require('./routes/todoRoutes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: "it's ok" });
});

app.use('/todos', todoRoutes);

module.exports = app;