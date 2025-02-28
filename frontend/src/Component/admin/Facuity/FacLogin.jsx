import React, { useState, useEffect } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, BookOpen, User, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

// GraphQL query for faculty authentication
const LOGIN_QUERY = gql`
  query FacultyLogin($Username: String!, $Password: String!) {
    FacultyLogin(Username: $Username, Password: $Password) {
      Username
      tokenss
    }
  }
`;

export default function FacLogin() {
  // State management
  const [credentials, setCredentials] = useState({
    Username: "",
    Password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Apollo GraphQL hook for authentication
  const [login, { data: queryData, loading, error }] = useLazyQuery(LOGIN_QUERY);
  const navigate = useNavigate();

  // Handle successful login
  useEffect(() => {
    if (queryData?.FacultyLogin) {
      // Store auth token
      localStorage.setItem('tokenss', queryData.FacultyLogin.tokenss);
      
      // If remember me is checked, store username
      if (rememberMe) {
        localStorage.setItem('facultyUsername', credentials.Username);
      } else {
        localStorage.removeItem('facultyUsername');
      }
      
      // Show success notification
      toast.success('Login successful! Welcome to Faculty Portal', {
        icon: <CheckCircle className="text-green-500" />,
        duration: 2000,
        style: {
          background: "#f0f9ff",
          color: "#0369a1",
          borderRadius: "10px",
          border: "1px solid #bae6fd"
        }
      });
      
      // Redirect to admin panel
      setTimeout(() => navigate('/admin/FacilityAuth/Facility', { 
        state: { Username: queryData.FacultyLogin.Username } 
      }), 2000);
    }
  }, [queryData, navigate, rememberMe, credentials.Username]);

  // Handle login errors
  useEffect(() => {
    if (error) {
      toast.error('Invalid credentials. Please try again.', {
        icon: <AlertCircle className="text-red-500" />,
        duration: 3000,
        style: {
          background: "#fef2f2",
          color: "#b91c1c",
          borderRadius: "10px",
          border: "1px solid #fecaca"
        }
      });
    }
  }, [error]);

  // Check for stored username on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('facultyUsername');
    if (savedUsername) {
      setCredentials(prev => ({
        ...prev,
        Username: savedUsername
      }));
      setRememberMe(true);
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({
        variables: {
          Username: credentials.Username,
          Password: credentials.Password
        }
      });
    } catch (err) {
      console.error("Error during login:", err);
      toast.error('An error occurred. Please try again later.', {
        icon: <AlertCircle className="text-red-500" />,
        duration: 3000
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Toaster position="top-right" />
      
      <div className="w-full max-w-md relative">
        {/* Decorative elements */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header with animation */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <div className="absolute top-4 left-4 w-12 h-12 rounded-full border-4 border-white/30 animate-ping"></div>
              <div className="absolute bottom-4 right-10 w-8 h-8 rounded-full border-4 border-white/20 animate-ping"></div>
              <div className="absolute top-10 right-4 w-6 h-6 rounded-full border-4 border-white/10 animate-ping"></div>
            </div>
            
            <div className="flex items-center justify-center mb-2">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4 shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center">Faculty Login Portal</h1>
            <p className="text-center text-blue-100 mt-2">Access your teaching dashboard</p>
          </div>
          
          {/* Login Form */}
          <form onSubmit={handleLogin} className="p-8">
            <div className="space-y-6">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="Username"
                    value={credentials.Username}
                    onChange={handleChange}
                    className="input input-bordered w-full pl-10 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="faculty_username"
                    required
                  />
                </div>
              </div>
              
              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="Password"
                    value={credentials.Password}
                    onChange={handleChange}
                    className="input input-bordered w-full pl-10 pr-10 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="checkbox checkbox-primary h-4 w-4"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="remember-me" className="ml-2 text-gray-600 dark:text-gray-400">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                  Forgot password?
                </a>
              </div>
              
              {/* Login Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Logging in...
                    </div>
                  ) : 'Sign in to Dashboard'}
                </button>
              </div>
              
              {/* Faculty Help */}
              <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                <p>Need technical assistance? <a href="#" className="text-indigo-600 hover:underline">Contact IT Support</a></p>
              </div>
            </div>
          </form>
          
          {/* Faculty-related decorative illustration */}
          <div className="absolute -z-10 opacity-5 right-0 top-1/3">
            <svg width="180" height="180" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-900">
              <path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
            </svg>
          </div>
        </div>
        
        {/* Footer note */}
        <div className="text-center mt-6 text-gray-600 dark:text-gray-400 text-xs">
          <p>© 2025 Educational Institute Management System</p>
          <p className="mt-1">Secure faculty access portal • All rights reserved</p>
        </div>
      </div>
    </div>
  );
}