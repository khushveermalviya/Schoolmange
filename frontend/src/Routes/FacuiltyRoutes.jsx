import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Subjects from '../Component/admin/Facuity/Subjects';
import Attendance from '../Component/admin/Facuity/Attendance';
import Timetable from '../Component/admin/Facuity/Timetable';
import Reports from '../Component/admin/Facuity/Reports';
import Faculty from '../Component/admin/Facuity/Faculty';
import FDashboard from '../Component/admin/Facuity/FDashboard';


// ... import other components

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Faculty />}>
        <Route index element={<FDashboard />} />
        <Route path="Subjects" element={<Subjects />} />
        <Route path="Timetable" element={<Timetable />} />
        <Route path="Attendance" element={<Attendance />} />
        <Route path="Reports" element={<Reports />} />
        {/* <Route path="students" element={<Students />} />
    
  
        <Route path="facilities" element={<Facilities />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} /> */}
      </Route>
    </Routes>
  );
}
