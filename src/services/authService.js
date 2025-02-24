import api from './api';

const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  register: async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', { userName: username, email, password });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default authService;
