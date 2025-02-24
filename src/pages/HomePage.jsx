import React, { useState } from 'react';
import AuthorsList from '../components/AuthorsList';
import SongsList from '../components/SongsList';
import SongDetails from '../components/SongDetails';

const HomePage = () => {
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);

  const handleSelectAuthor = (author) => {
    setSelectedAuthor(author);
    setSelectedSong(null);
  };

  const handleSelectSong = (song) => {
    setSelectedSong(song);
  };

  return (
    <div style={containerStyle}>
      {/* Левая колонка: исполнители */}
      <div style={authorsColumnStyle}>
        <AuthorsList onSelectAuthor={handleSelectAuthor} />
      </div>

      {/* Средняя колонка: песни */}
      <div style={songsColumnStyle}>
        <SongsList author={selectedAuthor} onSelectSong={handleSelectSong} />
      </div>

      {/* Правая колонка: детали песни */}
      <div style={detailsColumnStyle}>
        <SongDetails songId={selectedSong ? selectedSong.id : null} />
      </div>
    </div>
  );
};

const containerStyle = {
  display: 'flex',
  height: 'calc(100vh - 60px)',
  background: 'linear-gradient(135deg, #1e1e1e, #3a3a3a)',
  fontFamily: "'Roboto', sans-serif",
  color: '#fff',
};

/** Левая колонка (исполнители) */
const authorsColumnStyle = {
  width: '220px',
  minWidth: '220px',
  borderRight: '1px solid #444',
  boxShadow: '2px 0 5px rgba(0,0,0,0.3)',
};

/** Средняя колонка (список песен) */
const songsColumnStyle = {
  width: '280px',
  minWidth: '280px',
  borderRight: '1px solid #444',
};

/** Правая колонка (детали песни) – растягивается, 
    а контент внутри выравниваем по центру */
const detailsColumnStyle = {
  flex: 1,
  display: 'flex',
  justifyContent: 'center',   // горизонтальное центрирование
  alignItems: 'flex-start',   // при желании можно поставить 'center'
  padding: '1rem',
  overflowY: 'auto',
};

export default HomePage;
