import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLFloat, GraphQLList, GraphQLInt, GraphQLID } from 'graphql';
import sql from 'mssql';

// StudentFees Type (unchanged)
const StudentFeesType = new GraphQLObjectType({
  name: 'StudentFees',
  fields: () => ({
    StudentId: { type: GraphQLString },
    FirstName: { type: GraphQLString },
    FatherName: { type: GraphQLString },
    Class: { type: GraphQLInt },
    FeeStatus: { type: GraphQLString },
    AmountPaid: { type: GraphQLFloat },
    TotalFee: { type: GraphQLFloat }
  })
});

// Updated StudentFees query with class-based filtering
const StudentFees = {
  type: new GraphQLList(StudentFeesType),
  args: {
    class: { type: GraphQLInt }
  },
  async resolve(parent, { class: classNumber }) {
    try {
      const pool = await sql.connect(/* your connection config */);
      const result = await pool
        .request()
        .input('class', sql.Int, classNumber)
        .query(`
          SELECT 
            StudentId, 
            FirstName,
            FatherName,
            Class,  
            FeeStatus, 
            AmountPaid, 
            TotalFee 
          FROM StudentFee 
          WHERE Class = @class
        `);
      
      return result.recordset;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Failed to fetch student fees');
    }
  }
};

// New query to fetch student fee data by StudentId
const StudentFeeById = {
  type: StudentFeesType,
  args: {
    studentId: { type: new  GraphQLNonNull(GraphQLString) }
  },
  async resolve(parent, { studentId }) {
    try {
      const pool = await sql.connect(/* your connection config */);
      const result = await pool
        .request()
        .input('studentId', sql.VarChar, studentId)
        .query(`
          SELECT 
            StudentId, 
            FirstName,
            FatherName,
            Class,  
            FeeStatus, 
            AmountPaid, 
            TotalFee 
          FROM StudentFee 
          WHERE StudentId = @studentId
        `);
      
      if (result.recordset.length > 0) {
        return result.recordset[0];
      } else {
        throw new Error('Student not found');
      }
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error('Failed to fetch student fee data');
    }
  }
};

export { StudentFees, StudentFeeById };