import api from '../core/baseRequest'

const notificationService = {
    /**
     * Lấy danh sách notifications
     */
    getNotifications(params = {}) {
        return api.get('/notifications/list', params)
    },

    /**
     * Lấy notifications chưa đọc
     */
    getUnread() {
        return api.get('/notifications/unread')
    },

    /**
     * Đếm số notifications chưa đọc
     */
    getUnreadCount() {
        return api.get('/notifications/count')
    },

    /**
     * Đánh dấu notification đã đọc
     */
    markAsRead(id) {
        return api.post(`/notifications/read/${id}`)
    },

    /**
     * Đánh dấu tất cả đã đọc
     */
    markAllAsRead() {
        return api.post('/notifications/read-all')
    },

    /**
     * Xóa notification
     */
    delete(id) {
        return api.delete(`/notifications/delete/${id}`)
    },

    /**
     * Xóa tất cả notifications đã đọc
     */
    clearRead() {
        return api.delete('/notifications/clear-read')
    },
}

export default notificationService
