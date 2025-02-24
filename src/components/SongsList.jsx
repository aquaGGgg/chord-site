import React, { useEffect, useState } from 'react';
import songsService from '../services/songsService';

const SongsList = ({ author, onSelectSong }) => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      if (author) {
        try {
          const data = await songsService.getSongsByAuthor(author);
          setSongs(data);
        } catch (error) {
          console.error("Ошибка при загрузке песен", error);
        }
      }
    };
    fetchSongs();
  }, [author]);

  if (!author) {
    return (
      <div style={placeholderStyle}>
        <p>Выберите исполнителя, чтобы увидеть список песен</p>
      </div>
    );
  }

  return (
    <div style={songsContainerStyle}>
      <h3 style={headingStyle}>Песни: {author}</h3>
      <ul style={listStyle}>
        {songs.map((song) => (
          <li 
            key={song.id} 
            onClick={() => onSelectSong(song)} 
            style={itemStyle}
          >
            {song.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

const songsContainerStyle = {
  height: '100%',
  backgroundColor: '#2a2e33',
  padding: '1rem',
  overflowY: 'auto',
  color: '#fff',
};

const headingStyle = {
  marginTop: 0,
  marginBottom: '1rem',
  fontSize: '1.2rem',
  fontWeight: 'bold',
};

const listStyle = {
  listStyleType: 'none',
  padding: 0,
  margin: 0,
};

const itemStyle = {
  padding: '0.75rem',
  marginBottom: '0.5rem',
  cursor: 'pointer',
  borderRadius: '8px',
  transition: 'background-color 0.3s',
  fontSize: '1rem',
  backgroundColor: '#3a3f44',
  color: '#fff',
  border: '1px solid #4a4f55',
};

const placeholderStyle = {
  height: '100%',
  backgroundColor: '#2a2e33',
  padding: '1rem',
  color: '#ccc',
};

export default SongsList;
