import React, { useState } from 'react';
import { Check, X, Calendar } from 'lucide-react';
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

const Attendance = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [students, setStudents] = useState([]);

  // Apollo hooks
  const [fetchStudents, { loading: fetchLoading, error: fetchError }] = useLazyQuery(GET_STUDENTS, {
    onCompleted: (data) => {
      setStudents(data.Studentdata.map(student => ({
        ...student,
        status: null
      })));
    }
  });

  const [saveAttendanceMutation, { loading: saveLoading, error: saveError }] = useMutation(SAVE_ATTENDANCE, {
    onCompleted: () => {
      alert('Attendance saved successfully!');
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
    const markedStudents = students.filter(student => student.status);
    const username = 'CURRENT_USER'; // Replace with actual logged-in username

    try {
      await saveAttendanceMutation({
        variables: {
          class: selectedClass.toString(),
          date: selectedDate.toISOString().split('T')[0],
          username,
          records: markedStudents.map(student => student.StudentID),
          status: markedStudents[0].status // Assuming all selected students have same status
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
        
        {/* Date Selection */}
        <div className="flex items-center gap-4 mb-4">
          <Calendar className="w-5 h-5 text-gray-500" />
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="border rounded-lg px-3 py-2"
          />
        </div>

        {/* Class Selection */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => handleClassSelect(cls.id)}
              className={`p-4 rounded-lg border-2 transition-colors ${
                selectedClass === cls.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <span className="font-medium">{cls.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error.message}</p>
        </div>
      )}

      {/* Attendance Marking Section */}
      {selectedClass && students.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Quick Actions */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Mark Attendance</h2>
            <div className="flex gap-2">
              <button
                onClick={() => markAllAttendance('Present')}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
              >
                All Present
              </button>
              <button
                onClick={() => markAllAttendance('Absent')}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                All Absent
              </button>
              <button
                onClick={() => markAllAttendance('Holiday')}
                className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
              >
                Mark Holiday
              </button>
            </div>
          </div>

          {/* Student List */}
          <div className="space-y-4">
            {students.map((student) => (
              <div
                key={student.StudentID}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <span className="font-medium">{student.FirstName} {student.LastName}</span>
                  <span className="text-sm text-gray-500 ml-2">({student.StudentID})</span>
                </div>
                
                <div className="flex gap-2">
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
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={saveAttendance}
              disabled={saveLoading}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saveLoading ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;