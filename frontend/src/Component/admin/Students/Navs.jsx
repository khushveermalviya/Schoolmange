import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Menu, X, Bell, UserCircle, Grid, Users, MessageSquare, AlertTriangle } from 'lucide-react';
import { gql, useLazyQuery } from '@apollo/client';

const FETCH_STUDENTS_BY_NAME = gql`
  query StudentDetail($StudentID: String!) {
    StudentDetail(StudentID: $StudentID) {
      StudentID
      FirstName
      Class
    }
  }
`;

const classTeachers = [
  "Ms. Johnson", "Mr. Smith", "Mrs. Davis", "Mr. Wilson",
  "Ms. Brown", "Mr. Taylor", "Mrs. Anderson", "Mr. Thomas",
  "Ms. Martinez", "Mr. Garcia", "Mrs. Robinson", "Mr. Lee"
];

export default function ClassDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState([]);

  const [fetchStudents, { data }] = useLazyQuery(FETCH_STUDENTS_BY_NAME);

  useEffect(() => {
    if (search) {
      fetchStudents({ variables: { StudentID: search } });
    }
  }, [search, fetchStudents]);

  useEffect(() => {
    if (data?.StudentDetail) {
      setStudents(data.StudentDetail);
    }
  }, [data]);

  return (
    <div className=" bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            {/* Logo and primary nav */}
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Grid className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <NavLink
                  to="add"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-gray-100 border-b-2 border-transparent hover:border-blue-500"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Add
                </NavLink>
                <NavLink
                  to="delete"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-gray-100 border-b-2 border-transparent hover:border-blue-500"
                >
                  <X className="h-4 w-4 mr-2" />
                  Delete
                </NavLink>
                <NavLink
                  to="annunosment"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-gray-100 border-b-2 border-transparent hover:border-blue-500"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Announcements
                </NavLink>
                <NavLink
                  to="Complaint"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-gray-100 border-b-2 border-transparent hover:border-blue-500"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Complaints
                </NavLink>
              </div>
            </div>

            {/* Search and user menu */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search students..."
                    className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="ml-4 flex items-center md:ml-6">
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <UserCircle className="h-6 w-6" />
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center md:hidden ml-4">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="pt-2 pb-3 space-y-1">
            <NavLink
              to="add"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              Add
            </NavLink>
            <NavLink
              to="delete"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              Delete
            </NavLink>
            <NavLink
              to="annunosment"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              Announcements
            </NavLink>
            <NavLink
              to="Complaint"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              Complaints
            </NavLink>
          </div>
        </div>
      </nav>
      </div>
  )}