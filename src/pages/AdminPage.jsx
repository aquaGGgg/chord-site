import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Модуль для работы с API

const AdminPage = () => {
  const [songs, setSongs] = useState([]);
  const [newSong, setNewSong] = useState({ title: '', author: '', lyricsWithChords: '' });
  const [editingSong, setEditingSong] = useState(null);

  // Загружаем песни при открытии страницы
  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await api.get('/songs');
      setSongs(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке песен:', error);
    }
  };

  const createSong = async () => {
    try {
      const response = await api.post('/songs', newSong);
      setSongs([...songs, response.data]);
      setNewSong({ title: '', author: '', lyricsWithChords: '' });
    } catch (error) {
      console.error('Ошибка при создании песни:', error);
    }
  };

  const updateSong = async () => {
    try {
      const response = await api.put(`/songs/${editingSong.id}`, editingSong);
      setSongs(songs.map(song => (song.id === editingSong.id ? response.data : song)));
      setEditingSong(null);
    } catch (error) {
      console.error('Ошибка при обновлении песни:', error);
    }
  };

  const deleteSong = async (id) => {
    try {
      await api.delete(`/songs/${id}`);
      setSongs(songs.filter(song => song.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении песни:', error);
    }
  };

  return (
    <div style={adminPageStyle}>
      <h2>Админ-панель</h2>

      <div style={formStyle}>
        <h3>{editingSong ? 'Редактировать песню' : 'Добавить новую песню'}</h3>
        <input
          type="text"
          placeholder="Автор"
          value={editingSong ? editingSong.author : newSong.author}
          onChange={(e) => editingSong ? setEditingSong({ ...editingSong, author: e.target.value }) : setNewSong({ ...newSong, author: e.target.value })}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Название"
          value={editingSong ? editingSong.title : newSong.title}
          onChange={(e) => editingSong ? setEditingSong({ ...editingSong, title: e.target.value }) : setNewSong({ ...newSong, title: e.target.value })}
          style={inputStyle}
        />
        <textarea
          placeholder="Текст с аккордами"
          value={editingSong ? editingSong.lyricsWithChords : newSong.lyricsWithChords}
          onChange={(e) => editingSong ? setEditingSong({ ...editingSong, lyricsWithChords: e.target.value }) : setNewSong({ ...newSong, lyricsWithChords: e.target.value })}
          style={textareaStyle}
        />
        <button onClick={editingSong ? updateSong : createSong} style={buttonStyle}>
          {editingSong ? 'Обновить песню' : 'Добавить песню'}
        </button>
        {editingSong && <button onClick={() => setEditingSong(null)} style={cancelButtonStyle}>Отменить редактирование</button>}
      </div>

      <h3>Список песен</h3>
      <ul style={listStyle}>
        {songs.map(song => (
          <li key={song.id} style={listItemStyle}>
            <p><strong>{song.title}</strong> - {song.author}</p>
            <button onClick={() => setEditingSong(song)} style={editButtonStyle}>Редактировать</button>
            <button onClick={() => deleteSong(song.id)} style={deleteButtonStyle}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const adminPageStyle = {
  maxWidth: '800px',
  margin: '50px auto',
  padding: '20px',
  backgroundColor: '#333',
  color: '#fff',
  borderRadius: '8px',
};

const formStyle = {
  marginBottom: '20px',
};

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '4px',
  border: 'none',
};

const textareaStyle = {
  display: 'block',
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '4px',
  border: 'none',
};

const buttonStyle = {
  padding: '10px 20px',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#28a745',
  color: '#fff',
  cursor: 'pointer',
};

const cancelButtonStyle = {
  padding: '10px 20px',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#d9534f',
  color: '#fff',
  cursor: 'pointer',
  marginLeft: '10px',
};

const listStyle = {
  listStyleType: 'none',
  padding: 0,
};

const listItemStyle = {
  marginBottom: '10px',
  padding: '10px',
  backgroundColor: '#444',
  borderRadius: '4px',
};

const editButtonStyle = {
  padding: '5px 10px',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#ffc107',
  color: '#fff',
  cursor: 'pointer',
  marginRight: '10px',
};

const deleteButtonStyle = {
  padding: '5px 10px',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: '#d9534f',
  color: '#fff',
  cursor: 'pointer',
};

export default AdminPage;
