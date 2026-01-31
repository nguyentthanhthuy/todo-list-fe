<template>
  <div class="discord-page">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <div class="header-icon">
            <i class="fa-brands fa-discord"></i>
          </div>
          <div class="header-text">
            <h1 class="page-title">Tích hợp Discord</h1>
            <p class="page-subtitle">Nhận thông báo công việc trực tiếp trên Discord</p>
          </div>
        </div>
        <div class="connection-status" :class="{ connected: settings.is_active }">
          <i :class="settings.is_active ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"></i>
          <span>{{ settings.is_active ? 'Đã kết nối' : 'Chưa kết nối' }}</span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="content-container">
      <!-- Setup Card -->
      <div class="setup-card">
        <div class="card-header">
          <div class="card-icon">
            <i class="fa-solid fa-link"></i>
          </div>
          <div class="card-title">
            <h3>Cấu hình Webhook</h3>
            <p>Kết nối WorkBuddy với Discord server của bạn</p>
          </div>
        </div>

        <div class="card-body">
          <!-- Guide Section -->
          <div class="guide-section" v-if="!settings.webhook_url">
            <h4><i class="fa-solid fa-book"></i> Hướng dẫn tạo Webhook</h4>
            <ol class="guide-steps">
              <li>Mở Discord và vào server bạn muốn nhận thông báo</li>
              <li>Click chuột phải vào channel → <strong>Edit Channel</strong></li>
              <li>Chọn <strong>Integrations</strong> → <strong>Webhooks</strong></li>
              <li>Click <strong>New Webhook</strong> hoặc <strong>Create Webhook</strong></li>
              <li>Đặt tên (ví dụ: WorkBuddy) và copy <strong>Webhook URL</strong></li>
              <li>Dán URL vào ô bên dưới</li>
            </ol>
          </div>

          <!-- Webhook URL Input -->
          <div class="form-group">
            <label>
              <i class="fa-solid fa-link"></i> Webhook URL
            </label>
            <div class="input-with-button">
              <input 
                type="text" 
                v-model="webhookUrl" 
                placeholder="https://discord.com/api/webhooks/..."
                :disabled="loading"
              >
              <button class="btn-test" @click="testWebhook" :disabled="!webhookUrl || loading">
                <i class="fa-solid fa-plug"></i>
                {{ testing ? 'Đang test...' : 'Test kết nối' }}
              </button>
            </div>
            <span class="input-hint">Chỉ hỗ trợ Discord webhook URL</span>
          </div>

          <!-- Server & Channel Info (Optional) -->
          <div class="form-row">
            <div class="form-group">
              <label><i class="fa-solid fa-server"></i> Tên Server (tùy chọn)</label>
              <input type="text" v-model="settings.server_name" placeholder="My Discord Server">
            </div>
            <div class="form-group">
              <label><i class="fa-solid fa-hashtag"></i> Tên Channel (tùy chọn)</label>
              <input type="text" v-model="settings.channel_name" placeholder="notifications">
            </div>
          </div>

          <!-- Connection Actions -->
          <div class="action-buttons" v-if="settings.webhook_url">
            <button class="btn-disconnect" @click="disconnect" :disabled="loading">
              <i class="fa-solid fa-unlink"></i> Ngắt kết nối
            </button>
            <button class="btn-test-notification" @click="sendTestNotification" :disabled="!settings.is_active || loading">
              <i class="fa-solid fa-paper-plane"></i> Gửi thông báo test
            </button>
          </div>
        </div>
      </div>

      <!-- Notification Settings Card -->
      <div class="settings-card" :class="{ disabled: !settings.webhook_url }">
        <div class="card-header">
          <div class="card-icon">
            <i class="fa-solid fa-bell"></i>
          </div>
          <div class="card-title">
            <h3>Cài đặt thông báo</h3>
            <p>Chọn loại thông báo bạn muốn nhận trên Discord</p>
          </div>
          <div class="master-toggle">
            <label class="toggle-switch">
              <input type="checkbox" v-model="settings.is_active" :disabled="!settings.webhook_url">
              <span class="slider"></span>
            </label>
            <span>{{ settings.is_active ? 'Bật' : 'Tắt' }}</span>
          </div>
        </div>

        <div class="card-body">
          <div class="notification-grid">
            <!-- Task Created -->
            <div class="notification-item">
              <div class="notification-icon created">
                <i class="fa-solid fa-plus"></i>
              </div>
              <div class="notification-info">
                <h4>Tạo công việc mới</h4>
                <p>Thông báo khi tạo công việc mới</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="settings.notify_task_created" :disabled="!settings.is_active">
                <span class="slider"></span>
              </label>
            </div>

            <!-- Task Updated -->
            <div class="notification-item">
              <div class="notification-icon updated">
                <i class="fa-solid fa-pen"></i>
              </div>
              <div class="notification-info">
                <h4>Cập nhật công việc</h4>
                <p>Thông báo khi cập nhật công việc</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="settings.notify_task_updated" :disabled="!settings.is_active">
                <span class="slider"></span>
              </label>
            </div>

            <!-- Task Completed -->
            <div class="notification-item">
              <div class="notification-icon completed">
                <i class="fa-solid fa-check"></i>
              </div>
              <div class="notification-info">
                <h4>Hoàn thành công việc</h4>
                <p>Thông báo khi hoàn thành công việc</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="settings.notify_task_completed" :disabled="!settings.is_active">
                <span class="slider"></span>
              </label>
            </div>

            <!-- Task Assigned -->
            <div class="notification-item">
              <div class="notification-icon assigned">
                <i class="fa-solid fa-user-plus"></i>
              </div>
              <div class="notification-info">
                <h4>Được gán công việc</h4>
                <p>Thông báo khi được gán công việc mới</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="settings.notify_task_assigned" :disabled="!settings.is_active">
                <span class="slider"></span>
              </label>
            </div>

            <!-- Reminder -->
            <div class="notification-item">
              <div class="notification-icon reminder">
                <i class="fa-solid fa-bell"></i>
              </div>
              <div class="notification-info">
                <h4>Nhắc nhở</h4>
                <p>Nhận nhắc nhở công việc</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="settings.notify_reminder" :disabled="!settings.is_active">
                <span class="slider"></span>
              </label>
            </div>

            <!-- Deadline -->
            <div class="notification-item">
              <div class="notification-icon deadline">
                <i class="fa-solid fa-clock"></i>
              </div>
              <div class="notification-info">
                <h4>Cảnh báo deadline</h4>
                <p>Cảnh báo khi deadline sắp đến</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="settings.notify_deadline" :disabled="!settings.is_active">
                <span class="slider"></span>
              </label>
            </div>

            <!-- Comment -->
            <div class="notification-item">
              <div class="notification-icon comment">
                <i class="fa-solid fa-comment"></i>
              </div>
              <div class="notification-info">
                <h4>Bình luận mới</h4>
                <p>Thông báo khi có bình luận mới</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="settings.notify_comment" :disabled="!settings.is_active">
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="save-section">
        <button class="btn-save" @click="saveSettings" :disabled="loading">
          <i class="fa-solid fa-save"></i>
          {{ loading ? 'Đang lưu...' : 'Lưu cài đặt' }}
        </button>
      </div>

      <!-- Preview Card -->
      <div class="preview-card">
        <div class="card-header">
          <div class="card-icon">
            <i class="fa-solid fa-eye"></i>
          </div>
          <div class="card-title">
            <h3>Xem trước thông báo</h3>
            <p>Đây là cách thông báo hiển thị trên Discord</p>
          </div>
        </div>
        <div class="card-body">
          <div class="discord-preview">
            <div class="discord-message">
              <div class="message-avatar">
                <img src="https://cdn-icons-png.flaticon.com/512/906/906343.png" alt="WorkBuddy">
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="bot-name">WorkBuddy</span>
                  <span class="bot-tag">BOT</span>
                  <span class="message-time">Hôm nay lúc {{ currentTime }}</span>
                </div>
                <div class="message-embed">
                  <div class="embed-color"></div>
                  <div class="embed-content">
                    <div class="embed-title">📝 Công việc mới được tạo</div>
                    <div class="embed-description">Hoàn thành báo cáo tuần</div>
                    <div class="embed-fields">
                      <div class="embed-field">
                        <div class="field-name">📁 Dự án</div>
                        <div class="field-value">WorkBuddy</div>
                      </div>
                      <div class="embed-field">
                        <div class="field-name">🎯 Độ ưu tiên</div>
                        <div class="field-value">🟠 Cao</div>
                      </div>
                      <div class="embed-field">
                        <div class="field-name">📅 Hạn chót</div>
                        <div class="field-value">{{ previewDate }}</div>
                      </div>
                    </div>
                    <div class="embed-footer">
                      WorkBuddy • {{ currentDate }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div class="toast" :class="{ show: toast.show, success: toast.type === 'success', error: toast.type === 'error' }">
      <i :class="toast.type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'"></i>
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>

<script>
import discordService from '@/services/discordService';

export default {
  name: 'DiscordIntegration',

  data() {
    return {
      loading: false,
      testing: false,
      webhookUrl: '',
      settings: {
        webhook_url: '',
        server_name: '',
        channel_name: '',
        is_active: false,
        notify_task_created: true,
        notify_task_updated: true,
        notify_task_completed: true,
        notify_task_assigned: true,
        notify_reminder: true,
        notify_deadline: true,
        notify_comment: false,
      },
      toast: {
        show: false,
        message: '',
        type: 'success',
      },
    };
  },

  computed: {
    currentTime() {
      return new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    },
    currentDate() {
      return new Date().toLocaleDateString('vi-VN') + ' ' + this.currentTime;
    },
    previewDate() {
      const date = new Date();
      date.setDate(date.getDate() + 3);
      return date.toLocaleDateString('vi-VN');
    },
  },

  async mounted() {
    await this.loadSettings();
  },

  methods: {
    async loadSettings() {
      try {
        this.loading = true;
        const res = await discordService.getSettings();
        this.settings = res.data.data;
        this.webhookUrl = this.settings.webhook_url || '';
      } catch (err) {
        console.error('Error loading Discord settings:', err);
      } finally {
        this.loading = false;
      }
    },

    async testWebhook() {
      if (!this.webhookUrl) return;

      try {
        this.testing = true;
        await discordService.testWebhook(this.webhookUrl);
        this.showToast('Kết nối thành công! Kiểm tra Discord channel của bạn.', 'success');
        this.settings.webhook_url = this.webhookUrl;
      } catch (err) {
        this.showToast(err.response?.data?.message || 'Không thể kết nối webhook', 'error');
      } finally {
        this.testing = false;
      }
    },

    async saveSettings() {
      try {
        this.loading = true;
        await discordService.updateSettings({
          ...this.settings,
          webhook_url: this.webhookUrl,
        });
        this.showToast('Đã lưu cài đặt Discord!', 'success');
        await this.loadSettings();
      } catch (err) {
        this.showToast(err.response?.data?.message || 'Lỗi khi lưu cài đặt', 'error');
      } finally {
        this.loading = false;
      }
    },

    async disconnect() {
      if (!confirm('Bạn có chắc muốn ngắt kết nối Discord?')) return;

      try {
        this.loading = true;
        await discordService.disconnect();
        this.webhookUrl = '';
        this.settings.webhook_url = '';
        this.settings.is_active = false;
        this.showToast('Đã ngắt kết nối Discord!', 'success');
      } catch (err) {
        this.showToast('Lỗi khi ngắt kết nối', 'error');
      } finally {
        this.loading = false;
      }
    },

    async sendTestNotification() {
      try {
        this.loading = true;
        await discordService.sendTestNotification();
        this.showToast('Đã gửi thông báo test! Kiểm tra Discord của bạn.', 'success');
      } catch (err) {
        this.showToast(err.response?.data?.message || 'Gửi thông báo thất bại', 'error');
      } finally {
        this.loading = false;
      }
    },

    showToast(message, type = 'success') {
      this.toast = { show: true, message, type };
      setTimeout(() => {
        this.toast.show = false;
      }, 3000);
    },
  },
};
</script>

<style scoped>
.discord-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  font-family: 'Be Vietnam Pro', 'Inter', sans-serif;
}

