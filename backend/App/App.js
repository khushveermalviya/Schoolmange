// App.js
import express from 'express';
import cors from 'cors';

// Create an Express application instance
const app = express();

// Use CORS middleware
app.use(cors());

// Export the app instance
export default app;
