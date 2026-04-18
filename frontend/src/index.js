import React from 'react';
import ReactDOM from 'react-dom/client';
// Remove BrowserRouter from here because it is already in App.js
import { AuthProvider } from './context/AuthContext';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap the app in AuthProvider so the user stays logged in */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();