import api from './axiosConfig';

export const login = async (username, password) => {
  const response = await api.post('/api/auth/login', { username, password });
  localStorage.setItem('jwtToken', response.data.token);
  localStorage.setItem('userId', response.data.userId);     // ← save karo
  localStorage.setItem('username', response.data.username); // ← save karo
  return response.data;
};

export const register = async (username, password) => {
  const response = await api.post('/api/auth/register', { username, password });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('jwtToken');
};

export const isLoggedIn = () => {
  return !!localStorage.getItem('jwtToken');
};
