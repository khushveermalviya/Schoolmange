import app from './App/App.js';
import dotenv from 'dotenv';
import Pool from "./db/Database.js";
import express from "express";
import cors from "cors";

dotenv.config();

// Use the cors middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.post('/admin', async (req, res) => {
  try {
    const { father_name } = req.body;
  
    const result = await Pool.query("INSERT INTO students (father_name) VALUES($1, $2)", [father_name]);
    res.send('Student added successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
