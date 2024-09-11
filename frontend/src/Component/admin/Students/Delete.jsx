import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function Delete() {
  const { studentid } = useParams();
  const [studentId, setStudentId] = useState('');
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const handleDelete = async (e) => {
    e.preventDefault();     
    try {
      // Ensure this is correctly set
      const response = await axios.delete(`https://backend-mauve-ten.vercel.app/delete/${studentId}`, {
          data: { reason: reason === 'Other' ? otherReason : reason }
      });
      
      console.log(`Requesting deletion for student ID: ${studentId}`);
      console.log('Server response:', response.data);
      alert('Student deleted successfully');
  } catch (error) {
      console.error('Error during deletion:', error);
      alert('An error occurred while deleting the student');
  }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Delete Student</h2>
        <form onSubmit={handleDelete} className="space-y-4">
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
              Student ID
            </label>
            <input
              type="text"
              id="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
              Reason for Deletion
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="">Select a reason</option>
              <option value="Graduated">Graduated</option>
              <option value="Transferred">Transferred</option>
              <option value="Dropped Out">Dropped Out</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {reason === 'Other' && (
            <div>
              <label htmlFor="otherReason" className="block text-sm font-medium text-gray-700">
                Please specify
              </label>
              <input
                type="text"
                id="otherReason"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
          )}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}