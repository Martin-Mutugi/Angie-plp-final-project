import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onLogout) {
      onLogout();
    }
    navigate('/');
    window.location.reload(); // Force refresh to update navigation
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-primary-600 hover:opacity-80 transition-opacity"
            >
              <span className="text-2xl">🌍</span>
              SDG Platform
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="nav-links">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/donate" className="nav-link">
              Donate
            </Link>
            
            {user ? (
              <>
                {/* Show Dashboard for all logged-in users */}
                <Link to="/dashboard" className="nav-link">
                  Dashboard
                </Link>
                
                {/* Show Admin links only for ADMIN users */}
                {user.role === 'ADMIN' && (
                  <>
                    <Link to="/admin/recipients" className="nav-link">
                      Recipients
                    </Link>
                    <Link to="/admin/allocations" className="nav-link">
                      Allocations
                    </Link>
                    <Link to="/admin/reports" className="nav-link">
                      Reports
                    </Link>
                  </>
                )}
                
                {/* User Profile with Badge */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-semibold text-neutral-700">
                      {user.email || 'User'}
                    </span>
                    {user.role === 'ADMIN' && (
                      <span className="text-xs bg-primary-500 text-white px-2 py-1 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  <div className="w-8 h-8 bg-gradient rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {(user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="nav-link">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;