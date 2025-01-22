
import { StrictMode } from 'react';
import { App } from '@capacitor/app';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Main from './Component/Main.jsx';
import Admin from './pages/Admin.jsx';
import Student from './pages/Student.jsx';
import Result from './Component/student/Result.jsx';
import Complain from './Component/student/Complain.jsx';
import Attendence from './Component/student/Attendence.jsx';
import Layout from './Routes/Layout.jsx';
import Faculty from './Component/admin/Facuity/Faculty.jsx';
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
import First from './Component/student/Chart/First.jsx';
import { UserProvider } from './Component/student/UserContext.jsx';
import Protect from './Component/admin/Protect.jsx';
import Smart from './Component/student/AiGURU/Smart.jsx';
import Complaint from './Component/admin/Students/Complaint.jsx';
import AdminRoutes from "./Routes/adminRoutes.jsx";
import FacuiltyRoutes from "./Routes/FacuiltyRoutes.jsx";
import { BackButtonHandler } from './BackButtonHandler';
import  { client } from '../Apolloclient.jsx';
import GroupChat from './Component/student/Groupchat.jsx';

// Root Layout Component
const RootLayout = () => {
  return (
    <>
      <BackButtonHandler />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { 
        path: '/',
        element: <Protect><Main /></Protect>
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
                path: 'Facility/*',
                element: <Protected><FacuiltyRoutes/></Protected>
              },
              {
                path: 'Administrative/*',
                element: <Protected><AdminRoutes /></Protected>
              },
              {
                path: "class",
                element: <ClassesLayout />,
                children: [
                  {
                    path: "",
                    element: <Protected><S1 /></Protected>
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
                    path: "Complaint",
                    element: <Complaint/>
                  },
                  {
                    path: ":classId",
                    element: <Classaddlayout />,
                    children: [
                      {
                        path: "",
                        element: <Protected><Classes /></Protected>
                      },
                      {
                        path: "details/:studentId",
                        element: <Protected><Details /></Protected>
                      },
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
        element: <Protect><Layout/></Protect>,
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
            path: 'Attendence',
            element: <Attendence />
          },
          {
            path: 'complain',
            element: <Complain />
          },
          {
            path: 'Aiguru',
            element: <Smart/>
          },{
            path:"groupchat",
            element:<GroupChat/>
          }
        ]
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </ApolloProvider>
  </StrictMode>
);