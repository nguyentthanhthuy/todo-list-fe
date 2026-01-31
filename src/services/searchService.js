import api from '../core/baseRequest'

const searchService = {
    /**
     * Tìm kiếm nâng cao tasks
     */
    searchTasks(params = {}) {
        return api.get('/search/tasks', params)
    },

    /**
     * Tìm kiếm nâng cao projects
     */
    searchProjects(params = {}) {
        return api.get('/search/projects', params)
    },

    /**
     * Tìm kiếm toàn cục (tasks, projects, users)
     */
    globalSearch(query) {
        return api.get('/search/global', { q: query })
    },
}

export default searchService
