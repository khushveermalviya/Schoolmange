import { GraphQLObjectType, GraphQLString } from 'graphql';

const FacultyLoginType = new GraphQLObjectType({
  name: 'FacultyLogin',
  fields: () => ({
    Username: { type: GraphQLString },
    tokenss: { type: GraphQLString },
  }),
});

export default FacultyLoginType;
