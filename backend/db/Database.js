import pg from 'pg'
import dotenv from "dotenv"
dotenv.config();
const {Pool}=pg;
const pool= new Pool(
   {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: 5432,
      database: process.env.DB_NAME
      
   },
   console.log(  `${process.env.DB_USER}`)
   

)
export default pool;