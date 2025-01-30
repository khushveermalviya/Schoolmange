import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import sql from 'mssql';
import { createServer } from 'http';
import schema from './Schema/Schema.js';  // Import the comprehensive schema
import AzureDb from './db/SecondDb.js';
import authMiddleware from './middleware/authMiddleware.js';
import bodyParser from 'body-parser';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

async function startServer() {
    const app = express();
    const httpServer = createServer(app);

    // WebSocket server for subscriptions
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql'
    });

    // WebSocket connection handler
    wsServer.on('connection', async (ws) => {
        ws.on('message', async (message) => {
            try {
                const parsedMessage = JSON.parse(message);
                
                if (parsedMessage.type === 'connection_init') {
                    const token = parsedMessage.payload?.Authorization?.split(' ')[1];
                    if (!token) {
                        ws.send(JSON.stringify({ 
                            type: 'connection_error', 
                            payload: { message: 'No token provided' } 
                        }));
                        return;
                    }

                    try {
                        const decoded = jwt.verify(token, SECRET_KEY);
                        const result = await sql.query`
                            SELECT StudentID, FirstName, LastName, Class
                            FROM Students
                            WHERE StudentID = ${decoded.StudentID}
                        `;
                        
                        if (result.recordset.length === 0) {
                            ws.send(JSON.stringify({ 
                                type: 'connection_error', 
                                payload: { message: 'Invalid token' } 
                            }));
                            return;
                        }

                        ws.student = result.recordset[0];
                        ws.send(JSON.stringify({ type: 'connection_ack' }));
                    } catch (err) {
                        ws.send(JSON.stringify({ 
                            type: 'connection_error', 
                            payload: { message: 'Authentication failed' } 
                        }));
                    }
                }
            } catch (err) {
                console.error('WebSocket message error:', err);
            }
        });
    });

    // Initialize database
    await AzureDb();

    const server = new ApolloServer({
        schema,
        introspection: true,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer })
        ]
    });

    await server.start();

    app.use(cors());
    app.use(authMiddleware);
    app.use(bodyParser.json({ limit: '5mb' })); 
    app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
    app.use(
        '/graphql',
        express.json(),
        expressMiddleware(server, {
            context: async ({ req }) => {
                return { student: req.student };
            }
        })
    );

    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer().catch(console.error);