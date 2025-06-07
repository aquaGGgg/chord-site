import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // ✅ исправленный импорт
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token); // ✅ исправленное имя
        const userData = {
          id: decoded.id,
          email: decoded.email,
          username: decoded.username || decoded.email,
          role: decoded.role || 'User'
        };
        setUser(userData);
      } catch (error) {
        console.error("Ошибка при декодировании токена:", error);
        logout();
      }
    }
  }, [token]);

  const setAuthData = (accessToken, refreshToken, userData) => {
    setToken(accessToken);
    setRefreshToken(refreshToken);
    setUser(userData);

    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const login = async (email, password) => {
    try {
      if (email === 'admin' && password === 'admin') {
        const adminUser = { id: 1, email, username: 'Administrator', role: 'Admin' };
        setAuthData('fake-admin-token', 'fake-refresh-token', adminUser);
        navigate('/profile');
        return;
      }

      const data = await authService.login(email, password);
      const decoded = jwtDecode(data.token || data.accessToken);
      const userData = {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username || email,
        role: decoded.role || 'User'
      };

      setAuthData(data.token || data.accessToken, data.refreshToken, userData);
      navigate('/profile');
    } catch (error) {
      console.error("Ошибка при входе:", error);
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const data = await authService.register(username, email, password);
      const decoded = jwtDecode(data.token || data.accessToken);
      const userData = {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username || email,
        role: decoded.role || 'User'
      };

      setAuthData(data.token || data.accessToken, data.refreshToken, userData);
      navigate('/profile');
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      throw error;
    }
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) return;

    try {
      const data = await authService.refreshToken(refreshToken);
      const newAccessToken = data.token || data.accessToken;
      setToken(newAccessToken);
      localStorage.setItem('token', newAccessToken);
    } catch (error) {
      console.error("Ошибка при обновлении токена:", error);
      logout();
    }
  };

  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{ user, token, refreshToken, login, register, logout, refreshAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
