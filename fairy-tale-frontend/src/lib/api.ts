import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
});

// Automatically add JWT token if available
API.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
