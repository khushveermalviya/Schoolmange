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
import schema from "./Schema/Schema.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});