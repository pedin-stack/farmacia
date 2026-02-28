import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import useAuth from './useAuth';

const useLoginForm = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();

    if (!email || !password) {
      message.error('Email e senha são obrigatórios.');
      return;
    }

    try {
      await login(email, password);
      message.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      message.error('Email ou senha incorretos.');
    }
  }, [email, password, login, navigate]);

  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
  }, []);

  return {
    email,
    password,
    loading,
    setEmail,
    setPassword,
    handleLogin,
    resetForm
  };
};

export default useLoginForm;
