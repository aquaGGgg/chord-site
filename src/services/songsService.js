import api from './api';

const songsService = {
  // Получение списка авторов (каждый автор — строка)
  getAuthors: async () => {
    try {
      const response = await api.get('/songs/authors');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message || error;
    }
  },
  // Получение песен по выбранному автору (фильтрация по строке)
  getSongsByAuthor: async (author) => {
    try {
      const response = await api.get('/songs');
      const allSongs = response.data;
      const filteredSongs = allSongs.filter(song => song.author === author);
      return filteredSongs;
    } catch (error) {
      throw error.response?.data || error.message || error;
    }
  },
  // Получение деталей песни
  getSong: async (songId) => {
    try {
      const response = await api.get(`/songs/${songId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message || error;
    }
  },
  // Добавление песни в избранное для пользователя
  addFavorite: async (userId, songId) => {
    try {
      const response = await api.post(`/users/${userId}/favorites`, { songId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message || error;
    }
  },
  // Удаление песни из избранного для пользователя
  removeFavorite: async (userId, songId) => {
    try {
      const response = await api.delete(`/users/${userId}/favorites/${songId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message || error;
    }
  },
  // Получение избранных песен пользователя
  getFavorites: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/favorites`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message || error;
    }
  },
};

export default songsService;
