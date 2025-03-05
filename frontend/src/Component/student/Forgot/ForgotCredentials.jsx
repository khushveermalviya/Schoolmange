import React, { useState } from 'react';
import { User, Phone, KeyRound, MessageCircle, Shield } from 'lucide-react';

const ForgotCredentials = () => {
  const [activeTab, setActiveTab] = useState('forgotPass');
  const [studentId, setStudentId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Dummy data (to be replaced with backend integration)
  const dummyStudentData = {
    '12345': {
      name: 'John Doe',
      mobileNumber: '9876543210'
    }
  };

  const handleForgotPassword = () => {
    // Dummy validation (replace with actual backend logic)
    if (studentId in dummyStudentData) {
      const student = dummyStudentData[studentId];
      setSuccess(`OTP sent to ${student.mobileNumber}`);
      // In real scenario, trigger OTP generation and sending
    } else {
      setError('Invalid Student ID');
    }
  };

  const handleRetrieveStudentId = () => {
    // Dummy validation (replace with actual backend logic)
    if (mobileNumber === '9876543210') {
      setSuccess('Student ID: 12345');
    } else {
      setError('Mobile number not found');
    }
  };

  const handlePasswordReset = () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setSuccess('Password reset successful');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        {/* Tabs */}
        <div className="flex mb-6 border-b">
          <button 
            onClick={() => setActiveTab('forgotPass')}
            className={`flex-1 py-2 ${activeTab === 'forgotPass' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          >
            Forgot Password
          </button>
          <button 
            onClick={() => setActiveTab('forgotId')}
            className={`flex-1 py-2 ${activeTab === 'forgotId' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          >
            Forgot Student ID
          </button>
        </div>

        {/* Forgot Password Tab */}
        {activeTab === 'forgotPass' && (
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Enter Student ID" 
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button 
              onClick={handleForgotPassword}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
            >
              <KeyRound className="mr-2" /> Get OTP
            </button>

            {/* OTP Section */}
            <div className="relative mt-4">
              <MessageCircle className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Enter OTP" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* New Password Section */}
            <div className="space-y-4">
              <div className="relative">
                <Shield className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="password" 
                  placeholder="New Password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="relative">
                <Shield className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="password" 
                  placeholder="Confirm Password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button 
                onClick={handlePasswordReset}
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
              >
                Reset Password
              </button>
            </div>
          </div>
        )}

        {/* Forgot Student ID Tab */}
        {activeTab === 'forgotId' && (
          <div className="space-y-4">
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Enter Mobile Number" 
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button 
              onClick={handleRetrieveStudentId}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
            >
              <User className="mr-2" /> Retrieve Student ID
            </button>
          </div>
        )}

        {/* Error and Success Messages */}
        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotCredentials;