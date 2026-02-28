import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'https://farmacia-back-dm6j.onrender.com/chat';

const useChat = () => {
  const [mensagens, setMensagens] = useState([
    { role: 'bot', text: 'Olá! Sou seu assistente farmacêutico. Analiso seu estoque em tempo real. Como posso ajudar?' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const enviarMensagem = useCallback(async (perguntaUsuario, dadosDoEstoque) => {
    setLoading(true);
    setError(null);
    try {
      const dadosString = JSON.stringify(dadosDoEstoque);
      const payload = {
        pergunta: perguntaUsuario,
        dadosJson: dadosString
      };

      console.log("Enviando para o backend:", payload);

      const response = await axios.post(API_URL, payload);
      
      // Adiciona mensagem do usuário
      setMensagens(prev => [...prev, { role: 'user', text: perguntaUsuario }]);
      
      // Adiciona resposta do bot
      setMensagens(prev => [...prev, { role: 'bot', text: response.data }]);

      return response.data;
    } catch (err) {
      console.error("Erro na requisição:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const limparMensagens = useCallback(() => {
    setMensagens([
      { role: 'bot', text: 'Olá! Sou seu assistente farmacêutico. Analiso seu estoque em tempo real. Como posso ajudar?' }
    ]);
  }, []);

  return {
    mensagens,
    loading,
    error,
    enviarMensagem,
    limparMensagens
  };
};

export default useChat;
