import { useState, useCallback, useEffect } from 'react';
import moment from 'moment';
import usePessoa from './usePessoa';
import useRemedio from './useRemedio';
import { message } from 'antd';

const useDashboard = () => {
  const { pessoas, findAll, save: savePessoa, deletePessoa, removerItem } = usePessoa();
  const { deleteRemedio, save: saveRemedio, update: updateRemedio } = useRemedio();

  // Estado de UI (modais e formulários)
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [targetPersonId, setTargetPersonId] = useState(null);
  const [personModalVisible, setPersonModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadDados = useCallback(async () => {
    setLoading(true);
    try {
      await findAll();
    } catch (err) {
      message.error('Erro ao carregar dados do servidor');
      console.error('[Dashboard] Erro:', err);
    } finally {
      setLoading(false);
    }
  }, [findAll]);

  // Carregar dados na montagem
  useEffect(() => {
    const usuarioString = localStorage.getItem('usuarioLogado');
    
    if (!usuarioString) {
      message.error('Você precisa estar logado para acessar o dashboard');
      return;
    }
    
    try {
      const usuario = JSON.parse(usuarioString);
      if (usuario.id) {
        loadDados();
      } else {
        message.error('Dados de autenticação inválidos. Faça login novamente.');
      }
    } catch {
      message.error('Erro ao carregar dados de autenticação');
    }
  }, [loadDados]);

  // ===== HANDLERS PESSOA =====
  const handleAddPerson = useCallback(() => {
    setPersonModalVisible(true);
  }, []);

  const handleSavePerson = useCallback(async (formValues) => {
    setLoading(true);
    try {
      const nova = { nome: formValues.nomePessoa, itens: [] };
      await savePessoa(nova);
      setPersonModalVisible(false);
      message.success('Pessoa adicionada!');
    } catch (err) {
      console.error(err);
      message.error('Erro ao adicionar pessoa');
    } finally {
      setLoading(false);
    }
  }, [savePessoa]);

  const handleDeletePerson = useCallback(async (id) => {
    setLoading(true);
    try {
      await deletePessoa(id);
      message.success('Pessoa removida');
    } catch (err) {
      console.error(err);
      message.error('Erro ao remover pessoa');
    } finally {
      setLoading(false);
    }
  }, [deletePessoa]);

  // ===== HANDLERS ITEM/REMÉDIO =====
  const handleAddItem = useCallback((personId) => {
    setEditingItem(null);
    setTargetPersonId(personId);
    setItemModalVisible(true);
  }, []);

  const handleEditItem = useCallback((item, personId) => {
    setEditingItem(item);
    setTargetPersonId(personId);
    setItemModalVisible(true);
  }, []);

  const handleDeleteItem = useCallback(async (itemId, personId) => {
    setLoading(true);
    try {
      await deleteRemedio(itemId);
      removerItem(personId, itemId);
      message.success('Item removido com sucesso!');
    } catch (err) {
      console.error(err);
      message.error('Erro ao remover item.');
    } finally {
      setLoading(false);
    }
  }, [deleteRemedio, removerItem]);

  const handleSaveItem = useCallback(async (formValues) => {
    const payloadBase = {
      nome: formValues.remedio,
      quantidade: formValues.estoque,
      usoDiario: formValues.usoDiario,
    };

    if (formValues.horario) {
      payloadBase.horaConsumo = formValues.horario.format('HH:mm:ss');
    }

    setLoading(true);
    try {
      if (editingItem) {
        console.log('Enviando (PUT):', payloadBase);
        await updateRemedio(editingItem.id, payloadBase);
        message.success('Medicamento atualizado!');
      } else {
        const payloadCreate = { ...payloadBase, pessoaId: targetPersonId };
        console.log('Enviando (POST):', payloadCreate);
        await saveRemedio(payloadCreate);
        message.success('Medicamento criado!');
      }

      setItemModalVisible(false);
      await loadDados();
    } catch (err) {
      console.error(err);
      message.error('Erro ao salvar. Verifique se a pessoa existe.');
    } finally {
      setLoading(false);
    }
  }, [targetPersonId, editingItem, updateRemedio, saveRemedio, loadDados]);

  // ===== CÁLCULOS =====
  const totalRemedios = pessoas.reduce((acc, p) => acc + (p?.itens?.length ?? 0), 0);
  const totalUrgentes = pessoas.reduce((acc, pessoa) => {
    const urgentes = pessoa.itens.filter(item => item.status === 'urgente').length;
    return acc + urgentes;
  }, 0);

  // ===== PREPARAR DADOS PARA EDIÇÃO =====
  const getEditingItemForForm = useCallback(() => {
    if (!editingItem) return {};
    return {
      ...editingItem,
      horario: editingItem.horario && editingItem.horario !== '-' 
        ? moment(editingItem.horario, 'HH:mm') 
        : null
    };
  }, [editingItem]);

  // ===== FECHAR MODAIS =====
  const closeItemModal = useCallback(() => {
    setItemModalVisible(false);
    setEditingItem(null);
    setTargetPersonId(null);
  }, []);

  const closePersonModal = useCallback(() => {
    setPersonModalVisible(false);
  }, []);

  return {
    // Estado de dados
    dadosDoEstoque: pessoas,
    loading,
    itemModalVisible,
    editingItem,
    personModalVisible,

    // Handlers de pessoa
    handleAddPerson,
    handleSavePerson,
    handleDeletePerson,

    // Handlers de item
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleSaveItem,

    // Dados calculados
    totalRemedios,
    totalUrgentes,

    // Helpers
    getEditingItemForForm,
    closeItemModal,
    closePersonModal,

    // Reload
    loadDados
  };
};

export default useDashboard;
