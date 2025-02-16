import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } from 'graphql';

const StudentLoginType = new GraphQLObjectType({
  name: 'StudentLogin',
  fields: () => ({
    StudentID: { type: GraphQLString },
    FirstName: { type: GraphQLString },
    LastName: { type: GraphQLString },
    FatherName: { type: GraphQLString },
    SchoolName: { type: GraphQLString },
    Class: { type: GraphQLInt },
    WeeklyPerformance: { type: new GraphQLList(GraphQLString) },
    token: { type: GraphQLString },
  }),
});

export default StudentLoginType;