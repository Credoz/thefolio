import { useState, useEffect } from 'react';
import API from '../api/axios';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]); 
  const [tab, setTab] = useState('users');

  useEffect(() => {
    API.get('/admin/users').then(r => setUsers(r.data)).catch(err => console.log(err));
    API.get('/admin/posts').then(r => setPosts(r.data)).catch(err => console.log(err));
    // Fetch Contact Messages
    API.get('/admin/messages').then(r => setMessages(r.data)).catch(err => console.log(err)); 
  }, []);

  const toggleStatus = async (id) => {
    const { data } = await API.put(`/admin/users/${id}/status`);
    setUsers(users.map(u => u._id === id ? data.user : u));
  };

  const removePost = async (id) => {
    await API.put(`/admin/posts/${id}/remove`);
    setPosts(posts.map(p => p._id === id ? { ...p, status: 'removed' } : p));
  };

  const deleteMessage = async (id) => {
    if(window.confirm("Are you sure you want to delete this message?")) {
        try {
            await API.delete(`/admin/messages/${id}`);
            setMessages(messages.filter(m => m._id !== id));
        } catch (err) {
            alert("Failed to delete message");
        }
    }
  };

  return (
    <div className='admin-page'>
      <h2>Admin Dashboard</h2>
      
      <div className='admin-tabs'>
        <button onClick={() => setTab('users')} className={tab === 'users' ? 'active' : ''}>
          Members ({users.length})
        </button>
        <button onClick={() => setTab('posts')} className={tab === 'posts' ? 'active' : ''}>
          All Posts ({posts.length})
        </button>
        {/* New Messages Tab */}
        <button onClick={() => setTab('messages')} className={tab === 'messages' ? 'active' : ''}>
          Messages ({messages.length})
        </button>
      </div>

      {tab === 'users' && (
        <table className='admin-table'>
          <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className={`status-badge ${u.status}`}>{u.status}</span></td>
                <td>
                  <button onClick={() => toggleStatus(u._id)} className={u.status === 'active' ? 'btn-danger' : 'btn-success'}>
                    {u.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === 'posts' && (
        <table className='admin-table'>
          <thead><tr><th>Title</th><th>Author</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {posts.map(p => (
              <tr key={p._id}>
                <td>{p.title}</td>
                <td>{p.author?.name}</td>
                <td><span className={`status-badge ${p.status}`}>{p.status}</span></td>
                <td>
                  {p.status === 'published' && (
                    <button className='btn-danger' onClick={() => removePost(p._id)}>Remove</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* New Messages Table */}
      {tab === 'messages' && (
        <table className='admin-table'>
          <thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Message</th><th>Action</th></tr></thead>
          <tbody>
            {messages.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign: 'center'}}>No new messages.</td></tr>
            ) : (
                messages.map(m => (
                  <tr key={m._id}>
                    <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                    <td>{m.name}</td>
                    <td><a href={`mailto:${m.email}`} style={{color: 'var(--accent-gold)'}}>{m.email}</a></td>
                    <td style={{maxWidth: '300px', wordWrap: 'break-word'}}>{m.message}</td>
                    <td>
                      <button className='btn-danger' onClick={() => deleteMessage(m._id)}>Delete</button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;