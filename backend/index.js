import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import { graphqlHTTP } from 'express-graphql';
import schema from "./Schema/Schema.js";
import AzureDb from './db/SecondDb.js';
import authMiddleware from './middleware/Auth.js'; // Import both middlewares

dotenv.config();

const app = express(); 
app.use(cors());
app.use(express.json());
await AzureDb();

app.use(authMiddleware); // Apply general authentication middleware to all routes

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
  customFormatErrorFn: (err) => {
    console.error(err);
    return { message: err.message, locations: err.locations, stack: err.stack ? err.stack.split('\n') : [], path: err.path };
  },
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});