import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import React, { useState } from 'react';

const RegisterPage = () => {
  const navigate = useNavigate();

  // 1. Setup State (We only need ONE state object for the form)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    level: '',
    password: '',
    confirmPassword: '',
    terms: false
  });

  // 2. Setup State for validation errors
  const [errors, setErrors] = useState({});
  
  // 3. Setup State for API errors (This fixes 'setError is not defined')
  const [apiError, setApiError] = useState('');

  // 4. Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // If it's a checkbox, we need the 'checked' value instead of 'value'
    const inputValue = type === 'checkbox' ? checked : value;

    setFormData({
      ...formData,
      [name]: inputValue
    });

    // Clear the error for this field as the user types
    if (errors[name]) {
        setErrors({
            ...errors,
            [name]: ''
        });
    }
  };

  // 5. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // --- VALIDATION START ---
    let isValid = true;
    let newErrors = {};

    // Name Validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    
    // Email Validation
    if (!formData.email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      newErrors.email = "Valid email required";
      isValid = false;
    }

    // Age Validation (< 18 check)
    if (!formData.dob) {
      newErrors.dob = "Date of birth required";
      isValid = false;
    } else {
      const dobDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }
      if (age < 18) {
        newErrors.dob = "You must be at least 18 years old.";
        isValid = false;
      }
    }

    // Password Validation
    if (formData.password.length < 8) {
      newErrors.password = "Password must be 8+ chars";
      isValid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // Radio/Checkbox Validation
    if (!formData.level) {
      newErrors.level = "Select an experience level";
      isValid = false;
    }
    if (!formData.terms) {
      newErrors.terms = "You must agree to terms";
      isValid = false;
    }

    setErrors(newErrors);
    // --- VALIDATION END ---

    // If validation passed, try to send to API
    if (isValid) {
        try {
            // We send the formData to the backend
            const { data } = await API.post('/auth/register', formData);
            
            // Save token
            localStorage.setItem('token', data.token);
            
            // Redirect user
            alert("Registration Successful!");
            navigate('/home'); // or navigate('/login')
        } catch (err) {
            // Handle API errors (like "Email already exists")
            setApiError(err.response?.data?.message || 'Registration failed. Try again.');
        }
    }
  };

  return (
    <main>
      <section>
        <h2>Create Account</h2>
        
        {/* Display Global API Error if it exists */}
        {apiError && <p className="error-msg" style={{color: 'red'}}>{apiError}</p>}

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            
            <label htmlFor="name">Full Name</label>
            <input type="text" id="rName" name="name" value={formData.name} onChange={handleChange} />
            {errors.name && <span className="error" style={{color: 'red'}}>{errors.name}</span>}

            <label htmlFor="email">Email Address</label>
            <input type="email" id="rEmail" name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <span className="error" style={{color: 'red'}}>{errors.email}</span>}

            <label htmlFor="dob">Date of Birth</label>
            <input type="date" id="rDob" name="dob" value={formData.dob} onChange={handleChange} />
            {errors.dob && <span className="error" style={{color: 'red'}}>{errors.dob}</span>}

            <label>Experience Level</label>
            <div className="radio-group">
              <label><input type="radio" name="level" value="Newbie" checked={formData.level === "Newbie"} onChange={handleChange} /> Newbie</label>
              <label><input type="radio" name="level" value="Gamer" checked={formData.level === "Gamer"} onChange={handleChange} /> Gamer</label>
              <label><input type="radio" name="level" value="Pro" checked={formData.level === "Pro"} onChange={handleChange} /> Pro</label>
            </div>
            {errors.level && <span className="error" style={{color: 'red'}}>{errors.level}</span>}

            <label htmlFor="password">Password</label>
            <input type="password" id="rPass" name="password" value={formData.password} onChange={handleChange} />
            {errors.password && <span className="error" style={{color: 'red'}}>{errors.password}</span>}

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="rConfirmPass" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            {errors.confirmPassword && <span className="error" style={{color: 'red'}}>{errors.confirmPassword}</span>}

            <label className="checkbox-container">
              <input type="checkbox" id="terms" name="terms" checked={formData.terms} onChange={handleChange} />
              I agree to the Terms and Conditions
            </label>
            {errors.terms && <span className="error" style={{color: 'red'}}>{errors.terms}</span>}

            <button type="submit" className="quiz-btn">Register Now</button>
          </form>
          
          <p style={{marginTop: '20px'}}>
            Already have an account? <Link to='/login'>Login</Link>
          </p>

        </div>
      </section>
    </main>
  );
};

export default RegisterPage;