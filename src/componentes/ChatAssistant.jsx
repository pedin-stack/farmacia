import React, { useState, useRef, useEffect } from 'react';
import { MessageOutlined, CloseOutlined, SendOutlined, RobotOutlined } from '@ant-design/icons';
import { message as antMessage } from 'antd';
import ChatService from '../api/ChatService';
import ReactMarkdown from 'react-markdown';

const ChatAssistant = ({ dadosEstoque }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [mensagens, setMensagens] = useState([
        { role: 'bot', text: 'Olá! Sou seu assistente farmacêutico. Analiso seu estoque em tempo real. Como posso ajudar?' }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [mensagens, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const textoUsuario = input;
        setInput('');


        setMensagens(prev => [...prev, { role: 'user', text: textoUsuario }]);
        setLoading(true);

        try {

            const estoqueResumido = dadosEstoque.map(p => ({
                pessoa: p.nome,
                remedios: p.itens.map(i => `${i.remedio} (${i.quantidade}) - Fim: ${i.proximaCompra}`)
            }));

            const respostaIA = await ChatService.enviarMensagem(textoUsuario, estoqueResumido);

            setMensagens(prev => [...prev, { role: 'bot', text: respostaIA }]);

        } catch (error) {
            antMessage.error("Erro ao falar com o assistente.");
            setMensagens(prev => [...prev, { role: 'bot', text: 'Erro de conexão. Verifique se o backend está rodando.' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="position-fixed bottom-0 end-0 p-4" style={{ zIndex: 1000 }}>

            {/* JANELA DO CHAT */}
            {isOpen && (
                <div className="bg-white shadow-lg rounded mb-3 d-flex flex-column overflow-hidden" style={{ width: '350px', height: '480px', border: '1px solid #dee2e6' }}>

                    {/* Header */}
                    <div className="bg-primary text-white p-3 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                            <RobotOutlined style={{ fontSize: '1.2rem' }} />
                            <span className="fw-bold">Farmacêutico IA</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="btn btn-sm text-white border-0 p-0"><CloseOutlined /></button>
                    </div>

                    {/* Mensagens */}
                    <div ref={scrollRef} className="flex-grow-1 p-3 overflow-auto bg-light">
                        {mensagens.map((msg, idx) => (
                            <div key={idx} className={`d-flex mb-3 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                                <div className={`p-2 rounded shadow-sm ${msg.role === 'user' ? 'bg-primary text-white text-end' : 'bg-white text-dark text-start border'}`} style={{ maxWidth: '85%', fontSize: '0.9rem' }}>
                                    <div style={{ textAlign: 'left' }}>
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && <div className="text-center text-muted small"><span className="spinner-border spinner-border-sm me-2"></span>Processando...</div>}
                    </div>

                    {/* Input */}
                    <div className="p-2 border-top bg-white d-flex gap-2">
                        <input
                            type="text"
                            className="form-control form-control-sm border-0 bg-light"
                            placeholder="Ex: quais remédios estão perto do fim?"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                        />
                        <button className="btn btn-primary btn-sm" onClick={handleSend} disabled={loading}><SendOutlined /></button>
                    </div>
                </div>
            )}

            {/* FAB (Botão Flutuante) */}
            <div className="d-flex justify-content-end">
                <button onClick={() => setIsOpen(!isOpen)} className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                    {isOpen ? <CloseOutlined /> : <MessageOutlined />}
                </button>
            </div>
        </div>
    );
};

export default ChatAssistant;