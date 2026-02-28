import { useState, useCallback } from 'react';
import useChat from './useChat';

const useChatAssistant = (dadosEstoque) => {
  const [input, setInput] = useState('');
  const { mensagens, loading, enviarMensagem } = useChat();

  const handleSend = useCallback(async (texto) => {
    if (!texto.trim()) return;

    const estoqueResumido = dadosEstoque.map(p => ({
      pessoa: p.nome,
      remedios: p.itens.map(i => `${i.remedio} (${i.quantidade}) - Fim: ${i.proximaCompra}`)
    }));

    await enviarMensagem(texto, estoqueResumido);
  }, [dadosEstoque, enviarMensagem]);

  return {
    input,
    setInput,
    mensagens,
    loading,
    handleSend
  };
};

export default useChatAssistant;
