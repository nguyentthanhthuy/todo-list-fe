import api from '../core/baseRequest'

const adminService = {
    // ============================================
    // Dashboard
    // ============================================
    getDashboard() {
        return api.get('/admin/dashboard')
    },

    // ============================================
    // User Management
    // ============================================
    getUsers(params = {}) {
        return api.get('/admin/users/list', params)
    },

    getUserStatistics() {
        return api.get('/admin/users/statistics')
    },

    getUser(id) {
        return api.get(`/admin/users/show/${id}`)
    },

    createUser(data) {
        return api.post('/admin/users/create', data)
    },

    updateUser(id, data) {
        return api.put(`/admin/users/update/${id}`, data)
    },

    deleteUser(id) {
        return api.delete(`/admin/users/delete/${id}`)
    },

    changeUserRole(id, role) {
        return api.post(`/admin/users/change-role/${id}`, { role })
    },

    toggleUserStatus(id) {
        return api.post(`/admin/users/toggle-status/${id}`)
    },

    // ============================================
    // Role Management
    // ============================================
    getRoles() {
        return api.get('/admin/roles/list')
    },

    getRole(id) {
        return api.get(`/admin/roles/show/${id}`)
    },

    createRole(data) {
        return api.post('/admin/roles/create', data)
    },

    updateRole(id, data) {
        return api.put(`/admin/roles/update/${id}`, data)
    },

    deleteRole(id) {
        return api.delete(`/admin/roles/delete/${id}`)
    },

    updateRolePermissions(id, permissions) {
        return api.post(`/admin/roles/permissions/${id}`, { permissions })
    },

    // ============================================
    // Permission Management
    // ============================================
    getPermissions() {
        return api.get('/admin/permissions/list')
    },

    getGroupedPermissions() {
        return api.get('/admin/permissions/grouped')
    },

    createPermission(data) {
        return api.post('/admin/permissions/create', data)
    },

    updatePermission(id, data) {
        return api.put(`/admin/permissions/update/${id}`, data)
    },

    deletePermission(id) {
        return api.delete(`/admin/permissions/delete/${id}`)
    },
}

export default adminService
