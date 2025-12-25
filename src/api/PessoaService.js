import api from './axiosConfig';

const BASE_URL = '/pessoas';

const PessoaService = {

    // Consome: GET /pessoas?page=0&size=10
    findAll: async (page = 0, size = 10) => {
        try {
            const response = await api.get(`${BASE_URL}`, {
                params: { page, size }
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar pessoas:", error);
            throw error;
        }
    },

    // Consome: GET /pessoas/{id}
    findById: async (id) => {
        try {
            const response = await api.get(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar pessoa com ID ${id}:`, error);
            throw error;
        }
    },

    save: async (pessoaData) => {
        try {
            const response = await api.post(`${BASE_URL}`, pessoaData);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error("Erro ao salvar pessoa: status=", error.response.status, "data=", error.response.data);
            } else {
                console.error("Erro ao salvar pessoa:", error.message);
            }
            throw error;
        }
    },

    // Consome: PUT /pessoas/{id}
    update: async (id, pessoaData) => {
        try {
            const response = await api.put(`${BASE_URL}/${id}`, pessoaData);
            return response.data;
        } catch (error) {
            console.error(`Erro ao atualizar pessoa com ID ${id}:`, error);
            throw error;
        }
    },

    // Consome: DELETE /pessoas/{id}
    delete: async (id) => {
        try {
            await api.delete(`${BASE_URL}/${id}`);
        } catch (error) {
            console.error(`Erro ao deletar pessoa com ID ${id}:`, error);
            throw error;
        }
    }
};

export default PessoaService;