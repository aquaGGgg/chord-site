import api from './api';

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      // Проверяем наличие error.response и error.response.data
      if (error.response && error.response.data) {
        throw error.response.data;
      } else {
        throw { message: "Ошибка при подключении к серверу" };
      }
    }
  },
  register: async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', { userName: username, email, password });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw error.response.data;
      } else {
        throw { message: "Ошибка при подключении к серверу" };
      }
    }
  },
};

export default authService;
