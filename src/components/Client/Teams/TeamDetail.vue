<template>
  <div class="team-detail-page" v-if="team">
    <!-- Header -->
    <div class="page-header" :style="{ background: team.color || '#667eea' }">
      <div class="header-overlay"></div>
      <div class="header-content">
        <button class="btn-back" @click="$router.push('/teams')">
          <i class="fa-solid fa-arrow-left"></i>
        </button>

        <div class="team-info">
          <div class="team-avatar">
            {{ team.name?.charAt(0).toUpperCase() }}
          </div>
          <div class="team-meta">
            <h1 class="team-name">{{ team.name }}</h1>
            <p class="team-description">{{ team.description || 'Chưa có mô tả' }}</p>
            <div class="team-badges">
              <span class="badge members">
                <i class="fa-solid fa-users"></i> {{ members.length }} thành viên
              </span>
              <span class="badge projects">
                <i class="fa-solid fa-folder"></i> {{ team.projects_count || 0 }} dự án
              </span>
              <span class="badge role" :class="team.my_role">
                {{ getRoleLabel(team.my_role) }}
              </span>
            </div>
          </div>
        </div>

        <div class="header-actions" v-if="canManage">
          <button class="btn-action" @click="showEditModal = true">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn-action invite" @click="showInviteModal = true">
            <i class="fa-solid fa-user-plus"></i> Mời thành viên
          </button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs-container">
      <div class="tabs">
        <button class="tab" :class="{ active: activeTab === 'members' }" @click="activeTab = 'members'">
          <i class="fa-solid fa-users"></i> Thành viên
        </button>
        <button class="tab" :class="{ active: activeTab === 'projects' }" @click="activeTab = 'projects'">
          <i class="fa-solid fa-folder"></i> Dự án
        </button>
        <button class="tab" :class="{ active: activeTab === 'invitations' }" @click="activeTab = 'invitations'" v-if="canManage">
          <i class="fa-solid fa-envelope"></i> Lời mời
          <span class="tab-badge" v-if="invitations.length">{{ invitations.length }}</span>
        </button>
        <button class="tab" :class="{ active: activeTab === 'settings' }" @click="activeTab = 'settings'" v-if="canManage">
          <i class="fa-solid fa-gear"></i> Cài đặt
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Members Tab -->
      <div class="members-section" v-if="activeTab === 'members'">
        <div class="section-header">
          <h2><i class="fa-solid fa-users"></i> Thành viên ({{ members.length }})</h2>
          <div class="search-box">
            <i class="fa-solid fa-search"></i>
            <input type="text" v-model="memberSearch" placeholder="Tìm thành viên...">
          </div>
        </div>

        <div class="members-grid">
          <div class="member-card" v-for="member in filteredMembers" :key="member.id">
            <div class="member-avatar" :style="{ background: getAvatarColor(member.client?.ho_va_ten) }">
              {{ member.client?.ho_va_ten?.charAt(0).toUpperCase() || 'U' }}
            </div>
            <div class="member-info">
              <h4 class="member-name">{{ member.client?.ho_va_ten }}</h4>
              <p class="member-email">{{ member.client?.email }}</p>
              <span class="role-badge" :class="member.role">{{ getRoleLabel(member.role) }}</span>
            </div>
            <div class="member-actions" v-if="canManageRole(member)">
              <div class="dropdown">
                <button class="btn-more" @click="toggleDropdown(member.id)">
                  <i class="fa-solid fa-ellipsis-v"></i>
                </button>
                <div class="dropdown-menu" v-if="activeDropdown === member.id">
                  <button @click="changeRole(member, 'admin')" v-if="member.role !== 'admin' && member.role !== 'owner'">
                    <i class="fa-solid fa-shield"></i> Đặt làm Admin
                  </button>
                  <button @click="changeRole(member, 'member')" v-if="member.role !== 'member' && member.role !== 'owner'">
                    <i class="fa-solid fa-user"></i> Đặt làm Member
                  </button>
                  <button @click="changeRole(member, 'viewer')" v-if="member.role !== 'viewer' && member.role !== 'owner'">
                    <i class="fa-solid fa-eye"></i> Đặt làm Viewer
                  </button>
                  <button class="danger" @click="removeMember(member)" v-if="member.role !== 'owner'">
                    <i class="fa-solid fa-user-minus"></i> Xóa khỏi team
                  </button>
                  <button @click="transferOwnership(member)" v-if="isOwner && member.role !== 'owner'">
                    <i class="fa-solid fa-crown"></i> Chuyển quyền sở hữu
                  </button>
                </div>
              </div>
            </div>
            <div class="owner-badge" v-else-if="member.role === 'owner'">
              <i class="fa-solid fa-crown"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Projects Tab -->
      <div class="projects-section" v-if="activeTab === 'projects'">
        <div class="section-header">
          <h2><i class="fa-solid fa-folder"></i> Dự án của team</h2>
          <button class="btn-add-project" @click="showAddProjectModal = true" v-if="canManage">
            <i class="fa-solid fa-plus"></i> Thêm dự án
          </button>
        </div>

        <div class="projects-grid" v-if="projects.length > 0">
          <div class="project-card" v-for="project in projects" :key="project.id">
            <div class="project-color" :style="{ background: getProjectColor(project) }"></div>
            <div class="project-info">
              <h4>{{ project.ten_du_an }}</h4>
              <p>{{ project.mo_ta || 'Không có mô tả' }}</p>
            </div>
            <div class="project-meta">
              <span class="status-badge" :class="project.trang_thai">
                {{ getStatusLabel(project.trang_thai) }}
              </span>
              <button class="btn-remove" @click="removeProject(project)" v-if="canManage">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="empty-state" v-else>
          <i class="fa-solid fa-folder-open"></i>
          <p>Chưa có dự án nào trong team</p>
        </div>
      </div>

      <!-- Invitations Tab -->
      <div class="invitations-section" v-if="activeTab === 'invitations' && canManage">
        <div class="section-header">
          <h2><i class="fa-solid fa-envelope"></i> Lời mời đang chờ</h2>
        </div>

        <div class="invitations-list" v-if="invitations.length > 0">
          <div class="invitation-item" v-for="inv in invitations" :key="inv.id">
            <div class="invitation-info">
              <div class="invitation-avatar">
                <i class="fa-solid fa-envelope"></i>
              </div>
              <div class="invitation-details">
                <h4>{{ inv.email }}</h4>
                <p>Mời bởi {{ inv.inviter?.ho_va_ten }} • {{ formatDate(inv.created_at) }}</p>
                <span class="role-badge">{{ getRoleLabel(inv.role) }}</span>
              </div>
            </div>
            <div class="invitation-actions">
              <button class="btn-resend" @click="resendInvitation(inv.id)">
                <i class="fa-solid fa-redo"></i> Gửi lại
              </button>
              <button class="btn-cancel-inv" @click="cancelInvitation(inv.id)">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="empty-state" v-else>
          <i class="fa-solid fa-envelope-open"></i>
          <p>Không có lời mời đang chờ</p>
        </div>
      </div>

      <!-- Settings Tab -->
      <div class="settings-section" v-if="activeTab === 'settings' && canManage">
        <div class="settings-card">
          <h3><i class="fa-solid fa-info-circle"></i> Thông tin team</h3>
          <div class="settings-form">
            <div class="form-group">
              <label>Tên team</label>
              <input type="text" v-model="editForm.name">
            </div>
            <div class="form-group">
              <label>Mô tả</label>
              <textarea v-model="editForm.description" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>Màu team</label>
              <div class="color-picker">
                <div class="color-option" v-for="color in colors" :key="color"
                     :style="{ background: color }"
                     :class="{ active: editForm.color === color }"
                     @click="editForm.color = color">
                  <i class="fa-solid fa-check" v-if="editForm.color === color"></i>
                </div>
              </div>
            </div>
            <button class="btn-save" @click="updateTeam">
              <i class="fa-solid fa-save"></i> Lưu thay đổi
            </button>
          </div>
        </div>

        <div class="danger-zone" v-if="isOwner">
          <h3><i class="fa-solid fa-exclamation-triangle"></i> Vùng nguy hiểm</h3>
          <div class="danger-actions">
            <button class="btn-leave" @click="leaveTeam" v-if="!isOwner">
              <i class="fa-solid fa-sign-out-alt"></i> Rời khỏi team
            </button>
            <button class="btn-delete" @click="deleteTeam" v-if="isOwner">
              <i class="fa-solid fa-trash"></i> Xóa team
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Invite Modal -->
    <div class="modal-overlay" v-if="showInviteModal" @click.self="showInviteModal = false">
      <div class="modal-content invite-modal">
        <div class="modal-header">
          <h3><i class="fa-solid fa-user-plus"></i> Mời thành viên</h3>
          <button class="btn-close" @click="showInviteModal = false">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <!-- Search existing users -->
          <div class="form-group">
            <label>Tìm người dùng</label>
            <div class="search-input-wrapper">
              <input type="text" v-model="userSearch" @input="searchUsers" placeholder="Nhập tên hoặc email...">
              <i class="fa-solid fa-search"></i>
            </div>
            <div class="user-results" v-if="userResults.length > 0">
              <div class="user-result" v-for="user in userResults" :key="user.id" @click="selectUser(user)">
                <div class="user-avatar" :style="{ background: getAvatarColor(user.ho_va_ten) }">
                  {{ user.ho_va_ten?.charAt(0).toUpperCase() }}
                </div>
                <div class="user-info">
                  <span class="user-name">{{ user.ho_va_ten }}</span>
                  <span class="user-email">{{ user.email }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Or invite by email -->
          <div class="divider">
            <span>hoặc</span>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="inviteForm.email" placeholder="Nhập email người dùng">
          </div>

          <div class="form-group">
            <label>Vai trò</label>
            <select v-model="inviteForm.role">
              <option value="member">Thành viên</option>
              <option value="admin">Quản trị viên</option>
              <option value="viewer">Người xem</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showInviteModal = false">Hủy</button>
          <button class="btn-submit" @click="sendInvite" :disabled="!inviteForm.email">
            <i class="fa-solid fa-paper-plane"></i> Gửi lời mời
          </button>
        </div>
      </div>
    </div>

    <!-- Add Project Modal -->
    <div class="modal-overlay" v-if="showAddProjectModal" @click.self="showAddProjectModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3><i class="fa-solid fa-folder-plus"></i> Thêm dự án vào team</h3>
          <button class="btn-close" @click="showAddProjectModal = false">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="project-select-list">
            <div class="project-select-item" v-for="proj in availableProjects" :key="proj.id"
                 :class="{ selected: selectedProjectId === proj.id }"
                 @click="selectedProjectId = proj.id">
              <div class="project-check">
                <i class="fa-solid fa-check" v-if="selectedProjectId === proj.id"></i>
              </div>
              <div class="project-name">{{ proj.ten_du_an }}</div>
            </div>
            <div class="empty-projects" v-if="availableProjects.length === 0">
              <p>Không có dự án nào khả dụng</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showAddProjectModal = false">Hủy</button>
          <button class="btn-submit" @click="addProject" :disabled="!selectedProjectId">
            <i class="fa-solid fa-plus"></i> Thêm dự án
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading -->
  <div class="loading-state" v-else>
    <div class="spinner"></div>
    <p>Đang tải...</p>
  </div>
</template>

<script>
import teamService from '@/services/teamService';

export default {
  name: 'TeamDetail',

  data() {
    return {
      team: null,
      members: [],
      projects: [],
      invitations: [],
      availableProjects: [],
      activeTab: 'members',
      memberSearch: '',
      userSearch: '',
      userResults: [],
      activeDropdown: null,
      showInviteModal: false,
      showEditModal: false,
      showAddProjectModal: false,
      selectedProjectId: null,
      inviteForm: {
        email: '',
        role: 'member',
      },
      editForm: {
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
    teamId() {
      return this.$route.params.id;
    },

    isOwner() {
      return this.team?.my_role === 'owner';
    },

    isAdmin() {
      return this.team?.my_role === 'admin' || this.isOwner;
    },

    canManage() {
      return this.isOwner || this.isAdmin;
    },

    filteredMembers() {
      if (!this.memberSearch) return this.members;
      const search = this.memberSearch.toLowerCase();
      return this.members.filter(m => 
        m.client?.ho_va_ten?.toLowerCase().includes(search) ||
        m.client?.email?.toLowerCase().includes(search)
      );
    },
  },

  async mounted() {
    await this.loadTeam();
    document.addEventListener('click', this.closeDropdown);
  },

  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdown);
  },

  methods: {
    async loadTeam() {
      try {
        const res = await teamService.getTeam(this.teamId);
        this.team = res.data.data;
        this.editForm = {
          name: this.team.name,
          description: this.team.description || '',
          color: this.team.color || '#667eea',
        };
        await this.loadMembers();
        await this.loadProjects();
        if (this.canManage) {
          await this.loadInvitations();
        }
      } catch (err) {
        console.error('Error loading team:', err);
        this.$router.push('/teams');
      }
    },

    async loadMembers() {
      try {
        const res = await teamService.getMembers(this.teamId);
        this.members = res.data.data;
      } catch (err) {
        console.error('Error loading members:', err);
      }
    },

    async loadProjects() {
      try {
        const res = await teamService.getTeamProjects(this.teamId);
        this.projects = res.data.data;
      } catch (err) {
        console.error('Error loading projects:', err);
      }
    },

    async loadInvitations() {
      try {
        const res = await teamService.getInvitations(this.teamId);
        this.invitations = res.data.data;
      } catch (err) {
        console.error('Error loading invitations:', err);
      }
    },

    async searchUsers() {
      if (this.userSearch.length < 2) {
        this.userResults = [];
        return;
      }
      try {
        const res = await teamService.searchUsers(this.teamId, this.userSearch);
        this.userResults = res.data.data;
      } catch (err) {
        console.error('Error searching users:', err);
      }
    },

    selectUser(user) {
      this.inviteForm.email = user.email;
      this.userResults = [];
      this.userSearch = '';
    },

    async sendInvite() {
      if (!this.inviteForm.email) return;
      try {
        await teamService.inviteMember(this.teamId, this.inviteForm);
        this.showInviteModal = false;
        this.inviteForm = { email: '', role: 'member' };
        await this.loadInvitations();
        alert('Đã gửi lời mời!');
      } catch (err) {
        console.error('Error sending invite:', err);
        alert(err.response?.data?.message || 'Có lỗi xảy ra!');
      }
    },

    async resendInvitation(invitationId) {
      try {
        await teamService.resendInvitation(this.teamId, invitationId);
        alert('Đã gửi lại lời mời!');
      } catch (err) {
        console.error('Error resending invitation:', err);
      }
    },

    async cancelInvitation(invitationId) {
      if (!confirm('Bạn có chắc muốn hủy lời mời này?')) return;
      try {
        await teamService.cancelInvitation(this.teamId, invitationId);
        await this.loadInvitations();
      } catch (err) {
        console.error('Error canceling invitation:', err);
      }
    },

    async changeRole(member, newRole) {
      try {
        await teamService.updateMemberRole(this.teamId, member.id, newRole);
        await this.loadMembers();
        this.activeDropdown = null;
      } catch (err) {
        console.error('Error changing role:', err);
        alert('Có lỗi xảy ra!');
      }
    },

    async removeMember(member) {
      if (!confirm(`Bạn có chắc muốn xóa ${member.client?.ho_va_ten} khỏi team?`)) return;
      try {
        await teamService.removeMember(this.teamId, member.id);
        await this.loadMembers();
      } catch (err) {
        console.error('Error removing member:', err);
        alert('Có lỗi xảy ra!');
      }
    },

    async transferOwnership(member) {
      if (!confirm(`Bạn có chắc muốn chuyển quyền sở hữu cho ${member.client?.ho_va_ten}?`)) return;
      try {
        await teamService.transferOwnership(this.teamId, member.client_id);
        await this.loadTeam();
      } catch (err) {
        console.error('Error transferring ownership:', err);
        alert('Có lỗi xảy ra!');
      }
    },

    async addProject() {
      if (!this.selectedProjectId) return;
      try {
        await teamService.addProject(this.teamId, this.selectedProjectId);
        this.showAddProjectModal = false;
        this.selectedProjectId = null;
        await this.loadProjects();
      } catch (err) {
        console.error('Error adding project:', err);
        alert('Có lỗi xảy ra!');
      }
    },

    async removeProject(project) {
      if (!confirm(`Bạn có chắc muốn xóa dự án "${project.ten_du_an}" khỏi team?`)) return;
      try {
        await teamService.removeProject(this.teamId, project.id);
        await this.loadProjects();
      } catch (err) {
        console.error('Error removing project:', err);
      }
    },

    async updateTeam() {
      try {
        await teamService.updateTeam(this.teamId, this.editForm);
        await this.loadTeam();
        alert('Đã cập nhật team!');
      } catch (err) {
        console.error('Error updating team:', err);
        alert('Có lỗi xảy ra!');
      }
    },

    async leaveTeam() {
      if (!confirm('Bạn có chắc muốn rời khỏi team này?')) return;
      try {
        await teamService.leaveTeam(this.teamId);
        this.$router.push('/teams');
      } catch (err) {
        console.error('Error leaving team:', err);
        alert('Có lỗi xảy ra!');
      }
    },

    async deleteTeam() {
      if (!confirm('Bạn có chắc muốn XÓA VĨNH VIỄN team này? Hành động này không thể hoàn tác!')) return;
      try {
        await teamService.deleteTeam(this.teamId);
        this.$router.push('/teams');
      } catch (err) {
        console.error('Error deleting team:', err);
        alert('Có lỗi xảy ra!');
      }
    },

    canManageRole(member) {
      if (member.role === 'owner') return false;
      if (this.isOwner) return true;
      if (this.isAdmin && member.role !== 'admin') return true;
      return false;
    },

    toggleDropdown(id) {
      this.activeDropdown = this.activeDropdown === id ? null : id;
    },

    closeDropdown(e) {
      if (!e.target.closest('.dropdown')) {
        this.activeDropdown = null;
      }
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

    getStatusLabel(status) {
      const labels = {
        'chua-bat-dau': 'Chưa bắt đầu',
        'dang-thuc-hien': 'Đang thực hiện',
        'tam-dung': 'Tạm dừng',
        'hoan-thanh': 'Hoàn thành',
        'huy-bo': 'Hủy bỏ',
      };
      return labels[status] || status;
    },

    getAvatarColor(name) {
      const colors = ['#667eea', '#f093fb', '#f5576c', '#4facfe', '#43e97b', '#fa709a', '#ff6b6b', '#48dbfb'];
      const index = (name?.charCodeAt(0) || 0) % colors.length;
      return colors[index];
    },

    getProjectColor(project) {
      const colors = ['#667eea', '#f093fb', '#f5576c', '#4facfe', '#43e97b'];
      return colors[project.id % colors.length];
    },

    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('vi-VN');
    },
  },
};
</script>

<style scoped>
.team-detail-page {
  min-height: 100vh;
  background: #f5f7fa;
  font-family: 'Be Vietnam Pro', 'Inter', sans-serif;
}

/* Header */
.page-header {
  position: relative;
  padding: 2rem;
  color: white;
  overflow: hidden;
}

.header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 100%);
}

