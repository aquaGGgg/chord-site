import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [likedSongs, setLikedSongs] = useState([]);

  useEffect(() => {
    const fetchLikedSongs = async () => {
      if (user && user.id) {
        try {
          // Предполагается, что API возвращает список лайкнутых песен по данному пользователю
          const response = await api.get(`/users/${user.id}/favorites`);
          setLikedSongs(response.data);
        } catch (error) {
          console.error("Ошибка при загрузке лайкнутых песен", error);
        }
      }
    };
    fetchLikedSongs();
  }, [user]);

  const removeLike = async (songId) => {
    try {
      await api.delete(`/users/${user.id}/favorites/${songId}`);
      setLikedSongs(likedSongs.filter(song => song.id !== songId));
    } catch (error) {
      console.error("Ошибка при удалении лайка", error);
    }
  };

  return (
    <div style={profileStyle}>
      <h2>Профиль пользователя</h2>
      {user ? (
        <>
          <p>Имя: {user.username || user.email}</p>
          <h3>Лайкнутые песни</h3>
          {likedSongs.length ? (
            <ul style={listStyle}>
              {likedSongs.map(song => (
                <li key={song.id} style={itemStyle}>
                  {song.title}
                  <button onClick={() => removeLike(song.id)} style={removeButtonStyle}>Убрать лайк</button>
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

export default ProfilePage;
