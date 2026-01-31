<template>
  <div class="teams-page">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <div class="header-icon">
            <i class="fa-solid fa-users"></i>
          </div>
          <div class="header-text">
            <h1 class="page-title">Teams của tôi</h1>
            <p class="page-subtitle">Quản lý và làm việc nhóm hiệu quả</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn-create" @click="showCreateModal = true">
            <i class="fa-solid fa-plus"></i>
            <span>Tạo Team</span>
          </button>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="stats-bar">
        <div class="stat-item">
          <div class="stat-icon total">
            <i class="fa-solid fa-users"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ teams.length }}</span>
            <span class="stat-label">Tổng teams</span>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon owner">
            <i class="fa-solid fa-crown"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ ownedTeams }}</span>
            <span class="stat-label">Teams sở hữu</span>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon member">
            <i class="fa-solid fa-user-group"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ memberTeams }}</span>
            <span class="stat-label">Teams tham gia</span>
          </div>
        </div>
        <div class="stat-item" v-if="pendingInvitations > 0">
          <div class="stat-icon pending">
            <i class="fa-solid fa-envelope"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ pendingInvitations }}</span>
            <span class="stat-label">Lời mời chờ</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pending Invitations -->
    <div class="invitations-section" v-if="invitations.length > 0">
      <h3 class="section-title">
        <i class="fa-solid fa-envelope-open-text"></i> Lời mời tham gia
      </h3>
      <div class="invitations-list">
        <div class="invitation-card" v-for="inv in invitations" :key="inv.id">
          <div class="invitation-info">
            <div class="team-avatar" :style="{ background: inv.team?.color || '#667eea' }">
              {{ inv.team?.name?.charAt(0).toUpperCase() }}
            </div>
            <div class="invitation-details">
              <h4>{{ inv.team?.name }}</h4>
              <p>Mời bởi {{ inv.inviter?.ho_va_ten }}</p>
              <span class="role-badge">{{ getRoleLabel(inv.role) }}</span>
            </div>
          </div>
          <div class="invitation-actions">
            <button class="btn-accept" @click="acceptInvitation(inv.token)">
              <i class="fa-solid fa-check"></i> Chấp nhận
            </button>
            <button class="btn-decline" @click="declineInvitation(inv.token)">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Teams Grid -->
    <div class="teams-container">
      <div class="teams-grid" v-if="teams.length > 0">
        <div class="team-card" v-for="(team, index) in teams" :key="team.id"
             :style="{ '--delay': index * 0.05 + 's' }">
          
          <!-- Card Header -->
          <div class="card-header" :style="{ background: team.color || '#667eea' }">
            <div class="card-header-content">
              <span class="team-badge">
                <i class="fa-solid fa-users"></i> {{ team.members_count }} thành viên
              </span>
              <div class="role-indicator" :class="team.my_role">
                <i :class="getRoleIcon(team.my_role)"></i>
              </div>
            </div>
            <h3 class="team-name">{{ team.name }}</h3>
            <p class="team-owner" v-if="team.owner">
              <i class="fa-solid fa-crown"></i> {{ team.owner.ho_va_ten }}
            </p>
          </div>

          <!-- Card Body -->
          <div class="card-body">
            <p class="team-description">
              {{ team.description || 'Chưa có mô tả' }}
            </p>

            <div class="team-stats">
              <div class="team-stat">
                <i class="fa-solid fa-folder"></i>
                <span>{{ team.projects_count || 0 }} dự án</span>
              </div>
              <div class="team-stat">
                <span class="role-tag" :class="team.my_role">{{ getRoleLabel(team.my_role) }}</span>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="card-footer">
            <button class="btn-view" @click="viewTeam(team)">
              <i class="fa-solid fa-arrow-right"></i> Xem chi tiết
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" v-else>
        <div class="empty-illustration">
          <i class="fa-solid fa-users"></i>
        </div>
        <h3>Chưa có team nào</h3>
        <p>Tạo team đầu tiên để bắt đầu làm việc nhóm</p>
        <button class="btn-create" @click="showCreateModal = true">
          <i class="fa-solid fa-plus"></i> Tạo team mới
        </button>
      </div>
    </div>

    <!-- Create Team Modal -->
    <div class="modal-overlay" v-if="showCreateModal" @click.self="showCreateModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-icon">
            <i class="fa-solid fa-users-gear"></i>
          </div>
          <h3>Tạo Team mới</h3>
          <button class="btn-close" @click="showCreateModal = false">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Tên team <span class="required">*</span></label>
            <input type="text" v-model="createForm.name" placeholder="Nhập tên team" maxlength="100">
          </div>
          <div class="form-group">
            <label>Mô tả</label>
            <textarea v-model="createForm.description" placeholder="Mô tả về team..." rows="3" maxlength="500"></textarea>
          </div>
          <div class="form-group">
            <label>Màu team</label>
            <div class="color-picker">
              <div class="color-option" v-for="color in colors" :key="color"
                   :style="{ background: color }"
                   :class="{ active: createForm.color === color }"
                   @click="createForm.color = color">
                <i class="fa-solid fa-check" v-if="createForm.color === color"></i>
              </div>
            </div>
          </div>
          <div class="form-preview">
            <div class="preview-card" :style="{ background: createForm.color }">
              <span class="preview-avatar">{{ createForm.name?.charAt(0)?.toUpperCase() || 'T' }}</span>
              <span class="preview-name">{{ createForm.name || 'Tên team' }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showCreateModal = false">Hủy</button>
          <button class="btn-submit" @click="createTeam" :disabled="!createForm.name.trim()">
            <i class="fa-solid fa-check"></i> Tạo team
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import teamService from '@/services/teamService';

export default {
  name: 'TeamsIndex',

  data() {
    return {
      teams: [],
      invitations: [],
      loading: false,
      showCreateModal: false,
      createForm: {
        name: '',
        description: '',
        color: '#667eea',
      },
      colors: [
        '#667eea', '#764ba2', '#f093fb', '#f5576c',
        '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
        '#fa709a', '#fee140', '#a8edea', '#fed6e3',
        '#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1',
      ],
    };
  },

  computed: {
    ownedTeams() {
      return this.teams.filter(t => t.my_role === 'owner').length;
    },
    memberTeams() {
      return this.teams.filter(t => t.my_role !== 'owner').length;
    },
    pendingInvitations() {
      return this.invitations.length;
    },
  },

  async mounted() {
    await this.loadTeams();
    await this.loadInvitations();
  },

  methods: {
    async loadTeams() {
      try {
        this.loading = true;
        const res = await teamService.getMyTeams();
        this.teams = res.data.data;
      } catch (err) {
        console.error('Error loading teams:', err);
      } finally {
        this.loading = false;
      }
    },

    async loadInvitations() {
      try {
        const res = await teamService.getMyInvitations();
        this.invitations = res.data.data;
      } catch (err) {
        console.error('Error loading invitations:', err);
      }
    },

    async createTeam() {
      if (!this.createForm.name.trim()) return;

      try {
        await teamService.createTeam(this.createForm);
        this.showCreateModal = false;
        this.createForm = { name: '', description: '', color: '#667eea' };
        await this.loadTeams();
      } catch (err) {
        console.error('Error creating team:', err);
        alert('Tạo team thất bại!');
      }
    },

    async acceptInvitation(token) {
      try {
        await teamService.acceptInvitation(token);
        await this.loadTeams();
        await this.loadInvitations();
      } catch (err) {
        console.error('Error accepting invitation:', err);
        alert('Có lỗi xảy ra!');
      }
    },

    async declineInvitation(token) {
      if (!confirm('Bạn có chắc muốn từ chối lời mời này?')) return;
      
      try {
        await teamService.declineInvitation(token);
        await this.loadInvitations();
      } catch (err) {
        console.error('Error declining invitation:', err);
      }
    },

    viewTeam(team) {
      this.$router.push(`/teams/${team.id}`);
    },

    getRoleLabel(role) {
      const labels = {
        owner: 'Chủ sở hữu',
        admin: 'Quản trị viên',
        member: 'Thành viên',
        viewer: 'Người xem',
      };
      return labels[role] || role;
    },

    getRoleIcon(role) {
      const icons = {
        owner: 'fa-solid fa-crown',
        admin: 'fa-solid fa-shield',
        member: 'fa-solid fa-user',
        viewer: 'fa-solid fa-eye',
      };
      return icons[role] || 'fa-solid fa-user';
    },
  },
};
</script>

<style scoped>
.teams-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  font-family: 'Be Vietnam Pro', 'Inter', sans-serif;
}

