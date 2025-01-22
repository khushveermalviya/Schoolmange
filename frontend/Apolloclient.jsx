import {
  ApolloClient,
  InMemoryCache,
  split,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

// Your Azure App Service endpoint
const serverEndpoint = 'https://center-gefucegncpf7akcc.centralindia-01.azurewebsites.net';

// HTTP Link
const httpLink = new HttpLink({
  uri: `${serverEndpoint}/graphql`,
});

// WebSocket Link
const wsLink = new WebSocketLink({
  uri: `${serverEndpoint.replace(/^https/, 'wss')}/graphql`,
  options: {
    reconnect: true,
    connectionParams: () => {
      const token = localStorage.getItem('token');
      return {
        Authorization: token ? `Bearer ${token}` : '',
      };
    },
  },
});

// Authentication Link for HTTP requests
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token');
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });
  return forward(operation);
});

// Split Link for HTTP and WebSocket
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink) // Apply authLink to HTTP link
);

// Apollo Client Instance
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  connectToDevTools: true, // Enable Apollo DevTools
});

export default client;
