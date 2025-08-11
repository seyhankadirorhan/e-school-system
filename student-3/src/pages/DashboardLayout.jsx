import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function DashboardLayout() {
  const { currentUser, roleToDashboardPath } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (currentUser) {
      if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
        navigate(roleToDashboardPath(currentUser.role), { replace: true });
      }
    }
  }, [currentUser, navigate, roleToDashboardPath, location.pathname]);

  return (
    <div className="grid gap-6">
      <Outlet />
    </div>
  );
}


