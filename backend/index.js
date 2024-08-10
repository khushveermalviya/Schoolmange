import express from 'express';
import pool from './db/Database.js';

const app = express();

app.get('/', (req, res) => {
  res.send('Server is ready');
});

// Example route using Pool to query the database
app.get('/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM your_table');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(5098, () => {
  console.log('Server at http://localhost:5000');
});
