// Protected.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const Protect = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if token exists

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default Protect;