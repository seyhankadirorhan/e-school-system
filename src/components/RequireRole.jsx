import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RequireRole({ role, children }) {
  const { currentUser, ready, roleToDashboardPath } = useAuth();
  const location = useLocation();

  if (!ready) {
    return <div className="text-center text-gray-600 py-12">Yükleniyor...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (currentUser.role !== role) {
    return <Navigate to={roleToDashboardPath(currentUser.role)} replace />;
  }

  return children;
}


