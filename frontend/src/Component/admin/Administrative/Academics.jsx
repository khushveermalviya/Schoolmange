import React, { useState } from 'react';
import DataTable from './componenet/DataTable';
import FilterBar from './componenet/FilterBar';
import { BookOpen, Users, Calendar, Award } from 'lucide-react';

export default function Academics() {
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
        { label: 'Commerce', value: 'commerce' }
      ]
    },
    {
      key: 'semester',
      label: 'Semester',
      type: 'select',
      value: '',
      options: [
        { label: 'Fall 2024', value: 'fall_2024' },
        { label: 'Spring 2024', value: 'spring_2024' }
      ]
    }
  ]);

  const columns = [
    { key: 'courseCode', label: 'Course Code' },
    { key: 'courseName', label: 'Course Name' },
    { key: 'department', label: 'Department' },
    { key: 'instructor', label: 'Instructor' },
    { key: 'students', label: 'Students' },
    { key: 'status', label: 'Status' }
  ];

  const courseData = [
    {
      courseCode: 'CS101',
      courseName: 'Introduction to Programming',
      department: 'Science',
      instructor: 'Dr. Smith',
      students: 45,
      status: 'Active'
    }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(filters.map(filter => 
      filter.key === key ? { ...filter, value } : filter
    ));
  };

  const handleFilterSubmit = () => {
    console.log('Applying filters:', filters);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Academic Management</h1>
        <div className="space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Add Course
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Schedule Class
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-4">
            <BookOpen className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Active Courses</p>
              <p className="text-2xl font-bold">68</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-4">
            <Users className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold">2,845</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-4">
            <Calendar className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-500">Class Schedule</p>
              <p className="text-2xl font-bold">180</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-4">
            <Award className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500">Departments</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </div>
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
          data={courseData}
          onRowClick={(row) => console.log('Clicked row:', row)}
        />
      </div>
    </div>
  );
}