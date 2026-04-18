import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SplashPage = () => {
  // State to control whether the loader is in the DOM
  const [isLoading, setIsLoading] = useState(true);
  // State to control the fade-out effect
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // 1. Start the fade-out after 500ms
    const fadeTimer = setTimeout(() => {
      setOpacity(0);
    }, 500);

    // 2. Completely remove the loader from the DOM after 1000ms (giving it time to fade)
    const removeTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Cleanup timers if the user navigates away before they finish
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []); // The empty array [] means this effect only runs once when the page loads

  return (
    <main>
      {/* Conditionally render the loader */}
      {isLoading && (
        <div 
          id="page-loader" 
          style={{ opacity: opacity, transition: 'opacity 0.5s ease' }}
        >
          <div className="spinner"></div>
          <p style={{ color: 'var(--accent-red)', fontFamily: 'Oswald', letterSpacing: '2px' }}>
            LOADING...
          </p>
        </div>
      )}

      {/* Main Hero Content */}
      <section className="hero-content">
        <h2 style={{ fontSize: '3rem', color: 'var(--accent-gold)' }}>Level Up Your Vision</h2>
        <p>Experience the journey of a competitive gamer through LoL, Valorant, and more.</p>
        
        {/* We use React Router's Link instead of a standard <a> tag */}
        <Link to="/home" className="enter-btn">
          Enter Site
        </Link>
      </section>
    </main>
  );
};

export default SplashPage;