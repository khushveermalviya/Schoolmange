import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { FileText, ArrowLeft } from 'lucide-react';

// GraphQL query to fetch student fee details by studentId
const GET_STUDENT_FEE_DETAILS = gql`
  query StudentFeeById($studentId: String!) {
    StudentFeeById(studentId: $studentId) {
      StudentId
      FirstName
      FatherName
      Class
      FeeStatus
      AmountPaid
      TotalFee
    }
  }
`;

const StudentFeeDetails = () => {
  const navigate = useNavigate();
  const { studentId } = useParams(); // Get studentId from URL params

  // Fetch student fee details using the studentId
  const { loading, error, data } = useQuery(GET_STUDENT_FEE_DETAILS, {
    variables: { studentId },
  });

  // Handle loading and error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const student = data.StudentFeeById; // Extract student data
  const remainingBalance = student.TotalFee - student.AmountPaid; // Calculate remaining balance

  // Function to generate a printable receipt
  const generateReceipt = () => {
    const receiptWindow = window.open('', 'Receipt', 'width=600,height=800');
    receiptWindow.document.write(`
      <html>
        <head>
          <title>Fee Receipt - ${student.FirstName}</title>
          <style>
            body { font-family: Arial; max-width: 500px; margin: 0 auto; padding: 20px; }
            h1 { text-align: center; }
            .receipt-details { border: 1px solid #ddd; padding: 15px; }
          </style>
        </head>
        <body>
          <h1>Fee Receipt</h1>
          <div class="receipt-details">
            <p><strong>Student Name:</strong> ${student.FirstName}</p>
            <p><strong>Father's Name:</strong> ${student.FatherName}</p>
            <p><strong>Class:</strong> ${student.Class}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Total Fee:</strong> ₹${student.TotalFee.toLocaleString()}</p>
            <p><strong>Amount Paid:</strong> ₹${student.AmountPaid.toLocaleString()}</p>
            <p><strong>Remaining Balance:</strong> ₹${remainingBalance.toLocaleString()}</p>
            <p><strong>Fee Status:</strong> ${student.FeeStatus}</p>
          </div>
        </body>
      </html>
    `);
    receiptWindow.document.close();
    receiptWindow.print();
  };

  return (
    <div className="container mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="mr-2" /> Back to Class List
      </button>

      {/* Student Details Card */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">{student.FirstName}</h2>
            <p className="text-gray-600">Class {student.Class} | Father: {student.FatherName}</p>
          </div>
          <div className={`font-bold ${
            student.FeeStatus === 'Paid' ? 'text-green-600' : 
            student.FeeStatus === 'Pending' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {student.FeeStatus}
          </div>
        </div>

        {/* Fee Details Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Fee Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-gray-600">Total Fee</p>
              <p className="font-bold">₹{student.TotalFee.toLocaleString()}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-gray-600">Amount Paid</p>
              <p className="font-bold">₹{student.AmountPaid.toLocaleString()}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg col-span-2">
              <p className="text-gray-600">Remaining Balance</p>
              <p className="font-bold text-red-600">₹{remainingBalance.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Generate Receipt Button */}
        <div className="flex justify-end">
          <button
            onClick={generateReceipt}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            <FileText className="mr-2" /> Generate Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentFeeDetails;