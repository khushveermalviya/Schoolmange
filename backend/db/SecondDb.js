import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const sqlConfig = {
  user: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASSWORD,
  database: process.env.AZURE_SQL_DATABASE,
  server: process.env.AZURE_SQL_SERVER,
  port: 1433,
  options: {
    encrypt: true, // Required for Azure
    trustServerCertificate: false, // Set to true for self-signed certs
    enableArithAbort: true,
    connectTimeout: 30000, // 30 seconds
    requestTimeout: 30000, // 30 seconds
  },
};

// Function to establish the connection with retry mechanism
const AzureDb = async (retries = 2) => {
  while (retries) {
    try {
      await sql.connect(sqlConfig);
      console.log("connected successfully");
      break;
    } catch (err) {
      console.error("database has some issue", err);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      if (!retries) throw err;
      await new Promise(res => setTimeout(res, 5000)); // Wait for 5 seconds before retrying
    }
  }
};

// Export the connection function
export default AzureDb;