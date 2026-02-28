import { useState, useCallback } from 'react';
import api from '../api/axiosConfig';

const useAuth = () => {
  const [usuario, setUsuario] = useState(() => {
    const usuarioArmazenado = localStorage.getItem('usuarioLogado');
    return usuarioArmazenado ? JSON.parse(usuarioArmazenado) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/users/login', { email, password });
      
      if (response.data) {
        const usuarioData = response.data;
        console.log('[AUTH] Login OK - id:', usuarioData.id, 'email:', usuarioData.email);

        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioData));
        setUsuario(usuarioData);
      }
      return response.data;
    } catch (err) {
      console.error("[AUTH] Erro ao fazer login:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('usuarioLogado');
    setUsuario(null);
    setError(null);
  }, []);

  const isAuthenticated = useCallback(() => {
    return usuario !== null;
  }, [usuario]);

  return {
    usuario,
    loading,
    error,
    login,
    logout,
    isAuthenticated
  };
};

export default useAuth;
