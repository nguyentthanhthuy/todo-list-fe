import api from "@/core/baseRequest";

export default {
    // Lấy reminders của task
    listByTask(taskId) {
        return api.get(`/reminders/task/${taskId}`);
    },

    // Lấy reminders sắp tới
    listUpcoming() {
        return api.get("/reminders/upcoming");
    },

    // Tạo reminder mới
    create(taskId, remindTime) {
        return api.post(`/reminders/task/${taskId}`, { remind_time: remindTime });
    },

    // Cập nhật reminder
    update(id, remindTime) {
        return api.put(`/reminders/update/${id}`, { remind_time: remindTime });
    },

    // Xóa reminder
    delete(id) {
        return api.delete(`/reminders/delete/${id}`);
    },

    // Đánh dấu đã gửi
    markAsSent(id) {
        return api.post(`/reminders/mark-sent/${id}`);
    },
};