/* Header */
.page-header {
  background: linear-gradient(135deg, #5865F2 0%, #7289DA 100%);
  padding: 2rem;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.header-icon {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
}

.page-subtitle {
  font-size: 0.95rem;
  opacity: 0.9;
  margin: 0;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 30px;
  font-weight: 500;
}

.connection-status.connected {
  background: rgba(87, 242, 135, 0.2);
}

.connection-status i {
  font-size: 1.1rem;
}

/* Content */
.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Cards */
.setup-card,
.settings-card,
.preview-card {
  background: white;
  border-radius: 20px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.settings-card.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.card-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #5865F2 0%, #7289DA 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.card-title {
  flex: 1;
}

.card-title h3 {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
}

.card-title p {
  margin: 0;
  font-size: 0.85rem;
  color: #64748b;
}

.card-body {
  padding: 1.5rem;
}

/* Guide Section */
.guide-section {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.guide-section h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #0369a1;
  margin: 0 0 1rem;
}

.guide-steps {
  margin: 0;
  padding-left: 1.25rem;
  color: #0c4a6e;
  font-size: 0.9rem;
  line-height: 1.8;
}

.guide-steps li {
  margin-bottom: 0.25rem;
}

/* Form */
.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #5865F2;
  box-shadow: 0 0 0 4px rgba(88, 101, 242, 0.1);
}

.input-with-button {
  display: flex;
  gap: 0.75rem;
}

.input-with-button input {
  flex: 1;
}

.btn-test {
  padding: 0 1.5rem;
  background: linear-gradient(135deg, #5865F2 0%, #7289DA 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  transition: all 0.3s;
}

.btn-test:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(88, 101, 242, 0.4);
}

.btn-test:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-hint {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: 0.5rem;
  display: block;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn-disconnect {
  padding: 0.75rem 1.5rem;
  background: #fef2f2;
  color: #ef4444;
  border: 2px solid #fecaca;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.btn-disconnect:hover {
  background: #fee2e2;
}

.btn-test-notification {
  padding: 0.75rem 1.5rem;
  background: #f0fdf4;
  color: #22c55e;
  border: 2px solid #bbf7d0;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.btn-test-notification:hover:not(:disabled) {
  background: #dcfce7;
}

.btn-test-notification:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Master Toggle */
.master-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  color: #374151;
}

/* Notification Grid */
.notification-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.notification-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.3s;
}

