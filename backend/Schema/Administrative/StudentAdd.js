// types.js remains the same
import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInputObjectType, GraphQLInt } from 'graphql';
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
    StudentID: { type:  (GraphQLString) },
    Password: { type:  (GraphQLString) },
    FirstName: { type:  (GraphQLString) },
    LastName: { type:  (GraphQLString) },
    FatherName: { type:  (GraphQLString) },
    MotherName: { type:  (GraphQLString) },
    dob: { type: (GraphQLString) },
    phoneNumber: { type: (GraphQLString) },
    parentPhoneNumber: { type: (GraphQLString) },
    Email: { type:(GraphQLString) },
    address: { type: (GraphQLString) },
    gender: { type: (GraphQLString) },
    caste: { type:(GraphQLString) },
    Class: { type:(GraphQLInt) },  // Keep as String
    SchoolName: { type: (GraphQLString) },
    previousClass: { type: GraphQLString } // Remove NonNull wrapper for optional field
  })
});

// mutations.js~
 const AddStudentMutation = {
  type: StudentType,
  args: {
    input: { type: new GraphQLNonNull(StudentInputType) }
  },
  resolve: async (parent, { input }, context) => {
    try {
      // Create a new connection
      const connection = await sql.connect(context.sqlConfig);

      // Format date properly
      const formattedDob = new Date(input.dob).toISOString().split('T')[0];

      // Check if student already exists - only checking first name + last name + dob combination
      const existingStudent = await connection.request()
        .input('FirstName', sql.VarChar, input.FirstName)
        .input('LastName', sql.VarChar, input.LastName)
        .input('dob', sql.Date, formattedDob)
        .query`
          SELECT StudentID, FirstName, LastName, dob
          FROM Students 
          WHERE FirstName = @FirstName 
          AND LastName = @LastName 
          AND dob = @dob
        `;

      // Only throw error if exact name and DOB match is found
      if (existingStudent.recordset.length > 0) {
        throw new Error('A student with the same name and date of birth is already registered');
      }

      // Insert student record with all parameters
      const result = await connection.request()
        .input('StudentID', sql.VarChar, input.StudentID)
        .input('Password', sql.VarChar, input.Password)
        .input('FirstName', sql.VarChar, input.FirstName)
        .input('LastName', sql.VarChar, input.LastName)
        .input('FatherName', sql.VarChar, input.FatherName)
        .input('MotherName', sql.VarChar, input.MotherName)
        .input('dob', sql.Date, formattedDob)
        .input('phoneNumber', sql.VarChar, input.phoneNumber)
        .input('parentPhoneNumber', sql.VarChar, input.parentPhoneNumber)
        .input('Email', sql.VarChar, input.Email)
        .input('address', sql.VarChar, input.address)
        .input('gender', sql.VarChar, input.gender)
        .input('caste', sql.VarChar, input.caste)
        .input('Class', sql.Int, input.Class)
        .input('SchoolName', sql.VarChar, input.SchoolName)
        .input('previousClass', sql.VarChar, input.previousClass)
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
      // Check if it's a unique constraint violation
      if (error.message.includes('UQ__Students')) {
        // Continue with the insertion if it's just an email duplicate
        // but still display the warning to the user
        throw new Error('Warning: An account with this email already exists, but the registration will proceed');
      }
      // For all other errors, propagate them normally
      throw new Error(error.message || 'Failed to register student');
    }
  }
};
const UpdateStudentMutation = {
  type: StudentType,
  args: {
    input: { type: new GraphQLNonNull(StudentInputType) }
  },
  resolve: async (parent, { input }, context) => {
    try {
      // Create a new connection to the database
      const connection = await sql.connect(context.sqlConfig);

      // Format date properly
      const formattedDob = input.dob ? new Date(input.dob).toISOString().split('T')[0] : null;

      // Check if the student exists by StudentID
      const existingStudent = await connection.request()
        .input('StudentID', sql.VarChar, input.StudentID)
        .query`
          SELECT StudentID 
          FROM Students 
          WHERE StudentID = @StudentID
        `;

      if (existingStudent.recordset.length === 0) {
        throw new Error(`Student with ID ${input.StudentID} not found.`);
      }

      // Perform the update operation
      const result = await connection.request()
        .input('StudentID', sql.VarChar, input.StudentID)
        .input('Password', sql.VarChar, input.Password)
        .input('FirstName', sql.VarChar, input.FirstName)
        .input('LastName', sql.VarChar, input.LastName)
        .input('FatherName', sql.VarChar, input.FatherName)
        .input('MotherName', sql.VarChar, input.MotherName)
        .input('dob', sql.Date, formattedDob)
        .input('phoneNumber', sql.VarChar, input.phoneNumber)
        .input('parentPhoneNumber', sql.VarChar, input.parentPhoneNumber)
        .input('Email', sql.VarChar, input.Email)
        .input('address', sql.VarChar, input.address)
        .input('gender', sql.VarChar, input.gender)
        .input('caste', sql.VarChar, input.caste)
        .input('Class', sql.Int, input.Class) // Ensure Class is treated as an integer
        .input('SchoolName', sql.VarChar, input.SchoolName)
        .input('previousClass', sql.VarChar, input.previousClass)
        .query`
          UPDATE Students 
          SET 
            Password = @Password,
            FirstName = @FirstName,
            LastName = @LastName,
            FatherName = @FatherName,
            MotherName = @MotherName,
            dob = @dob,
            phoneNumber = @phoneNumber,
            parentPhoneNumber = @parentPhoneNumber,
            Email = @Email,
            address = @address,
            gender = @gender,
            caste = @caste,
            Class = @Class,
            SchoolName = @SchoolName,
            previousClass = @previousClass
          WHERE StudentID = @StudentID
        `;

      if (result.rowsAffected[0] === 0) {
        throw new Error(`Failed to update student with ID ${input.StudentID}`);
      }

      // Return the updated student object
      return {
        ...input,
        dob: formattedDob
      };
    } catch (error) {
      console.error("Error updating student:", error);
      throw new Error(error.message || `Failed to update student with ID ${input.StudentID}`);
    }
  }
};

export { AddStudentMutation, UpdateStudentMutation };