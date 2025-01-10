// schema.js
import { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString } from 'graphql';
import sql from 'mssql';
import studentLogin from './StudentResolver.js';
import FacultyLogin from './FacultyResolver.js';
import Aichat from './AIGuru/AichatResolver.js';
import AiMutation from './AIGuru/AiMutation.js';
import { Studentdata } from './StudentDataResolver.js';
import {StudentComplaint} from "./Complaint/Complaint.js"
import  StudentDetail  from './AIGuru/StudentDetail.js';
import { DashBoard } from './AdminDasboard/Dashboard.js';
import GetAllStaff from './Administrative/Staff.js';

// Define ChatType
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

// Define RootQuery
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    studentLogin,
    FacultyLogin,
    Studentdata,
    StudentComplaint,
    StudentDetail,
    DashBoard,
    GetAllStaff,
    getStudentChats: {
      type: new GraphQLList(ChatType),
      args: { StudentID: { type: GraphQLString } },
      resolve(parent, args) {
        return sql.query`SELECT * FROM StudentChat WHERE StudentID = ${args.StudentID}`
          .then(result => result.recordset);
      },
    },
    Aichat,
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: AiMutation,
});