<template>
  <div class="admin-dashboard">
    <div class="page-header">
      <h1>Admin Dashboard</h1>
      <p class="text-muted">Tổng quan hệ thống quản lý</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else>
      <!-- Stats Cards -->
      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="card stat-card bg-primary text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-subtitle mb-2 opacity-75">Tổng người dùng</h6>
                  <h2 class="card-title mb-0">{{ stats.users?.total || 0 }}</h2>
                </div>
                <i class="bi bi-people fs-1 opacity-50"></i>
              </div>
              <small class="opacity-75">
                <i class="bi bi-check-circle"></i> {{ stats.users?.active || 0 }} đang hoạt động
              </small>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card stat-card bg-success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-subtitle mb-2 opacity-75">Tổng công việc</h6>
                  <h2 class="card-title mb-0">{{ stats.tasks?.total || 0 }}</h2>
                </div>
                <i class="bi bi-list-task fs-1 opacity-50"></i>
              </div>
              <small class="opacity-75">
                <i class="bi bi-check2-all"></i> {{ stats.tasks?.completed || 0 }} hoàn thành
              </small>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card stat-card bg-info text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-subtitle mb-2 opacity-75">Tổng dự án</h6>
                  <h2 class="card-title mb-0">{{ stats.projects?.total || 0 }}</h2>
                </div>
                <i class="bi bi-folder fs-1 opacity-50"></i>
              </div>
              <small class="opacity-75">
                <i class="bi bi-folder-check"></i> {{ stats.projects?.with_tasks || 0 }} có tasks
              </small>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card stat-card bg-warning text-dark">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-subtitle mb-2 opacity-75">Quá hạn</h6>
                  <h2 class="card-title mb-0">{{ stats.tasks?.overdue || 0 }}</h2>
                </div>
                <i class="bi bi-exclamation-triangle fs-1 opacity-50"></i>
              </div>
              <small class="opacity-75">
                <i class="bi bi-clock"></i> {{ stats.tasks?.due_today || 0 }} hôm nay
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="row g-4 mb-4">
        <!-- Users by Role -->
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-header">
              <h5 class="mb-0"><i class="bi bi-pie-chart me-2"></i>Phân bố theo vai trò</h5>
            </div>
            <div class="card-body">
              <div class="role-stats">
                <div class="role-item" v-for="(count, role) in stats.users?.by_role" :key="role">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="badge" :class="getRoleBadgeClass(role)">{{ getRoleName(role) }}</span>
                    <span class="fw-bold">{{ count }}</span>
                  </div>
                  <div class="progress" style="height: 6px;">
                    <div class="progress-bar" :class="getRoleProgressClass(role)"
                         :style="{ width: getRolePercentage(count) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Task Status -->
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-header">
              <h5 class="mb-0"><i class="bi bi-bar-chart me-2"></i>Trạng thái công việc</h5>
            </div>
            <div class="card-body">
              <div class="task-stats">
                <div class="stat-row d-flex justify-content-between py-2 border-bottom">
                  <span><i class="bi bi-hourglass text-warning me-2"></i>Đang chờ</span>
                  <span class="badge bg-warning">{{ stats.tasks?.pending || 0 }}</span>
                </div>
                <div class="stat-row d-flex justify-content-between py-2 border-bottom">
                  <span><i class="bi bi-arrow-repeat text-info me-2"></i>Đang làm</span>
                  <span class="badge bg-info">{{ stats.tasks?.in_progress || 0 }}</span>
                </div>
                <div class="stat-row d-flex justify-content-between py-2 border-bottom">
                  <span><i class="bi bi-check-circle text-success me-2"></i>Hoàn thành</span>
                  <span class="badge bg-success">{{ stats.tasks?.completed || 0 }}</span>
                </div>
                <div class="stat-row d-flex justify-content-between py-2">
                  <span><i class="bi bi-x-circle text-danger me-2"></i>Quá hạn</span>
                  <span class="badge bg-danger">{{ stats.tasks?.overdue || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- System Info -->
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-header">
              <h5 class="mb-0"><i class="bi bi-gear me-2"></i>Thông tin hệ thống</h5>
            </div>
            <div class="card-body">
              <div class="system-info">
                <div class="info-row d-flex justify-content-between py-2 border-bottom">
                  <span>PHP Version</span>
                  <span class="text-muted">{{ stats.system?.php_version || 'N/A' }}</span>
                </div>
                <div class="info-row d-flex justify-content-between py-2 border-bottom">
                  <span>Laravel Version</span>
                  <span class="text-muted">{{ stats.system?.laravel_version || 'N/A' }}</span>
                </div>
                <div class="info-row d-flex justify-content-between py-2 border-bottom">
                  <span>Timezone</span>
                  <span class="text-muted">{{ stats.system?.timezone || 'N/A' }}</span>
                </div>
                <div class="info-row d-flex justify-content-between py-2">
                  <span>Server Time</span>
                  <span class="text-muted">{{ stats.system?.server_time || 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0"><i class="bi bi-activity me-2"></i>Hoạt động gần đây</h5>
              <router-link to="/activity-logs" class="btn btn-sm btn-outline-primary">
                Xem tất cả
              </router-link>
            </div>
            <div class="card-body">
              <div class="activity-list">
                <div v-for="activity in stats.activities" :key="activity.id"
                     class="activity-item d-flex align-items-start py-3 border-bottom">
                  <div class="avatar me-3">
                    <img v-if="activity.client?.avatar" :src="activity.client.avatar"
                         class="rounded-circle" width="40" height="40">
                    <div v-else class="avatar-placeholder rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                         style="width: 40px; height: 40px;">
                      <i class="bi bi-person text-white"></i>
                    </div>
                  </div>
                  <div class="activity-content flex-grow-1">
                    <div class="d-flex justify-content-between">
                      <span class="fw-bold">{{ activity.client?.ho_va_ten || 'Unknown' }}</span>
                      <small class="text-muted">{{ formatTime(activity.created_at) }}</small>
                    </div>
                    <p class="mb-0 text-muted">{{ activity.action }}</p>
                  </div>
                </div>
                <div v-if="!stats.activities?.length" class="text-center py-4 text-muted">
                  Chưa có hoạt động nào
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import adminService from '@/services/adminService'

export default {
  name: 'AdminDashboard',
  data() {
    return {
      loading: true,
      stats: {
        users: {},
        tasks: {},
        projects: {},
        activities: [],
        system: {}
      }
    }
  },
  mounted() {
    this.loadDashboard()
  },
  methods: {
    async loadDashboard() {
      try {
        this.loading = true
        const response = await adminService.getDashboard()
        if (response.data.success) {
          this.stats = response.data.data
        }
      } catch (error) {
        console.error('Error loading dashboard:', error)
        this.$toast?.error?.('Không thể tải dữ liệu dashboard')
      } finally {
        this.loading = false
      }
    },
    getRoleName(role) {
      const names = {
        admin: 'Admin',
        manager: 'Manager',
        user: 'User'
      }
      return names[role] || role
    },
    getRoleBadgeClass(role) {
      const classes = {
        admin: 'bg-danger',
        manager: 'bg-primary',
        user: 'bg-secondary'
      }
      return classes[role] || 'bg-secondary'
    },
    getRoleProgressClass(role) {
      const classes = {
        admin: 'bg-danger',
        manager: 'bg-primary',
        user: 'bg-secondary'
      }
      return classes[role] || 'bg-secondary'
    },
    getRolePercentage(count) {
      const total = this.stats.users?.total || 1
      return Math.round((count / total) * 100)
    },
    formatTime(datetime) {
      if (!datetime) return ''
      const date = new Date(datetime)
      const now = new Date()
      const diff = now - date
      
      if (diff < 60000) return 'Vừa xong'
      if (diff < 3600000) return `${Math.floor(diff/60000)} phút trước`
      if (diff < 86400000) return `${Math.floor(diff/3600000)} giờ trước`
      return date.toLocaleDateString('vi-VN')
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  margin-bottom: 5px;
}

.stat-card {
  border: none;
  border-radius: 12px;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.role-item {
  margin-bottom: 15px;
}

.activity-item:last-child {
  border-bottom: none !important;
}

.avatar-placeholder {
  font-size: 18px;
}
</style>
