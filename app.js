const express = require('express');
const todoRoutes = require('./routes/todoRoutes');

const app = express();

app.use(express.json());

app.get('/', (req, res, next) => {
  res.status(200).json({ message: "it's ok" });
});

app.use('/todos', todoRoutes);

app.use((err, req, res, next) => {
  console.log('In Next:', err.message)
  const status = err.status || 500;
  res.status(status).json({ message: err.message });
});

module.exports = app;