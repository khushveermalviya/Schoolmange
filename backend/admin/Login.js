import express from "express"
import Pool from "../db/Database.js"
const app=express();


 const Login =app.post('/login',async (req,res)=>{
    const { username,password } = req.body;
    try {
      const result = await Pool.query('SELECT * FROM login WHERE username = $1 AND password = $2', [username, password]);
      if (result.rows.length > 0) {
        res.json({ exists: true });
        console.log("done");
        
      } else {
        res.json({ exists: false });
        console.log("lose");
       
      }
    } catch (error) {
    
      res.status(500).json({ success: false, error: 'Internal server error' });
      console.log("lose");
       
    }
  });
  export default Login;