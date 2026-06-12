import React, { createContext, useContext, useState } from 'react';
import { logout as logoutService } from '../api/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('jwtToken'));

  const login = (jwtToken) => {
    localStorage.setItem('jwtToken', jwtToken);
    setToken(jwtToken);
  };

  const logout = () => {
    logoutService();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
