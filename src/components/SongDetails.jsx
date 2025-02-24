import React, { useEffect, useState } from 'react';
import songsService from '../services/songsService';

const SongDetails = ({ songId }) => {
  const [song, setSong] = useState(null);

  useEffect(() => {
    const fetchSong = async () => {
      if (songId) {
        try {
          const data = await songsService.getSong(songId);
          setSong(data);
        } catch (error) {
          console.error("Ошибка при загрузке песни", error);
        }
      } else {
        setSong(null);
      }
    };
    fetchSong();
  }, [songId]);

  if (!song) {
    return (
      <div style={detailsPlaceholderStyle}>
        <p>Выберите песню, чтобы увидеть текст с аккордами</p>
      </div>
    );
  }

  return (
    <div style={detailsContentWrapper}>
      <div style={detailsContentStyle}>
        <h2 style={titleStyle}>{song.title}</h2>
        <h4 style={authorStyle}>Исполнитель: {song.author}</h4>
        <pre style={lyricsStyle}>{song.lyricsWithChords}</pre>
      </div>
    </div>
  );
};

/**
 * Обёртка, которая располагает контент по центру
 * (горизонтально), но оставляет вертикальную прокрутку.
 */
const detailsContentWrapper = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  // Можно добавить padding сверху/снизу, если нужно больше отступов
};

const detailsContentStyle = {
  width: '100%',
  maxWidth: '800px',            // Можно увеличить ширину для более крупного вида
  backgroundColor: '#3d4044',
  padding: '1.5rem',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0,0,0,0.5)',
  fontSize: '1.2rem',           // Общий размер шрифта (увеличен)
  lineHeight: '1.6',            // Увеличенная межстрочная высота
};

const detailsPlaceholderStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  color: '#ccc',
};

const titleStyle = {
  marginTop: 0,
  fontSize: '2rem',             // Увеличенный заголовок
  fontWeight: 'bold',
};

const authorStyle = {
  color: '#ccc',
  marginBottom: '1rem',
  fontSize: '1.3rem',           // Тоже немного увеличим
};

const lyricsStyle = {
  whiteSpace: 'pre-wrap',
  fontFamily: 'monospace',
  fontSize: '1.2rem',           // Увеличенный размер текста
  marginTop: '1rem',
};

export default SongDetails;