.header-content {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
}

.btn-back {
  width: 44px;
  height: 44px;
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
  flex-shrink: 0;
}

.btn-back:hover {
  background: rgba(255,255,255,0.3);
}

.team-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.team-avatar {
  width: 80px;
  height: 80px;
  background: rgba(255,255,255,0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  flex-shrink: 0;
}

.team-name {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
}

.team-description {
  font-size: 0.95rem;
  opacity: 0.9;
  margin: 0 0 1rem;
}

.team-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.8rem;
  background: rgba(255,255,255,0.2);
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.badge.role.owner { background: rgba(251, 191, 36, 0.3); }
.badge.role.admin { background: rgba(139, 92, 246, 0.3); }

.header-actions {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-action:hover {
  background: rgba(255,255,255,0.3);
}

.btn-action.invite {
  background: white;
  color: #1e293b;
}

.btn-action.invite:hover {
  background: #f8fafc;
}

/* Tabs */
.tabs-container {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 2rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
}

.tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  background: none;
  border: none;
  color: #64748b;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
  position: relative;
}

.tab:hover {
  color: #1e293b;
}

.tab.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.tab-badge {
  padding: 0.15rem 0.5rem;
  background: #ef4444;
  color: white;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
}

/* Tab Content */
.tab-content {
  padding: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.section-header h2 i {
  color: #667eea;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  min-width: 250px;
}

.search-box i {
  color: #94a3b8;
}

.search-box input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 0.9rem;
}

/* Members Grid */
.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.member-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 0.3s;
}

