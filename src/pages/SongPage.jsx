import React from 'react';
import SongPlayer from '../components/SongPlayer';
import SongDetails from '../components/SongDetails';

const SongPage = () => {
  // Можно будет передавать songId через props, context или query
  const exampleSongId = '123'; // временно захардкожено

  return (
    <div style={layoutStyle}>
      <div style={playerContainerStyle}>
        <SongPlayer />
        <SongDetails songId={exampleSongId} />
      </div>
    </div>
  );
};

const layoutStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: '#1f2227',
};

const playerContainerStyle = {
  flex: '1',
  padding: '20px',
  color: '#fff',
  overflow: 'auto',
};

export default SongPage;
