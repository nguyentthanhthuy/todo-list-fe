<template>
  <div class="dashboard-modern">
    <!-- Animated Background -->
    <div class="dashboard-bg">
      <div class="bg-gradient-1"></div>
      <div class="bg-gradient-2"></div>
      <div class="floating-particles">
        <span v-for="n in 15" :key="n" class="particle"></span>
      </div>
    </div>

    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">
            <i class="fa-solid fa-briefcase"></i>
          </div>
          <span class="logo-text">WorkBuddy</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <span class="nav-label">Menu chính</span>
          <router-link to="/dashboard" class="nav-item active">
            <div class="nav-icon"><i class="fa-solid fa-home"></i></div>
            <span>Dashboard</span>
            <div class="nav-indicator"></div>
          </router-link>
          <router-link to="/cong-viec" class="nav-item">
            <div class="nav-icon"><i class="fa-solid fa-list-check"></i></div>
            <span>Công việc</span>
            <span class="nav-badge" v-if="taskStats.total > 0">{{ taskStats.total }}</span>
          </router-link>
          <router-link to="/projects" class="nav-item">
            <div class="nav-icon"><i class="fa-solid fa-folder-open"></i></div>
            <span>Dự án</span>
          </router-link>
          <router-link to="/lich" class="nav-item">
            <div class="nav-icon"><i class="fa-solid fa-calendar-days"></i></div>
            <span>Lịch</span>
          </router-link>
        </div>

        <div class="nav-section">
          <span class="nav-label">Tiện ích</span>
          <router-link to="/tags" class="nav-item">
            <div class="nav-icon"><i class="fa-solid fa-tags"></i></div>
            <span>Nhãn</span>
          </router-link>
          <router-link to="/reminders" class="nav-item">
            <div class="nav-icon"><i class="fa-solid fa-bell"></i></div>
            <span>Nhắc nhở</span>
            <span class="nav-badge warning" v-if="reminders.length > 0">{{ reminders.length }}</span>
          </router-link>
          <router-link to="/activity-logs" class="nav-item">
            <div class="nav-icon"><i class="fa-solid fa-clock-rotate-left"></i></div>
            <span>Hoạt động</span>
          </router-link>
          <router-link to="/driver" class="nav-item">
            <div class="nav-icon"><i class="fa-brands fa-google-drive"></i></div>
            <span>Google Drive</span>
          </router-link>
        </div>
      </nav>

      <div class="sidebar-footer">
        <router-link to="/profile" class="user-profile">
          <div class="user-avatar">
            <span>{{ userInitial }}</span>
          </div>
          <div class="user-info">
            <span class="user-name">{{ userName }}</span>
            <span class="user-role">Thành viên</span>
          </div>
          <i class="fa-solid fa-chevron-right"></i>
        </router-link>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Header -->
      <header class="main-header">
        <div class="header-left">
          <div class="greeting">
            <h1 class="greeting-text">
              {{ getGreeting }}, <span class="highlight">{{ userName }}</span>! 👋
            </h1>
            <p class="greeting-subtitle">
              Bạn có <strong>{{ taskStats.pending || 0 }}</strong> công việc cần hoàn thành hôm nay
            </p>
          </div>
        </div>
        <div class="header-right">
          <div class="header-date">
            <i class="fa-regular fa-calendar"></i>
            <span>{{ currentDate }}</span>
          </div>
          <div class="header-actions">
            <button class="action-btn notification" @click="toggleNotifications">
              <i class="fa-solid fa-bell"></i>
              <span class="badge" v-if="reminders.length > 0">{{ reminders.length }}</span>
            </button>
            <router-link to="/them-moi-cong-viec" class="btn-add-task">
              <i class="fa-solid fa-plus"></i>
              <span>Tạo công việc</span>
            </router-link>
          </div>
        </div>
      </header>

      <!-- Stats Grid -->
      <section class="stats-section">
        <div class="stats-grid">
          <div class="stat-card stat-total" @click="$router.push('/cong-viec')">
            <div class="stat-icon">
              <i class="fa-solid fa-layer-group"></i>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ taskStats.total }}</span>
              <span class="stat-label">Tổng công việc</span>
            </div>
            <div class="stat-trend up">
              <i class="fa-solid fa-arrow-trend-up"></i>
              <span>+12%</span>
            </div>
            <div class="stat-wave"></div>
          </div>

          <div class="stat-card stat-completed">
            <div class="stat-icon">
              <i class="fa-solid fa-circle-check"></i>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ taskStats.completed }}</span>
              <span class="stat-label">Hoàn thành</span>
            </div>
            <div class="stat-progress">
              <div class="progress-ring">
                <svg viewBox="0 0 36 36">
                  <path class="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path class="ring-fill" :stroke-dasharray="`${overallProgress}, 100`" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span class="ring-text">{{ overallProgress }}%</span>
              </div>
            </div>
            <div class="stat-wave"></div>
          </div>

          <div class="stat-card stat-progress">
            <div class="stat-icon">
              <i class="fa-solid fa-spinner"></i>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ taskStats.inProgress }}</span>
              <span class="stat-label">Đang thực hiện</span>
            </div>
            <div class="stat-mini-chart">
              <div class="mini-bar" v-for="n in 7" :key="n" :style="{ height: Math.random() * 30 + 10 + 'px' }"></div>
            </div>
            <div class="stat-wave"></div>
          </div>

          <div class="stat-card stat-pending">
            <div class="stat-icon">
              <i class="fa-solid fa-hourglass-half"></i>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ taskStats.pending }}</span>
              <span class="stat-label">Chờ xử lý</span>
            </div>
            <div class="stat-dots">
              <span v-for="n in 5" :key="n" class="dot"></span>
            </div>
            <div class="stat-wave"></div>
          </div>

          <div class="stat-card stat-overdue" v-if="taskStats.overdue > 0">
            <div class="stat-icon">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ taskStats.overdue }}</span>
              <span class="stat-label">Quá hạn</span>
            </div>
            <div class="stat-alert">
              <i class="fa-solid fa-exclamation"></i>
            </div>
            <div class="stat-wave"></div>
          </div>
        </div>
      </section>

      <!-- Main Grid -->
      <section class="main-grid">
        <!-- Chart Section -->
        <div class="card chart-card">
          <div class="card-header">
            <div class="card-title">
              <div class="title-icon purple">
                <i class="fa-solid fa-chart-line"></i>
              </div>
              <div>
                <h3>Hiệu suất làm việc</h3>
                <p>Thống kê 6 tháng gần đây</p>
              </div>
            </div>
            <div class="card-actions">
              <button class="btn-filter active">Tuần</button>
              <button class="btn-filter">Tháng</button>
              <button class="btn-filter">Năm</button>
            </div>
          </div>
          <div class="card-body">
            <Line :data="chartData" :options="chartOptions" />
          </div>
        </div>

        <!-- Recent Tasks -->
        <div class="card tasks-card">
          <div class="card-header">
            <div class="card-title">
              <div class="title-icon blue">
                <i class="fa-solid fa-list-check"></i>
              </div>
              <div>
                <h3>Công việc gần đây</h3>
                <p>{{ recentTasks.length }} công việc</p>
              </div>
            </div>
            <router-link to="/cong-viec" class="btn-view-all">
              Xem tất cả
              <i class="fa-solid fa-arrow-right"></i>
            </router-link>
          </div>
          <div class="card-body">
            <div class="tasks-list">
              <div 
                v-for="task in recentTasks" 
                :key="task.id" 
                class="task-item"
                :class="getStatusClass(task.status)"
              >
                <div class="task-check">
                  <input type="checkbox" :checked="task.status === 'Hoàn thành'" disabled>
                </div>
                <div class="task-content">
                  <router-link :to="'/tasks/detail/' + task.id" class="task-title">
                    {{ task.title }}
                  </router-link>
                  <div class="task-meta">
                    <span class="task-date">
                      <i class="fa-regular fa-calendar"></i>
                      {{ formatDate(task.deadline) }}
                    </span>
                    <span class="task-priority" :class="getPriorityClass(task.priority)">
                      {{ task.priority }}
                    </span>
                  </div>
                </div>
                <div class="task-status" :class="getStatusClass(task.status)">
                  {{ task.status }}
                </div>
              </div>
              <div v-if="recentTasks.length === 0" class="empty-state">
                <i class="fa-solid fa-inbox"></i>
                <p>Chưa có công việc nào</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Reminders -->
        <div class="card reminders-card">
          <div class="card-header">
            <div class="card-title">
              <div class="title-icon orange">
                <i class="fa-solid fa-bell"></i>
              </div>
              <div>
                <h3>Nhắc nhở sắp tới</h3>
                <p>{{ reminders.length }} nhắc nhở</p>
              </div>
            </div>
            <router-link to="/reminders" class="btn-view-all">
              Xem tất cả
              <i class="fa-solid fa-arrow-right"></i>
            </router-link>
          </div>
          <div class="card-body">
            <div class="reminders-list">
              <div 
                v-for="reminder in reminders.slice(0, 5)" 
                :key="reminder.id" 
                class="reminder-item"
                :class="{ overdue: isOverdue(reminder) }"
              >
                <div class="reminder-icon" :class="isOverdue(reminder) ? 'danger' : 'warning'">
                  <i class="fa-solid fa-clock"></i>
                </div>
                <div class="reminder-content">
                  <router-link :to="'/tasks/detail/' + reminder.task?.id" class="reminder-title">
                    {{ reminder.task?.title || 'Công việc' }}
                  </router-link>
                  <span class="reminder-time">
                    <i class="fa-regular fa-clock"></i>
                    {{ formatDateTime(reminder.remind_time) }}
                  </span>
                </div>
                <div class="reminder-status" :class="isOverdue(reminder) ? 'overdue' : ''">
                  {{ isOverdue(reminder) ? 'Quá hạn' : 'Sắp tới' }}
                </div>
              </div>
              <div v-if="reminders.length === 0" class="empty-state">
                <i class="fa-solid fa-bell-slash"></i>
                <p>Không có nhắc nhở</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity Log -->
        <div class="card activity-card">
          <div class="card-header">
            <div class="card-title">
              <div class="title-icon green">
                <i class="fa-solid fa-clock-rotate-left"></i>
              </div>
              <div>
                <h3>Hoạt động gần đây</h3>
                <p>Cập nhật mới nhất</p>
              </div>
            </div>
            <router-link to="/activity-logs" class="btn-view-all">
              Xem tất cả
              <i class="fa-solid fa-arrow-right"></i>
            </router-link>
          </div>
          <div class="card-body">
            <div class="activity-timeline">
              <div 
                v-for="log in activityLogs.slice(0, 6)" 
                :key="log.id" 
                class="activity-item"
              >
                <div class="activity-dot" :class="getActionClass(log.action)"></div>
                <div class="activity-content">
                  <p class="activity-text">
                    <strong>{{ log.user?.name || 'Bạn' }}</strong>
                    {{ parseAction(log.action) }}
                    <span class="activity-target">{{ log.description || '' }}</span>
                  </p>
                  <span class="activity-time">{{ formatTimeAgo(log.created_at) }}</span>
                </div>
              </div>
              <div v-if="activityLogs.length === 0" class="empty-state">
                <i class="fa-solid fa-clock-rotate-left"></i>
                <p>Chưa có hoạt động</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Projects Overview -->
        <div class="card projects-card">
          <div class="card-header">
            <div class="card-title">
              <div class="title-icon cyan">
                <i class="fa-solid fa-folder-open"></i>
              </div>
              <div>
                <h3>Dự án đang thực hiện</h3>
                <p>3 dự án hoạt động</p>
              </div>
            </div>
            <router-link to="/projects" class="btn-view-all">
              Xem tất cả
              <i class="fa-solid fa-arrow-right"></i>
            </router-link>
          </div>
          <div class="card-body">
            <div class="projects-grid">
              <div class="project-item" v-for="project in projects" :key="project.id">
                <div class="project-header">
                  <div class="project-icon" :class="project.color">
                    <i :class="project.icon"></i>
                  </div>
                  <span class="project-status" :class="project.statusClass">{{ project.status }}</span>
                </div>
                <h4 class="project-name">{{ project.name }}</h4>
                <div class="project-progress">
                  <div class="progress-info">
                    <span>Tiến độ</span>
                    <span>{{ project.progress }}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: project.progress + '%' }" :class="project.color"></div>
                  </div>
                </div>
                <div class="project-footer">
                  <div class="project-tasks">
                    <i class="fa-solid fa-list-check"></i>
                    {{ project.completedTasks }}/{{ project.totalTasks }}
                  </div>
                  <div class="project-team">
                    <div class="team-avatars">
                      <span v-for="member in project.team.slice(0, 3)" :key="member" class="avatar">{{ member }}</span>
                      <span v-if="project.team.length > 3" class="avatar more">+{{ project.team.length - 3 }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Filler
} from "chart.js";
import reminderService from '../../../services/reminderService';
import activityLogService from '../../../services/activityLogService';
import taskService from '../../../services/taskService';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Filler
);

