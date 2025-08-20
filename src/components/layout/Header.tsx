import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';

const Header = () => {
  const { isAuthenticated, logout } = useAuthContext();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-5 items-center py-4 text-sm text-white/80">
          <Link to="/" className="text-center hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/camera" className="text-center hover:text-white transition-colors">
            Camera
          </Link>
          <Link to="/analysis" className="text-center hover:text-white transition-colors">
            Results
          </Link>
          <Link to="/profile" className="text-center hover:text-white transition-colors">
            My Page
          </Link>
          {isAuthenticated ? (
            <button 
              onClick={logout} 
              className="text-center hover:text-white transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="text-center hover:text-white transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;