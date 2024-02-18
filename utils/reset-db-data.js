const pool = require('../db');

const resetData = async () => {
  const resetQuery = `
    TRUNCATE TABLE todos RESTART IDENTITY CASCADE;

    INSERT INTO todos (item, completed) VALUES
    ('Eat', true),
    ('Sleep', false),
    ('Pray', false);
  `;

  try {
    await pool.query(resetQuery);
  } catch (error) {
    console.log('Error resetting database', error);
    throw error;
  }
};

module.exports = resetData;