export default {
  name: "DashboardPage",
  components: { Line },
  data() {
    return {
      userName: 'Bạn',
      currentDate: new Date().toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      reminders: [],
      activityLogs: [],
      recentTasks: [],
      taskStats: {
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        overdue: 0
      },
      projects: [
        {
          id: 1,
          name: 'Thiết kế UI Dashboard',
          icon: 'fa-solid fa-palette',
          color: 'purple',
          status: 'Đang thực hiện',
          statusClass: 'active',
          progress: 75,
          completedTasks: 15,
          totalTasks: 20,
          team: ['A', 'B', 'C', 'D', 'E']
        },
        {
          id: 2,
          name: 'App Mobile',
          icon: 'fa-solid fa-mobile-screen',
          color: 'blue',
          status: 'Đang thực hiện',
          statusClass: 'active',
          progress: 45,
          completedTasks: 9,
          totalTasks: 20,
          team: ['D', 'E', 'F']
        },
        {
          id: 3,
          name: 'Marketing Campaign',
          icon: 'fa-solid fa-bullhorn',
          color: 'orange',
          status: 'Rà soát',
          statusClass: 'review',
          progress: 90,
          completedTasks: 18,
          totalTasks: 20,
          team: ['G', 'H', 'I']
        }
      ],
      chartData: {
        labels: ["T1", "T2", "T3", "T4", "T5", "T6"],
        datasets: [
          {
            label: "Công việc hoàn thành",
            data: [12, 19, 15, 25, 22, 30],
            tension: 0.4,
            fill: true,
            borderColor: "#667eea",
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 300);
              gradient.addColorStop(0, 'rgba(102, 126, 234, 0.3)');
              gradient.addColorStop(1, 'rgba(102, 126, 234, 0)');
              return gradient;
            },
            pointBackgroundColor: "#667eea",
            pointBorderColor: "#fff",
            pointBorderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(26, 26, 46, 0.9)',
            padding: 16,
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 13 },
            borderColor: 'rgba(102, 126, 234, 0.3)',
            borderWidth: 1,
            cornerRadius: 12,
            displayColors: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(148, 163, 184, 0.1)',
              drawBorder: false
            },
            ticks: {
              color: '#94a3b8',
              font: { size: 12 }
            }
          },
          x: {
            grid: { display: false },
            ticks: {
              color: '#94a3b8',
              font: { size: 12 }
            }
          }
        }
      }
    }
  },
  computed: {
    userInitial() {
      return this.userName.charAt(0).toUpperCase();
    },
    getGreeting() {
      const hour = new Date().getHours();
      if (hour < 12) return 'Chào buổi sáng';
      if (hour < 18) return 'Chào buổi chiều';
      return 'Chào buổi tối';
    },
    overallProgress() {
      if (this.taskStats.total === 0) return 0;
      return Math.round((this.taskStats.completed / this.taskStats.total) * 100);
    }
  },
  mounted() {
    this.loadUserInfo();
    this.loadReminders();
    this.loadActivityLogs();
    this.loadTaskStats();
    this.loadRecentTasks();
  },
  methods: {
    loadUserInfo() {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.userName = user.name || 'Bạn';
    },

    async loadReminders() {
      try {
        const response = await reminderService.getUpcoming();
        this.reminders = response.data || [];
      } catch (error) {
        console.error('Error loading reminders:', error);
      }
    },

    async loadActivityLogs() {
      try {
        const response = await activityLogService.list({ limit: 10 });
        this.activityLogs = response.data || [];
      } catch (error) {
        console.error('Error loading activity logs:', error);
      }
    },

    async loadTaskStats() {
      try {
        const response = await taskService.list();
        const tasks = response.data || [];

        this.taskStats.total = tasks.length;
        this.taskStats.completed = tasks.filter(t => t.status === 'Hoàn thành' || t.status === 'completed').length;
        this.taskStats.inProgress = tasks.filter(t => t.status === 'Đang làm' || t.status === 'in_progress').length;
        this.taskStats.pending = tasks.filter(t => t.status === 'Cần làm' || t.status === 'pending' || t.status === 'Chưa bắt đầu').length;

        const today = new Date();
        this.taskStats.overdue = tasks.filter(t => {
          if (t.status === 'Hoàn thành' || t.status === 'completed') return false;
          if (!t.deadline) return false;
          return new Date(t.deadline) < today;
        }).length;
      } catch (error) {
        console.error('Error loading task stats:', error);
      }
    },

    async loadRecentTasks() {
      try {
        const response = await taskService.list();
        this.recentTasks = (response.data || []).slice(0, 5);
      } catch (error) {
        console.error('Error loading recent tasks:', error);
      }
    },

    toggleNotifications() {
      this.$router.push('/reminders');
    },

    isOverdue(reminder) {
      return new Date(reminder.remind_time) < new Date();
    },

    formatDate(dateString) {
      if (!dateString) return 'Không có';
      return new Date(dateString).toLocaleDateString('vi-VN');
    },

    formatDateTime(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    formatTimeAgo(dateString) {
      if (!dateString) return '';
      const now = new Date();
      const date = new Date(dateString);
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Vừa xong';
      if (diffMins < 60) return `${diffMins} phút trước`;
      if (diffHours < 24) return `${diffHours} giờ trước`;
      if (diffDays < 7) return `${diffDays} ngày trước`;
      return date.toLocaleDateString('vi-VN');
    },

    parseAction(action) {
      const actionMap = {
        'created': 'đã tạo mới',
        'updated': 'đã cập nhật',
        'deleted': 'đã xóa',
        'completed': 'đã hoàn thành',
        'comment_added': 'đã bình luận',
        'status_changed': 'đã thay đổi trạng thái',
        'assigned': 'đã gán công việc'
      };
      return actionMap[action] || action;
    },

    getActionClass(action) {
      const classMap = {
        'created': 'success',
        'updated': 'info',
        'deleted': 'danger',
        'completed': 'success',
        'comment_added': 'primary',
        'status_changed': 'warning',
        'assigned': 'primary'
      };
      return classMap[action] || 'default';
    },

    getStatusClass(status) {
      const statusMap = {
        'Hoàn thành': 'completed',
        'completed': 'completed',
        'Đang làm': 'in-progress',
        'in_progress': 'in-progress',
        'Cần làm': 'pending',
        'pending': 'pending',
        'Chưa bắt đầu': 'pending'
      };
      return statusMap[status] || 'default';
    },

    getPriorityClass(priority) {
      const priorityMap = {
        'Cao': 'high',
        'high': 'high',
        'Trung bình': 'medium',
        'medium': 'medium',
        'Thấp': 'low',
        'low': 'low'
      };
      return priorityMap[priority] || 'default';
    }
  }
}
</script>

