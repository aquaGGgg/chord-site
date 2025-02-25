import React from 'react';
import SongPlayer from './SongPlayer'; // ваш компонент плеера песни
import GeneralChat from './GeneralChat';

const SongWithChat = () => {
  return (
    <div style={layoutStyle}>
      <div style={playerContainerStyle}>
        <SongPlayer />
      </div>
      <GeneralChat />
    </div>
  );
};

const layoutStyle = {
  display: 'flex',
  flexDirection: 'row',
  height: '100vh',
};

const playerContainerStyle = {
  flex: '1',
  backgroundColor: '#1f2227',
  padding: '20px',
  color: '#fff',
  overflow: 'auto'
};

export default SongWithChat;
