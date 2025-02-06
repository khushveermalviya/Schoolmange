import React, { useState, useEffect } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, Eye, EyeOff, User } from 'lucide-react';

const LOGIN_QUERY = gql`
  query FacultyLogin($Username: String!, $Password: String!) {
    FacultyLogin(Username: $Username, Password: $Password) {
      Username
      tokenss
    }
  }
`;

export default function Login(Username) {
  const [data, setData] = useState({
    Username: "",
    Password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [login, { data: queryData, loading, error }] = useLazyQuery(LOGIN_QUERY);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(Username)
    if (queryData?.FacultyLogin) {
      localStorage.setItem('tokenss', queryData.FacultyLogin.tokenss);
      toast.success('Login successful! Redirecting...', {
        position: "top-center",
        duration: 2000,
        style: {
          background: "#32CD32",
          color: "#fff",
          borderRadius: "10px",
        },
      });
      setTimeout(() => navigate('/admin/adminPanel', { state: { Username: queryData.FacultyLogin.Username } }), 2000);
    }
  }, [queryData, navigate]);

  useEffect(() => {
    if (error) {
      toast.error('Invalid credentials. Please try again.', {
        position: "top-center",
        duration: 3000,
        style: {
          background: "#FF4500",
          color: "#fff",
          borderRadius: "10px",
        },
      });
    }
  }, [error]);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({
        variables: {
          Username: data.Username,
          Password: data.Password
        }
      });
    } catch (err) {
      console.error("Error during login:", err);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-admin flex items-center justify-center">
      {/* Toast Notification */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Login Form */}
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 space-y-6 animate-fadeIn">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Please sign in to continue to the Admin Panel.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              name="Username"
              value={data.Username}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       dark:bg-gray-800 dark:border-gray-700 dark:text-white
                       transition-all duration-200"
              placeholder="Enter your username"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="Password"
              value={data.Password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       dark:bg-gray-800 dark:border-gray-700 dark:text-white
                       transition-all duration-200"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 
                     text-white font-medium rounded-lg
                     transform transition-all duration-200
                     hover:scale-105 hover:shadow-lg
                     disabled:opacity-50 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Signing in...
              </div>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}