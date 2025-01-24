import { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLNonNull } from 'graphql';
const StaffTypess = new GraphQLObjectType({
  name: "Staffs",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    department: { type: GraphQLString },
    role: { type: GraphQLString },
    status: { type: GraphQLString },
    joiningDate: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});
// Class Type
const ClassType = new GraphQLObjectType({
  name: 'Class',
  fields: () => ({
    id: { type: GraphQLID },
    class_name: { type: GraphQLString },
    section: { type: GraphQLString },
    created_at: { type: GraphQLString },
    updated_at: { type: GraphQLString },
  }),
});

// Subject Type
const SubjectType = new GraphQLObjectType({
  name: 'Subject',
  fields: () => ({
    id: { type: GraphQLID },
    subject_name: { type: GraphQLString },
    created_at: { type: GraphQLString },
    updated_at: { type: GraphQLString },
  }),
});

// Timetable Type
const TimetableType = new GraphQLObjectType({
  name: 'Timetable',
  fields: () => ({
    id: { type: GraphQLID },
    class_id: { type: GraphQLID },
    subject_id: { type: GraphQLID },
    teacher_id: { type: GraphQLID },
    period: { type: GraphQLString },
    day: { type: GraphQLString },
    created_at: { type: GraphQLString },
    updated_at: { type: GraphQLString },
  }),
});
export{TimetableType,SubjectType,ClassType,StaffTypess}