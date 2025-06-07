// src/components/SongDetails.jsx
import React, { useEffect, useState, useContext } from 'react';
import songsService from '../services/songsService';
import { AuthContext } from '../context/AuthContext';

const CHROMATIC_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const CHROMATIC_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const SongDetails = ({ songId }) => {
  const { user } = useContext(AuthContext);
  const [song, setSong] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [transposeStep, setTransposeStep] = useState(0);
  const [displayedLyrics, setDisplayedLyrics] = useState('');

  useEffect(() => {
    const fetchSongDetails = async () => {
      if (!songId) {
        setSong(null);
        setDisplayedLyrics('');
        setTransposeStep(0);
        return;
      }
      try {
        const data = await songsService.getSong(songId);
        setSong(data);
        setDisplayedLyrics(data.lyricsWithChords);
        setTransposeStep(0);

        if (user) {
          const favorites = await songsService.getFavorites();
          setIsFavorite(favorites.some(fav => fav.id === songId));
        }
      } catch (error) {
        console.error("Ошибка при загрузке песни или избранного", error);
      }
    };

    fetchSongDetails();
  }, [songId, user]);

  const toggleFavorite = async () => {
    if (!user) return;
    try {
      if (isFavorite) {
        await songsService.removeFavorite(songId);
        setIsFavorite(false);
      } else {
        await songsService.addFavorite(songId);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Ошибка при переключении избранного", error);
    }
  };

  const transposeChord = (chord, step) => {
    if (!chord || step === 0) return chord;
    const match = chord.match(/^([A-G])([#b]?)(.*)$/);
    if (!match) return chord;
    let [ , root, accidental, suffix ] = match;
    let useFlats = false;

    let noteName = root;
    if (accidental === '#') noteName += '#';
    else if (accidental === 'b') {
      noteName += 'b';
      useFlats = true;
    }

    let chromatic = useFlats ? CHROMATIC_FLAT : CHROMATIC_SHARP;
    if (!chromatic.includes(noteName)) {
      chromatic = CHROMATIC_SHARP.includes(noteName) ? CHROMATIC_SHARP : CHROMATIC_FLAT;
    }

    const idx = chromatic.findIndex(n => n === noteName);
    if (idx < 0) return chord;

    let newIndex = (idx + step) % 12;
    if (newIndex < 0) newIndex += 12;
    return chromatic[newIndex] + suffix;
  };

  const transposeLyrics = (fullText, step) => {
    return fullText
      .split('\n')
      .map(line => {
        const tokens = line.split(/(\s+)/);
        return tokens
          .map(tok => (/^\s*$/.test(tok) ? tok : transposeChord(tok, step)))
          .join('');
      })
      .join('\n');
  };

  const handleTransposeUp = () => {
    if (!song) return;
    const newStep = (transposeStep + 1) % 12;
    setTransposeStep(newStep);
    setDisplayedLyrics(transposeLyrics(song.lyricsWithChords, newStep));
  };

  const handleTransposeDown = () => {
    if (!song) return;
    const newStep = (transposeStep + 11) % 12;
    setTransposeStep(newStep);
    setDisplayedLyrics(transposeLyrics(song.lyricsWithChords, newStep));
  };

  const handleReset = () => {
    if (!song) return;
    setTransposeStep(0);
    setDisplayedLyrics(song.lyricsWithChords);
  };

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
        <div style={headerStyle}>
          <h2 style={titleStyle}>{song.title}</h2>
          {user && (
            <button
              onClick={toggleFavorite}
              style={{
                ...likeButtonStyle,
                backgroundColor: isFavorite ? '#d9534f' : '#28a745',
              }}
            >
              {isFavorite ? 'Убрать из избранного' : 'В избранное'}
            </button>
          )}
        </div>

        <h4 style={authorStyle}>Исполнитель: {song.author}</h4>

        <div style={mainContainerStyle}>
          <pre style={lyricsStyle}>{displayedLyrics}</pre>

          <div style={transposePanelStyle}>
            <div style={buttonsWrapperStyle}>
              <button onClick={handleTransposeDown} style={transposeButtonSquareStyle}>−</button>
              <button onClick={handleTransposeUp} style={transposeButtonSquareStyle}>+</button>
            </div>
            <button onClick={handleReset} style={resetLinkStyle}>Сбросить</button>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Новый стиль в стиле сайта **/

const detailsContentWrapper = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
};

const detailsContentStyle = {
  width: '100%',
  maxWidth: '900px',
  backgroundColor: '#3d4044',
  padding: '1.5rem',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0,0,0,0.5)',
  fontSize: '1.2rem',
  lineHeight: '1.6',
  color: '#fff',
};

const detailsPlaceholderStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  color: '#ccc',
  fontSize: '1.2rem',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const titleStyle = {
  margin: 0,
  fontSize: '2rem',
  fontWeight: 'bold',
};

const authorStyle = {
  color: '#ccc',
  marginTop: '0.5rem',
  marginBottom: '1rem',
  fontSize: '1.3rem',
};

const mainContainerStyle = {
  display: 'flex',
  width: '100%',
};

const lyricsStyle = {
  flexGrow: 1,
  whiteSpace: 'pre-wrap',
  fontFamily: 'monospace',
  fontSize: '1.1rem',
  margin: 0,
  paddingRight: '1rem',
  overflowX: 'auto',
};

/** 🔵 Новый стиль для транспонирования **/
const transposePanelStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '80px',
  height: '80px',
  backgroundColor: '#444',
  borderRadius: '8px',
  border: '1px solid #007bff',
};

const buttonsWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  marginBottom: '4px',
};

const transposeButtonSquareStyle = {
  width: '32px',
  height: '32px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  transition: 'background-color 0.2s ease',
};

const resetLinkStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  color: '#66b2ff',
  fontSize: '0.75rem',
  cursor: 'pointer',
  textDecoration: 'underline',
};

const likeButtonStyle = {
  padding: '0.5rem 1rem',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '6px',
  color: '#fff',
  cursor: 'pointer',
};

export default SongDetails;
