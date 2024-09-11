import dotenv from 'dotenv';
import Pool from "./db/Database.js";
import express from "express";
import cors from "cors";
import axios from 'axios';
import Login from "./admin/Login.js";
import Studentadd from './admin/Studentadd.js';
import Studentlist from './admin/Studentlist.js';
import Studentdetails from './admin/Studentdetails.js';
import Studentdelete from './admin/Studentdelete.js';
import logs from './Student/Login.js';
import { graphqlHTTP } from 'express-graphql';
import { schema,root } from './Schema/Schema.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,  // Enable GraphiQL UI for testing in development
}));



app.use(Login);
app.use(Studentadd);
app.use(Studentlist);
app.use(Studentdetails);
app.use(Studentdelete);
app.use(logs);

const PORT = 3334;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});