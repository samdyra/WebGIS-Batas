import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../hooks/useAuthStore';

type ProtectedRouteProps = {
  children: JSX.Element;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    // Not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
