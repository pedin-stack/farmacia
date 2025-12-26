import api from './axiosConfig';

const BASE_URL = '/remedios';

const RemedioService = {

    // Consome: GET /remedios?page=0&size=10
    findAll: async (page = 0, size = 10) => {
        try {
            const response = await api.get(`${BASE_URL}`, {
                params: { page, size }
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar remédios:", error);
            throw error;
        }
    },

    // Consome: GET /remedios/{id}
    findById: async (id) => {
        try {
            const response = await api.get(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar remédio com ID ${id}:`, error);
            throw error;
        }
    },

    // Consome: POST /remedios
    save: async (remedioData) => {
        try {
            const response = await api.post(`${BASE_URL}`, remedioData);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error("Erro ao salvar remédio: status=", error.response.status, "data=", error.response.data);
            } else {
                console.error("Erro ao salvar remédio:", error.message);
            }
            throw error;
        }
    },

    // Consome: PUT /remedios/{id}
    update: async (id, remedioData) => {
        try {
            const response = await api.put(`${BASE_URL}/${id}`, remedioData);
            return response.data;
        } catch (error) {
            console.error(`Erro ao atualizar remédio com ID ${id}:`, error);
            throw error;
        }
    },

    // Consome: DELETE /remedios/{id}
    delete: async (id) => {
        try {
            await api.delete(`${BASE_URL}/${id}`);
        } catch (error) {
            console.error(`Erro ao deletar remédio com ID ${id}:`, error);
            throw error;
        }
    }
};

export default RemedioService;