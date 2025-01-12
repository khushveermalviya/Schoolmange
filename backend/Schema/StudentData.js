import {GraphQLObjectType,GraphQLString} from 'graphql'
const StudentDataType = new GraphQLObjectType({
    name:"studentdatas",
    fields: () => ({
        StudentID: { type: GraphQLString },
        FirstName: { type: GraphQLString },
        LastName: { type: GraphQLString },
       Class:{type:GraphQLString}
       
      }),
})
export default StudentDataType;