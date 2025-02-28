import React, { useState, useEffect } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, User, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

// GraphQL query for admin authentication
const LOGIN_QUERY = gql`
  query FacultyLogin($Username: String!, $Password: String!) {
    FacultyLogin(Username: $Username, Password: $Password) {
      Username
      tokenss
    }
  }
`;

export default function AdminLogin() {
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
        localStorage.setItem('adminUsername', credentials.Username);
      } else {
        localStorage.removeItem('adminUsername');
      }
      
      // Show success notification
      toast.success('Login successful! Welcome to Admin Dashboard', {
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
      setTimeout(() => navigate('/admin/AdministrativeAuth/Administrative', { 
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
    const savedUsername = localStorage.getItem('adminUsername');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <Toaster position="top-right" />
      
      <div className="w-full max-w-md">
        {/* Card container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center">Admin Control Panel</h1>
            <p className="text-center text-purple-100 mt-2">Secure administrative access</p>
          </div>
          
          {/* Login Form */}
          <form onSubmit={handleLogin} className="p-8">
            <div className="space-y-6">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Admin Username
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
                    className="w-full pl-10 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="admin_username"
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
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              
              {/* Remember Me and Security */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="remember-me" className="ml-2 text-gray-600 dark:text-gray-400">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-purple-600 hover:text-purple-500 dark:text-purple-400">
                  Security policy
                </a>
              </div>
              
              {/* Login Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Authenticating...
                    </div>
                  ) : 'Sign in to Admin Dashboard'}
                </button>
              </div>
              
              {/* Security Note */}
              <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4 flex items-center justify-center">
                <Lock className="w-4 h-4 mr-1" />
                <p>This is a secured authentication system</p>
              </div>
            </div>
          </form>
        </div>
        
        {/* Footer note */}
        <div className="text-center mt-6 text-gray-400 text-xs">
          <p>© 2025 Educational Institute Management System</p>
          <p className="mt-1">Administrative access only • All actions are logged</p>
        </div>
      </div>
    </div>
  );
}