/* Header */
.page-header {
  background: white;
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
}

.page-subtitle {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0.25rem 0 0;
}

.btn-create {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

/* Stats Bar */
.stats-bar {
  display: flex;
  gap: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.stat-icon.total { background: #eff6ff; color: #3b82f6; }
.stat-icon.owner { background: #fef3c7; color: #f59e0b; }
.stat-icon.member { background: #f0fdf4; color: #22c55e; }
.stat-icon.pending { background: #fce7f3; color: #ec4899; }

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

/* Invitations Section */
.invitations-section {
  padding: 1.5rem 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.section-title i {
  color: #667eea;
}

.invitations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.invitation-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #667eea;
}

.invitation-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.team-avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
}

.invitation-details h4 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  color: #1e293b;
}

.invitation-details p {
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  color: #64748b;
}

.role-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background: #eff6ff;
  color: #3b82f6;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.invitation-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-accept {
  padding: 0.5rem 1rem;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.3s;
}

.btn-accept:hover {
  background: #16a34a;
}

.btn-decline {
  padding: 0.5rem 0.75rem;
  background: #fee2e2;
  color: #ef4444;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-decline:hover {
  background: #fecaca;
}

/* Teams Container */
.teams-container {
  padding: 2rem;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

/* Team Card */
.team-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: fadeInUp 0.5s ease forwards;
  animation-delay: var(--delay);
  opacity: 0;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.team-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.team-card .card-header {
  padding: 1.5rem;
  color: white;
  position: relative;
}

.team-card .card-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -30%;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.card-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;
}

.team-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.role-indicator {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.role-indicator.owner { background: rgba(251, 191, 36, 0.3); }
.role-indicator.admin { background: rgba(139, 92, 246, 0.3); }

.team-name {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  position: relative;
}

.team-owner {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.team-owner i {
  font-size: 0.75rem;
  color: #fbbf24;
}

.team-card .card-body {
  padding: 1.5rem;
}

.team-description {
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.team-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.team-stat {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #64748b;
  font-size: 0.85rem;
}

.team-stat i {
  color: #667eea;
}

.role-tag {
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.role-tag.owner { background: #fef3c7; color: #d97706; }
.role-tag.admin { background: #ede9fe; color: #7c3aed; }
.role-tag.member { background: #dcfce7; color: #16a34a; }
.role-tag.viewer { background: #f1f5f9; color: #64748b; }

.team-card .card-footer {
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.btn-view {
  width: 100%;
  padding: 0.75rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.85rem;
  color: #475569;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-view:hover {
  border-color: #667eea;
  color: #667eea;
  background: #f5f3ff;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 24px;
  max-width: 400px;
  margin: 0 auto;
}

.empty-illustration {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.empty-illustration i {
  font-size: 2.5rem;
  color: #94a3b8;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 1.5rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.modal-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.modal-header h3 {
  flex: 1;
  margin: 0;
  font-size: 1.25rem;
}

.btn-close {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.required {
  color: #ef4444;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.9rem;
  transition: all 0.3s;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.color-option {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s;
  border: 3px solid transparent;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  border-color: #1e293b;
  transform: scale(1.1);
}

.form-preview {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
}

.preview-card {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  color: white;
}

.preview-avatar {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.preview-name {
  font-weight: 600;
}

.modal-footer {
  padding: 1rem 1.5rem;
  background: #f9fafb;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.btn-submit {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-actions {
    width: 100%;
  }

  .btn-create {
    width: 100%;
    justify-content: center;
  }

  .stats-bar {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .teams-grid {
    grid-template-columns: 1fr;
  }

  .invitation-card {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .invitation-actions {
    width: 100%;
  }

  .btn-accept {
    flex: 1;
    justify-content: center;
  }
}
</style>
