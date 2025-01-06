import React, { useState } from 'react';

const Attendence = () => {
  const studentData = {
    StudentID: "STD123",
    FirstName: "John",
    LastName: "Doe",
    Class: "XII-A",
    Email: "john.doe@school.com",
    FatherName: "James Doe",
    MotherName: "Jane Doe",
    TotalPresent: "132",
    TotalAbsenet: "24"
  };

  const [showContactForm, setShowContactForm] = useState(false);

  const totalClasses = parseInt(studentData.TotalPresent) + parseInt(studentData.TotalAbsenet);
  const attendancePercentage = ((parseInt(studentData.TotalPresent) / totalClasses) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 mb-6 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome, {studentData.FirstName}!</h1>
          <div className="inline-block bg-white text-indigo-600 rounded-lg p-4">
            <div className="text-sm">Current Attendance</div>
            <div className="text-3xl font-bold">{attendancePercentage}%</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-500 text-white rounded-lg p-6 shadow-lg">
          <div className="text-sm opacity-80">Present Days</div>
          <div className="text-3xl font-bold">{studentData.TotalPresent}</div>
        </div>

        <div className="bg-red-500 text-white rounded-lg p-6 shadow-lg">
          <div className="text-sm opacity-80">Absent Days</div>
          <div className="text-3xl font-bold">{studentData.TotalAbsenet}</div>
        </div>

        <div className="bg-blue-500 text-white rounded-lg p-6 shadow-lg">
          <div className="text-sm opacity-80">Total Classes</div>
          <div className="text-3xl font-bold">{totalClasses}</div>
        </div>

        <div className="bg-purple-500 text-white rounded-lg p-6 shadow-lg">
          <div className="text-sm opacity-80">Required Classes</div>
          <div className="text-3xl font-bold">14</div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Attendance Progress</h2>
        <div className="w-full h-4 bg-gray-200 rounded-full">
          <div 
            className={`h-4 rounded-full ${attendancePercentage >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${attendancePercentage}%` }}
          ></div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {attendancePercentage >= 75 ? 'Good standing' : 'Needs improvement'}
        </div>
      </div>

      {/* Student Details */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Student Information</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">ID:</span> {studentData.StudentID}</p>
            <p><span className="font-semibold">Name:</span> {studentData.FirstName} {studentData.LastName}</p>
            <p><span className="font-semibold">Class:</span> {studentData.Class}</p>
            <p><span className="font-semibold">Email:</span> {studentData.Email}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Parent Information</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">Father's Name:</span> {studentData.FatherName}</p>
            <p><span className="font-semibold">Mother's Name:</span> {studentData.MotherName}</p>
          </div>
        </div>
      </div>

      {/* Warning Card */}
      {attendancePercentage < 75 && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="h-5 w-5 text-red-500">⚠️</div>
            </div>
            <div className="ml-3">
              <h3 className="text-red-800 font-medium">Low Attendance Warning</h3>
              <p className="text-red-700 mt-1">Your attendance is below the required 75%.</p>
              <button
                onClick={() => setShowContactForm(true)}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Contact Teacher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Contact Teacher</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Regarding Low Attendance"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea 
                  className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your message here..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Improvement Tips</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-700">Set Reminders</h4>
            <p className="text-blue-600 mt-1">Enable notifications for classes</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-700">Track Progress</h4>
            <p className="text-green-600 mt-1">Monitor weekly attendance</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-700">Join Groups</h4>
            <p className="text-purple-600 mt-1">Connect with classmates</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendence;