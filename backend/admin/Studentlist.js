import express from "express"
import Pool from "../db/Database.js"
const App = express.Router();

const Studentlist =App.get("/list", async(req,res)=>{

try {
    const list=await Pool.query("SELECT * FROM student")
    res.json(list.rows);
    console.log(list);
    
} catch (error) {
    console.error(error)
    res.status(500).send('An error occurred while fetching students');
}

   
})
export default Studentlist;