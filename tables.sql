DROP TABLE IF EXISTS todos;

CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  item VARCHAR(255),
  completed BOOLEAN
);

TRUNCATE TABLE todos RESTART IDENTITY CASCADE;

INSERT INTO todos ("item", "completed") VALUES
('Eat', true),
('Sleep', false),
('Pray', false)
;

-- psql -h 127.0.0.1 totlist < tables.sql
-- psql -h 127.0.0.1 totlist < seeds.sql