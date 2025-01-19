import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
const cnt = new ApolloClient({
    link: new HttpLink({
      // uri: 'https://backend-kz3r.onrender.com/graphql',
      // uri:"http://localhost:5000/graphql",
      uri:'https://center-gefucegncpf7akcc.centralindia-01.azurewebsites.net/graphql',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),
    cache: new InMemoryCache(),
  });
  export default cnt; 