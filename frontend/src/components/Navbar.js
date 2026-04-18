import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <--- Import Auth Context

const Navbar = ({ theme, toggleTheme }) => {
  const { user, logout } = useAuth(); // Grab the user info and logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header>
      <h1>Gaming Portfolio</h1>
      <nav>
        <ul className="nav-links">
          <li><NavLink to="/">Welcome</NavLink></li>
          <li><NavLink to="/home">Home</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>
          
          {/* --- CONDITIONAL LINKS --- */}
          {/* If there is NO user logged in, show Login and Register */}
          {!user ? (
            <>
              <li><NavLink to="/login">Login</NavLink></li>
              <li><NavLink to="/register">Register</NavLink></li>
            </>
          ) : (
            /* If a user IS logged in, show Profile and Logout */
            <>
              <li><NavLink to="/profile">Profile</NavLink></li>
              
              {/* If that user is specifically an ADMIN, show the Admin button */}
              {user.role === 'admin' && (
                <li>
                  <NavLink to="/admin" style={{ color: 'var(--accent-gold)' }}>
                    Admin Dashboard
                  </NavLink>
                </li>
              )}
              
              <li>
                <button onClick={handleLogout} className="toggle-btn" style={{ border: 'none', background: 'transparent' }}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
        
        <button id="theme-toggle" className="toggle-btn" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </nav>
    </header>
  );
};

export default Navbar;