<style scoped>
/* ==================== GLOBAL ==================== */
.dashboard-modern {
  display: flex;
  min-height: 100vh;
  background: #f0f4f8;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
}

/* ==================== ANIMATED BACKGROUND ==================== */
.dashboard-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.bg-gradient-1 {
  position: absolute;
  top: -30%;
  right: -20%;
  width: 60%;
  height: 80%;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.08) 0%, transparent 70%);
  animation: pulse 15s ease-in-out infinite;
}

.bg-gradient-2 {
  position: absolute;
  bottom: -20%;
  left: -10%;
  width: 50%;
  height: 60%;
  background: radial-gradient(circle, rgba(118, 75, 162, 0.06) 0%, transparent 70%);
  animation: pulse 20s ease-in-out infinite reverse;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.floating-particles .particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  opacity: 0.3;
  animation: floatParticle 20s infinite linear;
}

.particle:nth-child(1) { left: 10%; top: 20%; animation-delay: 0s; }
.particle:nth-child(2) { left: 20%; top: 50%; animation-delay: 2s; }
.particle:nth-child(3) { left: 30%; top: 80%; animation-delay: 4s; }
.particle:nth-child(4) { left: 40%; top: 30%; animation-delay: 1s; }
.particle:nth-child(5) { left: 50%; top: 60%; animation-delay: 3s; }
.particle:nth-child(6) { left: 60%; top: 10%; animation-delay: 5s; }
.particle:nth-child(7) { left: 70%; top: 70%; animation-delay: 2.5s; }
.particle:nth-child(8) { left: 80%; top: 40%; animation-delay: 1.5s; }
.particle:nth-child(9) { left: 90%; top: 90%; animation-delay: 3.5s; }
.particle:nth-child(10) { left: 15%; top: 35%; animation-delay: 4.5s; }
.particle:nth-child(11) { left: 25%; top: 65%; animation-delay: 0.5s; }
.particle:nth-child(12) { left: 35%; top: 15%; animation-delay: 2.2s; }
.particle:nth-child(13) { left: 45%; top: 85%; animation-delay: 3.8s; }
.particle:nth-child(14) { left: 55%; top: 45%; animation-delay: 1.8s; }
.particle:nth-child(15) { left: 65%; top: 25%; animation-delay: 4.2s; }

