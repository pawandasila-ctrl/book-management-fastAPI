import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Nav = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('is_logged_in') === 'true';

  const handleLogout = () => {
    axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`)
      .finally(() => {
        localStorage.removeItem('is_logged_in');
        navigate('/login');
        window.location.reload();
      });
  };

  return (
    <nav className="bg-white border-b border-slate-200 py-4 shadow-sm mb-8">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl text-slate-900 flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span>📚</span> BookSphere
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-slate-600 hover:text-indigo-600 font-semibold transition-colors text-sm">
            Books
          </Link>
          <Link to="/create" className="text-slate-600 hover:text-indigo-600 font-semibold transition-colors text-sm">
            Create
          </Link>
          {isLoggedIn ? (
            <button 
              className="border border-slate-300 text-slate-600 hover:bg-slate-50 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer" 
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <div className="flex gap-3">
              <Link 
                to="/login" 
                className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors text-center"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors text-center shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;