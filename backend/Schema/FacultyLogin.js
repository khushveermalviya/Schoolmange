import { GraphQLObjectType, GraphQLString } from 'graphql';

const FacultyLoginType = new GraphQLObjectType({
  name: 'FacultyLogin',
  fields: () => ({
    Username: { type: GraphQLString },
    token: { type: GraphQLString },
  }),
});

export default FacultyLoginType;
