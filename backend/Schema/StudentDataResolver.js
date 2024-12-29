import jwt from 'jsonwebtoken';
import sql from 'mssql';
import StudentDataType from './StudentData.js';
import { GraphQLNonNull, GraphQLString,GraphQLList } from 'graphql';
import { SECRET_KEY } from '../Config/secret.js';
const Studentdata={
    type:new GraphQLList(StudentDataType),
    args:{
        Class:{ type: new GraphQLNonNull(GraphQLString) },
    }
    ,
    resolve: async(parent,{Class})=>{
const result=await sql.query`
SELECT * FROM Students  WHERE class = ${Class}

`

return result.recordset;

    }
}
export  {Studentdata};