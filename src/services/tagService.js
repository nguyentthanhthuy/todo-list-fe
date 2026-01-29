import api from "@/core/baseRequest";

export default {
    // Lấy danh sách tags
    list() {
        return api.get("/tags/list");
    },

    // Tạo tag mới
    create(data) {
        return api.post("/tags/create", data);
    },

    // Cập nhật tag
    update(id, data) {
        return api.put(`/tags/update/${id}`, data);
    },

    // Xóa tag
    delete(id) {
        return api.delete(`/tags/delete/${id}`);
    },

    // Gắn tags vào task
    attachToTask(taskId, tagIds) {
        return api.post(`/tags/task/${taskId}/attach`, { tag_ids: tagIds });
    },

    // Bỏ tag khỏi task
    detachFromTask(taskId, tagId) {
        return api.delete(`/tags/task/${taskId}/detach/${tagId}`);
    },
};
