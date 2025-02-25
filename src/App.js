import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';  // Добавляем AdminPage
import ChatPage from './pages/ChatPage';       // Импортируем ChatPage
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} /> {/* Маршрут для AdminPage */}
          <Route path="/chat" element={<ChatPage />} />   {/* Маршрут для чата */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
