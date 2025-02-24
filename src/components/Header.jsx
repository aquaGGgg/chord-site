import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header style={headerStyle}>
      <div>
        <Link to="/" style={linkStyle}>Главная</Link>
      </div>
      <div>
        {user ? (
          <>
            <Link to="/profile" style={linkStyle}>Профиль</Link>
            <button onClick={logout} style={buttonStyle}>Выйти</button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Войти</Link>
            <Link to="/register" style={linkStyle}>Регистрация</Link>
          </>
        )}
      </div>
    </header>
  );
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '10px 20px',
  backgroundColor: '#333',
  color: '#fff'
};

const linkStyle = {
  marginRight: '10px',
  color: '#fff',
  textDecoration: 'none'
};

const buttonStyle = {
  background: 'transparent',
  border: 'none',
  color: '#fff',
  cursor: 'pointer'
};

export default Header;
