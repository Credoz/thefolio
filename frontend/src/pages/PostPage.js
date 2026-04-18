import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const PostPage = () => {
  const { id } = useParams(); // Gets the post ID from the URL
  const { user } = useAuth(); // Checks who is logged in
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch the Post and its Comments when the page loads
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        // Fetch the specific post
        const postRes = await API.get(`/posts/${id}`);
        setPost(postRes.data);

        // Fetch comments for this post using the exact route from your backend
        const commentsRes = await API.get(`/comments/${id}`);
        setComments(commentsRes.data);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load post.');
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id]);

  // 2. Handle submitting a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      // Your backend expects the text inside an object key called "body"
      const { data } = await API.post(`/comments/${id}`, { body: newComment });
      
      // Add the new comment to the BOTTOM of the list (since your backend sorts oldest first)
      setComments([...comments, data]);
      setNewComment(''); // Clear the input box
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add comment');
    }
  };

  // 3. Handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await API.delete(`/comments/${commentId}`);
        // Remove the deleted comment from the screen
        setComments(comments.filter(c => c._id !== commentId));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete comment');
      }
    }
  };

  // 4. Handle deleting the entire post
  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this ENTIRE post?')) {
      try {
        await API.delete(`/posts/${id}`);
        navigate('/home'); // Send them back to home after deleting
      } catch (err) {
        alert('Failed to delete post');
      }
    }
  };

  // While loading, show a loading message
  if (loading) return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Loading...</h2>;
  if (error || !post) return <h2 style={{textAlign: 'center', marginTop: '50px', color: 'red'}}>{error || 'Post not found.'}</h2>;

  return (
    <main className="content-large" style={{ padding: '40px 5%' }}>
      <div className="form-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* --- POST CONTENT --- */}
        <h1 style={{ color: 'var(--accent-gold)', marginBottom: '5px' }}>{post.title}</h1>
        <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '20px' }}>
          By {post.author?.name || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}
        </p>

        {/* Display the Image if the post has one */}
        {post.image && (
          <img
            src={`http://localhost:5000/uploads/${post.image}`}
            alt={post.title}
            style={{ width: '100%', borderRadius: '8px', marginBottom: '20px', border: '2px solid var(--accent-gold)' }}
          />
        )}

        {/* The Caption / Body */}
        <div style={{ whiteSpace: 'pre-wrap', marginBottom: '30px' }}>
          {post.body}
        </div>

        {/* Edit / Delete Post Buttons */}
        {user && (user._id === post.author?._id || user.role === 'admin') && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
            <Link to={`/edit-post/${post._id}`}>
              <button className="quiz-btn" style={{ background: '#4CAF50' }}>Edit Post</button>
            </Link>
            <button className="quiz-btn" onClick={handleDeletePost}>Delete Post</button>
          </div>
        )}

        <hr style={{ borderColor: '#444', margin: '40px 0' }} />

        {/* --- COMMENTS SECTION --- */}
        <h2>Comments ({comments.length})</h2>

        {/* Add Comment Form */}
        {user ? (
          <form onSubmit={handleAddComment} style={{ marginBottom: '30px' }}>
            <textarea
              rows="3"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{ width: '100%', marginBottom: '10px' }}
              required
            ></textarea>
            <button type="submit" className="quiz-btn">Post Comment</button>
          </form>
        ) : (
          <p style={{ marginBottom: '30px', color: 'var(--accent-red)' }}>
            You must be <Link to="/login" style={{ color: 'var(--accent-gold)' }}>logged in</Link> to leave a comment.
          </p>
        )}

        {/* List of Existing Comments */}
        <div className="comments-list">
          {comments.length === 0 ? (
            <p>No comments yet. Be the first to say something!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} style={{ background: 'var(--input-bg)', padding: '15px', borderRadius: '8px', marginBottom: '15px', borderLeft: '4px solid var(--accent-red)', position: 'relative' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: 'var(--accent-gold)' }}>
                  {/* Your backend uses comment.author.name */}
                  <strong>{comment.author?.name || 'Unknown User'}</strong> • {new Date(comment.createdAt).toLocaleDateString()}
                </p>
                
                {/* Your backend uses comment.body for the text */}
                <p style={{ margin: 0, fontSize: '1rem' }}>{comment.body}</p>

                {/* Delete Comment Button (Only for the author of the comment or Admin) */}
                {user && (user._id === comment.author?._id || user.role === 'admin') && (
                  <button 
                    onClick={() => handleDeleteComment(comment._id)}
                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    X
                  </button>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
};

export default PostPage;