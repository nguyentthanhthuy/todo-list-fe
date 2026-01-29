import api from "@/core/baseRequest";

export default {
    // Lấy danh sách activity logs
    list(limit = 50) {
        return api.get("/activity-logs/list", { limit });
    },

    // Lấy activity logs của task
    listByTask(taskId) {
        return api.get(`/activity-logs/task/${taskId}`);
    },
};
