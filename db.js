require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'todolist',
  host: 'localhost',
  port: 5432
})

module.exports = pool;