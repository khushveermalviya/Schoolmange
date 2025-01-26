import React, { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

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

// PDF Document Component
const AdmissionPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>ADMISSION CONFIRMATION</Text>
        <Text style={styles.schoolName}>{data.SchoolName}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>STUDENT DETAILS</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Student ID:</Text>
          <Text style={styles.value}>{data.StudentID}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Password:</Text>
          <Text style={styles.value}>{data.Password}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Full Name:</Text>
          <Text style={styles.value}>{`${data.FirstName} ${data.LastName}`}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date of Birth:</Text>
          <Text style={styles.value}>{new Date(data.dob).toLocaleDateString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Class:</Text>
          <Text style={styles.value}>{data.Class}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PARENT DETAILS</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Father's Name:</Text>
          <Text style={styles.value}>{data.FatherName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Mother's Name:</Text>
          <Text style={styles.value}>{data.MotherName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Contact:</Text>
          <Text style={styles.value}>{data.parentPhoneNumber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{data.Email}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ADDRESS & OTHER DETAILS</Text>
        <View style={styles.row}>
          <Text style={styles.value}>{data.address}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Caste:</Text>
          <Text style={styles.value}>{data.caste}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>This is an official admission document issued by {data.SchoolName}</Text>
        <Text>Generated on: {new Date().toLocaleDateString()}</Text>
      </View>
    </Page>
  </Document>
);

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

  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'FirstName':
      case 'LastName':
      case 'FatherName':  
      case 'MotherName':
        return /^[A-Za-z\s]{2,30}$/.test(value) ? '' : 'Only letters allowed (2-30 characters)';
      case 'phoneNumber':
      case 'parentPhoneNumber':
        return /^\d{10}$/.test(value) ? '' : 'Must be 10 digits';
      case 'Email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email format';
      case 'Class':
        return /^([1-9]|1[0-2])$/.test(value) ? '' : 'Enter class (1-12)';
      default:
        return value.trim() ? '' : `${name} is required`;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const [addStudent, { loading }] = useMutation(ADD_STUDENT, {
    onCompleted: () => {
      toast.success('Registration successful!');
      setRegistrationComplete(true);
    },
    onError: (error) => {
      toast.error(error.message || 'Registration failed');
    }
  });

  useEffect(() => {
    if (formData.FirstName && formData.dob) {
      const namePart = formData.FirstName.substring(0, 3).toUpperCase();
      const dobPart = new Date(formData.dob).getFullYear().toString();
      setFormData(prev => ({
        ...prev,
        StudentID: `${namePart}${dobPart}ABCD`,
        Password: `${formData.FirstName.toLowerCase()}${dobPart}ABCD`
      }));
    }
  }, [formData.FirstName, formData.dob]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) errors[key] = error;
    });

    // if (Object.keys(errors).length > 0) {
    //   setValidationErrors(errors);
    //   toast.error('Please correct the errors in the form');
    //   return;
    // }

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
      console.error('Submission error:', error);
    }
  };

  const inputClassName = (fieldName) => `
    w-full px-4 py-3 text-lg font-medium border rounded-lg
    ${validationErrors[fieldName] 
      ? 'border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:ring-blue-500'
    }
    focus:outline-none focus:ring-2 transition duration-200
  `;

  const labelClassName = "block text-xl font-semibold text-gray-700 mb-2";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-800">
            <h1 className="text-4xl font-bold text-white">Student Registration</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Generated Information Section */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Generated Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClassName}>Student ID</label>
                  <input
                    type="text"
                    value={formData.StudentID}
                    readOnly
                    className="w-full px-4 py-3 text-lg bg-gray-100 rounded-lg"
                  />
                </div>
                <div>
                  <label className={labelClassName}>Password</label>
                  <input
                    type="text"
                    value={formData.Password}
                    readOnly
                    className="w-full px-4 py-3 text-lg bg-gray-100 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClassName}>First Name</label>
                  <input
                    type="text"
                    name="FirstName"
                    value={formData.FirstName}
                    onChange={handleChange}
                    className={inputClassName('FirstName')}
                    placeholder="Enter first name"
                  />
                  {validationErrors.FirstName && (
                    <p className="mt-2 text-red-500">{validationErrors.FirstName}</p>
                  )}
                </div>

                <div>
                  <label className={labelClassName}>Last Name</label>
                  <input
                    type="text"
                    name="LastName"
                    value={formData.LastName}
                    onChange={handleChange}
                    className={inputClassName('LastName')}
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label className={labelClassName}>FatherName</label>
                  <input
                    type="text"
                    name="FatherName"
                    value={formData.FatherName}
                    onChange={handleChange}
                    className={inputClassName('FatherName')}
                    placeholder="Enter FatherName"
                  />
                </div>
                <div>
                  <label className={labelClassName}>MotherName</label>
                  <input
                    type="text"
                    name="MotherName"
                    value={formData.MotherName}
                    onChange={handleChange}
                    className={inputClassName('MotherName')}
                    placeholder="Enter MotherName"
                  />
                </div>

                {/* Add all other fields with similar styling */}
                {/* Date of Birth */}
                <div>
                  <label className={labelClassName}>Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className={inputClassName('dob')}
                  />
                </div>

                {/* Phone Numbers */}
                <div>
                  <label className={labelClassName}>Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={inputClassName('phoneNumber')}
                    placeholder="10-digit phone number"
                  />
                </div>

                <div>
                  <label className={labelClassName}>Parent Phone Number</label>
                  <input
                    type="tel"
                    name="parentPhoneNumber"
                    value={formData.parentPhoneNumber}
                    onChange={handleChange}
                    className={inputClassName('parentPhoneNumber')}
                    placeholder="10-digit phone number"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className={labelClassName}>Email</label>
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    className={inputClassName('Email')}
                    placeholder="Enter email address"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className={labelClassName}>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={inputClassName('address')}
                    rows="3"
                    placeholder="Enter full address"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className={labelClassName}>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={inputClassName('gender')}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Class */}
                <div>
                  <label className={labelClassName}>Class</label>
                  <input
                    type="text"
                    name="Class"
                    value={formData.Class}
                    onChange={handleChange}
                    className={inputClassName('Class')}
                    placeholder="Enter class (1-12)"
                  />
                </div>

                {/* School Name */}
                <div>
                  <label className={labelClassName}>School Name</label>
                  <input
                    type="text"
                    name="SchoolName"
                    value={formData.SchoolName}
                    onChange={handleChange}
                    className={inputClassName('SchoolName')}
                    placeholder="Enter school name"
                  />
                </div>

                {/* Previous Class */}
                <div>
                  <label className={labelClassName}>Previous Class</label>
                  <input
                    type="text"
                    name="previousClass"
                    value={formData.previousClass}
                    onChange={handleChange}
                    className={inputClassName('previousClass')}
                    placeholder="Enter previous class"
                  />
                </div>

                {/* Caste */}
                <div>
                  <label className={labelClassName}>Caste</label>
                  <input
                    type="text"
                    name="caste"
                    value={formData.caste}
                    onChange={handleChange}
                    className={inputClassName('caste')}
                    placeholder="Enter caste"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 text-xl font-bold text-white bg-blue-600 rounded-xl
                         hover:bg-blue-700 transform hover:scale-105 transition-all duration-200
                         disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Submit Registration'}
              </button>
              
              {registrationComplete && (
                <PDFDownloadLink
                  document={<AdmissionPDF data={formData} />}
                  fileName={`admission_form_${formData.StudentID}.pdf`}
                  className="px-8 py-4 text-xl font-bold text-white bg-green-600 rounded-xl
                           hover:bg-green-700 transform hover:scale-105 transition-all duration-200"
                >
                  {({ loading }) => (
                    <span className="flex items-center">
                      <svg 
                        className="w-6 h-6 mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                        />
                      </svg>
                      {loading ? 'Generating PDF...' : 'Download Admission Form'}
                    </span>
                  )}
                </PDFDownloadLink>
              )}
            </div>
          </form>
        </div>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff'
  },
  header: {
    marginBottom: 30,
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a365d'
  },
  schoolName: {
    fontSize: 18,
    marginBottom: 20,
    color: '#2d3748'
  },
  section: {
    marginBottom: 25,
    borderBottom: '1 solid #e2e8f0',
    paddingBottom: 10
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2d3748',
    backgroundColor: '#f7fafc',
    padding: 8
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    padding: '4 0'
  },
  label: {
    width: '35%',
    fontWeight: 'bold',
    color: '#4a5568'
  },
  value: {
    width: '65%',
    color: '#1a202c'
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    color: '#718096',
    fontSize: 10,
    borderTop: '1 solid #e2e8f0',
    paddingTop: 20
  }
});

export default AddStudent;