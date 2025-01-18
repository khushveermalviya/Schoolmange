// types.js remains the same
import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInputObjectType } from 'graphql';
import sql from 'mssql';

const StudentType = new GraphQLObjectType({
  name: 'Student',
  fields: () => ({
    StudentID: { type: GraphQLString },
    Password: { type: GraphQLString },
    FirstName: { type: GraphQLString },
    LastName: { type: GraphQLString },
    FatherName: { type: GraphQLString },
    MotherName: { type: GraphQLString },
    dob: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    parentPhoneNumber: { type: GraphQLString },
    Email: { type: GraphQLString },
    address: { type: GraphQLString },
    gender: { type: GraphQLString },
    caste: { type: GraphQLString },
    Class: { type: GraphQLString },
    SchoolName: { type: GraphQLString },
    previousClass: { type: GraphQLString }
  })
});

const StudentInputType = new GraphQLInputObjectType({
  name: 'StudentInput',
  fields: () => ({
    StudentID: { type: new GraphQLNonNull(GraphQLString) },
    Password: { type: new GraphQLNonNull(GraphQLString) },
    FirstName: { type: new GraphQLNonNull(GraphQLString) },
    LastName: { type: new GraphQLNonNull(GraphQLString) },
    FatherName: { type: new GraphQLNonNull(GraphQLString) },
    MotherName: { type: new GraphQLNonNull(GraphQLString) },
    dob: { type: new GraphQLNonNull(GraphQLString) },
    phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
    parentPhoneNumber: { type: new GraphQLNonNull(GraphQLString) },
    Email: { type: new GraphQLNonNull(GraphQLString) },
    address: { type: new GraphQLNonNull(GraphQLString) },
    gender: { type: new GraphQLNonNull(GraphQLString) },
    caste: { type: new GraphQLNonNull(GraphQLString) },
    Class: { type: new GraphQLNonNull(GraphQLString) },
    SchoolName: { type: new GraphQLNonNull(GraphQLString) },
    previousClass: { type: new GraphQLNonNull(GraphQLString) }
  })
});

// mutations.js
export const AddStudentMutation = {
  type: StudentType,
  args: {
    input: { type: new GraphQLNonNull(StudentInputType) }
  },
  resolve: async (parent, { input }, context) => {
    try {
      // Create a new connection
      const connection = await sql.connect(context.sqlConfig);

      // Check if student already exists
    const existingStudent = await connection.request()
  .input('StudentID', sql.VarChar, input.StudentID)
  .input('Email', sql.VarChar, input.Email)
  .input('FirstName', sql.VarChar, input.FirstName)
  .input('LastName', sql.VarChar, input.LastName)
  .input('FatherName', sql.VarChar, input.FatherName)
  .input('dob', sql.Date, input.dob)
  .query`
    SELECT StudentID, Email, FirstName, LastName, FatherName, dob
    FROM Students 
    WHERE StudentID = @StudentID OR Email = @Email OR (FirstName = @FirstName AND LastName = @LastName AND FatherName = @FatherName AND dob = @dob)
  `;

if (existingStudent.recordset.length > 0) {
  const existingRecord = existingStudent.recordset[0];
  let errorMessage = 'Student already exists: ';
  
  if (existingRecord.FirstName === input.FirstName && existingRecord.LastName === input.LastName && existingRecord.dob === input.dob) {
    throw new Error('Student is already enrolled');
  } 
   else if (existingRecord.FirstName === input.FirstName && existingRecord.LastName === input.LastName && existingRecord.FatherName === input.FatherName) {
    throw new Error('Student with same name and father\'s name exists');
  }
}
  
      // Format date properly
      const formattedDob = new Date(input.dob).toISOString().split('T')[0];

      // Insert student record
      const result = await connection.request()
        .input('StudentID', sql.VarChar, input.StudentID)
        // ... (rest of the inputs remain the same)
        .query`
          INSERT INTO Students (
            StudentID, Password, FirstName, LastName,
            FatherName, MotherName, dob, phoneNumber,
            parentPhoneNumber, Email, address, gender,
            caste, Class, SchoolName, previousClass
          )
          VALUES (
            @StudentID, @Password, @FirstName, @LastName,
            @FatherName, @MotherName, @dob, @phoneNumber,
            @parentPhoneNumber, @Email, @address, @gender,
            @caste, @Class, @SchoolName, @previousClass
          )`;

      if (!result) {
        throw new Error('Failed to insert student record');
      }

      return {
        ...input,
        dob: formattedDob
      };
    } catch (error) {
      // Ensure the error is propagated with the message
      throw new Error(error.message || 'Failed to register student');
    }
  }
};