import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../assets/logo.svg';

export default function Navbar() {
  const { currentUser, isAuthenticated, logout, roleToDashboardPath } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container max-w-6xl flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-8 w-8" />
          <span className="font-semibold text-indigo-700">Öğrenci Yönetimi</span>
        </Link>

        <nav className="flex items-center gap-3">
          {!isAuthenticated && (
            <>
              <Link className="btn-outline" to="/login">Giriş</Link>
              <Link className="btn" to="/register">Kayıt</Link>
            </>
          )}

          {isAuthenticated && (
            <>
              <Link className="btn-outline" to={roleToDashboardPath(currentUser.role)}>
                Dashboard
              </Link>
              <div className="hidden sm:flex items-center gap-2">
                <span className="badge">{currentUser.role}</span>
                <span className="text-sm text-gray-700">{currentUser.username}</span>
              </div>
              <button className="btn" onClick={handleLogout}>Çıkış</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}