.member-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.member-avatar {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.member-info {
  flex: 1;
}

.member-name {
  margin: 0 0 0.2rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
}

.member-email {
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  color: #64748b;
}

.role-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
}

.role-badge.owner { background: #fef3c7; color: #d97706; }
.role-badge.admin { background: #ede9fe; color: #7c3aed; }
.role-badge.member { background: #dcfce7; color: #16a34a; }
.role-badge.viewer { background: #f1f5f9; color: #64748b; }

.owner-badge {
  color: #fbbf24;
  font-size: 1.25rem;
}

/* Dropdown */
.dropdown {
  position: relative;
}

.btn-more {
  width: 36px;
  height: 36px;
  background: #f8fafc;
  border: none;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-more:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  min-width: 200px;
  z-index: 100;
  overflow: hidden;
}

.dropdown-menu button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 0.9rem;
  color: #374151;
  transition: all 0.2s;
}

.dropdown-menu button:hover {
  background: #f3f4f6;
}

.dropdown-menu button.danger {
  color: #ef4444;
}

.dropdown-menu button.danger:hover {
  background: #fef2f2;
}

/* Projects */
.btn-add-project {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-add-project:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.project-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.project-color {
  width: 8px;
  height: 60px;
  border-radius: 4px;
}

.project-info {
  flex: 1;
}

.project-info h4 {
  margin: 0 0 0.3rem;
  font-size: 0.95rem;
  color: #1e293b;
}

.project-info p {
  margin: 0;
  font-size: 0.8rem;
  color: #64748b;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.status-badge {
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 500;
}

.status-badge.dang-thuc-hien { background: #dbeafe; color: #2563eb; }
.status-badge.hoan-thanh { background: #dcfce7; color: #16a34a; }
.status-badge.tam-dung { background: #fef3c7; color: #d97706; }
.status-badge.chua-bat-dau { background: #f1f5f9; color: #64748b; }

.btn-remove {
  width: 28px;
  height: 28px;
  background: #fef2f2;
  border: none;
  border-radius: 6px;
  color: #ef4444;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s;
}

.btn-remove:hover {
  background: #fee2e2;
}

/* Invitations */
.invitations-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.invitation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.invitation-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.invitation-avatar {
  width: 48px;
  height: 48px;
  background: #eff6ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  font-size: 1.1rem;
}

.invitation-details h4 {
  margin: 0 0 0.2rem;
  font-size: 0.95rem;
  color: #1e293b;
}

.invitation-details p {
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  color: #64748b;
}

.invitation-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-resend {
  padding: 0.5rem 1rem;
  background: #eff6ff;
  border: none;
  border-radius: 8px;
  color: #3b82f6;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.3s;
}

.btn-resend:hover {
  background: #dbeafe;
}

.btn-cancel-inv {
  width: 36px;
  height: 36px;
  background: #fef2f2;
  border: none;
  border-radius: 8px;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel-inv:hover {
  background: #fee2e2;
}

/* Settings */
.settings-card {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.settings-card h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.settings-card h3 i {
  color: #667eea;
}

.settings-form .form-group {
  margin-bottom: 1.25rem;
}

.settings-form label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.settings-form input,
.settings-form textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.settings-form input:focus,
.settings-form textarea:focus {
  outline: none;
  border-color: #667eea;
}

.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.color-option {
  width: 36px;
  height: 36px;
  border-radius: 8px;
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
}

.btn-save {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.danger-zone {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  border: 2px solid #fee2e2;
}

.danger-zone h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #ef4444;
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.danger-actions {
  display: flex;
  gap: 1rem;
}

.btn-leave,
.btn-delete {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-leave {
  background: white;
  border: 2px solid #e5e7eb;
  color: #64748b;
}

.btn-leave:hover {
  background: #f8fafc;
}

.btn-delete {
  background: #ef4444;
  border: none;
  color: white;
}

.btn-delete:hover {
  background: #dc2626;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 20px;
}

.empty-state i {
  font-size: 3rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #64748b;
  margin: 0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 480px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-close {
  width: 32px;
  height: 32px;
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.9rem;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.search-input-wrapper {
  position: relative;
}

.search-input-wrapper input {
  padding-right: 2.5rem;
}

.search-input-wrapper i {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.user-results {
  margin-top: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  background: #f8fafc;
  border-radius: 10px;
}

.user-result {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.user-result:hover {
  background: #e2e8f0;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #1e293b;
}

.user-email {
  font-size: 0.8rem;
  color: #64748b;
}

.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
  color: #94a3b8;
  font-size: 0.85rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.project-select-list {
  max-height: 300px;
  overflow-y: auto;
}

.project-select-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.project-select-item:hover {
  border-color: #667eea;
}

.project-select-item.selected {
  border-color: #667eea;
  background: #f5f3ff;
}

.project-check {
  width: 24px;
  height: 24px;
  border: 2px solid #cbd5e1;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.2s;
}

.project-select-item.selected .project-check {
  background: #667eea;
  border-color: #667eea;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #f9fafb;
}

.btn-cancel {
  padding: 0.65rem 1.25rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
}

.btn-submit {
  padding: 0.65rem 1.25rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading */
.loading-state {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .team-info {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .members-grid,
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