.notification-item:hover {
  background: #f1f5f9;
}

.notification-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  flex-shrink: 0;
}

.notification-icon.created { background: #3b82f6; }
.notification-icon.updated { background: #eab308; }
.notification-icon.completed { background: #22c55e; }
.notification-icon.assigned { background: #8b5cf6; }
.notification-icon.reminder { background: #f97316; }
.notification-icon.deadline { background: #ef4444; }
.notification-icon.comment { background: #06b6d4; }

.notification-info {
  flex: 1;
}

.notification-info h4 {
  margin: 0 0 0.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
}

.notification-info p {
  margin: 0;
  font-size: 0.8rem;
  color: #64748b;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: 0.4s;
  border-radius: 26px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background: linear-gradient(135deg, #5865F2 0%, #7289DA 100%);
}

input:checked + .slider:before {
  transform: translateX(22px);
}

input:disabled + .slider {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Save Section */
.save-section {
  text-align: center;
  margin-bottom: 1.5rem;
}

.btn-save {
  padding: 1rem 3rem;
  background: linear-gradient(135deg, #5865F2 0%, #7289DA 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(88, 101, 242, 0.3);
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(88, 101, 242, 0.4);
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Discord Preview */
.discord-preview {
  background: #36393f;
  border-radius: 12px;
  padding: 1rem;
}

.discord-message {
  display: flex;
  gap: 1rem;
}

.message-avatar {
  flex-shrink: 0;
}

.message-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.message-content {
  flex: 1;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.bot-name {
  color: #5865F2;
  font-weight: 600;
  font-size: 0.95rem;
}

.bot-tag {
  background: #5865F2;
  color: white;
  font-size: 0.65rem;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  font-weight: 600;
}

.message-time {
  color: #72767d;
  font-size: 0.75rem;
}

.message-embed {
  display: flex;
  max-width: 520px;
  background: #2f3136;
  border-radius: 4px;
  overflow: hidden;
}

.embed-color {
  width: 4px;
  background: #3b82f6;
}

.embed-content {
  padding: 1rem;
  flex: 1;
}

.embed-title {
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.embed-description {
  color: #dcddde;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.embed-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.embed-field {
  flex: 1;
  min-width: 100px;
}

.field-name {
  color: #72767d;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.field-value {
  color: #dcddde;
  font-size: 0.85rem;
}

.embed-footer {
  color: #72767d;
  font-size: 0.75rem;
  margin-top: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid #40444b;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  background: #1e293b;
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  transform: translateY(100px);
  opacity: 0;
  transition: all 0.3s;
  z-index: 1000;
}

.toast.show {
  transform: translateY(0);
  opacity: 1;
}

.toast.success i { color: #22c55e; }
.toast.error i { color: #ef4444; }

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header-left {
    flex-direction: column;
  }

  .input-with-button {
    flex-direction: column;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .notification-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .toast {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
  }
}
</style>
