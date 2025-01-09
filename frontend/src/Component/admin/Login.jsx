import React, { useState, useEffect } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const LOGIN_QUERY = gql`
  query FacultyLogin($Username: String!, $Password: String!) {
    FacultyLogin(Username: $Username, Password: $Password) {
      Username
      tokenss
    }
  }
`;

export default function Login() {
  const [data, setData] = useState({
    Username: "",
    Password: ""
  });

  const [login, { data: queryData, loading, error }] = useLazyQuery(LOGIN_QUERY);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (queryData?.FacultyLogin) {
        localStorage.setItem('tokenss', queryData.FacultyLogin.tokenss);
        toast.success('Login successful! Redirecting...');
        setTimeout(() => navigate('/admin/adminPanel'), 1000);
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      console.error("Frontend error:", err);
    }
  }, [queryData, navigate]);

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
      toast.error('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-admin bg-cover bg-center">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen">
        <div className="w-full max-w-md transform transition-all duration-300 hover:scale-102 hover:shadow-xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6 animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please sign in to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                           dark:bg-gray-700 dark:border-gray-600 dark:text-white
                           transition-all duration-200"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  name="Password"
                  value={data.Password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           dark:bg-gray-700 dark:border-gray-600 dark:text-white
                           transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 
                         text-white font-medium rounded-lg
                         transform transition-all duration-200
                         hover:translate-y-[-2px] hover:shadow-lg
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

            {error && (
              <div className="animate-fadeIn">
                <p className="text-sm text-center text-red-500">
                  An error occurred. Please try again.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}