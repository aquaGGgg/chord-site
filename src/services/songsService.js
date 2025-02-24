import api from './api';

const songsService = {
  // Получение списка авторов (каждый автор — строка)
  getAuthors: async () => {
    try {
      const response = await api.get('/songs/authors');
      return response.data;
    } catch (error) {
      // Если error.response не определён, выбрасываем error.message или сам error
      throw error.response?.data || error.message || error;
    }
  },
  // Получение песен по выбранному автору (фильтрация по строке)
  getSongsByAuthor: async (author) => {
    try {
      // Получаем все песни
      const response = await api.get('/songs');
      // Фильтруем песни по автору
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
};

export default songsService;
