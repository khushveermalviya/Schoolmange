import React, { useState } from 'react';
import DataTable from './componenet/DataTable';
import FilterBar from './componenet/FilterBar';
import { Mail, Phone, Building } from 'lucide-react';

export default function StaffManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState([
    { 
      key: 'department',
      label: 'Department',
      type: 'select',
      value: '',
      options: [
        { label: 'Science', value: 'science' },
        { label: 'Arts', value: 'arts' },
        { label: 'Commerce', value: 'commerce' },
      ]
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      value: '',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'On Leave', value: 'on_leave' },
        { label: 'Terminated', value: 'terminated' },
      ]
    }
  ]);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'department', label: 'Department' },
    { key: 'role', label: 'Role' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'status', label: 'Status' },
  ];

  const staffData = [
    {
      name: 'John Doe',
      department: 'Science',
      role: 'Senior Professor',
      email: 'john@example.com',
      phone: '+1234567890',
      status: 'Active',
    },
    // Add more sample data as needed
  ];

  const handleFilterChange = (key, value) => {
    setFilters(filters.map(filter => 
      filter.key === key ? { ...filter, value } : filter
    ));
  };

  const handleFilterSubmit = () => {
    // Implement filter logic
    console.log('Applying filters:', filters);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Staff Management</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Add New Staff
        </button>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterSubmit={handleFilterSubmit}
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <DataTable
          columns={columns}
          data={staffData}
          onRowClick={(row) => console.log('Clicked row:', row)}
        />
      </div>
    </div>
  );
}