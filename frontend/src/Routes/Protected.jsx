import React from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';

export default function Protected({ children }) {
    const context = useOutletContext();
    const { isAuthenticated } = context || {}; // Add a fallback to avoid destructuring undefined

    
   
    return children;
}