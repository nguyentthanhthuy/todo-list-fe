<template>
  <div class="notifications-page">
    <div class="page-header d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1>Thông báo</h1>
        <p class="text-muted mb-0">Quản lý tất cả thông báo của bạn</p>
      </div>
      <div class="btn-group">
        <button class="btn btn-outline-primary" @click="markAllRead" :disabled="unreadCount === 0">
          <i class="bi bi-check-all me-1"></i>Đánh dấu tất cả đã đọc
        </button>
        <button class="btn btn-outline-danger" @click="clearRead" :disabled="readCount === 0">
          <i class="bi bi-trash me-1"></i>Xóa đã đọc
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-center">
          <div class="col-auto">
            <label class="col-form-label">Lọc:</label>
          </div>
          <div class="col-auto">
            <div class="btn-group" role="group">
              <button type="button" class="btn" 
                      :class="filter === 'all' ? 'btn-primary' : 'btn-outline-primary'"
                      @click="filter = 'all'">
                Tất cả <span class="badge bg-secondary ms-1">{{ pagination.total }}</span>
              </button>
              <button type="button" class="btn"
                      :class="filter === 'unread' ? 'btn-primary' : 'btn-outline-primary'"
                      @click="filter = 'unread'">
                Chưa đọc <span class="badge bg-danger ms-1">{{ unreadCount }}</span>
              </button>
              <button type="button" class="btn"
                      :class="filter === 'read' ? 'btn-primary' : 'btn-outline-primary'"
                      @click="filter = 'read'">
                Đã đọc <span class="badge bg-success ms-1">{{ readCount }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notifications List -->
    <div class="card">
      <div class="card-body p-0">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else-if="!filteredNotifications.length" class="text-center py-5">
          <i class="bi bi-bell-slash fs-1 text-muted d-block mb-3"></i>
          <p class="text-muted">Không có thông báo nào</p>
        </div>

        <div v-else class="notification-list">
          <div v-for="notif in filteredNotifications" :key="notif.id"
               class="notification-item" :class="{ unread: !notif.is_read }"
               @click="handleClick(notif)">
            <div class="notification-icon" :class="`bg-${notif.color || 'primary'}`">
              <i :class="getIcon(notif.icon)"></i>
            </div>
            <div class="notification-content flex-grow-1">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="mb-1">{{ notif.title }}</h6>
                  <p class="mb-1 text-muted">{{ notif.message }}</p>
                  <small class="text-muted">
                    <i class="bi bi-clock me-1"></i>{{ formatTime(notif.created_at) }}
                  </small>
                </div>
                <div class="notification-actions">
                  <button v-if="!notif.is_read" class="btn btn-sm btn-outline-primary me-1"
                          @click.stop="markAsRead(notif)" title="Đánh dấu đã đọc">
                    <i class="bi bi-check"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click.stop="deleteNotif(notif)"
                          title="Xóa">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <nav v-if="pagination.last_page > 1" class="p-3 border-top">
          <ul class="pagination justify-content-center mb-0">
            <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
              <a class="page-link" href="#" @click.prevent="goToPage(pagination.current_page - 1)">
                <i class="bi bi-chevron-left"></i>
              </a>
            </li>
            <li class="page-item" v-for="page in visiblePages" :key="page"
                :class="{ active: page === pagination.current_page }">
              <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
              <a class="page-link" href="#" @click.prevent="goToPage(pagination.current_page + 1)">
                <i class="bi bi-chevron-right"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import notificationService from '@/services/notificationService'

export default {
  name: 'NotificationsPage',
  data() {
    return {
      notifications: [],
      loading: false,
      filter: 'all',
      unreadCount: 0,
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 20,
        total: 0
      }
    }
  },
  computed: {
    filteredNotifications() {
      if (this.filter === 'unread') {
        return this.notifications.filter(n => !n.is_read)
      }
      if (this.filter === 'read') {
        return this.notifications.filter(n => n.is_read)
      }
      return this.notifications
    },
    readCount() {
      return this.notifications.filter(n => n.is_read).length
    },
    visiblePages() {
      const pages = []
      const current = this.pagination.current_page
      const last = this.pagination.last_page
      
      let start = Math.max(1, current - 2)
      let end = Math.min(last, current + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }
  },
  watch: {
    filter() {
      // Reset to first page when filter changes
      this.pagination.current_page = 1
    }
  },
  mounted() {
    this.loadNotifications()
  },
  methods: {
    async loadNotifications() {
      try {
        this.loading = true
        const response = await notificationService.getNotifications({
          page: this.pagination.current_page,
          per_page: this.pagination.per_page
        })
        
        if (response.data.success) {
          this.notifications = response.data.data
          this.pagination = response.data.pagination
          this.unreadCount = response.data.unread_count
        }
      } catch (error) {
        console.error('Error loading notifications:', error)
        this.$toast?.error?.('Không thể tải thông báo')
      } finally {
        this.loading = false
      }
    },
    async markAsRead(notif) {
      try {
        await notificationService.markAsRead(notif.id)
        notif.is_read = true
        this.unreadCount = Math.max(0, this.unreadCount - 1)
      } catch (error) {
        console.error('Error marking as read:', error)
      }
    },
    async markAllRead() {
      try {
        await notificationService.markAllAsRead()
        this.notifications.forEach(n => n.is_read = true)
        this.unreadCount = 0
        this.$toast?.success?.('Đã đánh dấu tất cả đã đọc')
      } catch (error) {
        console.error('Error:', error)
        this.$toast?.error?.('Có lỗi xảy ra')
      }
    },
    async deleteNotif(notif) {
      if (!confirm('Bạn có chắc muốn xóa thông báo này?')) return
      
      try {
        await notificationService.delete(notif.id)
        const index = this.notifications.indexOf(notif)
        if (index > -1) {
          this.notifications.splice(index, 1)
          if (!notif.is_read) {
            this.unreadCount = Math.max(0, this.unreadCount - 1)
          }
        }
        this.$toast?.success?.('Đã xóa thông báo')
      } catch (error) {
        console.error('Error:', error)
        this.$toast?.error?.('Có lỗi xảy ra')
      }
    },
    async clearRead() {
      if (!confirm('Bạn có chắc muốn xóa tất cả thông báo đã đọc?')) return
      
      try {
        await notificationService.clearRead()
        this.notifications = this.notifications.filter(n => !n.is_read)
        this.$toast?.success?.('Đã xóa thông báo đã đọc')
      } catch (error) {
        console.error('Error:', error)
        this.$toast?.error?.('Có lỗi xảy ra')
      }
    },
    handleClick(notif) {
      if (!notif.is_read) {
        this.markAsRead(notif)
      }
      
      if (notif.data?.task_id) {
        this.$router.push(`/tasks/detail/${notif.data.task_id}`)
      }
    },
    goToPage(page) {
      if (page < 1 || page > this.pagination.last_page) return
      this.pagination.current_page = page
      this.loadNotifications()
    },
    getIcon(icon) {
      const icons = {
        assignment: 'bi bi-clipboard-check',
        comment: 'bi bi-chat-dots',
        alarm: 'bi bi-alarm',
        info: 'bi bi-info-circle',
        bell: 'bi bi-bell'
      }
      return icons[icon] || 'bi bi-bell'
    },
    formatTime(datetime) {
      if (!datetime) return ''
      const date = new Date(datetime)
      const now = new Date()
      const diff = now - date
      
      if (diff < 60000) return 'Vừa xong'
      if (diff < 3600000) return `${Math.floor(diff/60000)} phút trước`
      if (diff < 86400000) return `${Math.floor(diff/3600000)} giờ trước`
      
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.notifications-page {
  padding: 20px;
}

.notification-list {
  max-height: 600px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: #f8f9fa;
}

.notification-item.unread {
  background-color: #e7f3ff;
}

.notification-item.unread:hover {
  background-color: #d0e8ff;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 16px;
  flex-shrink: 0;
  font-size: 20px;
}

.notification-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.notification-item:hover .notification-actions {
  opacity: 1;
}

.notification-content h6 {
  font-size: 15px;
}

.notification-content p {
  font-size: 14px;
}
</style>
