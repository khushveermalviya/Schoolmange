import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Protect = ({ children }) => {
  const token = localStorage.getItem('token'); // Check if token exists
  const location = useLocation();
  const [isValid, setIsValid] = useState(null); // State to track token validity
  const [isVerified, setIsVerified] = useState(false); // State to track if token has been verified
const expectedRole = "student"
  useEffect(() => {
    // Function to verify the token with the server
    const verifyTokenWithServer = async () => {
      if (!token) {
       
        setIsValid(false); // No token means invalid
        return;
      }

      try {
     
        const response = await fetch('http://localhost:5000/api/verify-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
       

        if (response.ok && data.valid && data.role === expectedRole) {
        
          setIsValid(true); // Token is valid and role matches
        } else {
        
          // Clear the invalid token
          localStorage.removeItem('token');
          toast.error('Your session has expired . Please Login Again.', {
            autoClose: 5000,
          });
          setIsValid(false); // Token is invalid, expired, or role does not match
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        setIsValid(false); // Treat network errors as invalid tokens
      } finally {
        setIsVerified(true); // Mark token as verified
      }
    };

    if (!isVerified) {
      verifyTokenWithServer();
    }
  }, [token, isVerified]);

  // While waiting for the server response, show a loading state
  if (isValid === null) {
    return <div>Loading...</div>;
  }

  // If no valid token and trying to access protected routes, show toast and redirect after 5 seconds
  if (!isValid && location.pathname !== '/') {
    setTimeout(() => {
      window.location.href = '/';
    }, 5000);
    return (
      <>
        <ToastContainer />
        <div>Redirecting to login page...</div>
      </>
    );
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