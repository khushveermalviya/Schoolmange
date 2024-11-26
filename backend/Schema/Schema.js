import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull } from 'graphql';
import pool from '../db/Database.js';  // Import your database connection

// Define StudentType to match your table structure
const StudentType = new GraphQLObjectType({
  name: 'Student',
  fields: () => ({
    std_id: { type: GraphQLInt },
    std_name: { type: GraphQLString },
    father_name: { type: GraphQLString },
    mother_name: { type: GraphQLString },
    mobile_number: { type: GraphQLString },
    parent_number: { type: GraphQLString },
    address: { type: GraphQLString },
    previous_school: { type: GraphQLString },
    class_teacher: { type: GraphQLString },
    class: { type: GraphQLInt },
    admission_date: { type: GraphQLString },  // You can change this to GraphQLDate if using a date library
    photo: { type: GraphQLString },
    result: { type: GraphQLString },
  }),
});

// Define RootQuery to fetch students
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    students: {
      type: new GraphQLList(StudentType),  // Fetch multiple students
      resolve: async () => {
        try {
          const result = await pool.query('SELECT * FROM student');  // Adjust SQL query as needed
          return result.rows;
        } catch (error) {
          console.error('Error fetching students:', error);
          throw new Error('Failed to fetch students');
        }
      },
    },
    student: {
      type: StudentType,  // Fetch a specific student
      args: { std_id: { type: GraphQLInt } },
      resolve: async (parent, args) => {
        try {
          const result = await pool.query('SELECT * FROM student WHERE std_id = $1', [args.std_id]);
          return result.rows[0];  // Return the first matching student
        } catch (error) {
          console.error('Error fetching student:', error);
          throw new Error('Failed to fetch the student');
        }
      },
    },
  },
});

// const Teacher = new GraphQLObjectType()
// {
//   name:"teacher",
// fields : ()=>({
//   teacher:{type : GraphQLString},
//   Class_Teacher :{type: GraphQLString}
  
// })
// }

// Define Schema
const schema = new GraphQLSchema({
  query: RootQuery,
});

export default schema;
