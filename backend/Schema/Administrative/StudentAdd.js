import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLFloat, GraphQLNonNull, GraphQLInputObjectType } from 'graphql';
import { GraphQLUpload } from 'graphql-upload';
import sql from 'mssql';

// Define the Student type
const StudentType = new GraphQLObjectType({
  name: 'Student',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    fatherName: { type: GraphQLString },
    motherName: { type: GraphQLString },
    dob: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    parentPhoneNumber: { type: GraphQLString },
    email: { type: GraphQLString },
    address: { type: GraphQLString },
    gender: { type: GraphQLString },
    caste: { type: GraphQLString },
    previousClass: { type: GraphQLString },
    percentage: { type: GraphQLFloat },
    grade: { type: GraphQLString },
    admissionForm: { type: GraphQLString },
    previousSchoolTC: { type: GraphQLString }
  })
});

// Define the input type for adding a student
const StudentInputType = new GraphQLInputObjectType({
  name: 'StudentInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    fatherName: { type: new GraphQLNonNull(GraphQLString) },
    motherName: { type: new GraphQLNonNull(GraphQLString) },
    dob: { type: new GraphQLNonNull(GraphQLString) },
    phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
    parentPhoneNumber: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    address: { type: new GraphQLNonNull(GraphQLString) },
    gender: { type: new GraphQLNonNull(GraphQLString) },
    caste: { type: new GraphQLNonNull(GraphQLString) },
    previousClass: { type: new GraphQLNonNull(GraphQLString) },
    percentage: { type: new GraphQLNonNull(GraphQLFloat) },
    grade: { type: new GraphQLNonNull(GraphQLString) },
    admissionForm: { type: GraphQLUpload },
    previousSchoolTC: { type: GraphQLUpload }
  })
});

// Define the mutation for adding a student
const AddStudentMutation = {
  type: StudentType,
  args: {
    input: { type: new GraphQLNonNull(StudentInputType) }
  },
  resolve: async (parent, { input }) => {
    const { name, fatherName, motherName, dob, phoneNumber, parentPhoneNumber, email, address, gender, caste, previousClass, percentage, grade, admissionForm, previousSchoolTC } = input;

    // Generate student ID
    const studentId = `${name.substring(0, 3)}${dob.replace(/-/g, '')}`;

    // Handle file uploads
    const admissionFormPath = admissionForm ? await handleFileUpload(admissionForm) : null;
    const previousSchoolTCPath = previousSchoolTC ? await handleFileUpload(previousSchoolTC) : null;

    // Insert student into the database
    const result = await sql.query`
      INSERT INTO Students (id, name, fatherName, motherName, dob, phoneNumber, parentPhoneNumber, email, address, gender, caste, previousClass, percentage, grade, admissionForm, previousSchoolTC)
      VALUES (${studentId}, ${name}, ${fatherName}, ${motherName}, ${dob}, ${phoneNumber}, ${parentPhoneNumber}, ${email}, ${address}, ${gender}, ${caste}, ${previousClass}, ${percentage}, ${grade}, ${admissionFormPath}, ${previousSchoolTCPath})
    `;

    return {
      id: studentId,
      name,
      fatherName,
      motherName,
      dob,
      phoneNumber,
      parentPhoneNumber,
      email,
      address,
      gender,
      caste,
      previousClass,
      percentage,
      grade,
      admissionForm: admissionFormPath,
      previousSchoolTC: previousSchoolTCPath
    };
  }
};

// Function to handle file uploads
const handleFileUpload = async (file) => {
  const { createReadStream, filename } = await file;
  const stream = createReadStream();
  const path = `uploads/${filename}`;
  const out = require('fs').createWriteStream(path);
  stream.pipe(out);
  await finished(out);
  return path;
};

export { AddStudentMutation };