import React, { useEffect, useState } from 'react';
import { Navigate, useLocation,useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TailSpin } from 'react-loader-spinner'; // Import the loader component

const Protect = ({ children }) => {
  const token = localStorage.getItem('token'); // Check if token exists
  const location = useLocation();
  const navigate = useNavigate(); // Add useNavigate hook
  const [isValid, setIsValid] = useState(null); // State to track token validity
  const [isVerified, setIsVerified] = useState(false); // State to track if token has been verified
  const expectedRole = "student";

  useEffect(() => {
    const verifyTokenWithServer = async () => {
      if (!token) {
        setIsValid(false);
        setIsVerified(true);
        return;
      }

      try {
        const response = await fetch('https://center-gefucegncpf7akcc.centralindia-01.azurewebsites.net/api/verify-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok && data.valid && data.role === expectedRole) {
          setIsValid(true);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('userType'); // Ensure complete logout
          toast.error('Your session has expired. Please Login Again.', {
            autoClose: 5000,
          });
          setIsValid(false);
          navigate('/'); // Programmatically navigate to login
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        setIsValid(false);
      } finally {
        setIsVerified(true);
      }
    };

    if (!isVerified) {
      verifyTokenWithServer();
    }
  }, [token, isVerified, navigate]);

  // While waiting for the server response, show a loading state
  if (isValid === null) {
    return  <div className="flex items-center justify-center min-h-screen">
    <TailSpin height="50" width="50" color="blue" ariaLabel="loading" />
    <span className="ml-4">Loading...</span>
  </div>;
  }

  // If no valid token and trying to access protected routes, show toast and redirect after 5 seconds
  if (!isValid && location.pathname !== '/') {
  
      window.location.href = '/';

  }

  // If we're on the root path and have a valid token, redirect to the appropriate portal
  if (location.pathname === '/' && isValid) {
    if (expectedRole === 'student') {
      return <Navigate to="/Student" replace />;
    } else if (expectedRole === 'faculty') {
      return <Navigate to="/Administrative" replace />;
    }
  }

  // If we have a valid token and trying to access protected routes, allow access
  if (isValid && location.pathname.startsWith(`/${expectedRole === 'student' ? 'Student' : 'Administrative'}`)) {
    return (
      <>
        {children}
        <ToastContainer />
      </>
    );
  }

  // For the root path without a token, show the login page (Main component)
  if (location.pathname === '/' && !isValid) {
    return (
      <>
        {children}
        <ToastContainer />
      </>
    );
  }

  // If no valid token and trying to access protected routes, redirect to login
  if (!isValid && location.pathname !== '/') {
    toast.error('Please log in to access this page');
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  // Default fallback - redirect to root
  return <Navigate to="/" replace />;
};

export default Protect;