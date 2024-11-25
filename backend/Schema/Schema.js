import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt } from 'graphql';
import Axios from 'axios';

// Define SchoolType (for Company data)
const SchoolType = new GraphQLObjectType({
  name: "School",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    user:{
      type : new GraphQLList (UserType),
      resolve(parentValue,args){
        return Axios.get(`http://localhost:3000/companies/${parentValue.id}/User`)
      }
    }
  }
});

// Define UserType
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstname: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: SchoolType,
      resolve(parentValue, args) {
        return Axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(res => res.data)
          .catch(error => {
            throw new Error('An error occurred while fetching the company data');
          });
      }
    }
  }
});

// Define RootQuery
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
    },
    company :{
      type: SchoolType,
      args:{id:{type: GraphQLString}},
      resolve(parentValue,args){
        return Axios.get(`http://localhost:3000/companies/${args.id}`)
        .then(res=>res.data)
        .catch(error=>{
          throw new error("a problem a hey bhau")
        })
      }
    }
  }
});

// Define Schema
const schema = new GraphQLSchema({
  query: RootQuery
});

export default schema;
