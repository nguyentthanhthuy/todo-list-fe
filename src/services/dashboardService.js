import api from '../core/baseRequest'

const dashboardService = {
    /**
     * Lấy thống kê tổng quan dashboard
     */
    getStatistics() {
        return api.get('/dashboard/statistics')
    },

    /**
     * Lấy danh sách task gần đây
     */
    getRecentTasks() {
        return api.get('/dashboard/recent-tasks')
    },

    /**
     * Lấy overview nhanh
     */
    getQuickOverview() {
        return api.get('/dashboard/quick-overview')
    }
}

export default dashboardService
