// frontend/src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  // Hardcoded to force Vercel to use your live Render server!
  baseURL: 'https://thefolio-agp3.onrender.com/api',
});

// This interceptor runs before EVERY request.
// It reads the token from localStorage and adds it to the Authorization headers.
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;