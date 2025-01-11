import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { Loader2, FileSpreadsheet, UserCircle, BookOpen, BadgeCheck, Download } from 'lucide-react';
import useUserStore from '../../../app/useUserStore';


export default function ClassView() {
  const { classId } = useParams();
  const { students, loading, error, fetchStudents } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents(classId);
    console.log(students)
  }, [classId]);

  const handleGenerateExcel = () => {
    const dataToExport = students.map(student => ({
      'Student Name': student.FirstName,
      'Last Name': student.LastName,
      'Class': student.Class,
      'Student ID': student.StudentID,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, `Class_${classId}_Students.xlsx`);
  };

  const filteredStudents = students.filter(student => 
    student.FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.LastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.StudentID.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
          <p className="mt-2 text-gray-600">Loading student data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Class {classId} Students
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Total Students: {students.length}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search students..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={handleGenerateExcel}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <FileSpreadsheet className="h-5 w-5 mr-2" />
                Export to Excel
              </button>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        {filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student, index) => (
              <NavLink
                to={`details/${student.StudentID}`}
                key={student.StudentID}
                className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                        <UserCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {student.FirstName} {student.LastName}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                          ID: {student.StudentID}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <BookOpen className="h-5 w-5 mr-2" />
                        <span>Class {student.Class}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <BadgeCheck className="h-5 w-5 mr-2" />
                        <span>Active Student</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        View Details
                      </span>
                      <Download className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No students found for this class.</p>
          </div>
        )}
      </div>
    </div>
  );
}