import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Users,
  BookOpen,
  Building,
  ArrowDown,
} from 'lucide-react';

// GraphQL Queries and Mutations
const GET_STUDENT_BY_ID = gql`
  query StudentDetail($StudentID: String!) {
    StudentDetail(StudentID: $StudentID) {
      StudentID
      FirstName
      LastName
      Password
      FatherName
      MotherName
      dob
      phoneNumber
      parentPhoneNumber
      Email
      address
      gender
      caste
      Class
      SchoolName
      previousClass
    }
  }
`;

const UPDATE_STUDENT = gql`
  mutation updateStudentMutation($input: StudentInput!) {
    updateStudentMutation(input: $input) {
      StudentID
      FirstName
      LastName
      Password
      FatherName
      MotherName
      dob
      phoneNumber
      parentPhoneNumber
      Email
      address
      gender
      caste
      Class
      SchoolName
      previousClass
    }
  }
`;

// Main Component
const EditStudent = () => {
  const { studentId } = useParams(); // Get the student ID from the URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  // Fetch student data
  const { loading, data, error } = useQuery(GET_STUDENT_BY_ID, {
    variables: { StudentID: studentId },
    fetchPolicy: 'network-only',
  });

  // Mutation to update student
  const [updateStudent, { loading: mutationLoading }] = useMutation(UPDATE_STUDENT, {
    onCompleted: () => {
      toast.success('Student updated successfully!');
     
    },
    onError: (error) => {
      toast.error(`Update failed: ${error.message}`);
    },
  });

  // Initialize form data when the student data is fetched
  useEffect(() => {
    if (data?.StudentDetail) {
      setFormData(data.StudentDetail);
    }
  }, [data]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare the input object for the mutation
      const { __typename, ...cleanedFormData } = formData; // Remove __typename

      const input = {
        ...cleanedFormData,
        StudentID: studentId, // Ensure the original StudentID is used
        Class: parseInt(cleanedFormData.Class || '0', 10), // Convert Class to integer
        dob: cleanedFormData.dob || null, // Handle empty date of birth
      };

      // Call the mutation
      await updateStudent({
        variables: { input },
      });
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Failed to update student');
    }
  };

  // Render loading state
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading student data</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <User size={20} className="text-indigo-500" />
        Edit Student
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Student ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <BookOpen size={18} className="text-indigo-500" />
            Student ID
          </label>
          <div className="relative">
            <input
              type="text"
              name="StudentID"
              value={formData.StudentID || ''}
              readOnly
              className="w-full p-2.5 border rounded-lg text-gray-700 bg-gray-100 cursor-not-allowed pr-10"
            />
          </div>
        </div>

        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <User size={18} className="text-indigo-500" />
            First Name
          </label>
          <div className="relative">
            <input
              type="text"
              name="FirstName"
              value={formData.FirstName || ''}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <User size={18} className="text-indigo-500" />
            Last Name
          </label>
          <div className="relative">
            <input
              type="text"
              name="LastName"
              value={formData.LastName || ''}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
              required
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar size={18} className="text-indigo-500" />
            Date of Birth
          </label>
          <div className="relative">
            <input
              type="date"
              name="dob"
              value={formData.dob || ''}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <Users size={18} className="text-indigo-500" />
            Gender
          </label>
          <div className="relative">
            <select
              name="gender"
              value={formData.gender || ''}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Class */}
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <BookOpen size={18} className="text-indigo-500" />
            Class
          </label>
          <div className="relative">
            <input
              type="text"
              name="Class"
              value={formData.Class || ''}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <Phone size={18} className="text-indigo-500" />
            Phone Number
          </label>
          <div className="relative">
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <Mail size={18} className="text-indigo-500" />
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              name="Email"
              value={formData.Email || ''}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin size={18} className="text-indigo-500" />
            Address
          </label>
          <div className="relative">
            <textarea
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              rows="3"
              className="w-full p-2.5 border rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={mutationLoading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
        >
          {mutationLoading ? (
            <>
              <ArrowDown size={18} className="animate-bounce" />
              Updating...
            </>
          ) : (
            'Update Student'
          )}
        </button>
      </form>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default EditStudent;