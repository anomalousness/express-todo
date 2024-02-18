TRUNCATE TABLE todos RESTART IDENTITY CASCADE;

INSERT INTO todos (task, completed) VALUES
('Eat', true),
('Sleep', false),
('Pray', false)
;

-- psql -h 127.0.0.1 todolist < tables.sql
-- psql -h 127.0.0.1 todolist < seeds.sql