import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Update tab based on route pathname
  useEffect(() => {
    if (location.pathname === '/register') {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
  }, [location.pathname]);

  // validation states
  const [validated, setValidated] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_URL;

  const validateForm = () => {
    const errors = {};
    if (!username.trim()) {
      errors.username = 'Username is required';
    } else if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (activeTab === 'register') {
      if (!confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setValidated(true);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      let res;
      if (activeTab === 'login') {
        res = await axios.post(`${apiBase}/auth/login`, { username, password });
      } else {
        res = await axios.post(`${apiBase}/auth/register`, { username, password });
      }

      localStorage.setItem('is_logged_in', 'true');
      const queryParams = new URLSearchParams(location.search);
      const next = queryParams.get('next');
      window.location.href = next || '/';
    } catch (err) {
      console.error(err);
      setApiError(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setValidated(false);
    setValidationErrors({});
    setApiError(null);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="flex justify-center items-center px-4" style={{ minHeight: '65vh' }}>
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-lg p-8">

        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 mb-6">
          <button
            type="button"
            className={`font-bold px-4 py-2 text-sm focus:outline-none cursor-pointer border-b-2 transition-all ${activeTab === 'login' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            style={{ marginBottom: '-1px' }}
            onClick={() => switchTab('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`font-bold px-4 py-2 text-sm focus:outline-none cursor-pointer border-b-2 transition-all ${activeTab === 'register' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            style={{ marginBottom: '-1px' }}
            onClick={() => switchTab('register')}
          >
            Register
          </button>
        </div>

        {apiError && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-lg mb-4 text-sm" role="alert">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Username</label>
            <input
              type="text"
              className={`w-full px-3.5 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-all ${validated && validationErrors.username ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500' : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {validated && validationErrors.username && (
              <p className="text-rose-500 text-xs mt-1">{validationErrors.username}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              className={`w-full px-3.5 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-all ${validated && validationErrors.password ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500' : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {validated && validationErrors.password && (
              <p className="text-rose-500 text-xs mt-1">{validationErrors.password}</p>
            )}
          </div>

          {/* Confirm Password (only on Register tab) */}
          {activeTab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Confirm Password</label>
              <input
                type="password"
                className={`w-full px-3.5 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm transition-all ${validated && validationErrors.confirmPassword ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500' : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {validated && validationErrors.confirmPassword && (
                <p className="text-rose-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
              )}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-bold mt-6 transition-colors cursor-pointer flex items-center justify-center shadow-sm"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {activeTab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
