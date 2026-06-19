import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('jwtToken');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export default api;
