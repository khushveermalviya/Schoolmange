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
import Login from './Component/admin/Login.jsx';
import LoginLayout from './Routes/LoginLayout.jsx';
import Protected from './Routes/Protected.jsx';
import Details from './Component/admin/Students/Details.jsx';
import Delete from './Component/admin/Students/Delete.jsx';
import Annunosment from './Component/admin/Students/Annunosment.jsx';
import Update from './Component/admin/Students/Update.jsx';
import Studentlog from './Component/student/Studentlog.jsx';
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
        element:<Login/>
      },
      {
        path:"adminPanel",
        element:<LoginLayout/>,
        children:[
          {
            path:'',
            element:  <Protected><Admin/></Protected>  
          },
          {
            path:'faculty',
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
                    path: "details/:studentId",
                    element: <Details />
                  },
                  {
                    path:"add",
                    element:<Form/>
                    
                  },
                  {
                    path:"delete",
                    element:<Delete/>

                  },{
                    path:"annunosment",
                    element:<Annunosment/>

                  },
                  {
                    path:"update",
                    element:<Update/>

                  }
                ]
              }
            ]
          }
        ]
      },
      
    ]
  },
  {
    path: '/Student',  // Removed the trailing space here
    element: <Layout/>,
    children: [
      {
        path: '',  // Changed to a relative path
        element: <Student/>,
      },
      // {
      //   path: 'Students',  // Changed to a relative path
      //   element: <Student/>,
      // },
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
