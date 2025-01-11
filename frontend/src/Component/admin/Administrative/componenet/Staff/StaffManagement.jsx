// StaffManagement.jsx
import React, { useState, useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import DataTable from '../DataTable';
import { Loader2 } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

const STAFF_QUERY = gql`
  query GetAllStaff {
    GetAllStaff {
      firstName
      department
      role
      email
      phone
      status
    }
  }
`;

export default function StaffManagement() {
  const [staffData, setStaffData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fetchStaff] = useLazyQuery(STAFF_QUERY, {
    onCompleted: (data) => {
      // Transform the data to match your table structure
      const transformedData = data.GetAllStaff.map(staff => ({
        name: staff.firstName, // Map firstName to name for table
        department: staff.department,
        role: staff.role,
        email: staff.email,
        phone: staff.phone,
        status: staff.status
      }));
      setStaffData(transformedData);
      setLoading(false);
    },
    onError: (error) => {
      setError('An error occurred while fetching staff data.');
      setLoading(false);
      console.error(error);
    },
  });

  useEffect(() => {
    fetchStaff();
  }, []); // Remove fetchStaff from dependencies to avoid infinite loop

  // Filter function for search
  const getFilteredData = () => {
    if (!searchQuery) return staffData;
    
    return staffData.filter((staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'department', label: 'Department' },
    { key: 'role', label: 'Role' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'status', label: 'Status' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="mt-2 text-gray-600">Loading staff data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Staff Management
        </h1>
        <NavLink to="addstaff" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Add New Staff
        </NavLink>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search staff..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <DataTable
          columns={columns}
          data={getFilteredData()}
          onRowClick={(row) => console.log('Clicked row:', row)}
        />
      </div>
  
    </div>
  );
}