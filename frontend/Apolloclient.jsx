// File: /src/apollo/client.js
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

const httpLink = new HttpLink({
  uri: 'https://center-gefucegncpf7akcc.centralindia-01.azurewebsites.net/graphql'
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'http://localhost:5000/graphql',
  connectionParams: () => ({
    authToken: localStorage.getItem('token')
  })
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});


    //  // uri: 'https://backend-kz3r.onrender.com/graphql',
    //  uri:"http://localhost:5000/graphql",
    //  // uri:'https://center-gefucegncpf7akcc.centralindia-01.azurewebsites.net/graphql',