import express from "express";
import Pool from "../db/Database.js";

const App = express.Router();

App.get("/details/:std_id", async (req, res) => {
  const { std_id } = req.params; // Extract std_id from the URL parameters
console.log(std_id);


  try {
    const details = await Pool.query("SELECT * FROM student WHERE std_id = $1", [std_id]);
    
    if (details.rows.length === 0) {
      return res.status(404).send('Student not found');
    }


    res.json(details.rows[0]);
    
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching student details');
  }
});

export default App;
