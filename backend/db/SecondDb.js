import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const sqlConfig = {
  user: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASSWORD,
  database: process.env.AZURE_SQL_DATABASE,
  server: process.env.AZURE_SQL_SERVER,
  options: {
    encrypt: true, // Required for Azure
    trustServerCertificate: false, // Set to true for self-signed certs
  },
};

// Function to establish the connection
const AzureDb = async()=>{
try{
  await sql.connect(sqlConfig);
 
  console.log("connected suceesfully");

}catch(err){
  console.error("database as some issue",err)
}
};


// Export the connection function
export default AzureDb;
