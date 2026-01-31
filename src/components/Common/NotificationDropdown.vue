<template>
  <div class="notification-dropdown">
    <!-- Bell Icon with Badge -->
    <div class="notification-trigger" @click="toggleDropdown" ref="trigger">
      <i class="bi bi-bell fs-5"></i>
      <span v-if="unreadCount > 0" class="badge bg-danger notification-badge">
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </div>

    <!-- Dropdown -->
    <div class="notification-menu" :class="{ show: isOpen }" ref="menu">
      <div class="notification-header">
        <h6 class="mb-0">Thông báo</h6>
        <div>
          <button v-if="unreadCount > 0" class="btn btn-sm btn-link p-0 text-primary"
                  @click="markAllRead">
            Đánh dấu đã đọc
          </button>
        </div>
      </div>

      <div class="notification-body">
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border spinner-border-sm text-primary"></div>
        </div>

        <div v-else-if="!notifications.length" class="text-center py-4 text-muted">
          <i class="bi bi-bell-slash fs-1 d-block mb-2"></i>
          Không có thông báo mới
        </div>

        <div v-else class="notification-list">
          <div v-for="notif in notifications" :key="notif.id"
               class="notification-item" :class="{ unread: !notif.is_read }"
               @click="handleClick(notif)">
            <div class="notification-icon" :class="`bg-${notif.color || 'primary'}`">
              <i :class="getIcon(notif.icon)"></i>
            </div>
            <div class="notification-content">
              <div class="notification-title">{{ notif.title }}</div>
              <div class="notification-message">{{ notif.message }}</div>
              <div class="notification-time">{{ formatTime(notif.created_at) }}</div>
            </div>
            <button class="btn-close-notification" @click.stop="deleteNotification(notif.id)">
              <i class="bi bi-x"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="notification-footer">
        <router-link to="/notifications" class="btn btn-sm btn-outline-primary w-100"
                     @click="isOpen = false">
          Xem tất cả thông báo
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import notificationService from '@/services/notificationService'

export default {
  name: 'NotificationDropdown',
  data() {
    return {
      isOpen: false,
      loading: false,
      notifications: [],
      unreadCount: 0,
      pollInterval: null
    }
  },
  mounted() {
    this.loadNotifications()
    this.startPolling()
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    this.stopPolling()
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.loadNotifications()
      }
    },
    handleClickOutside(event) {
      if (this.$refs.trigger && !this.$refs.trigger.contains(event.target) &&
          this.$refs.menu && !this.$refs.menu.contains(event.target)) {
        this.isOpen = false
      }
    },
    async loadNotifications() {
      try {
        this.loading = true
        const response = await notificationService.getUnread()
        if (response.data.success) {
          this.notifications = response.data.data
          this.unreadCount = response.data.unread_count
        }
      } catch (error) {
        console.error('Error loading notifications:', error)
      } finally {
        this.loading = false
      }
    },
    async loadUnreadCount() {
      try {
        const response = await notificationService.getUnreadCount()
        if (response.data.success) {
          this.unreadCount = response.data.unread_count
        }
      } catch (error) {
        console.error('Error loading unread count:', error)
      }
    },
    startPolling() {
      // Poll every 30 seconds
      this.pollInterval = setInterval(() => {
        this.loadUnreadCount()
      }, 30000)
    },
    stopPolling() {
      if (this.pollInterval) {
        clearInterval(this.pollInterval)
      }
    },
    async markAllRead() {
      try {
        await notificationService.markAllAsRead()
        this.notifications.forEach(n => n.is_read = true)
        this.unreadCount = 0
      } catch (error) {
        console.error('Error marking all as read:', error)
      }
    },
    async handleClick(notification) {
      // Mark as read
      if (!notification.is_read) {
        try {
          await notificationService.markAsRead(notification.id)
          notification.is_read = true
          this.unreadCount = Math.max(0, this.unreadCount - 1)
        } catch (error) {
          console.error('Error marking as read:', error)
        }
      }

      // Navigate if has link
      if (notification.data?.task_id) {
        this.$router.push(`/tasks/detail/${notification.data.task_id}`)
        this.isOpen = false
      }
    },
    async deleteNotification(id) {
      try {
        await notificationService.delete(id)
        const index = this.notifications.findIndex(n => n.id === id)
        if (index > -1) {
          if (!this.notifications[index].is_read) {
            this.unreadCount = Math.max(0, this.unreadCount - 1)
          }
          this.notifications.splice(index, 1)
        }
      } catch (error) {
        console.error('Error deleting notification:', error)
      }
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
      if (diff < 604800000) return `${Math.floor(diff/86400000)} ngày trước`
      return date.toLocaleDateString('vi-VN')
    }
  }
}
</script>

<style scoped>
.notification-dropdown {
  position: relative;
}

.notification-trigger {
  cursor: pointer;
  position: relative;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.notification-trigger:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.notification-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 10px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 9px;
}

.notification-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 360px;
  max-height: 480px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: none;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
}

.notification-menu.show {
  display: flex;
}

.notification-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-body {
  flex: 1;
  overflow-y: auto;
  max-height: 340px;
}

.notification-list {
  padding: 8px 0;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
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

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 12px;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 2px;
}

.notification-message {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notification-time {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}

.btn-close-notification {
  background: none;
  border: none;
  color: #999;
  padding: 4px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.notification-item:hover .btn-close-notification {
  opacity: 1;
}

.btn-close-notification:hover {
  color: #dc3545;
}

.notification-footer {
  padding: 12px 16px;
  border-top: 1px solid #eee;
}

/* Scrollbar */
.notification-body::-webkit-scrollbar {
  width: 6px;
}

.notification-body::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 3px;
}
</style>
