import api from '../core/baseRequest';

const teamService = {
    // ============================================
    // TEAM CRUD
    // ============================================
    
    /**
     * Lấy danh sách teams của user
     */
    getMyTeams() {
        return api.get('/teams/list');
    },

    /**
     * Tạo team mới
     */
    createTeam(data) {
        return api.post('/teams/create', data);
    },

    /**
     * Lấy chi tiết team
     */
    getTeam(id) {
        return api.get(`/teams/show/${id}`);
    },

    /**
     * Cập nhật team
     */
    updateTeam(id, data) {
        return api.put(`/teams/update/${id}`, data);
    },

    /**
     * Xóa team
     */
    deleteTeam(id) {
        return api.delete(`/teams/delete/${id}`);
    },

    /**
     * Rời khỏi team
     */
    leaveTeam(id) {
        return api.post(`/teams/leave/${id}`);
    },

    /**
     * Thống kê team
     */
    getTeamStatistics(id) {
        return api.get(`/teams/statistics/${id}`);
    },

    // ============================================
    // TEAM PROJECTS
    // ============================================

    /**
     * Lấy danh sách projects của team
     */
    getTeamProjects(teamId) {
        return api.get(`/teams/${teamId}/projects`);
    },

    /**
     * Thêm project vào team
     */
    addProject(teamId, projectId) {
        return api.post(`/teams/${teamId}/projects`, { project_id: projectId });
    },

    /**
     * Xóa project khỏi team
     */
    removeProject(teamId, projectId) {
        return api.delete(`/teams/${teamId}/projects/${projectId}`);
    },

    // ============================================
    // TEAM MEMBERS
    // ============================================

    /**
     * Lấy danh sách members
     */
    getMembers(teamId) {
        return api.get(`/teams/${teamId}/members`);
    },

    /**
     * Cập nhật role của member
     */
    updateMemberRole(teamId, memberId, role) {
        return api.put(`/teams/${teamId}/members/${memberId}/role`, { role });
    },

    /**
     * Xóa member khỏi team
     */
    removeMember(teamId, memberId) {
        return api.delete(`/teams/${teamId}/members/${memberId}`);
    },

    /**
     * Chuyển quyền owner
     */
    transferOwnership(teamId, newOwnerId) {
        return api.post(`/teams/${teamId}/transfer-ownership`, { new_owner_id: newOwnerId });
    },

    /**
     * Tìm kiếm users để mời
     */
    searchUsers(teamId, query) {
        return api.get(`/teams/${teamId}/search-users`, { params: { q: query } });
    },

    // ============================================
    // INVITATIONS
    // ============================================

    /**
     * Lấy danh sách invitations của team
     */
    getInvitations(teamId) {
        return api.get(`/teams/${teamId}/invitations`);
    },

    /**
     * Mời thành viên
     */
    inviteMember(teamId, data) {
        return api.post(`/teams/${teamId}/invite`, data);
    },

    /**
     * Hủy lời mời
     */
    cancelInvitation(teamId, invitationId) {
        return api.delete(`/teams/${teamId}/invitations/${invitationId}`);
    },

    /**
     * Gửi lại lời mời
     */
    resendInvitation(teamId, invitationId) {
        return api.post(`/teams/${teamId}/invitations/${invitationId}/resend`);
    },

    /**
     * Lấy invitations của current user
     */
    getMyInvitations() {
        return api.get('/my-invitations');
    },

    /**
     * Lấy thông tin invitation bằng token
     */
    getInvitationByToken(token) {
        return api.get(`/invitations/token/${token}`);
    },

    /**
     * Accept invitation
     */
    acceptInvitation(token) {
        return api.post(`/invitations/${token}/accept`);
    },

    /**
     * Decline invitation
     */
    declineInvitation(token) {
        return api.post(`/invitations/${token}/decline`);
    },
};

export default teamService;
