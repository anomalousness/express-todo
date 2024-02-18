DROP TABLE IF EXISTS todos;

CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  task VARCHAR(255),
  completed BOOLEAN
);

-- psql -h 127.0.0.1 todolist < tables.sql
-- psql -h 127.0.0.1 todolist < seeds.sql