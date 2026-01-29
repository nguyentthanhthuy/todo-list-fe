import api from "@/core/baseRequest";

export default {
    // Lấy comments của task
    listByTask(taskId) {
        return api.get(`/comments/task/${taskId}`);
    },

    // Thêm comment
    create(taskId, content) {
        return api.post(`/comments/task/${taskId}`, { content });
    },

    // Cập nhật comment
    update(id, content) {
        return api.put(`/comments/update/${id}`, { content });
    },

    // Xóa comment
    delete(id) {
        return api.delete(`/comments/delete/${id}`);
    },
};
