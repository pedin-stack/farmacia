import axios from 'axios';


const API_URL = 'https://farmacia-back-dm6j.onrender.com/chat';

const ChatService = {
    enviarMensagem: async (perguntaUsuario, dadosDoEstoque) => {
        try {
           
            const dadosString = JSON.stringify(dadosDoEstoque);

        
            const payload = {
                pergunta: perguntaUsuario,  
                dadosJson: dadosString      
            };

            console.log("Enviando para o backend:", payload); 

          
            const response = await axios.post(API_URL, payload);

           
            return response.data; 

        } catch (error) {
            console.error("Erro na requisição Axios:", error);
            throw error;
        }
    }
};

export default ChatService;