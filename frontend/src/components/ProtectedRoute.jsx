import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  // If there's no token, store the intended path and redirect to login
  if (!token) {
    localStorage.setItem('intendedPath', location.pathname);
    return <Navigate to="/login" replace />;
  }

  // Return children (protected content) if the token exists
  return children;
};

export default ProtectedRoute;
