import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt } from 'graphql';
import Axios from 'axios';


const SchoolType = new GraphQLObjectType({
  name: "School",
  fields:{
    id:{ type: GraphQLString},
    name :{type: GraphQLString}
  }
})

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstname: { type: GraphQLString },
    age: { type: GraphQLInt },
    company : {
      type : CompanyType,
      resolve(parentValue,args){
        console.log(parentValue,args);
        
      }
    }
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return Axios.get(`http://localhost:3000/User/${args.id}`)
          .then(response => response.data)
          .catch(error => {
            throw new Error('An error occurred while fetching the user data');
          });
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: RootQuery
});

export default schema;