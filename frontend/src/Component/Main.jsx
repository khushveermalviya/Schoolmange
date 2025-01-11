import React, { useState, useEffect } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, UserCircle2, Key, AlertCircle } from 'lucide-react';
import MainNav from "./MainNav.jsx";
import useUserStore from '../app/useUserStore.jsx';

const LOGIN_QUERY = gql`
  query StudentLogin($StudentID: String!, $Password: String!) {
    studentLogin(StudentID: $StudentID, Password: $Password) {
      StudentID
      FirstName
      LastName
      token
      WeeklyPerformance
    }
  }
`;

export default function Main() {
  const [data, setData] = useState({
    username: "",
    password: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [login, { data: queryData, error: queryError }] = useLazyQuery(LOGIN_QUERY);
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  // Check for connection status
  // useEffect(() => {
  //   const checkConnection = async () => {
  //     try {
  //       await fetch(process.env.REACT_APP_API_URL || 'http://localhost:5000');
  //     } catch (error) {
  //       toast.error('Server connection failed. Please check your internet connection.', {
  //         icon: '🔌',
  //         duration: 5000,
  //       });
  //     }
  //   };
  //   checkConnection();
  // }, []);

  useEffect(() => {
    if (queryError) {
      const errorMessage = queryError.message.includes('Invalid credentials')
        ? 'Invalid Student ID or Password'
        : 'Server error. Please try again later.';
      
      toast.error(errorMessage, {
        duration: 3000,
        icon: <AlertCircle className="text-white" />,
      });
      setIsLoading(false);
    }
  }, [queryError]);

  useEffect(() => {
    if (queryData?.studentLogin?.token) {
      const { token, ...userDetails } = queryData.studentLogin;
      
      const loadingToast = toast.loading('Logging in...', {
        icon: '🔐'
      });
      
      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("userData", JSON.stringify(userDetails));
      setUser(userDetails);

      // Show success and redirect
      setTimeout(() => {
        toast.dismiss(loadingToast);
        toast.success(`Welcome back, ${userDetails.FirstName}!`, {
          icon: '👋',
          duration: 3000
        });
        navigate("/student");
      }, 1000);
    }
  }, [queryData, navigate, setUser]);

  const onHandle = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (!data.username || !data.password) {
      toast.error('Please fill in all fields', {
        icon: '⚠️',
        duration: 2000
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await login({ 
        variables: { 
          StudentID: data.username, 
          Password: data.password 
        } 
      });
    } catch (error) {
      setIsLoading(false);
      toast.error('Connection failed. Please try again.', {
        icon: '🔌',
        duration: 3000
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleClick(e);
    }
  };

  return (
    <div className="min-h-screen bg-school bg-center bg-cover">
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'text-sm font-medium',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#059669',
            },
          },
          error: {
            style: {
              background: '#DC2626',
            },
          },
        }}
      />
      
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={() => navigate('/admin')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Admin Portal
        </button>
      </div>
      
      <div className="flex justify-between items-center min-h-screen p-4">

        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:shadow-3xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Student Login</h2>
              <p className="text-gray-600">Welcome back! Please enter your details.</p>
            </div>
            
            <div className="space-y-6">
              <div className="relative">
                <UserCircle2 className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  name="username"
                  placeholder="Student ID"
                  value={data.username}
                  onChange={onHandle}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              
              <div className="relative">
                <Key className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={data.password}
                  onChange={onHandle}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <button 
                onClick={handleClick} 
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Verifying...
                  </>
                ) : 'Login to Dashboard'}
              </button>

             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}