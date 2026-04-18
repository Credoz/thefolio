import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Components
import Navbar from './components/Navbar'; 
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import AdminPage from './pages/AdminPage';

const App = () => {
  // --- THEME STATE ---
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <Router>

      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SplashPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path='/posts/:id' element={<PostPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route path='/profile'
          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path='/create-post'
          element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
        <Route path='/edit-post/:id'
          element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />
        
        {/* Admin Route */}
        <Route path='/admin'
          element={<ProtectedRoute role='admin'><AdminPage /></ProtectedRoute>} />
      </Routes>

      <footer>
        <p>Contact: example@email.com</p>
        <p>© CAS's Gaming Portfolio</p>
      </footer>
    </Router>
  );
};

export default App;