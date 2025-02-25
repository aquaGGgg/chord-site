import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Ошибка при загрузке пользователя из localStorage:", error);
        setUser(null);
        localStorage.removeItem('user');
      }
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      // Логин для админа (демо-режим)
      if (email === 'admin' && password === 'admin') {
        const userData = { id: 1, email: 'admin', username: 'Administrator' };
        setUser(userData);
        setToken('fake-admin-token');
        localStorage.setItem('token', 'fake-admin-token');
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/profile');
        return;
      }
  
      const data = await authService.login(email, password);
      console.log("Ответ от сервера:", data); // <-- Лог для отладки!
  
      // Учёт того, что сервер возвращает "Token" с заглавной буквы
      const returnedToken = data.Token || data.token;
      if (!returnedToken) {
        throw new Error("Некорректный ответ сервера");
      }
  
      // Так как сервер не возвращает объект user, создаём его на основе email
      const userData = { 
        id: 0, 
        email: email, 
        username: email 
      };
  
      setToken(returnedToken);
      localStorage.setItem('token', returnedToken);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
  
      navigate('/profile');
    } catch (error) {
      console.error("Ошибка при входе:", error);
      throw error;
    }
  };
  
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
