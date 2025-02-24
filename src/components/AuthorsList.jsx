import React, { useEffect, useState } from 'react';
import songsService from '../services/songsService';

const AuthorsList = ({ onSelectAuthor }) => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const data = await songsService.getAuthors();
        setAuthors(data);
      } catch (error) {
        console.error("Ошибка при загрузке авторов", error);
      }
    };
    fetchAuthors();
  }, []);

  return (
    <div style={authorsContainerStyle}>
      <h3 style={headingStyle}>Исполнители</h3>
      <ul style={listStyle}>
        {authors.map((author, index) => (
          <li
            key={index}
            onClick={() => onSelectAuthor(author)}
            style={itemStyle}
          >
            {author}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Стили для контейнера исполнителей
const authorsContainerStyle = {
  height: '100%',
  backgroundColor: '#1c1e22',
  padding: '1rem',
  overflowY: 'auto',
  color: '#fff',
};

// Стили для заголовка
const headingStyle = {
  marginTop: 0,
  marginBottom: '1rem',
  fontSize: '1.2rem',
  fontWeight: 'bold',
};

// Стили для списка
const listStyle = {
  listStyleType: 'none',
  padding: 0,
  margin: 0,
};

// Стили для каждого элемента списка
const itemStyle = {
  padding: '0.75rem',
  marginBottom: '0.5rem',
  cursor: 'pointer',
  borderRadius: '8px',
  transition: 'background-color 0.3s',
  fontSize: '1rem',
  backgroundColor: '#2a2e33',
  color: '#fff',
  border: '1px solid #3a3f44',
};

// При наведении мыши
const itemHoverStyle = {
  ...itemStyle,
  backgroundColor: '#3a3f44',
};

export default AuthorsList;
