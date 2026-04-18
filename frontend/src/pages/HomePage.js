import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext'; // <--- Import Auth context

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // <--- Get the logged-in user

  useEffect(() => {
    API.get('/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error("Error fetching posts:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading posts...</p>;

  return (
    <main>
      <section className='home-page' style={{ padding: '40px 5%' }}>
        
        {/* Header and Create Button Container */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', borderBottom: '2px solid var(--accent-red)', paddingBottom: '10px', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Latest Posts</h2>
          
          {/* ONLY show the Create Post button if someone is logged in */}
          {user && (
            <Link to="/create-post">
              <button className="quiz-btn" style={{ margin: 0 }}>+ Create New Post</button>
            </Link>
          )}
        </div>

        {/* If there are no posts */}
        {posts.length === 0 ? (
          <p>
            No posts yet. {user ? "Click the button above to write one!" : <><Link to="/login" style={{ color: 'var(--accent-gold)' }}>Log in</Link> to be the first to write one!</>}
          </p>
        ) : (
          /* If there ARE posts, display them in a grid */
          <div className='posts-grid' style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
            {posts.map(post => (
              <div key={post._id} className='post-card' style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '8px', borderTop: '4px solid var(--accent-gold)' }}>
                
                {post.image && (
                  <img 
                    src={`http://localhost:5000/uploads/${post.image}`}
                    alt={post.title} 
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '15px' }}
                  />
                )}
                
                <h3 style={{ margin: '0 0 10px 0' }}>
                  <Link to={`/posts/${post._id}`} style={{ color: 'var(--accent-red)', textDecoration: 'none' }}>
                    {post.title}
                  </Link>
                </h3>
                
                <p style={{ margin: '0 0 15px 0', fontSize: '0.9rem' }}>
                  {post.body.substring(0, 120)}...
                </p>
                
                <small style={{ color: '#888' }}>
                  By {post.author?.name || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- Rest of your original HomePage content --- */}
      <section style={{ textAlign: 'center' }}>
        <h2>Welcome to My Gaming Journey</h2>
        <p style={{ fontSize: '1.1rem' }}>
          I love competitive games like League of Legends, Valorant, and Brawl Stars.
        </p>
        <img 
          className="hero-img" 
          src="/PICS/1806be13-db84-4457-8fba-176a49df56eb.jpg" 
          alt="Gaming setup" 
        />
      </section>

      <section className="content-large">
        <h3>Why I Love Gaming</h3>
        <ul>
          <li>Improves teamwork and communication skills</li>
          <li>Builds strategic thinking and problem solving</li>
          <li>Helps me relax after a long day</li>
          <li>Connects me with friends around the world</li>
        </ul>
      </section>

      <section className="content-large">
        <h3>Featured Games</h3>
        <p>Learn more about my experience with League of Legends, Valorant, and Brawl Stars on the About page.</p>
      </section>
    </main>
  );
};

export default HomePage;