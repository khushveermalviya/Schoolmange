import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Main from './Component/Main.jsx';
import Admin from './pages/Admin.jsx';
import Student from './pages/Student.jsx';
import Result from './Component/student/Result.jsx';
import Complain from './Component/student/Complain.jsx';
import Attendence from './Component/student/Attendence.jsx';
import Layout from './Routes/Layout.jsx';
import Faculty from './Component/admin/Faculty.jsx';
import S1 from './Component/admin/Students/S1.jsx';
import Adminlayout from './Routes/Adminlayout.jsx';
import Classes from './Component/admin/Students/Classes.jsx';
import ClassesLayout from './Routes/ClassesLayout.jsx';
import Form from './Component/admin/Students/Form.jsx';
import Classaddlayout from './Routes/Classaddlayout.jsx';
import Login from './Component/admin/Login.jsx';
import LoginLayout from './Routes/LoginLayout.jsx';
import Protected from './Routes/Protected.jsx';
import Details from './Component/admin/Students/Details.jsx';
import Delete from './Component/admin/Students/Delete.jsx';
import Annunosment from './Component/admin/Students/Annunosment.jsx';
import Update from './Component/admin/Students/Update.jsx';
import Studentlog from './Component/student/Studentlog.jsx';
import Chart from "./Component/student/Chart/Pie.jsx";
import First from './Component/student/Chart/First.jsx';
import { UserProvider } from './Component/student/UserContext.jsx';

const router = createBrowserRouter([
  { 
    path: '/',
    element: <Main />,
  },
  {
    path: '/admin',
    element: <Adminlayout />,
    children: [
      {
        path: "",
        element: <Login />
      },
      {
        path: "adminPanel",
        element: <Protected><LoginLayout /></Protected>,
        children: [
          {
            path: '',
            element: <Protected><Admin /></Protected>
          },
          {
            path: 'faculty',
            element: <Protected><Faculty /></Protected>
          },
          {
            path: "classes",
            element: <ClassesLayout />,
            children: [
              {
                path: "",
                element: <Protected><S1 /></Protected>
              },
              {
                path: "",
                element: <Protected><Classes /></Protected>,
                children: [
                  {
                    path: '',
                    element: <Classes />
                  },
                  {
                    path: "details/:studentId",
                    element: <Protected><Details /></Protected>
                  },
                  {
                    path: "add",
                    element: <Form />
                  },
                  {
                    path: "delete",
                    element: <Delete />
                  },
                  {
                    path: "annunosment",
                    element: <Annunosment />
                  },
                  {
                    path: "details/:studentId",
                    element: <Details />
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/Student',
    element: <Protected><Layout /></Protected>,
    children: [
      {
        path: '',
        element: <First />
      },
      {
        path: 'result',
        element: <Result />
      },
      {
        path: 'Home',
        element: <First />
      },
      {
        path: 'attendence',
        element: <Attendence />
      },
      {
        path: 'complain',
        element: <Complain />
      }
    ]
  }
]);

const cnt = new ApolloClient({
  link: new HttpLink({
    uri: 'https://backend-kz3r.onrender.com/graphql',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={cnt}>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </ApolloProvider>
  </StrictMode>
);