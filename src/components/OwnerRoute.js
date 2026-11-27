import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const OwnerRoute = ({ children }) => {
  const { isAuthenticated, isOwner, loading } = useAuth();

  if (loading) return <LoadingSpinner fullPage />;

  if (!isAuthenticated) {
    return <Navigate to="/owner/login" replace />;
  }

  if (!isOwner) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default OwnerRoute;
