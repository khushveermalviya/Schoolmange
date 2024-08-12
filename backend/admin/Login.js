import express from "express"
import Pool from "../db/Database.js"
const app=express();


 const Login =app.post('/admin',async (req,res)=>{
    const { username } = req.body;
    try {
      const result = await Pool.query('SELECT * FROM admin WHERE username = $1', [username]);
      if (result.rows.length > 0) {
        res.json({ exists: true });
        console.log("done");
        
      } else {
        res.json({ exists: false });
        console.log("lose");
       
      }
    } catch (error) {
      console.error('Error querying database:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
  export default Login;