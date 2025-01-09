import React, { useState, useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { UserCircle, Mail, Users, Calendar, Award, BookOpen, Clock, Check, X, ChevronRight, GraduationCap, Loader2 } from 'lucide-react';

const FETCH_STUDENT_DETAIL = gql`
  query StudentDetail($StudentID: String!) {
    StudentDetail(StudentID: $StudentID) {
      StudentID
      FirstName
      LastName
      Class
      Email
      FatherName
      MotherName
      TotalPresent
    }
  }
`;

export default function Details() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const [fetchStudentDetail, { data, loading, error }] = useLazyQuery(FETCH_STUDENT_DETAIL, {
    variables: { StudentID: studentId },
    onCompleted: (data) => {
      setStudent(data.StudentDetail);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    fetchStudentDetail();
  }, [studentId, fetchStudentDetail]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
          <p className="mt-2 text-gray-600">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">No student data found.</div>
      </div>
    );
  }

  const attendancePercentage = (student.TotalPresent / 200) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
              <UserCircle className="w-20 h-20 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {student.FirstName} {student.LastName}
              </h1>
              <p className="mt-1 text-gray-500 dark:text-gray-400">Student ID: {student.StudentID}</p>
              <div className="mt-4 flex items-center space-x-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Class {student.Class}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Active Student
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Information</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-gray-900 dark:text-white">{student.Email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Parents</p>
                    <p className="text-gray-900 dark:text-white">{student.FatherName} & {student.MotherName}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Class</p>
                    <p className="text-gray-900 dark:text-white">Class {student.Class}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Attendance Overview</h2>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                      Attendance Rate
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-600">
                      {attendancePercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                  <div 
                    style={{ width: `${attendancePercentage}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Present: {student.TotalPresent} days
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {['overview', 'attendance', 'results'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                  <button
                    onClick={() => alert('Add Attendance')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Mark Attendance
                  </button>
                  <button
                    onClick={() => alert('Add Result')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Add Result
                  </button>
                </div>

                {/* Recent Activity */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
                  <div className="space-y-2">
                    {[
                      { icon: Check, text: 'Attended Math Class', date: 'Today' },
                      { icon: Award, text: 'Scored 95% in Science Test', date: 'Yesterday' },
                      { icon: GraduationCap, text: 'Completed Term Project', date: '3 days ago' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                        <div className="flex items-center">
                          <activity.icon className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.text}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{activity.date}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}