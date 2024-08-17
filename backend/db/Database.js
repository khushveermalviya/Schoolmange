import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // You can set this URL in your .env file
  ssl: {
    rejectUnauthorized: false
  }
});

console.log(`Connected to database with connection string: `);

// Function to fetch and log all data from a specific table


export default pool;