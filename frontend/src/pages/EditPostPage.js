// frontend/src/pages/EditPostPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch the existing post data when the page loads
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${id}`);
        setTitle(data.title);
        setBody(data.body);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch post details.');
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  // 2. Handle the update submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/posts/${id}`, { title, body });
      alert('Post updated successfully!');
      navigate(`/posts/${id}`);
    } catch (err) {
      setError('Failed to update post.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="edit-post-page">
      <h2>Edit Post</h2>
      {error && <p className="error-msg">{error}</p>}
      
      <form onSubmit={handleUpdate}>
        <label>Title:</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        
        <label>Content:</label>
        <textarea 
          rows="10" 
          value={body} 
          onChange={(e) => setBody(e.target.value)} 
          required 
        />
        
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditPostPage;