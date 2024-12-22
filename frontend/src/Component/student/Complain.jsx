import React, { useEffect, useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import useUserStore from '../../app/useUserStore.js'; // Import the Zustand store

const GET_STUDENT_DATA = gql`
  query GetStudentDetails {
    getStudentDetails {
      FirstName
      LastName
      
    }
  }
`;

export default function Complain() {
  const [studentData, setStudentData] = useState(null);
  const [fetchStudentData, { data, loading, error }] = useLazyQuery(GET_STUDENT_DATA);
  const user = useUserStore((state) => state.user); // Get the user state from the Zustand store

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // Set the token in the request headers
      fetchStudentData();
    }
  }, [fetchStudentData]);

  useEffect(() => {
    if (data?.getStudentDetails) {
      setStudentData(data.getStudentDetails);
    }
  }, [data]);

  if (loading) return <p>Loading student data...</p>;
  if (error) return <p>Error fetching student data: {error.message}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Complain</h1>
      {studentData ? (
        <div>
          <p><strong>Student Name:</strong> {studentData.FirstName} {studentData.LastName}</p>
          <p><strong>Father's Name:</strong> {studentData.FatherName}</p>
          <p><strong>Bio:</strong> {studentData.Bio || 'No bio available'}</p>
        </div>
      ) : (
        <p>No student data available.</p>
      )}
    </div>
  );
}