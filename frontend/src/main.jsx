import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
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
const router = createBrowserRouter([
  { 
    path: '/',
    element: <Main />,
  },
  {
    path: '/admin',
    element: <Adminlayout/>,
    children:[
      {
        path:"",
        element:<Admin />
      },
      {
        path:"facility",
        element:<Faculty/>
      },
      {
        path:"classes",
        element:<ClassesLayout/>,
        children:[
          {
            path:"",
            element:<S1/>
          },
          {
            path:"classes/:userid",
            element:<Classaddlayout/>,
            children:[
              {
                path:'',
                element:<Classes/>
              },
              {
                path:"add",
                element:<Form/>
                
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/Student',  // Removed the trailing space here
    element: <Layout/>,
    children: [
      {
        path: '',  // Changed to a relative path
        element: <Student />,
      },
      {
        path: 'result',  // Changed to a relative path
        element: <Result />,
      },
      {
        path: 'attendence',  // Changed to a relative path
        element: <Attendence />,
      },
      {
        path: 'complain',  // Changed to a relative path and corrected spelling
        element: <Complain />,
      },
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
