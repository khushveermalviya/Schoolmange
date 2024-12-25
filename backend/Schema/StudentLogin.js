import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';

const StudentLoginType = new GraphQLObjectType({
  name: 'StudentLogin',
  fields: () => ({
    StudentID: { type: GraphQLString },
    FirstName: { type: GraphQLString },
    LastName: { type: GraphQLString },
    WeeklyPerformance: { type: new GraphQLList(GraphQLString) },
    token: { type: GraphQLString },
  }),
});

export default StudentLoginType;
