import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Obtém o usuarioId do localStorage
const getUsuarioId = () => {
    try {
        const usuarioString = localStorage.getItem('usuarioLogado');
        if (!usuarioString) return null;
        const usuario = JSON.parse(usuarioString);
        return usuario?.id ?? null;
    } catch {
        return null;
    }
};

// Interceptor de REQUEST - injeta usuarioId automaticamente
api.interceptors.request.use(
    (config) => {
        const urlPessoais = config.url.match(/\/(pessoas|remedios)/);

        if (urlPessoais) {
            const usuarioId = getUsuarioId();

            if (!usuarioId) {
                console.error('[API] usuarioId não disponível para:', config.url);
            }

            if (!config.params) {
                config.params = {};
            }
            config.params.usuarioId = usuarioId;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de RESPONSE
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error(`[API] ${error.response.status} ${error.response.config.url}`, error.response.data);
        } else {
            console.error('[API] Erro de rede:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;