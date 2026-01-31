<template>
  <div class="projects-page">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <div class="header-icon">
            <i class="fa-solid fa-folder-open"></i>
          </div>
          <div class="header-text">
            <h1 class="page-title">Dự án của tôi</h1>
            <p class="page-subtitle">Quản lý và theo dõi tiến độ các dự án</p>
          </div>
        </div>
        <div class="header-actions">
          <div class="search-box">
            <i class="fa-solid fa-search"></i>
            <input type="text" v-model="searchQuery" placeholder="Tìm kiếm dự án..." @input="filterProjects">
          </div>
          <button class="btn-create" data-bs-toggle="modal" data-bs-target="#createProjectModal">
            <i class="fa-solid fa-plus"></i>
            <span>Tạo dự án</span>
          </button>
        </div>
      </div>
      
      <!-- Stats Bar -->
      <div class="stats-bar">
        <div class="stat-item">
          <div class="stat-icon total">
            <i class="fa-solid fa-folder"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ projects.length }}</span>
            <span class="stat-label">Tổng dự án</span>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon active">
            <i class="fa-solid fa-play-circle"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ activeProjects }}</span>
            <span class="stat-label">Đang thực hiện</span>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon completed">
            <i class="fa-solid fa-check-circle"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ completedProjects }}</span>
            <span class="stat-label">Hoàn thành</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Projects Grid -->
    <div class="projects-container">
      <div class="projects-grid" v-if="filteredProjects.length > 0">
        <div class="project-card" v-for="(project, index) in filteredProjects" :key="project.id" 
             :style="{ '--delay': index * 0.05 + 's' }">
          
          <!-- Card Header with gradient -->
          <div class="card-header" :class="getProjectColor(index)">
            <div class="card-header-content">
              <span class="project-badge">
                <i class="fa-solid fa-hashtag"></i> {{ project.id }}
              </span>
              <div class="card-menu">
                <button class="menu-btn" @click="toggleMenu(project.id)">
                  <i class="fa-solid fa-ellipsis-v"></i>
                </button>
                <div class="dropdown-menu" v-if="activeMenu === project.id">
                  <button @click="openEditModal(project)">
                    <i class="fa-solid fa-pen"></i> Chỉnh sửa
                  </button>
                  <button class="danger" @click="deleteProject(project.id)">
                    <i class="fa-solid fa-trash"></i> Xóa
                  </button>
                </div>
              </div>
            </div>
            <h3 class="project-name">{{ project.name }}</h3>
          </div>

          <!-- Card Body -->
          <div class="card-body">
            <p class="project-description">
              {{ project.description || 'Chưa có mô tả cho dự án này' }}
            </p>

            <!-- Progress Bar -->
            <div class="progress-section">
              <div class="progress-header">
                <span>Tiến độ</span>
                <span class="progress-percent">{{ getProgress(project) }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: getProgress(project) + '%' }" 
                     :class="getProgressClass(project)"></div>
              </div>
            </div>

            <!-- Project Info -->
            <div class="project-info">
              <div class="info-item">
                <i class="fa-solid fa-calendar-alt"></i>
                <div class="info-content">
                  <span class="info-label">Bắt đầu</span>
                  <span class="info-value">{{ formatDateVN(project.start_date) }}</span>
                </div>
              </div>
              <div class="info-item">
                <i class="fa-solid fa-flag-checkered"></i>
                <div class="info-content">
                  <span class="info-label">Kết thúc</span>
                  <span class="info-value">{{ formatDateVN(project.end_date) }}</span>
                </div>
              </div>
            </div>

            <!-- Status Badge -->
            <div class="status-section">
              <span class="status-badge" :class="getStatusClass(project)">
                <i :class="getStatusIcon(project)"></i>
                {{ getStatusText(project) }}
              </span>
              <span class="days-left" v-if="getDaysLeft(project) > 0">
                <i class="fa-solid fa-clock"></i> {{ getDaysLeft(project) }} ngày còn lại
              </span>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="card-footer">
            <button class="btn-view" @click="viewProject(project)">
              <i class="fa-solid fa-eye"></i> Xem chi tiết
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state" v-else>
        <div class="empty-illustration">
          <i class="fa-solid fa-folder-open"></i>
        </div>
        <h3>Chưa có dự án nào</h3>
        <p>Bắt đầu tạo dự án đầu tiên để quản lý công việc hiệu quả hơn</p>
        <button class="btn-create" data-bs-toggle="modal" data-bs-target="#createProjectModal">
          <i class="fa-solid fa-plus"></i> Tạo dự án mới
        </button>
      </div>
    </div>

    <!-- CREATE MODAL -->
    <div class="modal fade" id="createProjectModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content custom-modal">
          <div class="modal-header">
            <div class="modal-icon">
              <i class="fa-solid fa-folder-plus"></i>
            </div>
            <h5 class="modal-title">Tạo dự án mới</h5>
            <button type="button" class="btn-close-modal" data-bs-dismiss="modal">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-user"></i> Client ID
              </label>
              <input v-model="form.client_id" type="number" class="form-input" placeholder="Nhập ID khách hàng">
            </div>
            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-project-diagram"></i> Tên dự án
              </label>
              <input v-model="form.name" type="text" class="form-input" placeholder="Nhập tên dự án">
            </div>
            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-align-left"></i> Mô tả
              </label>
              <textarea v-model="form.description" rows="3" class="form-input" placeholder="Mô tả chi tiết về dự án..."></textarea>
            </div>
            <div class="form-row">
              <div class="form-group half">
                <label class="form-label">
                  <i class="fa-solid fa-calendar-plus"></i> Ngày bắt đầu
                </label>
                <input v-model="form.start_date" type="date" class="form-input">
              </div>
              <div class="form-group half">
                <label class="form-label">
                  <i class="fa-solid fa-calendar-check"></i> Ngày kết thúc
                </label>
                <input v-model="form.end_date" type="date" class="form-input">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-cancel" data-bs-dismiss="modal">
              <i class="fa-solid fa-times"></i> Hủy bỏ
            </button>
            <button type="button" class="btn-submit" @click="createProject">
              <i class="fa-solid fa-check"></i> Tạo dự án
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- EDIT MODAL -->
    <div class="modal fade" id="editProjectModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content custom-modal">
          <div class="modal-header">
            <div class="modal-icon edit">
              <i class="fa-solid fa-pen-to-square"></i>
            </div>
            <h5 class="modal-title">Cập nhật dự án</h5>
            <button type="button" class="btn-close-modal" data-bs-dismiss="modal">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-user"></i> Client ID
              </label>
              <input v-model="editForm.client_id" type="number" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-project-diagram"></i> Tên dự án
              </label>
              <input v-model="editForm.name" type="text" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">
                <i class="fa-solid fa-align-left"></i> Mô tả
              </label>
              <textarea v-model="editForm.description" rows="3" class="form-input"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group half">
                <label class="form-label">
                  <i class="fa-solid fa-calendar-plus"></i> Ngày bắt đầu
                </label>
                <input v-model="editForm.start_date" type="date" class="form-input">
              </div>
              <div class="form-group half">
                <label class="form-label">
                  <i class="fa-solid fa-calendar-check"></i> Ngày kết thúc
                </label>
                <input v-model="editForm.end_date" type="date" class="form-input">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-cancel" data-bs-dismiss="modal">
              <i class="fa-solid fa-times"></i> Hủy bỏ
            </button>
            <button type="button" class="btn-submit" @click="updateProject">
              <i class="fa-solid fa-save"></i> Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- VIEW DETAIL MODAL -->
    <div class="modal fade" id="viewProjectModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content custom-modal view-modal" v-if="selectedProject">
          <!-- Header with gradient -->
          <div class="modal-header view-header" :class="getProjectColor(selectedProject.id % 5)">
            <div class="view-header-content">
              <div class="view-badge">
                <i class="fa-solid fa-hashtag"></i> {{ selectedProject.id }}
              </div>
              <h2 class="view-title">{{ selectedProject.name }}</h2>
              <div class="view-status">
                <span class="status-badge-lg" :class="getStatusClass(selectedProject)">
                  <i :class="getStatusIcon(selectedProject)"></i>
                  {{ getStatusText(selectedProject) }}
                </span>
              </div>
            </div>
            <button type="button" class="btn-close-view" data-bs-dismiss="modal">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body view-body">
            <!-- Progress Overview -->
            <div class="view-section progress-overview">
              <div class="progress-circle-container">
                <div class="progress-circle" :class="getProgressClass(selectedProject)">
                  <svg viewBox="0 0 100 100">
                    <circle class="progress-bg" cx="50" cy="50" r="45"/>
                    <circle class="progress-value" cx="50" cy="50" r="45" 
                            :style="{ strokeDasharray: `${getProgress(selectedProject) * 2.83} 283` }"/>
                  </svg>
                  <div class="progress-text">
                    <span class="progress-number">{{ getProgress(selectedProject) }}</span>
                    <span class="progress-symbol">%</span>
                  </div>
                </div>
                <p class="progress-label">Tiến độ dự án</p>
              </div>
              
              <div class="time-info">
                <div class="time-item">
                  <div class="time-icon start">
                    <i class="fa-solid fa-play"></i>
                  </div>
                  <div class="time-details">
                    <span class="time-label">Ngày bắt đầu</span>
                    <span class="time-value">{{ formatDateVN(selectedProject.start_date) }}</span>
                  </div>
                </div>
                <div class="time-line">
                  <div class="line-fill" :style="{ width: getProgress(selectedProject) + '%' }"></div>
                </div>
                <div class="time-item">
                  <div class="time-icon end">
                    <i class="fa-solid fa-flag-checkered"></i>
                  </div>
                  <div class="time-details">
                    <span class="time-label">Ngày kết thúc</span>
                    <span class="time-value">{{ formatDateVN(selectedProject.end_date) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="view-section">
              <h4 class="section-title">
                <i class="fa-solid fa-align-left"></i> Mô tả dự án
              </h4>
              <div class="description-content">
                {{ selectedProject.description || 'Chưa có mô tả cho dự án này.' }}
              </div>
            </div>

            <!-- Stats Grid -->
            <div class="view-section">
              <h4 class="section-title">
                <i class="fa-solid fa-chart-bar"></i> Thống kê
              </h4>
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-card-icon blue">
                    <i class="fa-solid fa-calendar-days"></i>
                  </div>
                  <div class="stat-card-info">
                    <span class="stat-card-value">{{ getTotalDays(selectedProject) }}</span>
                    <span class="stat-card-label">Tổng số ngày</span>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-card-icon green">
                    <i class="fa-solid fa-calendar-check"></i>
                  </div>
                  <div class="stat-card-info">
                    <span class="stat-card-value">{{ getElapsedDays(selectedProject) }}</span>
                    <span class="stat-card-label">Ngày đã qua</span>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-card-icon orange">
                    <i class="fa-solid fa-clock"></i>
                  </div>
                  <div class="stat-card-info">
                    <span class="stat-card-value">{{ getDaysLeft(selectedProject) }}</span>
                    <span class="stat-card-label">Ngày còn lại</span>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-card-icon purple">
                    <i class="fa-solid fa-user"></i>
                  </div>
                  <div class="stat-card-info">
                    <span class="stat-card-value">{{ selectedProject.client_id }}</span>
                    <span class="stat-card-label">Client ID</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Timeline -->
            <div class="view-section">
              <h4 class="section-title">
                <i class="fa-solid fa-timeline"></i> Timeline
              </h4>
              <div class="timeline">
                <div class="timeline-item" :class="{ active: isDatePassed(selectedProject.start_date) }">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <span class="timeline-date">{{ formatDateVN(selectedProject.start_date) }}</span>
                    <span class="timeline-text">Bắt đầu dự án</span>
                  </div>
                </div>
                <div class="timeline-item" :class="{ active: getProgress(selectedProject) >= 25 }">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <span class="timeline-date">25%</span>
                    <span class="timeline-text">Giai đoạn khởi động</span>
                  </div>
                </div>
                <div class="timeline-item" :class="{ active: getProgress(selectedProject) >= 50 }">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <span class="timeline-date">50%</span>
                    <span class="timeline-text">Giai đoạn phát triển</span>
                  </div>
                </div>
                <div class="timeline-item" :class="{ active: getProgress(selectedProject) >= 75 }">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <span class="timeline-date">75%</span>
                    <span class="timeline-text">Giai đoạn hoàn thiện</span>
                  </div>
                </div>
                <div class="timeline-item" :class="{ active: getProgress(selectedProject) >= 100 }">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <span class="timeline-date">{{ formatDateVN(selectedProject.end_date) }}</span>
                    <span class="timeline-text">Kết thúc dự án</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer view-footer">
            <button type="button" class="btn-action-view" @click="openEditFromView">
              <i class="fa-solid fa-pen"></i> Chỉnh sửa
            </button>
            <button type="button" class="btn-close-modal-view" data-bs-dismiss="modal">
              <i class="fa-solid fa-times"></i> Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/core/baseRequest";

export default {
  name: "ProjectList",

  components: {},

  data() {
    return {
      projects: [],
      filteredProjects: [],
      searchQuery: '',
      activeMenu: null,
      selectedProject: null,
      form: {
        client_id: "",
        name: "",
        description: "",
        start_date: "",
        end_date: "",
      },
      editForm: {
        id: "",
        client_id: "",
        name: "",
        description: "",
        start_date: "",
        end_date: "",
      }
    };
  },

  computed: {
    activeProjects() {
      const today = new Date();
      return this.projects.filter(p => {
        const endDate = new Date(p.end_date);
        return endDate >= today;
      }).length;
    },
    completedProjects() {
      const today = new Date();
      return this.projects.filter(p => {
        const endDate = new Date(p.end_date);
        return endDate < today;
      }).length;
    }
  },

  mounted() {
    this.loadProjects();
    document.addEventListener('click', this.closeMenu);
  },

  beforeUnmount() {
    document.removeEventListener('click', this.closeMenu);
  },

  methods: {
    async loadProjects() {
      const res = await api.get("projects");
      this.projects = res.data.data;
      this.filteredProjects = this.projects;
    },

    filterProjects() {
      if (!this.searchQuery.trim()) {
        this.filteredProjects = this.projects;
        return;
      }
      const query = this.searchQuery.toLowerCase();
      this.filteredProjects = this.projects.filter(p => 
        p.name.toLowerCase().includes(query) || 
        (p.description && p.description.toLowerCase().includes(query))
      );
    },

    formatDateVN(date) {
      if (!date) return "Chưa xác định";
      const d = new Date(date);
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    },

    getProjectColor(index) {
      const colors = ['gradient-purple', 'gradient-blue', 'gradient-green', 'gradient-orange', 'gradient-pink'];
      return colors[index % colors.length];
    },

    getProgress(project) {
      if (!project.start_date || !project.end_date) return 0;
      const start = new Date(project.start_date);
      const end = new Date(project.end_date);
      const now = new Date();
      
      if (now < start) return 0;
      if (now > end) return 100;
      
      const total = end - start;
      const elapsed = now - start;
      return Math.round((elapsed / total) * 100);
    },

    getProgressClass(project) {
      const progress = this.getProgress(project);
      if (progress >= 100) return 'complete';
      if (progress >= 75) return 'high';
      if (progress >= 50) return 'medium';
      return 'low';
    },

    getStatusClass(project) {
      const progress = this.getProgress(project);
      if (progress >= 100) return 'completed';
      if (progress >= 75) return 'ending';
      return 'active';
    },

    getStatusText(project) {
      const progress = this.getProgress(project);
      if (progress >= 100) return 'Hoàn thành';
      if (progress >= 75) return 'Sắp kết thúc';
      return 'Đang thực hiện';
    },

    getStatusIcon(project) {
      const progress = this.getProgress(project);
      if (progress >= 100) return 'fa-solid fa-check-circle';
      if (progress >= 75) return 'fa-solid fa-clock';
      return 'fa-solid fa-play-circle';
    },

    getDaysLeft(project) {
      if (!project.end_date) return 0;
      const end = new Date(project.end_date);
      const now = new Date();
      const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 0;
    },

    toggleMenu(id) {
      this.activeMenu = this.activeMenu === id ? null : id;
    },

    closeMenu(e) {
      if (!e.target.closest('.card-menu')) {
        this.activeMenu = null;
      }
    },

    viewProject(project) {
      this.selectedProject = project;
      let modal = new bootstrap.Modal(document.getElementById("viewProjectModal"));
      modal.show();
    },

    getTotalDays(project) {
      if (!project.start_date || !project.end_date) return 0;
      const start = new Date(project.start_date);
      const end = new Date(project.end_date);
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    },

    getElapsedDays(project) {
      if (!project.start_date) return 0;
      const start = new Date(project.start_date);
      const now = new Date();
      const end = new Date(project.end_date);
      
      if (now < start) return 0;
      if (now > end) return this.getTotalDays(project);
      
      return Math.ceil((now - start) / (1000 * 60 * 60 * 24));
    },

    isDatePassed(date) {
      if (!date) return false;
      return new Date(date) <= new Date();
    },

    openEditFromView() {
      const modal = bootstrap.Modal.getInstance(document.getElementById("viewProjectModal"));
      modal.hide();
      setTimeout(() => {
        this.openEditModal(this.selectedProject);
      }, 300);
    },

    async deleteProject(id) {
      if (!confirm("Bạn có chắc muốn xóa dự án này?")) return;
      await api.delete("projects/delete/" + id);
      this.activeMenu = null;
      this.loadProjects();
    },

    async createProject() {
      try {
        await api.post("projects/create", this.form);
        const modal = bootstrap.Modal.getInstance(document.getElementById("createProjectModal"));
        modal.hide();
        
        this.form = {
          client_id: "",
          name: "",
          description: "",
          start_date: "",
          end_date: "",
        };
        
        this.loadProjects();
      } catch (err) {
        console.log(err);
        alert("Tạo dự án thất bại!");
      }
    },

    openEditModal(project) {
      this.activeMenu = null;
      this.editForm = {
        id: project.id,
        client_id: project.client_id,
        name: project.name,
        description: project.description,
        start_date: project.start_date,
        end_date: project.end_date,
      };
      let modal = new bootstrap.Modal(document.getElementById("editProjectModal"));
      modal.show();
    },

    async updateProject() {
      try {
        await api.post("projects/update/" + this.editForm.id, this.editForm);
        const modal = bootstrap.Modal.getInstance(document.getElementById("editProjectModal"));
        modal.hide();
        this.loadProjects();
      } catch (err) {
        console.log(err);
        alert("Cập nhật thất bại!");
      }
    }
  }
};
</script>

<style scoped>
/* ==================== PAGE LAYOUT ==================== */
.projects-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  font-family: 'Be Vietnam Pro', 'Inter', sans-serif;
}

/* ==================== HEADER ==================== */
.page-header {
  background: white;
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box i {
  position: absolute;
  left: 1rem;
  color: #94a3b8;
}

.search-box input {
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.9rem;
  width: 280px;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.search-box input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
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

/* ==================== STATS BAR ==================== */
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

.stat-icon.total {
  background: #eff6ff;
  color: #3b82f6;
}

.stat-icon.active {
  background: #f0fdf4;
  color: #22c55e;
}

.stat-icon.completed {
  background: #faf5ff;
  color: #a855f7;
}

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

/* ==================== PROJECTS CONTAINER ==================== */
.projects-container {
  padding: 2rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
}

/* ==================== PROJECT CARD ==================== */
.project-card {
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
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* Card Header Gradients */
.card-header {
  padding: 1.5rem;
  color: white;
  position: relative;
  overflow: hidden;
}

.card-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.gradient-purple { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.gradient-blue { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.gradient-green { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.gradient-orange { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.gradient-pink { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }

.card-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.project-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.card-menu {
  position: relative;
}

.menu-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.menu-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  padding: 0.5rem;
  min-width: 150px;
  z-index: 100;
}

.dropdown-menu button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  border: none;
  background: none;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.dropdown-menu button:hover {
  background: #f1f5f9;
}

.dropdown-menu button.danger {
  color: #ef4444;
}

.dropdown-menu button.danger:hover {
  background: #fef2f2;
}

.project-name {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.3;
}

/* Card Body */
.card-body {
  padding: 1.5rem;
}

.project-description {
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Progress Section */
.progress-section {
  margin-bottom: 1.25rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  color: #64748b;
}

.progress-percent {
  font-weight: 600;
  color: #1e293b;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.6s ease;
}

.progress-fill.low { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
.progress-fill.medium { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
.progress-fill.high { background: linear-gradient(90deg, #f97316, #fb923c); }
.progress-fill.complete { background: linear-gradient(90deg, #22c55e, #4ade80); }

/* Project Info */
.project-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.info-item i {
  width: 32px;
  height: 32px;
  background: #f1f5f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-size: 0.85rem;
}

.info-content {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.7rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
}

/* Status Section */
.status-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.85rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.active {
  background: #dcfce7;
  color: #16a34a;
}

.status-badge.ending {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.completed {
  background: #f3e8ff;
  color: #9333ea;
}

.days-left {
  font-size: 0.75rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

/* Card Footer */
.card-footer {
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

/* ==================== EMPTY STATE ==================== */
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

/* ==================== MODAL STYLES ==================== */
.custom-modal {
  border: none;
  border-radius: 24px;
  overflow: hidden;
}

.custom-modal .modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem;
  border: none;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.modal-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.modal-icon.edit {
  background: rgba(255, 255, 255, 0.2);
}

.custom-modal .modal-title {
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
  margin: 0;
}

.btn-close-modal {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  margin-left: auto;
  transition: all 0.3s;
}

.btn-close-modal:hover {
  background: rgba(255, 255, 255, 0.3);
}

.custom-modal .modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group.half {
  flex: 1;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-label i {
  color: #667eea;
}

.form-input {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.9rem;
  transition: all 0.3s;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

textarea.form-input {
  resize: vertical;
  min-height: 100px;
}

.custom-modal .modal-footer {
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border: none;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

/* ==================== VIEW MODAL STYLES ==================== */
.view-modal {
  max-width: 800px;
}

.view-header {
  padding: 2rem !important;
  position: relative;
  overflow: hidden;
}

.view-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.view-header-content {
  position: relative;
  z-index: 1;
}

.view-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  color: white;
  margin-bottom: 0.75rem;
}

.view-title {
  color: white;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 1rem;
}

.status-badge-lg {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge-lg.active {
  background: rgba(34, 197, 94, 0.2);
  color: #bbf7d0;
}

.status-badge-lg.ending {
  background: rgba(251, 191, 36, 0.2);
  color: #fef08a;
}

.status-badge-lg.completed {
  background: rgba(168, 85, 247, 0.2);
  color: #e9d5ff;
}

.btn-close-view {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close-view:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.view-body {
  padding: 2rem !important;
}

.view-section {
  margin-bottom: 2rem;
}

.view-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.section-title i {
  color: #667eea;
}

/* Progress Overview */
.progress-overview {
  display: flex;
  align-items: center;
  gap: 3rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 20px;
}

.progress-circle-container {
  text-align: center;
}

.progress-circle {
  position: relative;
  width: 120px;
  height: 120px;
}

.progress-circle svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}

.progress-bg {
  fill: none;
  stroke: #e2e8f0;
  stroke-width: 8;
}

.progress-value {
  fill: none;
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dasharray 0.6s ease;
}

.progress-circle.low .progress-value { stroke: #3b82f6; }
.progress-circle.medium .progress-value { stroke: #f59e0b; }
.progress-circle.high .progress-value { stroke: #f97316; }
.progress-circle.complete .progress-value { stroke: #22c55e; }

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.progress-number {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
}

.progress-symbol {
  font-size: 1rem;
  color: #64748b;
}

.progress-label {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: #64748b;
}

.time-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.time-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.time-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.time-icon.start {
  background: #dcfce7;
  color: #22c55e;
}

.time-icon.end {
  background: #fee2e2;
  color: #ef4444;
}

.time-details {
  display: flex;
  flex-direction: column;
}

.time-label {
  font-size: 0.75rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.time-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e293b;
}

.time-line {
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin: 0 0.5rem;
}

.line-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #3b82f6);
  border-radius: 10px;
  transition: width 0.6s ease;
}

/* Description */
.description-content {
  padding: 1.25rem;
  background: #f8fafc;
  border-radius: 12px;
  color: #475569;
  line-height: 1.7;
  font-size: 0.95rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.stat-card-icon.blue { background: #dbeafe; color: #3b82f6; }
.stat-card-icon.green { background: #dcfce7; color: #22c55e; }
.stat-card-icon.orange { background: #fed7aa; color: #f97316; }
.stat-card-icon.purple { background: #ede9fe; color: #8b5cf6; }

.stat-card-info {
  display: flex;
  flex-direction: column;
}

.stat-card-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.stat-card-label {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 0.25rem;
}

/* Timeline */
.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e2e8f0;
}

.timeline-item {
  position: relative;
  padding-bottom: 1.5rem;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -26px;
  top: 4px;
  width: 14px;
  height: 14px;
  background: #e2e8f0;
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0 0 0 3px #e2e8f0;
  transition: all 0.3s;
}

.timeline-item.active .timeline-dot {
  background: #22c55e;
  box-shadow: 0 0 0 3px #dcfce7;
}

.timeline-content {
  display: flex;
  flex-direction: column;
}

.timeline-date {
  font-size: 0.8rem;
  font-weight: 600;
  color: #667eea;
}

.timeline-text {
  font-size: 0.9rem;
  color: #64748b;
}

.timeline-item.active .timeline-text {
  color: #1e293b;
  font-weight: 500;
}

/* View Footer */
.view-footer {
  padding: 1.25rem 2rem !important;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-action-view {
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

.btn-action-view:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-close-modal-view {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-close-modal-view:hover {
  border-color: #cbd5e1;
  background: #f1f5f9;
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .search-box input {
    width: 100%;
  }

  .btn-create {
    width: 100%;
    justify-content: center;
  }

  .stats-bar {
    flex-direction: column;
    gap: 1rem;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    flex-direction: column;
  }

  .progress-overview {
    flex-direction: column;
    gap: 1.5rem;
  }

  .time-info {
    flex-direction: column;
    width: 100%;
  }

  .time-line {
    width: 100%;
    margin: 0.5rem 0;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>