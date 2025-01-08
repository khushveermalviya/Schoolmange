import sql from 'mssql';
import { sqlConfig } from './db/SecondDb.js';

export const checkDatabaseConnection = async () => {
  try {
    const pool = new sql.ConnectionPool(sqlConfig);
    await pool.connect();
    const result = await pool.request().query('SELECT 1 as dbCheck');
    await pool.close();
    return result.recordset[0].dbCheck === 1;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};