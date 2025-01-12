import { GraphQLNonNull, GraphQLString, GraphQLList } from "graphql";
import sql from "mssql";
import AttendanceType from './Attendence.js';

const SaveAttendance = {
  type: new GraphQLList(AttendanceType),
  args: {
    Class: { type: new GraphQLNonNull(GraphQLString) },
    Date: { type: new GraphQLNonNull(GraphQLString) },
    Username: { type: new GraphQLNonNull(GraphQLString) },
    AttendanceRecords: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
    Status: { type: new GraphQLNonNull(GraphQLString) },
    Remarks: { type: GraphQLString }
  },
  async resolve(parent, args) {
    // Initialize transaction outside try block
    let transaction = null;
    try {
      // Create new transaction
      transaction = new sql.Transaction(sql.globalConnection);
      await transaction.begin();

      const insertedRecords = [];

      // Insert attendance records for each student
      for (const studentId of args.AttendanceRecords) {
        const request = new sql.Request(transaction);
        const result = await request
          .input('StudentID', sql.VarChar(50), studentId)
          .input('Username', sql.NVarChar(100), args.Username)
          .input('Date', sql.Date, args.Date)
          .input('Status', sql.NVarChar(20), args.Status)
          .input('Remarks', sql.NVarChar(255), args.Remarks || null)
          .query(`
            INSERT INTO Attendance (StudentID, Username, Date, Status, Remarks)
            OUTPUT INSERTED.*
            VALUES (@StudentID, @Username, @Date, @Status, @Remarks)
          `);
        
        insertedRecords.push(result.recordset[0]);
      }

      // Commit transaction
      await transaction.commit();
      return insertedRecords;

    } catch (error) {
      // Rollback transaction if it exists
      if (transaction) {
        try {
          await transaction.rollback();
        } catch (rollbackError) {
          console.error('Error rolling back transaction:', rollbackError);
        }
      }
      throw new Error(`Failed to save attendance: ${error.message}`);

    } finally {
      // Clean up transaction in finally block
      transaction = null;
    }
  }
};

export { SaveAttendance };

// Note: Make sure you have a global connection established
// Add this to your database connection setup file:
/*
import sql from 'mssql';

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  }
};

async function connectDB() {
  try {
    const pool = await sql.connect(config);
    sql.globalConnection = pool;
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection failed:', err);
    throw err;
  }
}

export default connectDB;
*/