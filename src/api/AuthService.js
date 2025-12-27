import api from './axiosConfig';

const AuthService = {
  login: async (email, password) => {
    try {
      
      const response = await api.post('/users/login', { email, password });
      
      // Se der certo, salva os dados do usuário no navegador
      if (response.data) {
        localStorage.setItem('usuarioLogado', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('usuarioLogado');
  },

  isAuthenticated: () => {
    return localStorage.getItem('usuarioLogado') !== null;
  }
};

export default AuthService;