import { useState, useCallback } from 'react';
import api from '../api/axiosConfig';

const BASE_URL = '/remedios';

const useRemedio = () => {
  const [remedios, setRemedios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const findAll = useCallback(async (page = 0, size = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`${BASE_URL}`, {
        params: { page, size }
      });
      setRemedios(response.data);
      return response.data;
    } catch (err) {
      console.error("Erro ao buscar remédios:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const findById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (err) {
      console.error(`Erro ao buscar remédio com ID ${id}:`, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(async (remedioData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`${BASE_URL}`, remedioData);
      setRemedios(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error("Erro ao salvar remédio:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id, remedioData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`${BASE_URL}/${id}`, remedioData);
      setRemedios(prev => prev.map(r => r.id === id ? response.data : r));
      return response.data;
    } catch (err) {
      console.error(`Erro ao atualizar remédio com ID ${id}:`, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRemedio = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`${BASE_URL}/${id}`);
      setRemedios(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error(`Erro ao deletar remédio com ID ${id}:`, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    remedios,
    loading,
    error,
    findAll,
    findById,
    save,
    update,
    deleteRemedio
  };
};

export default useRemedio;
