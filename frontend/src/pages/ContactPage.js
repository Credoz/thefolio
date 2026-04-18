import React, { useState } from 'react';
import API from '../api/axios'; // <--- Added API import

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '', api: '' });
  const [successMsg, setSuccessMsg] = useState(''); // <--- Added success state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '', api: '' });
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    let isValid = true;
    let newErrors = { name: '', email: '', message: '', api: '' };

    if (formData.name.trim() === "") { newErrors.name = "Name is required"; isValid = false; }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(formData.email)) { newErrors.email = "Valid email is required"; isValid = false; }
    if (formData.message.trim().length < 10) { newErrors.message = "Message must be at least 10 characters"; isValid = false; }

    setErrors(newErrors);

    if (isValid) {
      try {
        // ACTUALLY SEND DATA TO BACKEND
        await API.post('/contact', formData);
        
        setSuccessMsg("Your message has been sent successfully!");
        setFormData({ name: '', email: '', message: '' }); // Clear form
      } catch (err) {
        setErrors({ ...newErrors, api: err.response?.data?.message || "Failed to send message. Try again." });
      }
    }
  };

  return (
    <main>
      <section>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Contact Me</h2>
        
        <div className="form-container">
          <div className="map-container">
            <iframe 
              src="https://maps.google.com/maps?q=Agoo%2C%20La%20Union%2C%20Philippines&t=&z=13&ie=UTF8&iwloc=&output=embed" 
              title="Location Map" allowFullScreen>
            </iframe>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Show Success or API Error Message at the top */}
            {successMsg && <p style={{ color: 'var(--accent-gold)', fontWeight: 'bold', textAlign: 'center' }}>{successMsg}</p>}
            {errors.api && <p className="error">{errors.api}</p>}

            <label htmlFor="cName">Name:</label>
            <input type="text" id="cName" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} />
            {errors.name && <span className="error">{errors.name}</span>}

            <label htmlFor="cEmail">Email:</label>
            <input type="text" id="cEmail" name="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} />
            {errors.email && <span className="error">{errors.email}</span>}

            <label htmlFor="cMessage">Message:</label>
            <textarea id="cMessage" name="message" rows="5" placeholder="Write something..." value={formData.message} onChange={handleChange}></textarea>
            {errors.message && <span className="error">{errors.message}</span>}

            <button type="submit" className="quiz-btn">Send Message</button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;