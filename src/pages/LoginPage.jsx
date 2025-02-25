import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Добавляем проверку для логина admin / admin
    if (email === 'admin' && password === 'admin') {
      try {
        await login(email, password);
        return; // Прерываем дальнейшее выполнение если это админ
      } catch (err) {
        setError(err.message || 'Ошибка при входе');
        return;
      }
    }

    // Стандартная валидация для email
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Неверный формат электронной почты');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Ошибка при входе');
    }
  };

  return (
    <div style={formContainerStyle}>
      <h2>Вход</h2>
      {error && <div style={errorStyle}>{error}</div>}
      <form onSubmit={handleSubmit} style={formStyle}>
        <input 
          type="text" // Изменяем на type="text", чтобы можно было вводить admin
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />
        <input 
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
        />
        <button type="submit" style={buttonStyle}>Войти</button>
      </form>
      <p>
        Нет аккаунта? <a href="/register">Зарегистрируйтесь</a>
      </p>
    </div>
  );
};

const formContainerStyle = {
  maxWidth: '400px',
  margin: '50px auto',
  padding: '20px',
  backgroundColor: '#333',
  color: '#fff',
  borderRadius: '8px'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const inputStyle = {
  marginBottom: '10px',
  padding: '10px',
  borderRadius: '4px',
  border: 'none'
};

const buttonStyle = {
  padding: '10px',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#555',
  color: '#fff',
  cursor: 'pointer'
};

const errorStyle = {
  color: 'red',
  marginBottom: '10px'
};

export default LoginPage;
