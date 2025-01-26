import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Filter, 
  X,
  Eye 
} from 'lucide-react';

// GraphQL Query
const GET_STUDENT_FEES = gql`
  query StudentFees($class: Int!) {
    StudentFees(class: $class) {
      StudentId
      FirstName
      FatherName
      FeeStatus
      AmountPaid
      TotalFee
      Class
    }
  }
`;

const Classlist = () => {
  const navigate = useNavigate();
  const { classNumber } = useParams();
  const parsedClassNumber = parseInt(classNumber, 10);

  const [filters, setFilters] = useState({
    paid: true,
    pending: true,
    overdue: true
  });

  const { loading, error, data, refetch } = useQuery(GET_STUDENT_FEES, {
    variables: { class: parsedClassNumber },
    onError: (error) => {
      console.error('GraphQL Error:', error);
    }
  });

  const toggleFilter = (filterType) => {
    setFilters(prev => ({ ...prev, [filterType]: !prev[filterType] }));
  };

  const navigateToStudentFeeDetails = (studentId) => {
    navigate(`detail/${studentId}`);
  };

  const filteredStudents = data?.StudentFees?.filter(student => {
    if (filters.paid && student.FeeStatus === 'Paid') return true;
    if (filters.pending && student.FeeStatus === 'Pending') return true;
    if (filters.overdue && student.FeeStatus === 'Overdue') return true;
    return false;
  }) || [];

  const getStatusIcon = (status) => {
    const icons = {
      'Paid': <CheckCircle2 className="text-green-500" />,
      'Pending': <Clock className="text-yellow-500" />,
      'Overdue': <AlertCircle className="text-red-500" />
    };
    return icons[status] || null;
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin">
        <Clock className="h-12 w-12 text-blue-500" />
      </div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen p-6 bg-red-50">
      <X className="h-16 w-16 text-red-600 mb-4" />
      <h2 className="text-2xl font-bold text-red-700 mb-2">Error Fetching Data</h2>
      <p className="text-red-500 text-center">{error.message}</p>
      <button 
        onClick={() => refetch()} 
        className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex items-center mb-6">
        <Filter className="mr-3 text-gray-600" />
        <div className="flex flex-wrap gap-4">
          {['paid', 'pending', 'overdue'].map(status => (
            <button 
              key={status}
              onClick={() => toggleFilter(status)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                filters[status] 
                  ? getStatusColorClass(status, true) 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {getStatusIcon(capitalizeFirstLetter(status))}
              {capitalizeFirstLetter(status)} Students (
                {data?.StudentFees?.filter(s => s.FeeStatus.toLowerCase() === status).length || 0}
              )
            </button>
          ))}
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-md">
          <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-600 text-xl">No students match the current filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map(student => (
            <div 
              key={student.StudentId}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    {student.FirstName} {student.FatherName}
                    {getStatusIcon(student.FeeStatus)}
                  </h3>
                  <p className="text-gray-600">Class {student.Class}</p>
                </div>
                <p className={`text-lg font-bold ${getStatusColorClass(student.FeeStatus.toLowerCase())}`}>
                  {student.FeeStatus}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-semibold">₹{student.AmountPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Fee:</span>
                  <span className="font-semibold">₹{student.TotalFee.toLocaleString()}</span>
                </div>
              </div>
              {student.FeeStatus !== 'Paid' && (
                <div className="mt-3 bg-red-50 p-3 rounded-lg text-red-700 flex justify-between items-center">
                  <span>Due Amount: ₹{(student.TotalFee - student.AmountPaid).toLocaleString()}</span>
                </div>
              )}
              <div className="mt-3 flex justify-between items-center">
                <button 
                  onClick={() => navigateToStudentFeeDetails(student.StudentId)}
                  className="flex items-center bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600"
                >
                  <Eye className="mr-2" size={16} /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Utility functions
const getStatusColorClass = (status, isButton = false) => {
  const baseClasses = {
    paid: isButton ? 'bg-green-500 text-white' : 'text-green-600',
    pending: isButton ? 'bg-yellow-500 text-white' : 'text-yellow-600',
    overdue: isButton ? 'bg-red-500 text-white' : 'text-red-600'
  };
  return baseClasses[status] || '';
};

const capitalizeFirstLetter = (string) => 
  string.charAt(0).toUpperCase() + string.slice(1);

export default Classlist;