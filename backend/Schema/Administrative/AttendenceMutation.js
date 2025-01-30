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
    let transaction = null;

    try {
      // Validate that the date is today
      const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
      if (args.Date !== currentDate) {
        throw new Error("Attendance can only be marked for today.");
      }

      // Begin transaction
      transaction = new sql.Transaction(sql.globalConnection);
      await transaction.begin();

      const insertedRecords = [];

      // Loop through each student ID in AttendanceRecords
      for (const studentId of args.AttendanceRecords) {
        const request = new sql.Request(transaction);

        // Check if attendance already exists for this student on the given date
        const checkRequest = new sql.Request(transaction);
        const checkResult = await checkRequest
          .input('StudentID', sql.VarChar(50), studentId)
          .input('Date', sql.Date, args.Date)
          .query(`
            SELECT COUNT(*) AS RecordCount
            FROM Attendance
            WHERE StudentID = @StudentID AND Date = @Date
          `);

        const recordCount = checkResult.recordset[0].RecordCount;

        if (recordCount > 0) {
          // Update existing attendance record for latecomers
          const updateResult = await request
            .input('StudentID', sql.VarChar(50), studentId)
            .input('Username', sql.NVarChar(100), args.Username)
            .input('Date', sql.Date, args.Date)
            .input('Status', sql.NVarChar(20), args.Status)
            .input('Remarks', sql.NVarChar(255), args.Remarks || null)
            .query(`
              UPDATE Attendance
              SET Status = @Status, Remarks = @Remarks
              OUTPUT INSERTED.*
              WHERE StudentID = @StudentID AND Date = @Date
            `);

          insertedRecords.push(updateResult.recordset[0]);
        } else {
          // Insert new attendance record
          const insertResult = await request
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

          insertedRecords.push(insertResult.recordset[0]);
        }
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