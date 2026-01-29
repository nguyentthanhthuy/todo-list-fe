import api from '@/core/baseRequest';

const taskService = {
    /**
     * Lấy danh sách tasks
     */
    async list(params = {}) {
        return api.get('/tasks/list', { params });
    },

    /**
     * Lấy chi tiết task
     */
    async get(id) {
        return api.get(`/tasks/show/${id}`);
    },

    /**
     * Tạo task mới
     */
    async create(data) {
        return api.post('/tasks/store', data);
    },

    /**
     * Cập nhật task
     */
    async update(id, data) {
        return api.put(`/tasks/update/${id}`, data);
    },

    /**
     * Xóa task
     */
    async delete(id) {
        return api.delete(`/tasks/delete/${id}`);
    },

    /**
     * Lấy thống kê tasks
     */
    async getStats() {
        return api.get('/tasks/stats');
    },
};

export default taskService;
