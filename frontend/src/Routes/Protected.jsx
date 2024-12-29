// Protected.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const Protected = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('tokenss'); // Check if token exists

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default Protected;