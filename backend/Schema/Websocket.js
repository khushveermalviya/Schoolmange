import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { execute, subscribe } from 'graphql';
import schema from './Schema.js';
import { getStudentFromToken } from './auth';

export function setupWebSocketServer(httpServer) {
  // Create WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql'
  });

  // GraphQL WebSocket configuration
  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx) => {
        // Get auth token from connection params
        const token = ctx.connectionParams.authToken;
        if (!token) {
          throw new Error('Missing auth token');
        }

        // Validate token and get student info
        const student = await getStudentFromToken(token);
        if (!student) {
          throw new Error('Invalid token');
        }

        return { student };
      },
      execute,
      subscribe,
      onConnect: async (ctx) => {
        console.log('Client connected');
      },
      onDisconnect: async (ctx) => {
        console.log('Client disconnected');
      }
    },
    wsServer
  );

  // Cleanup on server shutdown
  return () => {
    serverCleanup.dispose();
  };
}