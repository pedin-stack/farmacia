import { useState, useCallback } from 'react';
import api from '../api/axiosConfig';

const BASE_URL = '/pessoas';

// Normaliza dados da API para o formato esperado pela UI
const normalizarPessoas = (dados) => {
  const raw = dados?.content ?? dados;
  return (Array.isArray(raw) ? raw : (raw ? [raw] : [])).map(p => ({
    ...p,
    itens: (p.remedios || p.itens || []).map(item => ({
      ...item,
      id: item.id,
      remedio: item.nome,
      estoque: item.quantidade,
      usoDiario: item.usoDiario,
      quantidade: `${item.quantidade} un.`,
      proximaCompra: item.proxCompra
        ? item.proxCompra.split('-').reverse().join('/')
        : 'A calcular',
      dataIso: item.proxCompra || '',
      status: item.status === 'NORMAL' ? 'ok' : (item.status === 'URGENTE' ? 'urgente' : 'atencao'),
      horario: item.horaConsumo ? (typeof item.horaConsumo === 'string' ? item.horaConsumo.substring(0,5) : '') : '-',
      horaIso: item.horaConsumo || ''
    }))
  }));
};

const usePessoa = () => {
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const findAll = useCallback(async (page = 0, size = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`${BASE_URL}`, {
        params: { page, size }
      });
      const normalizado = normalizarPessoas(response.data);
      setPessoas(normalizado);
      return normalizado;
    } catch (err) {
      console.error("Erro ao buscar pessoas:", err);
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
      console.error(`Erro ao buscar pessoa com ID ${id}:`, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(async (pessoaData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`${BASE_URL}`, pessoaData);
      const normalizado = normalizarPessoas([response.data]);
      setPessoas(prev => [...prev, normalizado[0]]);
      return response.data;
    } catch (err) {
      console.error("Erro ao salvar pessoa:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id, pessoaData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`${BASE_URL}/${id}`, pessoaData);
      setPessoas(prev => prev.map(p => p.id === id ? { ...p, ...response.data } : p));
      return response.data;
    } catch (err) {
      console.error(`Erro ao atualizar pessoa com ID ${id}:`, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePessoa = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`${BASE_URL}/${id}`);
      setPessoas(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(`Erro ao deletar pessoa com ID ${id}:`, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    pessoas,
    loading,
    error,
    findAll,
    findById,
    save,
    update,
    deletePessoa,
    atualizarItem: (pessoaId, itemModificado) => {
      setPessoas(prev => prev.map(p => 
        p.id === pessoaId 
          ? { ...p, itens: p.itens.map(i => i.id === itemModificado.id ? itemModificado : i) }
          : p
      ));
    },
    removerItem: (pessoaId, itemId) => {
      setPessoas(prev => prev.map(p =>
        p.id === pessoaId
          ? { ...p, itens: p.itens.filter(i => i.id !== itemId) }
          : p
      ));
    }
  };
};

export default usePessoa;
