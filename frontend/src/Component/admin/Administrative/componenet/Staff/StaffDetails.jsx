import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Define the GraphQL query for fetching staff by ID
const GET_STAFF_BY_ID = gql`
  query GetStaffById($id: ID!) {
    GetStaffById(id: $id) {
      id
      firstName
      lastName
      email
      phone
      department
      role
      status
      joiningDate
      createdAt
      updatedAt
    }
  }
`;

export default function StaffDetails() {
  const { id } = useParams(); // Get staff ID from URL
  console.log('Staff ID:', id); // Debug: Log the ID

  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data, error: queryError } = useQuery(GET_STAFF_BY_ID, {
    variables: { id },
    onCompleted: (data) => {
      if (!data.GetStaffById) {
        setError('Staff not found.');
      } else {
        setStaff(data.GetStaffById);
      }
      setLoading(false);
    },
    onError: (error) => {
      console.error('GraphQL Error:', error); // Debug: Log the full error
      setError('An error occurred while fetching staff details.');
      setLoading(false);
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="mt-2 text-gray-600">Loading staff details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Staff Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <img
            src="https://via.placeholder.com/150" // Placeholder image
            alt={`${staff.firstName} ${staff.lastName}`}
            className="w-32 h-32 rounded-full object-cover"
          />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {staff.firstName} {staff.lastName}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{staff.role}</p>
        </div>
        <div className="space-y-4">
          <p><strong>Department:</strong> {staff.department}</p>
          <p><strong>Email:</strong> {staff.email}</p>
          <p><strong>Phone:</strong> {staff.phone}</p>
          <p><strong>Status:</strong> {staff.status}</p>
          <p><strong>Joining Date:</strong> {new Date(staff.joiningDate).toLocaleDateString()}</p>
          <p><strong>Created At:</strong> {new Date(staff.createdAt).toLocaleDateString()}</p>
          <p><strong>Updated At:</strong> {new Date(staff.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}