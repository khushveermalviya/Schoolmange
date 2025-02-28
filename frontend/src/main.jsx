
  import { StrictMode } from 'react';
  import { App } from '@capacitor/app';
  import { createRoot } from 'react-dom/client';
  import './index.css';
  import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
  import { createBrowserRouter, RouterProvider, Outlet ,createHashRouter} from 'react-router-dom';
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

  import Classaddlayout from './Routes/Classaddlayout.jsx';
  import Login from './Component/admin/Login.jsx';
  import LoginLayout from './Routes/LoginLayout.jsx';
  import Protected from './Routes/Protected.jsx';
  import Details from './Component/admin/Students/Details.jsx';
  import First from './Component/student/Chart/First.jsx';
  import { UserProvider } from './Component/student/UserContext.jsx';
  import Protect from './Component/admin/Protect.jsx';
  import Smart from './Component/student/AiGURU/Smart.jsx';
  import AdminRoutes from "./Routes/adminRoutes.jsx";
  import FacuiltyRoutes from "./Routes/FacuiltyRoutes.jsx";
  import { BackButtonHandler } from './BackButtonHandler';
  import   client  from '../Apolloclient.jsx';
  import GroupChat from './Component/student/Groupchat.jsx';
  import AdminLogin from './Component/admin/Administrative/AdminLogin.jsx';
  import FacLogin from './Component/admin/Facuity/FacLogin.jsx';
import Quiz from './Component/student/Quiz/Quiz.jsx';
import Fees from './Component/student/Fees.jsx';

Quiz
  // Root Layout Component
  const RootLayout = () => {
    return (
      <>
        <BackButtonHandler />
        <Outlet />
      </>
    );
  };

  const router = createHashRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { 
          path: '/',
          element: <Protect><Main /></Protect>
        },
        {
          path: 'admin',
          element: <LoginLayout />,
          children: [
            {
              path: "",
              element: <Admin />
            },
            {
              path: '/admin/AdministrativeAuth',
              element: <AdminLogin /> // No children here - this is just the login page
            },
            {
              path: '/admin/AdministrativeAuth/Administrative/*', // This will match all Administrative routes
              element: <Protected><AdminRoutes /></Protected>
            },
            
            // Faculty login and routes
            {
              path: '/admin/FacilityAuth',
              element: <FacLogin /> // No children here - this is just the login page
            },
            {
              path: '/admin/FacilityAuth/Facility/*', // This will match all Facility routes
              element: <Protected><FacuiltyRoutes /></Protected>
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
            },
            {
              path: 'Quiz',
              element: <Quiz/>
            },
            {
              path: 'Fees',
              element: <Fees/>
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