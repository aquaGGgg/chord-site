import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import songsService from '../services/songsService';

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const [likedSongs, setLikedSongs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedSongs = async () => {
      if (user) {
        try {
          const favorites = await songsService.getFavorites(user.email);
          setLikedSongs(favorites);
        } catch (error) {
          console.error("Ошибка при загрузке лайкнутых песен", error);
        }
      }
    };
    fetchLikedSongs();
  }, [user]);

  const removeLike = async (songId) => {
    try {
      await songsService.removeFavorite(user.id, songId);
      setLikedSongs(likedSongs.filter(song => song.id !== songId));
    } catch (error) {
      console.error("Ошибка при удалении лайка", error);
    }
  };

  const handleAdminPanelClick = () => {
    navigate('/admin');
  };

  return (
    <div style={profileStyle}>
      <h2>Профиль пользователя</h2>
      {user ? (
        <>
          <p>Имя: {user.username || user.email}</p>
          {(user.role?.toLowerCase() === 'admin') && (
            <button onClick={handleAdminPanelClick} style={adminButtonStyle}>
              Открыть админ-панель
            </button>
          )}
          <h3>Лайкнутые песни</h3>
          {likedSongs.length ? (
            <ul style={listStyle}>
              {likedSongs.map(song => (
                <li key={song.id} style={itemStyle}>
                  {song.title}
                  <button onClick={() => removeLike(song.id)} style={removeButtonStyle}>
                    Убрать лайк
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Нет лайкнутых песен.</p>
          )}
        </>
      ) : (
        <p>Пользователь не авторизован.</p>
      )}
      <button onClick={logout} style={logoutButtonStyle}>Выйти</button>
    </div>
  );
};

const profileStyle = {
  maxWidth: '600px',
  margin: '50px auto',
  padding: '20px',
  backgroundColor: '#333',
  color: '#fff',
  borderRadius: '8px'
};

const listStyle = {
  listStyleType: 'none',
  padding: 0
};

const itemStyle = {
  marginBottom: '10px'
};

const removeButtonStyle = {
  marginLeft: '10px',
  backgroundColor: '#555',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const adminButtonStyle = {
  marginBottom: '20px',
  padding: '10px',
  borderRadius: '4px',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  cursor: 'pointer'
};

const logoutButtonStyle = {
  marginTop: '20px',
  padding: '10px',
  borderRadius: '4px',
  backgroundColor: '#d9534f',
  color: '#fff',
  border: 'none',
  cursor: 'pointer'
};

export default ProfilePage;
