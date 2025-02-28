import React, { useEffect, useState } from 'react';
import { gql, useLazyQuery } from "@apollo/client";
import useUserStore from '../../app/useUserStore';
import { 
  DollarSign, 
  AlertCircle,
  CreditCard,
  Calendar,
  Download,
  FileText,
  BarChart4,
  Clock,
  Check,
  ChevronDown,
  User,
  UserPlus,
  BookOpen,
  Wallet,
  CreditCard as CardIcon,
  Landmark
} from 'lucide-react';

const FETCH_STUDENT_FEE = gql`
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

export default function Fees() {
  const user = useUserStore((state) => state.user);
  const [fetchFees, { data, error, loading }] = useLazyQuery(FETCH_STUDENT_FEE);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [emiMonths, setEmiMonths] = useState(3);

  useEffect(() => {
    fetchFees({
      variables: {
        studentId: user?.StudentID,
      },
    });
  }, [fetchFees, user?.StudentID]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-700 font-medium">Loading fee information...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200">
        <h3 className="flex items-center text-lg font-semibold text-red-700 mb-2">
          <AlertCircle className="w-5 h-5 mr-2" />
          Error Loading Data
        </h3>
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }

  if (!data?.StudentFeeById) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
        <p className="text-gray-500">No fee information available.</p>
      </div>
    );
  }

  const feeData = data.StudentFeeById;
  const balanceDue = feeData.TotalFee - feeData.AmountPaid;
  const paymentPercentage = Math.round((feeData.AmountPaid / feeData.TotalFee) * 100);
  
  const emiAmount = balanceDue > 0 ? Math.ceil(balanceDue / emiMonths) : 0;

  const handlePaymentOptionClick = (method) => {
    setSelectedPaymentMethod(method);
    setShowPaymentOptions(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-indigo-800 flex items-center">
          <Wallet className="w-8 h-8 mr-3 text-indigo-600" />
          Fee Management Dashboard
        </h1>
        
        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-indigo-100 mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-4 md:p-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <DollarSign className="w-6 h-6 mr-2" />
              Fee Statement
            </h2>
            <p className="text-indigo-100 mt-1">Academic Year 2024-2025</p>
          </div>
          
          <div className="p-4 md:p-6">
            {/* Student & Fee Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Student Info Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 shadow-sm">
                <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-indigo-600" />
                  Student Information
                </h3>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="w-1/3 text-sm text-gray-500">Student ID</div>
                    <div className="w-2/3 text-md font-medium text-gray-800">{feeData.StudentId}</div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-1/3 text-sm text-gray-500">Student Name</div>
                    <div className="w-2/3 text-md font-medium text-gray-800">{feeData.FirstName}</div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-1/3 text-sm text-gray-500">Father's Name</div>
                    <div className="w-2/3 text-md font-medium text-gray-800">{feeData.FatherName}</div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-1/3 text-sm text-gray-500">Class</div>
                    <div className="w-2/3 text-md font-medium">
                      <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full">
                        {feeData.Class}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Fee Info Card */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100 shadow-sm">
                <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                  <BarChart4 className="w-5 h-5 mr-2 text-purple-600" />
                  Fee Details
                </h3>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="w-1/3 text-sm text-gray-500">Fee Status</div>
                    <div className="w-2/3">
                      <span className={`text-md font-medium inline-block px-3 py-1 rounded-full ${
                        feeData.FeeStatus === 'Paid' ? 'bg-green-100 text-green-800' : 
                        feeData.FeeStatus === 'Partial' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {feeData.FeeStatus}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-1/3 text-sm text-gray-500">Amount Paid</div>
                    <div className="w-2/3 text-md font-medium text-green-600">₹{feeData.AmountPaid.toLocaleString()}</div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-1/3 text-sm text-gray-500">Total Fee</div>
                    <div className="w-2/3 text-md font-medium text-gray-800">₹{feeData.TotalFee.toLocaleString()}</div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-1/3 text-sm text-gray-500">Balance Due</div>
                    <div className="w-2/3 text-md font-bold text-red-600">
                      ₹{balanceDue.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Fee payment progress bar */}
            <div className="mt-8 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between mb-2">
                <p className="text-sm font-medium flex items-center">
                  <Check className="w-4 h-4 mr-1 text-blue-600" />
                  Payment Progress
                </p>
                <p className="text-sm font-medium text-blue-600">{paymentPercentage}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div 
                  className={`h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2 ${
                    paymentPercentage > 75 ? 'bg-green-500' : 
                    paymentPercentage > 40 ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${paymentPercentage}%` }}
                >
                  {paymentPercentage > 15 && (
                    <span className="text-xs font-bold text-white">{paymentPercentage}%</span>
                  )}
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>₹0</span>
                <span>₹{Math.round(feeData.TotalFee/2).toLocaleString()}</span>
                <span>₹{feeData.TotalFee.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Fee breakdown chart */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-medium mb-4 flex items-center text-gray-800">
                  <BarChart4 className="w-5 h-5 mr-2 text-indigo-600" />
                  Fee Breakdown
                </h3>
                <div className="h-64 flex items-end justify-center space-x-12 border-b border-l border-gray-200 pt-4">
                  <div className="flex flex-col items-center">
                    <div className="bg-gradient-to-t from-blue-600 to-indigo-400 w-24 rounded-t transition-all duration-500" style={{ height: `${paymentPercentage}%` }}></div>
                    <p className="mt-2 text-sm font-medium">Paid</p>
                    <p className="text-xs text-gray-500">₹{feeData.AmountPaid.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-gradient-to-t from-red-500 to-pink-300 w-24 rounded-t transition-all duration-500" style={{ height: `${100 - paymentPercentage}%` }}></div>
                    <p className="mt-2 text-sm font-medium">Remaining</p>
                    <p className="text-xs text-gray-500">₹{balanceDue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              {/* Payment Options Card */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100 shadow-sm">
                <h3 className="text-lg font-medium mb-4 flex items-center text-indigo-800">
                  <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
                  Payment Options
                </h3>
                
                {balanceDue > 0 ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <button 
                        onClick={() => setShowPaymentOptions(!showPaymentOptions)}
                        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-between transition duration-300"
                        disabled  // This button is disabled as requested
                      >
                        <span className="flex items-center">
                          <CreditCard className="w-4 h-4 mr-2" />
                          {selectedPaymentMethod || 'Select Payment Method'}
                        </span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      
                      {showPaymentOptions && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <div 
                            className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                            onClick={() => handlePaymentOptionClick('Credit/Debit Card')}
                          >
                            <CardIcon className="w-4 h-4 mr-2 text-blue-600" />
                            Credit/Debit Card
                          </div>
                          <div 
                            className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                            onClick={() => handlePaymentOptionClick('UPI Payment')}
                          >
                            <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                            UPI Payment
                          </div>
                          <div 
                            className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                            onClick={() => handlePaymentOptionClick('Net Banking')}
                          >
                            <Landmark className="w-4 h-4 mr-2 text-purple-600" />
                            Net Banking
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <button 
                      className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center transition duration-300"
                      disabled  // This button is disabled as requested
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Pay Full Amount (₹{balanceDue.toLocaleString()})
                    </button>
                    
                    <div className="bg-white p-3 rounded-lg border border-indigo-100">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium flex items-center text-indigo-800">
                          <Clock className="w-4 h-4 mr-1 text-indigo-600" />
                          0% EMI Option
                        </p>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-gray-500">Select months:</p>
                        <select 
                          className="text-xs border border-gray-300 rounded p-1"
                          value={emiMonths}
                          onChange={(e) => setEmiMonths(parseInt(e.target.value))}
                        >
                          <option value="3">3 Months</option>
                          <option value="6">6 Months</option>
                          <option value="9">9 Months</option>
                          <option value="12">12 Months</option>
                        </select>
                      </div>
                      <div className="text-xs text-gray-700 mb-2">
                        <div className="flex justify-between">
                          <span>Monthly amount:</span>
                          <span className="font-semibold">₹{emiAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total amount:</span>
                          <span className="font-semibold">₹{balanceDue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Interest:</span>
                          <span className="font-semibold text-green-600">0%</span>
                        </div>
                      </div>
                      <button 
                        className="w-full py-1.5 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm transition duration-300"
                        disabled  // This button is disabled as requested
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        Pay with EMI
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                    <Check className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <p className="text-green-800 font-medium">All fees have been paid</p>
                    <p className="text-xs text-green-600 mt-1">Thank you for your payment</p>
                  </div>
                )}
                
                <div className="mt-4">
                  <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center justify-center transition duration-300 text-sm">
                    <Download className="w-4 h-4 mr-2 text-indigo-600" />
                    Download Receipt
                  </button>
                </div>
              </div>
            </div>
            
            {/* Additional Information */}
            <div className="mt-8 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium mb-4 flex items-center text-gray-800">
                <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                Important Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-800 mb-1">Payment Deadline</h4>
                  <p className="text-blue-700">Please complete all payments by March 31, 2025</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                  <h4 className="font-medium text-purple-800 mb-1">Late Fee Policy</h4>
                  <p className="text-purple-700">2% additional charge on payments after deadline</p>
                </div>
                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                  <h4 className="font-medium text-indigo-800 mb-1">Contact Finance Office</h4>
                  <p className="text-indigo-700">For queries: finance@school.edu | +91 98765 43210</p>
                </div>
                <div className="bg-pink-50 p-3 rounded-lg border border-pink-100">
                  <h4 className="font-medium text-pink-800 mb-1">Scholarship Information</h4>
                  <p className="text-pink-700">Apply for scholarships before April 15, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}