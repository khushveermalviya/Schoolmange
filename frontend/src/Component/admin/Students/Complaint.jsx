import React, { useState } from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/client';

const FETCH_COMPLAINTS = gql`
  query StudentComplaint($Studentid: String!) {
    StudentComplaint(Studentid: $Studentid) {
      StudentID
      Complaint
      Class
    }
  }
`;

const ADD_COMPLAINT = gql`
  mutation AddComplaint($Studentid: String!, $Complaint: String!, $Class: String!) {
    addComplaint(Studentid: $Studentid, Complaint: $Complaint, Class: $Class) {
      StudentID
      Complaint
      Class
    }
  }
`;

export default function Complaint() {
  const [complaint, setComplaint] = useState('');
  const [studentId, setStudentId] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [fetchComplaint] = useLazyQuery(FETCH_COMPLAINTS, {
    variables: { Studentid: studentId },
    onCompleted: (data) => {
      setFiltered(data.StudentComplaint || []);
      setLoading(false);
    },
    onError: (error) => {
      setError('An error occurred while fetching student data.');
      setLoading(false);
      console.error(error);
    },
  });

  const [addComplaint] = useMutation(ADD_COMPLAINT, {
    onCompleted: () => {
      fetchComplaint();
    },
    onError: (error) => {
      setError('An error occurred while adding the complaint.');
      setLoading(false);
      console.error(error);
    },
  });

  const handleComplaintChange = (e) => {
    setComplaint(e.target.value);
  };

  const handleStudentIdChange = (e) => {
    setStudentId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    addComplaint({ variables: { Studentid: studentId, Complaint: complaint, Class: 'ClassName' } });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <div className="w-full max-w-lg p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Complaint Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
              Student ID
            </label>
            <input
              id="studentId"
              type="text"
              value={studentId}
              onChange={handleStudentIdChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your Student ID"
              required
            />
          </div>

          <div>
            <label htmlFor="complaint" className="block text-sm font-medium text-gray-700">
              Complaint
            </label>
            <textarea
              id="complaint"
              value={complaint}
              onChange={handleComplaintChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder="Describe your complaint"
              required
            ></textarea>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Submit Complaint
            </button>
          </div>
        </form>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {filtered.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold">Complaints</h3>
            <ul>
              {filtered.map((complaint, index) => (
                <li key={index} className="mt-2">
                  <p><strong>Student ID:</strong> {complaint.StudentID}</p>
                  <p><strong>Complaint:</strong> {complaint.Complaint}</p>
                  <p><strong>Class:</strong> {complaint.Class}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}