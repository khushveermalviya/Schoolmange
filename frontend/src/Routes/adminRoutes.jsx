import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Administrative from '../Component/admin/Administrative/Administrative';
import Dashboard from '../Component/admin/Administrative/Dashboard';
import StaffManagement from '../Component/admin/Administrative/componenet/Staff/StaffManagement.jsx';
import Academics from '../Component/admin/Administrative/Academics';
import Finance from '../Component/admin/Administrative/Finance';
import Students from "../Component/admin/Administrative/Students"
import Reports from '../Component/admin/Administrative/Reports';
import Settings from '../Component/admin/Administrative/Settings';
import Facilities from '../Component/admin/Administrative/Facilities';
import Addstaff from '../Component/admin/Administrative/componenet/Staff/Addstaff';
import AddStudent from '../Component/admin/Administrative/componenet/Student/Addstudent.jsx';
// ... import other components

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Administrative />}>
        <Route index element={<Dashboard />} />
        <Route path="staff" element={<StaffManagement/>} />
        <Route path="staff/addstaff" element={<Addstaff/>} />
        <Route path="academics" element={<Academics />} />
        <Route path="finance" element={<Finance />} />
        <Route path="students" element={<Students />} />
        <Route path="students/Addstudent" element={<AddStudent />} />
        <Route path="facilities" element={<Facilities />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

