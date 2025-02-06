import { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLID, GraphQLNonNull } from 'graphql';
import sql from 'mssql';
import studentLogin from './StudentResolver.js';
import FacultyLogin from './FacultyResolver.js';
import Aichat from './AIGuru/AichatResolver.js';
import { Studentdata } from './StudentDataResolver.js';
import { StudentComplaint } from "./Complaint/Complaint.js";
import StudentDetail from './AIGuru/StudentDetail.js';
import { DashBoard } from './AdminDasboard/Dashboard.js';
import { GetAllStaff, GetStaffById } from './Administrative/Staff.js';
import { StudentFees ,StudentFeeById} from './Administrative/StudentFees.js';
import { SaveAttendance } from './Administrative/AttendenceMutation.js';
import { GetFacultyAttendance, GetStudentAttendance } from './Administrative/AttendenceQuery.js';
import { AddStudentMutation,UpdateStudentMutation } from './Administrative/StudentAdd.js';
import { groupQueries, groupMutations, RootSubscription } from './Students/GroupChat.js';
import AichatType from './AIGuru/AichatType.js';
import { NotificationQueries, NotificationMutations } from './Administrative/Alert.js'
// Import Timetable-related types and resolvers
import {
  GetAllClasses,
  GetAllSubjects,
  GetAllTeachers,
  GetTimetableByClass,
  GetTimetableByTeacher,
  AddTimetableEntry,
  GetTimetableEntries, 
  UpdateTimetableEntry, 
  DeleteTimetableEntry ,
  Timetablefaculty

} from './Administrative/TimeTable.js';
import AiMutation from './AIGuru/AiMutation.js';
import { AddStaff } from './Administrative/Addstaff.js';
// Additional Types
const ChatType = new GraphQLObjectType({
  name: 'Chat',
  fields: () => ({
    chat_id: { type: GraphQLString },
    StudentID: { type: GraphQLString },
    user_type: { type: GraphQLString },
    prompt: { type: GraphQLString },
    response: { type: GraphQLString },
    created_at: { type: GraphQLString },
  }),
});

const LoginType = new GraphQLObjectType({
  name: 'Login',
  fields: () => ({
    token: { type: GraphQLString },
    user: { type: GraphQLObjectType },
    success: { type: GraphQLBoolean },
    message: { type: GraphQLString },
  }),
});

const UserProfileType = new GraphQLObjectType({
  name: 'UserProfile',
  fields: () => ({
    UserID: { type: GraphQLString },
    FirstName: { type: GraphQLString },
    LastName: { type: GraphQLString },
    Email: { type: GraphQLString },
    Phone: { type: GraphQLString },
    Role: { type: GraphQLString },
  }),
});

// Root Query with Additional Resolvers
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    // Existing Resolvers
    studentLogin,
    FacultyLogin,
    Studentdata,
    StudentComplaint,
    StudentDetail,
    DashBoard,
    GetAllStaff,
    StudentFees,
    GetFacultyAttendance,
    GetStudentAttendance,
    GetStaffById,
    StudentFeeById,
    ...groupQueries,
    Timetablefaculty,
    ...NotificationQueries,
    Aichat,

    // New Fetch Resolvers
    getStudentChats: {
      type: new GraphQLList(ChatType),
      args: { StudentID: { type: GraphQLString } },
      resolve: async (parent, args) => {
        const result = await sql.query`
          SELECT * FROM StudentChat 
          WHERE StudentID = ${args.StudentID}
        `;
        return result.recordset;
      },
    },
    getUserProfile: {
      type: UserProfileType,
      args: { UserID: { type: GraphQLString } },
      resolve: async (parent, args) => {
        const result = await sql.query`
          SELECT * FROM Users 
          WHERE UserID = ${args.UserID}
        `;
        return result.recordset[0];
      },
    },
    getAllUsers: {
      type: new GraphQLList(UserProfileType),
      resolve: async () => {
        const result = await sql.query`
          SELECT * FROM Users
        `;
        return result.recordset;
      },
    },

    // Timetable-related Queries
    getAllClasses: GetAllClasses,
    getAllSubjects: GetAllSubjects,
    getAllTeachers: GetAllTeachers,
    getTimetableByClass: GetTimetableByClass,
    getTimetableByTeacher: GetTimetableByTeacher,
    getTimetableEntries:GetTimetableEntries
    
  }),
});

// Root Mutation with Additional Mutations
const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: () => ({
    saveAttendance: SaveAttendance,
    addStudentMutation: AddStudentMutation,
    updateTimetableEntry: UpdateTimetableEntry,
    deleteTimetableEntry: DeleteTimetableEntry,
    updateStudentMutation: UpdateStudentMutation,
    addStaff:AddStaff,
    ...NotificationMutations,
    ...groupMutations,

    // Add the `addChat` mutation directly
    addChat: {
      type: AichatType, // Ensure AichatType is imported
      args: {
        StudentID: { type: new GraphQLNonNull(GraphQLString) },
        user_type: { type: new GraphQLNonNull(GraphQLString) },
        prompt: { type: new GraphQLNonNull(GraphQLString) },
        response: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return sql.query`
          INSERT INTO StudentChat (StudentID, user_type, prompt, response)
          VALUES (${args.StudentID}, ${args.user_type}, ${args.prompt}, ${args.response})
          SELECT SCOPE_IDENTITY() AS chat_id
        `
          .then(result => ({
            chat_id: result.recordset[0].chat_id,
            StudentID: args.StudentID,
            user_type: args.user_type,
            prompt: args.prompt,
            response: args.response,
            created_at: new Date().toISOString(),
          }))
          .catch(err => {
            console.error('Error adding chat', err);
            throw new Error('Error adding chat');
          });
      },
    },

    // Additional Mutations
    updateUserProfile: {
      type: UserProfileType,
      args: {
        UserID: { type: GraphQLString },
        FirstName: { type: GraphQLString },
        LastName: { type: GraphQLString },
        Email: { type: GraphQLString },
        Phone: { type: GraphQLString },
      },
      resolve: async (parent, args) => {
        await sql.query`
          UPDATE Users 
          SET 
            FirstName = ${args.FirstName}, 
            LastName = ${args.LastName},
            Email = ${args.Email},
            Phone = ${args.Phone}
          WHERE UserID = ${args.UserID}
        `;

        const result = await sql.query`
          SELECT * FROM Users 
          WHERE UserID = ${args.UserID}
        `;
        return result.recordset[0];
      },
    },

    // Timetable-related Mutations
    addTimetableEntry: AddTimetableEntry,
  }),
});

// Create and export the comprehensive schema
export default new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
  subscription: RootSubscription,
});