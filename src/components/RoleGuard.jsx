import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RoleGuard({ allowedRoles = [], fallback = '/login', children }) {
  if (typeof window === 'undefined') {
    return null;
  }

  const currentRole = localStorage.getItem('teaxis_role');

  if (!currentRole) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentRole)) {
    return <Navigate to={fallback} replace />;
  }

  return children;
}
