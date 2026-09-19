import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Immediate background pre-warm ping to eliminate cold start delay
const apiBase = (import.meta.env.VITE_API_URL || 'https://national-land-aquisisation.onrender.com').trim().replace(/\/+$/, '');
const healthUrl = `${apiBase.endsWith('/api') ? apiBase : `${apiBase}/api`}/v1/health`;
fetch(healthUrl, { method: 'GET', mode: 'cors' }).catch(() => {});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

