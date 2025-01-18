import { gql, useMutation } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ADD_STUDENT = gql`
  mutation addStudentMutation($input: StudentInput!) {
    addStudentMutation(input: $input) {
      StudentID
      Password
      FirstName
      LastName
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

const SCHOOL_CODE = "ABCD";

const AddStudent = () => {
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    FatherName: '',
    MotherName: '',
    dob: '',
    phoneNumber: '',
    parentPhoneNumber: '',
    Email: '',
    address: '',
    gender: '',
    caste: '',
    Class: '',
    SchoolName: '',
    previousClass: '',
    StudentID: '',
    Password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      FirstName: '',
      LastName: '',
      FatherName: '',
      MotherName: '',
      dob: '',
      phoneNumber: '',
      parentPhoneNumber: '',
      Email: '',
      address: '',
      gender: '',
      caste: '',
      Class: '',
      SchoolName: '',
      previousClass: '',
      StudentID: '',
      Password: ''
    });
  };

  useEffect(() => {
    if (formData.FirstName && formData.dob) {
      const namePart = formData.FirstName.substring(0, 3).toUpperCase();
      const dobPart = new Date(formData.dob).getFullYear().toString();
      const studentId = `${namePart}${dobPart}${SCHOOL_CODE}`;
      const password = `${formData.FirstName.toLowerCase()}${dobPart}${SCHOOL_CODE}`;

      setFormData(prevData => ({
        ...prevData,
        StudentID: studentId,
        Password: password
      }));
    }
  }, [formData.FirstName, formData.dob]);

  const [validationErrors, setValidationErrors] = useState({});

  const [addStudent, { loading }] = useMutation(ADD_STUDENT, {
    onCompleted: (data) => {
      toast.success('Student registered successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      resetForm();
    },
    onError: (error) => {
      console.error('Registration error:', error);
      
      // Extract the error message
      const errorMessage = error.message?.includes('Student ID already in use') || error.message?.includes('Email already registered') || error.message?.includes('Student with same name and father\'s name exists')
        ? error.message
        : 'Failed to register student. Please try again.';
  
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  });
  
  // Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate form data
    const errors = {};
    if (!formData.FirstName) errors.FirstName = 'First Name is required';
    if (!formData.LastName) errors.LastName = 'Last Name is required';
    if (!formData.dob) errors.dob = 'Date of Birth is required';
    if (!formData.phoneNumber) errors.phoneNumber = 'Phone Number is required';
    if (!formData.parentPhoneNumber) errors.parentPhoneNumber = 'Parent Phone Number is required';
    if (!formData.Email) errors.Email = 'Email is required';
    if (!formData.address) errors.address = 'Address is required';
    if (!formData.gender) errors.gender = 'Gender is required';
    if (!formData.caste) errors.caste = 'Caste is required';
    if (!formData.Class) errors.Class = 'Class is required';
    if (!formData.SchoolName) errors.SchoolName = 'School Name is required';
    if (!formData.previousClass) errors.previousClass = 'Previous Class is required';
  
    setValidationErrors(errors);
  
    if (Object.keys(errors).length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }
  
    try {
      await addStudent({ 
        variables: { 
          input: {
            ...formData,
            dob: new Date(formData.dob).toISOString().split('T')[0]
          } 
        } 
      });
    } catch (error) {
      // Apollo will handle this error through onError callback
      console.error('Submission error:', error);
    }
  };

  const renderGeneratedFields = () => (
    <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800">Generated Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Student ID</label>
          <input
            type="text"
            name="StudentID"
            value={formData.StudentID}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="text"
            name="Password"
            value={formData.Password}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:ring-blue-500 focus:border-blue-500 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );

  const inputClasses = (fieldName) => `
    mt-1 block w-full rounded-md shadow-sm 
    ${validationErrors[fieldName] 
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
    }
    transition duration-150 ease-in-out
  `;

  return (
    <div>
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
            <h1 className="text-2xl font-bold text-white">Student Registration</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {renderGeneratedFields()}

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="FirstName"
                    value={formData.FirstName}
                    onChange={handleChange}
                    className={inputClasses('FirstName')}
                    required
                  />
                  {validationErrors.FirstName && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.FirstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="LastName"
                    value={formData.LastName}
                    onChange={handleChange}
                    className={inputClasses('LastName')}
                    required
                  />
                  {validationErrors.LastName && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.LastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className={inputClasses('dob')}
                    required
                  />
                  {validationErrors.dob && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.dob}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Father's Name</label>
                  <input
                    type="text"
                    name="FatherName"
                    value={formData.FatherName}
                    onChange={handleChange}
                    className={inputClasses('FatherName')}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Mother's Name</label>
                  <input
                    type="text"
                    name="MotherName"
                    value={formData.MotherName}
                    onChange={handleChange}
                    className={inputClasses('MotherName')}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={inputClasses('phoneNumber')}
                    required
                  />
                  {validationErrors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Parent Phone Number</label>
                  <input
                    type="tel"
                    name="parentPhoneNumber"
                    value={formData.parentPhoneNumber}
                    onChange={handleChange}
                    className={inputClasses('parentPhoneNumber')}
                    required
                  />
                  {validationErrors.parentPhoneNumber && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.parentPhoneNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    className={inputClasses('Email')}
                    required
                  />
                  {validationErrors.Email && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.Email}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={inputClasses('address')}
                    required
                    rows="3"
                  />
                  {validationErrors.address && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={inputClasses('gender')}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {validationErrors.gender && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.gender}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Caste</label>
                  <input
                    type="text"
                    name="caste"
                    value={formData.caste}
                    onChange={handleChange}
                    className={inputClasses('caste')}
                    required
                  />
                  {validationErrors.caste && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.caste}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Class</label>
                  <input
                    type="text"
                    name="Class"
                    value={formData.Class}
                    onChange={handleChange}
                    className={inputClasses('Class')}
                    required
                  />
                  {validationErrors.Class && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.Class}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">School Name</label>
                  <input
                    type="text"
                    name="SchoolName"
                    value={formData.SchoolName}
                    onChange={handleChange}
                    className={inputClasses('SchoolName')}
                    required
                  />
                  {validationErrors.SchoolName && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.SchoolName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Previous Class</label>
                  <input
                    type="text"
                    name="previousClass"
                    value={formData.previousClass}
                    onChange={handleChange}
                    className={inputClasses('previousClass')}
                    required
                  />
                  {validationErrors.previousClass && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.previousClass}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`
                  px-6 py-2 rounded-md text-white font-semibold
                  transform transition-all duration-150
                  ${loading 
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
                  }
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  shadow-md hover:shadow `}
                >
                  <span className="flex items-center">
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Submit Registration
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
 </div>
  );
};

export default AddStudent;