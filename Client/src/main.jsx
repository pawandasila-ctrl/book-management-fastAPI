import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import axios from 'axios'

axios.defaults.withCredentials = true;

const initApp = async () => {
  try {
    await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`);
    localStorage.setItem('is_logged_in', 'true');
  } catch (err) {
    if (err.response?.status === 401) {
      localStorage.removeItem('is_logged_in');
    }
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
};

initApp(); 