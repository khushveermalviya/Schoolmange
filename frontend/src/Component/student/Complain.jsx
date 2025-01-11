import React, { useEffect, useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import useUserStore from '../../app/useUserStore.jsx';

const GET_STUDENT_DATA = gql`
  query GetStudentComplaint($Studentid: String!) {
    StudentComplaint(Studentid: $Studentid) {
      Studentid
      Complaint
      Class
    }
  }
`;

export default function Complain() {
  const [studentData, setStudentData] = useState(null);
  const [fetchStudentData, { data, loading, error }] = useLazyQuery(GET_STUDENT_DATA);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && user?.StudentID) {
      fetchStudentData({ 
        variables: { 
          Studentid: user.StudentID 
        }
      });
    }
  }, [fetchStudentData, user]);

  useEffect(() => {
    if (data?.StudentComplaint) {
      setStudentData(data.StudentComplaint);
    }
  }, [data]);

  if (loading) return <p>Loading student data...</p>;
  if (error) {
    console.error('GraphQL Error:', error);
    return <p>Error fetching student data: {error.message}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Complaints</h1>
      {studentData && studentData.length > 0 ? (
        <div className="space-y-4">
          {studentData.map((complaint, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <p><strong>Student ID:</strong> {complaint.Studentid}</p>
              <p><strong>Complaint:</strong> {complaint.Complaint}</p>
              {complaint.Class && <p><strong>Class:</strong> {complaint.Class}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p>No complaints found.</p>
      )}
    </div>
  );
}