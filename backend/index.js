import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import { graphqlHTTP } from 'express-graphql';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';
import sql from 'mssql'; // Assuming you are using mssql
import schema from "./Schema/Schema.js";
import AzureDb from './db/SecondDb.js'; 
import authMiddleware from './middleware/authMiddleware.js';

dotenv.config();

  const SECRET_KEY = process.env.SECRET_KEY; 

const app = express();
const httpServer = createServer(app); 
app.use(cors());
app.use(express.json());
await AzureDb();

// Authentication Middleware


// Apply auth middleware to all routes
app.use(authMiddleware);

app.use(
    '/graphql',
    graphqlHTTP((req) => ({
        schema,
        graphiql: true,
        context: { student: req.student }, // Pass student data to context
        // customFormatErrorFn: (err) => {
        //     console.error(err);
        //     return {
        //         message: err.message,
        //         locations: err.locations,
        //         stack: err.stack ? err.stack.split('\n') : [],
        //         path: err.path
        //     };
        // },
    }))
);

// WebSocket Subscription Server (with Authentication)
SubscriptionServer.create(
    {
        schema,
        execute,
        subscribe,
        onConnect: async (connectionParams) => {
            const token = connectionParams.Authorization?.split(' ')[1];
            if (!token) return { student: null };

            try {
                const decoded = jwt.verify(token, SECRET_KEY);
                const result = await sql.query`
                    SELECT StudentID, FirstName, LastName, Class
                    FROM Students
                    WHERE StudentID = ${decoded.StudentID}
                `;
                return { student: result.recordset[0] };
            } catch (err) {
                console.error("Subscription authentication failed:", err);
                return { student: null }; 
            }
        }
    },
    {
        server: httpServer,
        path: '/graphql'
    }
);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});