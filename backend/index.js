import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import { graphqlHTTP } from 'express-graphql';
import schema from "./Schema/Schema.js";
import AzureDb from './db/SecondDb.js';
import { authMiddleware, authenticate } from './middleware/Auth.js'; // Import both middlewares

dotenv.config();

const app = express(); 
app.use(cors());
app.use(express.json());
AzureDb();

app.use(authMiddleware); // Apply general authentication middleware to all routes

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

// Example of protecting a route for students
app.get('/student-route', authenticate('student'), (req, res) => {
  res.send('Welcome, student!');
});

// Example of protecting a route for faculty
app.get('/admin/adminPanel', authenticate('faculty'), (req, res) => {
  res.send('Welcome, faculty!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});