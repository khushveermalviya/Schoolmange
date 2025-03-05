    import dotenv from 'dotenv';
    import express from "express";
    import cors from "cors";
    import { ApolloServer } from '@apollo/server';
    import { expressMiddleware } from '@apollo/server/express4';
    import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
    import { WebSocketServer } from 'ws';
    import jwt from 'jsonwebtoken';
    import sql from 'mssql';
    import { createServer } from 'http';
    import schema from './Schema/Schema.js';  // Import the comprehensive schema
    import AzureDb from './db/SecondDb.js';
    import authMiddleware from './middleware/authMiddleware.js';
    import validateToken from './middleware/validateToken.js';

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

        // Configure CORS
        app.use(cors());

        // Middleware to verify token
        app.post('/api/verify-token', async (req, res) => {
            const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
        
            try {
            if (!token) {
                return res.status(401).json({ valid: false, message: 'No token provided' });
            }
        
            // Validate the token using the shared validateToken function
            const validationResult = await validateToken(token);
        
            if (!validationResult.valid) {
                return res.status(401).json({ valid: false, message: validationResult.message });
            }
        
            // Token is valid
            return res.json({ valid: true, message: validationResult.message, role: validationResult.role });
            } catch (error) {
            // console.error('Error verifying token:', error);
            return res.status(500).json({ valid: false, message: 'Internal server error' });
            }
        });

        app.use('/student', authMiddleware('student')); // Apply middleware for student routes
        app.use('/admin', authMiddleware('faculty')); // Apply middleware for admin routes

        app.use(
            '/graphql',
            express.json(),
            expressMiddleware(server, {
                context: async ({ req }) => {
                    // Check if token has expired
                    if (req.tokenExpired) {
                        // This will make the error available to your GraphQL resolvers
                        return {
                            user: null,
                            tokenExpired: true
                        };
                    }
                    return { 
                        user: req.user,
                        tokenExpired: false
                    };
                }
            })
        );

        const PORT = process.env.PORT || 5000;
        httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }

    startServer().catch(console.error);