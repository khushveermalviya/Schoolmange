import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { gql, useLazyQuery, useMutation } from '@apollo/client';

// GraphQL queries and mutations
const GET_STUDENTS = gql`
  query GetStudents($class: String!) {
    Studentdata(Class: $class) {
      StudentID
      FirstName
      LastName
      Class
    }
  }
`;

const SAVE_ATTENDANCE = gql`
  mutation SaveAttendance($class: String!, $date: String!, $username: String!, $records: [String!]!, $status: String!) {
    saveAttendance(
      Class: $class
      Date: $date
      Username: $username
      AttendanceRecords: $records
      Status: $status
    ) {
      AttendanceID
      StudentID
      Status
    }
  }
`;

// Attendance Verification Panel Component
const AttendanceVerificationPanel = ({ students, onStatusChange, onSave }) => {
  const presentStudents = students.filter(student => student.status === 'Present');
  const absentStudents = students.filter(student => student.status === 'Absent');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">Verify Today's Attendance</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Present Students */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-green-600 mb-3">
            Present Students ({presentStudents.length})
          </h3>
          <div className="space-y-2">
            {presentStudents.map(student => (
              <div 
                key={student.StudentID} 
                className="flex items-center justify-between p-2 bg-green-50 rounded"
              >
                <span>{student.FirstName} {student.LastName}</span>
                <button
                  onClick={() => onStatusChange(student.StudentID, 'Absent')}
                  className="text-sm px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  Mark Absent
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Absent Students */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-red-600 mb-3">
            Absent Students ({absentStudents.length})
          </h3>
          <div className="space-y-2">
            {absentStudents.map(student => (
              <div 
                key={student.StudentID} 
                className="flex items-center justify-between p-2 bg-red-50 rounded"
              >
                <span>{student.FirstName} {student.LastName}</span>
                <button
                  onClick={() => onStatusChange(student.StudentID, 'Present')}
                  className="text-sm px-2 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                >
                  Mark Present
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={onSave}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Finalize Attendance
        </button>
      </div>
    </div>
  );
};

// Today's Attendance List Component
const TodaysAttendanceList = ({ students }) => {
  const presentStudents = students.filter(student => student.status === 'Present');
  const absentStudents = students.filter(student => student.status === 'Absent');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">Today's Attendance List</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Present Students */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-green-600 mb-3">
            Present Students ({presentStudents.length})
          </h3>
          <ul className="space-y-2">
            {presentStudents.map(student => (
              <li key={student.StudentID} className="p-2 bg-green-50 rounded">
                {student.FirstName} {student.LastName}
              </li>
            ))}
          </ul>
        </div>

        {/* Absent Students */}
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-red-600 mb-3">
            Absent Students ({absentStudents.length})
          </h3>
          <ul className="space-y-2">
            {absentStudents.map(student => (
              <li key={student.StudentID} className="p-2 bg-red-50 rounded">
                {student.FirstName} {student.LastName}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Main Attendance Component
const Attendance = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [showVerificationPanel, setShowVerificationPanel] = useState(false);
  const [fetchStudents, { loading: fetchLoading, error: fetchError }] = useLazyQuery(GET_STUDENTS, {
    onCompleted: (data) => {
      // Initialize all students with 'null' status
      setStudents(data.Studentdata.map(student => ({
        ...student,
        status: null // Default status is null (not marked)
      })));
    }
  });

  const [saveAttendanceMutation, { loading: saveLoading, error: saveError }] = useMutation(SAVE_ATTENDANCE, {
    onCompleted: () => {
      alert('Attendance saved successfully!');
      setShowVerificationPanel(false); // Hide verification panel after saving
    },
    onError: (error) => {
      alert('Error saving attendance: ' + error.message);
    }
  });

  // Available classes
  const classes = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Class ${i + 1}`
  }));

  // Handle class selection
  const handleClassSelect = (classId) => {
    setSelectedClass(classId);
    setShowVerificationPanel(false);

    // Fetch students for the selected class
    fetchStudents({
      variables: {
        class: classId.toString()
      }
    });
  };

  // Mark attendance for a student
  const markAttendance = (studentId, status) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student.StudentID === studentId ? { ...student, status } : student
      )
    );
  };

  // Mark all students
  const markAllAttendance = (status) => {
    setStudents(prevStudents =>
      prevStudents.map(student => ({ ...student, status }))
    );
  };

  // Save attendance to database
  const saveAttendance = async () => {
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0) {
      alert("Today is a holiday (Sunday). Attendance cannot be marked.");
      return;
    }

    const markedStudents = students.filter(student => student.status);
    const username = 'CURRENT_USER'; // Replace with actual logged-in username
    const formattedDate = currentDate.toISOString().split('T')[0];

    try {
      await saveAttendanceMutation({
        variables: {
          class: selectedClass.toString(),
          date: formattedDate,
          username,
          records: markedStudents.map(student => student.StudentID),
          status: markedStudents[0]?.status || 'Unknown'
        }
      });
    } catch (error) {
      // Error handling is done in onError callback
    }
  };

  const error = fetchError || saveError;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Class Attendance Management</h1>

        {/* Class Selection */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {classes.map(cls => (
            <button
              key={cls.id}
              onClick={() => handleClassSelect(cls.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedClass === cls.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cls.name}
            </button>
          ))}
        </div>
      </div>

      {/* Attendance Table */}
      {selectedClass && (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main Attendance Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 flex-1">
            <h2 className="text-xl font-bold mb-4">Mark Attendance for Class {selectedClass}</h2>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Student Name</th>
                    <th className="py-2 px-4 border-b">Mark Present</th>
                    <th className="py-2 px-4 border-b">Mark Absent</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.StudentID}>
                      <td className="py-2 px-4 border-b">{student.FirstName} {student.LastName}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => markAttendance(student.StudentID, 'Present')}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            student.status === 'Present'
                              ? 'bg-green-500 text-white'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => markAttendance(student.StudentID, 'Absent')}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            student.status === 'Absent'
                              ? 'bg-red-500 text-white'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Verify Attendance Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowVerificationPanel(true)}
                className="px-6 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
              >
                Verify Attendance
              </button>
            </div>
          </div>

          {/* Today's Attendance List Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 flex-1">
            <TodaysAttendanceList students={students} />
          </div>
        </div>
      )}

      {/* Verification Panel */}
      {showVerificationPanel && (
        <AttendanceVerificationPanel
          students={students}
          onStatusChange={(studentId, newStatus) => markAttendance(studentId, newStatus)}
          onSave={saveAttendance}
        />
      )}
    </div>
  );
};

export default Attendance;