@keyframes floatParticle {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: 0.3; }
  90% { opacity: 0.3; }
  100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
}

/* ==================== SIDEBAR ==================== */
.sidebar {
  width: 280px;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 100;
  box-shadow: 4px 0 30px rgba(0, 0, 0, 0.15);
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.logo {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: white;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  color: white;
  letter-spacing: -0.5px;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 16px;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 30px;
}

.nav-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0 12px;
  margin-bottom: 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
  position: relative;
  margin-bottom: 6px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
  transform: translateX(5px);
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
  color: white;
}

.nav-item.active .nav-indicator {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: linear-gradient(180deg, #667eea, #764ba2);
  border-radius: 4px 0 0 4px;
}

.nav-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.3s ease;
}

.nav-item.active .nav-icon,
.nav-item:hover .nav-icon {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.nav-badge {
  margin-left: auto;
  padding: 4px 10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: 20px;
}

.nav-badge.warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.user-profile:hover {
  background: rgba(255, 255, 255, 0.08);
}

.user-avatar {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 16px;
}

.user-info {
  flex: 1;
}

.user-name {
  display: block;
  font-weight: 600;
  color: white;
  font-size: 14px;
}

.user-role {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.user-profile i {
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
}

/* ==================== MAIN CONTENT ==================== */
.main-content {
  flex: 1;
  margin-left: 280px;
  padding: 30px;
  position: relative;
  z-index: 1;
}

/* ==================== HEADER ==================== */
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  animation: slideDown 0.5s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.greeting-text {
  font-size: 32px;
  font-weight: 800;
  color: #1a1a2e;
  margin: 0 0 8px;
}

.greeting-text .highlight {
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.greeting-subtitle {
  font-size: 16px;
  color: #64748b;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-date {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: white;
  border-radius: 12px;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.header-date i {
  color: #667eea;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  width: 48px;
  height: 48px;
  border: none;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.action-btn:hover {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  transform: translateY(-2px);
}

.action-btn .badge {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-add-task {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.btn-add-task:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
}

/* ==================== STATS SECTION ==================== */
.stats-section {
  margin-bottom: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  animation: slideUp 0.5s ease backwards;
}

.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.15s; }
.stat-card:nth-child(3) { animation-delay: 0.2s; }
.stat-card:nth-child(4) { animation-delay: 0.25s; }
.stat-card:nth-child(5) { animation-delay: 0.3s; }

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
}

.stat-total .stat-icon { background: linear-gradient(135deg, #667eea, #764ba2); }
.stat-completed .stat-icon { background: linear-gradient(135deg, #10b981, #059669); }
.stat-progress .stat-icon { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.stat-pending .stat-icon { background: linear-gradient(135deg, #f59e0b, #d97706); }
.stat-overdue .stat-icon { background: linear-gradient(135deg, #ef4444, #dc2626); }

.stat-content {
  flex: 1;
}

.stat-value {
  display: block;
  font-size: 32px;
  font-weight: 800;
  color: #1a1a2e;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  margin-top: 6px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
}

.stat-trend.up {
  background: #d1fae5;
  color: #059669;
}

.stat-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(180deg, transparent, rgba(102, 126, 234, 0.03));
}

.stat-progress .stat-icon i {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Progress Ring */
.progress-ring {
  width: 50px;
  height: 50px;
  position: relative;
}

.progress-ring svg {
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: #e2e8f0;
  stroke-width: 3;
}

.ring-fill {
  fill: none;
  stroke: #10b981;
  stroke-width: 3;
  stroke-linecap: round;
  transition: stroke-dasharray 1s ease;
}

.ring-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 11px;
  font-weight: 700;
  color: #10b981;
}

/* Mini Chart */
.stat-mini-chart {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 40px;
}

.mini-bar {
  width: 6px;
  background: linear-gradient(180deg, #3b82f6, #93c5fd);
  border-radius: 3px;
  animation: barGrow 1s ease backwards;
}

@keyframes barGrow {
  from { height: 0 !important; }
}

/* Dots */
.stat-dots {
  display: flex;
  gap: 6px;
}

.stat-dots .dot {
  width: 8px;
  height: 8px;
  background: #f59e0b;
  border-radius: 50%;
  animation: dotPulse 1.5s ease-in-out infinite;
}

.stat-dots .dot:nth-child(2) { animation-delay: 0.2s; }
.stat-dots .dot:nth-child(3) { animation-delay: 0.4s; }
.stat-dots .dot:nth-child(4) { animation-delay: 0.6s; }
.stat-dots .dot:nth-child(5) { animation-delay: 0.8s; }

@keyframes dotPulse {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1); }
}

/* Alert */
.stat-alert {
  width: 30px;
  height: 30px;
  background: #fee2e2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
  font-size: 12px;
  animation: alertPulse 1s ease-in-out infinite;
}

@keyframes alertPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* ==================== MAIN GRID ==================== */
.main-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}

.card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease backwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.card:hover {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.chart-card { grid-column: span 8; animation-delay: 0.2s; }
.tasks-card { grid-column: span 4; animation-delay: 0.25s; }
.reminders-card { grid-column: span 4; animation-delay: 0.3s; }
.activity-card { grid-column: span 4; animation-delay: 0.35s; }
.projects-card { grid-column: span 4; animation-delay: 0.4s; }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #f1f5f9;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.title-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.title-icon.purple { background: linear-gradient(135deg, #667eea, #764ba2); }
.title-icon.blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.title-icon.orange { background: linear-gradient(135deg, #f59e0b, #d97706); }
.title-icon.green { background: linear-gradient(135deg, #10b981, #059669); }
.title-icon.cyan { background: linear-gradient(135deg, #06b6d4, #0891b2); }

.card-title h3 {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
}

.card-title p {
  font-size: 13px;
  color: #94a3b8;
  margin: 4px 0 0;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.btn-filter {
  padding: 8px 16px;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-filter.active,
.btn-filter:hover {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-view-all {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-view-all:hover {
  gap: 12px;
}

.card-body {
  padding: 24px;
}

/* Chart */
.chart-card .card-body {
  height: 300px;
}

/* Tasks List */
.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: #fafafa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.task-item:hover {
  background: #f1f5f9;
  transform: translateX(5px);
}

.task-check input {
  width: 20px;
  height: 20px;
  accent-color: #10b981;
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-title {
  display: block;
  font-weight: 600;
  color: #1a1a2e;
  font-size: 14px;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-title:hover {
  color: #667eea;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
}

.task-date {
  font-size: 12px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 6px;
}

.task-priority {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
}

.task-priority.high { background: #fee2e2; color: #dc2626; }
.task-priority.medium { background: #fef3c7; color: #d97706; }
.task-priority.low { background: #d1fae5; color: #059669; }

.task-status {
  font-size: 11px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 8px;
  white-space: nowrap;
}

.task-status.completed { background: #d1fae5; color: #059669; }
.task-status.in-progress { background: #dbeafe; color: #2563eb; }
.task-status.pending { background: #f1f5f9; color: #64748b; }

/* Reminders */
.reminders-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reminder-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: #fafafa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.reminder-item:hover {
  background: #f1f5f9;
  transform: translateX(5px);
}

.reminder-item.overdue {
  background: #fef2f2;
}

.reminder-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.reminder-icon.warning { background: linear-gradient(135deg, #f59e0b, #d97706); }
.reminder-icon.danger { background: linear-gradient(135deg, #ef4444, #dc2626); }

.reminder-content {
  flex: 1;
  min-width: 0;
}

.reminder-title {
  display: block;
  font-weight: 600;
  color: #1a1a2e;
  font-size: 14px;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.reminder-title:hover {
  color: #667eea;
}

.reminder-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
}

.reminder-status {
  font-size: 11px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 8px;
  background: #fef3c7;
  color: #d97706;
  white-space: nowrap;
}

.reminder-status.overdue {
  background: #fee2e2;
  color: #dc2626;
}

/* Activity Timeline */
.activity-timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
}

.activity-timeline::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 20px;
  bottom: 20px;
  width: 2px;
  background: #e2e8f0;
}

.activity-item {
  display: flex;
  gap: 16px;
  padding-left: 0;
  position: relative;
}

.activity-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  flex-shrink: 0;
  z-index: 1;
  border: 3px solid white;
}

.activity-dot.success { background: #10b981; }
.activity-dot.info { background: #3b82f6; }
.activity-dot.warning { background: #f59e0b; }
.activity-dot.danger { background: #ef4444; }
.activity-dot.primary { background: #667eea; }
.activity-dot.default { background: #94a3b8; }

.activity-content {
  flex: 1;
  padding-bottom: 16px;
}

.activity-text {
  font-size: 14px;
  color: #374151;
  margin: 0;
  line-height: 1.5;
}

.activity-text strong {
  color: #1a1a2e;
}

.activity-target {
  color: #667eea;
}

.activity-time {
  font-size: 12px;
  color: #94a3b8;
  display: block;
  margin-top: 4px;
}

/* Projects */
.projects-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.project-item {
  padding: 20px;
  background: #fafafa;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.project-item:hover {
  background: white;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transform: translateY(-3px);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.project-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
}

.project-icon.purple { background: linear-gradient(135deg, #667eea, #764ba2); }
.project-icon.blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.project-icon.orange { background: linear-gradient(135deg, #f59e0b, #d97706); }

.project-status {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
}

.project-status.active { background: #d1fae5; color: #059669; }
.project-status.review { background: #fef3c7; color: #d97706; }

.project-name {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 12px;
}

.project-progress {
  margin-bottom: 12px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
}

.progress-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 1s ease;
}

.progress-fill.purple { background: linear-gradient(90deg, #667eea, #764ba2); }
.progress-fill.blue { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
.progress-fill.orange { background: linear-gradient(90deg, #f59e0b, #fbbf24); }

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-tasks {
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
}

.team-avatars {
  display: flex;
}

.team-avatars .avatar {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -8px;
  border: 2px solid white;
}

.team-avatars .avatar:first-child {
  margin-left: 0;
}

.team-avatars .avatar.more {
  background: #e2e8f0;
  color: #64748b;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 1400px) {
  .chart-card { grid-column: span 12; }
  .tasks-card { grid-column: span 6; }
  .reminders-card { grid-column: span 6; }
  .activity-card { grid-column: span 6; }
  .projects-card { grid-column: span 6; }
}

@media (max-width: 1024px) {
  .sidebar {
    width: 80px;
  }
  
  .sidebar .logo-text,
  .sidebar .nav-label,
  .sidebar .nav-item span,
  .sidebar .nav-badge,
  .sidebar .user-info,
  .sidebar .user-profile i {
    display: none;
  }
  
  .sidebar .nav-item {
    justify-content: center;
    padding: 14px;
  }
  
  .sidebar .user-profile {
    justify-content: center;
  }
  
  .main-content {
    margin-left: 80px;
  }
  
  .tasks-card,
  .reminders-card,
  .activity-card,
  .projects-card {
    grid-column: span 12;
  }
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
  
  .main-content {
    margin-left: 0;
    padding: 20px;
  }
  
  .main-header {
    flex-direction: column;
    gap: 20px;
  }
  
  .header-right {
    width: 100%;
    flex-wrap: wrap;
  }
  
  .greeting-text {
    font-size: 24px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-card {
    padding: 16px;
  }
  
  .stat-value {
    font-size: 24px;
  }
}
</style>
