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
const router = createBrowserRouter([
  { 
    path: '/',
    element: <Main />,
  },
  {
    path: '/admin',
    element: <Admin />,
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
