import axios from 'axios';

const API = axios.create({
  baseURL: '/', // Assuming local API or proxy
});

// Add a request interceptor to add the auth token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
