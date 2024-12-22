  import dotenv from 'dotenv';
  import express from "express";
    import cors from "cors";
  import { graphqlHTTP } from 'express-graphql';
  import schema from "./Schema/Schema.js";
import  AzureDb from './db/SecondDb.js';
import authMiddleware from './middleware/Auth.js';
  dotenv.config();

  const app = express(); 
  app.use(cors());
  app.use(express.json());
  AzureDb();
  app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
  }));
  app.use(authMiddleware);
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });