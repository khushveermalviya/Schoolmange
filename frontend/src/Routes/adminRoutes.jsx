import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Administrative from '../Component/admin/Administrative/Administrative';
import Dashboard from '../Component/admin/Administrative/Dashboard';
import StaffManagement from '../Component/admin/Administrative/componenet/Staff/StaffManagement.jsx';
import Academics from '../Component/admin/Administrative/Academics';
import Finance from '../Component/admin/Administrative/Finance';
import Students from "../Component/admin/Administrative/Students";
import Reports from '../Component/admin/Administrative/Reports';
import TimetableManagement from '../Component/admin/Administrative/Settings';
import Facilities from '../Component/admin/Administrative/Facilities';
import Addstaff from '../Component/admin/Administrative/componenet/Staff/Addstaff';
import AddStudent from '../Component/admin/Administrative/componenet/Student/Addstudent.jsx';
import StaffDetails from '../Component/admin/Administrative/componenet/Staff/StaffDetails.jsx'; // Import StaffDetails component
import Classlist from '../Component/admin/Administrative/componenet/Finance/Classlist.jsx';
import StudentFeeDetails from '../Component/admin/Administrative/componenet/Finance/StudentFeeDetails.jsx';
import EditStudent from '../Component/admin/Administrative/componenet/Student/EditStudent.jsx';
import Notification from '../Component/admin/Administrative/Notification.jsx';
import ExpenseManagement from "../Component/admin/Administrative/ExpenseManagement.jsx"
export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Administrative />}>
        <Route index element={<Dashboard />} />
        <Route path="staff" element={<StaffManagement />} />
        <Route path="staff/addstaff" element={<Addstaff />} />
        <Route path="staff/:id" element={<StaffDetails />} /> {/* Add route for StaffDetails */}
        <Route path="academics" element={<Academics />} />
        <Route path="finance" element={<Finance />} />
        
        <Route path="ExpenseManagement" element={<ExpenseManagement />} />
        <Route path='finance/:classNumber' element={<Classlist/>}/>
        <Route path='finance/:classNumber/detail/:studentId' element={<StudentFeeDetails/>}/>
        <Route path="students" element={<Students />} />
        <Route path="students/:studentId" element={<EditStudent />} />
        <Route path="students/Addstudent" element={<AddStudent />} />
        <Route path="facilities" element={<Facilities />} />
        <Route path="reports" element={<Reports />} />
        <Route path="Notification" element={<Notification />} />
        <Route path="settings" element={<TimetableManagement />} />
      </Route>
    </Routes>
  );
}