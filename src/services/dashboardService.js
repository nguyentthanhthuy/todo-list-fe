import api from '../core/api'

const dashboardService = {
    /**
     * Lấy thống kê tổng quan dashboard
     */
    getStatistics() {
        return api.get('/api/dashboard/statistics')
    },

    /**
     * Lấy danh sách task gần đây
     */
    getRecentTasks() {
        return api.get('/api/dashboard/recent-tasks')
    },

    /**
     * Lấy overview nhanh
     */
    getQuickOverview() {
        return api.get('/api/dashboard/quick-overview')
    }
}

export default dashboardService
