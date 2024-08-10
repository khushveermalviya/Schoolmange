import pg from 'pg';
import express from 'express';

const { Pool, Client } = pg;

const client = new Client({
  user: "postgres",
  password: "Khushveer",
  host: "localhost",
  port: "5432",
});

async function createDatabase() {
  try {
    await client.connect();
    const response = await client.query('CREATE DATABASE school_manage');
    console.log('Database created');
    console.log(response);
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await client.end();
  }
}

createDatabase();

const pool = new Pool({
  user: "Postgress",
  password: "Khushveer",
  host: "localhost",
  port: "5432",
  database: "school", // Assuming you want to connect to the new database
});

const app = express();

app.get('/', (req, res) => {
  res.send('Server is ready');
});

app.listen(5000, () => {
  console.log('Server at http://localhost:5000');
});

export default pool;
