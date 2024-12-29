import React, { useState, useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

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
  const { studentId } = useParams(); // Extract studentId from the URL
  const [student, setStudent] = useState(null);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (!student) {
    return <div>No student data found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Student Details</h1>
    <div className="flex flex-col md:flex-row items-center md:items-start bg-white shadow-md rounded-lg p-4">
      <div className="w-32 h-32 md:w-48 md:h-48 mb-4 md:mb-0">
        <div className="bg-gray-200 w-full h-full rounded-full flex items-center justify-center">
          <span className="text-gray-600">No Photo</span>
        </div>
      </div>
      <div className="md:ml-6 flex-1">
        <p className="text-lg"><strong>Name:</strong> {student.FirstName} {student.LastName}</p>
        <p className="text-lg"><strong>Father's Name:</strong> {student.FatherName}</p>
        <p className="text-lg"><strong>Mother's Name:</strong> {student.MotherName}</p>
        <p className="text-lg"><strong>Class:</strong> {student.Class}</p>
        <p className="text-lg"><strong>Email:</strong> {student.Email}</p>
        <p className="text-lg"><strong>Total Present:</strong> {student.TotalPresent}</p>
        <p className="text-lg"><strong>Total Absent:</strong> {student.TotalAbsent}</p>
      </div>
    </div>
    <div className="flex flex-col md:flex-row justify-between mt-4">
      <button
        onClick={() => alert('Add Attendance')}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2 md:mb-0 md:mr-2"
      >
        Add Attendance
      </button>
      <button
        onClick={() => alert('Add Result')}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Add Result
      </button>
    </div>
  </div>
  );
}