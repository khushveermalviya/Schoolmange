import React, { useEffect, useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { PlusCircle, Edit2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';

// Updated GraphQL query to match your schema
const GET_STUDENT = gql`
  query GetStudentData($Class: String!) {
    Studentdata(Class: $Class) {
      StudentID
      FirstName
      LastName
      Class
    }
  }
`;

const StudentManagement = () => {
  const [selectedClass, setSelectedClass] = useState('1');
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState([]);
  const [error, setError] = useState(null);

  const [fetchStudentData, { data }] = useLazyQuery(GET_STUDENT, {
    variables: { Class: selectedClass },
    onCompleted: (data) => {
      setFiltered(data.Studentdata || []);
      setLoading(false);
    },
    onError: (error) => {
      setError('An error occurred while fetching student data.');
      setLoading(false);
      console.error(error);
    },
  });

  useEffect(() => {
    fetchStudentData();
  }, [selectedClass, fetchStudentData]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Students</h1>
        <NavLink 
        to="Addstudent"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <PlusCircle size={20} />
          Add Student
        </NavLink>
      </div>

      {/* Class Filter */}
      <div className="mb-6">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Students</option>
  {/* <option value="Nursery">Nursery</option>
  <option value="KG">KG</option> */}
  <option value="1">1st Grade</option>
  <option value="2">2nd Grade</option>
  <option value="3">3rd Grade</option>
  <option value="4">4th Grade</option>
  <option value="5">5th Grade</option>
  <option value="6">6th Grade</option>
  <option value="7">7th Grade</option>
  <option value="8">8th Grade</option>
  <option value="9">9th Grade</option>
  <option value="10">10th Grade</option>
  <option value="11">11th Grade</option>
  <option value="12">12th Grade</option>
        </select>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-red-500">{error}</td>
              </tr>
            ) : filtered.map((student) => (
              <tr key={student.StudentID} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{student.StudentID}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{`${student.FirstName} ${student.LastName}`}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{student.Class}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    onClick={() => console.log('Edit student:', student.StudentID)}
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

  
    </div>
  );
};

export default StudentManagement;