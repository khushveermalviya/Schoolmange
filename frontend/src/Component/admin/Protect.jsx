// Protect.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const Protect = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  
  // Keep track of the attempted URL for better redirection
  const from = location.pathname;

  // Function to check if token exists and is valid
  const isValidToken = () => {
    return !!token; // Add additional token validation logic if needed
  };

  // If we're on the root path and have a valid token, redirect to student portal
  if (location.pathname === '/' && isValidToken()) {
    return <Navigate to="/Student" replace state={{ from }} />;
  }

  // If no valid token and trying to access protected routes, redirect to root
  if (!isValidToken() && location.pathname !== '/') {
    return <Navigate to="/" replace state={{ from }} />;
  }

  // If we have a valid token and trying to access protected routes, allow access
  if (isValidToken() && location.pathname.startsWith('/Student')) {
    return children;
  }

  // For the root path without a token, show the login page (Main component)
  if (location.pathname === '/' && !isValidToken()) {
    return children;
  }

  // Default fallback - redirect to root
  return <Navigate to="/" replace state={{ from }} />;
};

export default Protect;