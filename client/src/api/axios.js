import axios from 'axios';

// In production, use the Render backend URL.
// In development, falls back to empty string (Vite proxy handles /api routes).
const API_BASE_URL = import.meta.env.VITE_API_URL
  || (import.meta.env.PROD ? 'https://ai-resume-backend-quz5.onrender.com' : '');

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token to every request if available
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('resumeai_user');
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
