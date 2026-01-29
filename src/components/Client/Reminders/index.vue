<template>
    <div class="reminders-page-wrapper">
        <div class="reminders-page container-fluid py-4">
            <div class="row justify-content-center">
                <div class="col-12 col-xl-10">
                    <!-- HEADER -->
                    <div class="page-header mb-4">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h4 class="title mb-1">
                                    <i class="fa-solid fa-bell me-2"></i>
                                    Nhắc nhở
                                </h4>
                                <p class="subtitle text-muted mb-0">Quản lý các nhắc nhở công việc của bạn</p>
                            </div>
                            <div class="d-flex gap-2">
                                <button class="btn btn-outline-secondary" :class="{ active: filter === 'upcoming' }"
                                    @click="filter = 'upcoming'">
                                    <i class="fa-solid fa-clock me-1"></i> Sắp tới
                                </button>
                                <button class="btn btn-outline-secondary" :class="{ active: filter === 'sent' }"
                                    @click="filter = 'sent'">
                                    <i class="fa-solid fa-check me-1"></i> Đã gửi
                                </button>
                                <button class="btn btn-outline-secondary" :class="{ active: filter === 'all' }"
                                    @click="filter = 'all'">
                                    <i class="fa-solid fa-list me-1"></i> Tất cả
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Stats Cards -->
                    <div class="row g-3 mb-4">
                        <div class="col-md-4">
                            <div class="stat-card upcoming">
                                <div class="stat-icon">
                                    <i class="fa-solid fa-clock"></i>
                                </div>
                                <div class="stat-info">
                                    <h3>{{ stats.upcoming }}</h3>
                                    <p>Sắp tới</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="stat-card today">
                                <div class="stat-icon">
                                    <i class="fa-solid fa-calendar-day"></i>
                                </div>
                                <div class="stat-info">
                                    <h3>{{ stats.today }}</h3>
                                    <p>Hôm nay</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="stat-card sent">
                                <div class="stat-icon">
                                    <i class="fa-solid fa-check-circle"></i>
                                </div>
                                <div class="stat-info">
                                    <h3>{{ stats.sent }}</h3>
                                    <p>Đã gửi</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Reminders List -->
                    <div class="card">
                        <div class="card-body p-0">
                            <div v-if="loading" class="text-center py-5">
                                <i class="fa-solid fa-spinner fa-spin fa-2x"></i>
                            </div>

                            <div v-else-if="filteredReminders.length === 0" class="empty-state text-center py-5">
                                <i class="fa-solid fa-bell-slash fa-3x text-muted mb-3"></i>
                                <h5>Không có nhắc nhở nào</h5>
                                <p class="text-muted">Thêm nhắc nhở từ trang chi tiết công việc</p>
                            </div>

                            <div v-else class="reminder-list">
                                <div v-for="reminder in filteredReminders" :key="reminder.id" class="reminder-item"
                                    :class="{ sent: reminder.is_sent, overdue: isOverdue(reminder) }">
                                    <div class="reminder-time">
                                        <div class="time-icon" :class="getTimeIconClass(reminder)">
                                            <i :class="getTimeIcon(reminder)"></i>
                                        </div>
                                        <div class="time-info">
                                            <span class="date">{{ formatDate(reminder.remind_time) }}</span>
                                            <span class="time">{{ formatTime(reminder.remind_time) }}</span>
                                        </div>
                                    </div>

                                    <div class="reminder-content">
                                        <router-link :to="'/tasks/detail/' + reminder.task?.id" class="task-title">
                                            {{ reminder.task?.title || 'Công việc không xác định' }}
                                        </router-link>
                                        <div class="task-meta">
                                            <span v-if="reminder.task?.due_date" class="due-date">
                                                <i class="fa-solid fa-calendar me-1"></i>
                                                Hạn: {{ formatDate(reminder.task.due_date) }}
                                            </span>
                                            <span class="status-badge" :class="reminder.is_sent ? 'sent' : 'pending'">
                                                {{ reminder.is_sent ? 'Đã gửi' : 'Chờ gửi' }}
                                            </span>
                                        </div>
                                    </div>

                                    <div class="reminder-actions">
                                        <button v-if="!reminder.is_sent" class="btn-action mark-sent"
                                            @click="markAsSent(reminder.id)" title="Đánh dấu đã gửi">
                                            <i class="fa-solid fa-check"></i>
                                        </button>
                                        <button class="btn-action delete" @click="deleteReminder(reminder.id)" title="Xóa">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
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
import reminderService from "@/services/reminderService";

export default {
    name: "RemindersPage",

    data() {
        return {
            reminders: [],
            loading: true,
            filter: "upcoming",
        };
    },

    computed: {
        filteredReminders() {
            const now = new Date();
            switch (this.filter) {
                case "upcoming":
                    return this.reminders.filter(r => !r.is_sent && new Date(r.remind_time) >= now);
                case "sent":
                    return this.reminders.filter(r => r.is_sent);
                default:
                    return this.reminders;
            }
        },

        stats() {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            return {
                upcoming: this.reminders.filter(r => !r.is_sent && new Date(r.remind_time) >= now).length,
                today: this.reminders.filter(r => {
                    const rt = new Date(r.remind_time);
                    return !r.is_sent && rt >= today && rt < tomorrow;
                }).length,
                sent: this.reminders.filter(r => r.is_sent).length,
            };
        },
    },

    async mounted() {
        await this.loadReminders();
    },

    methods: {
        async loadReminders() {
            this.loading = true;
            try {
                const res = await reminderService.listUpcoming();
                this.reminders = res.data.data || [];
            } catch (e) {
                console.error("Error loading reminders:", e);
            } finally {
                this.loading = false;
            }
        },

        async markAsSent(id) {
            try {
                await reminderService.markAsSent(id);
                const reminder = this.reminders.find(r => r.id === id);
                if (reminder) reminder.is_sent = true;
            } catch (e) {
                alert("Lỗi khi cập nhật nhắc nhở");
            }
        },

        async deleteReminder(id) {
            if (!confirm("Xóa nhắc nhở này?")) return;
            try {
                await reminderService.delete(id);
                this.reminders = this.reminders.filter(r => r.id !== id);
            } catch (e) {
                alert("Lỗi khi xóa nhắc nhở");
            }
        },

        isOverdue(reminder) {
            return !reminder.is_sent && new Date(reminder.remind_time) < new Date();
        },

        getTimeIcon(reminder) {
            if (reminder.is_sent) return "fa-solid fa-check";
            if (this.isOverdue(reminder)) return "fa-solid fa-exclamation";
            return "fa-solid fa-clock";
        },

        getTimeIconClass(reminder) {
            if (reminder.is_sent) return "sent";
            if (this.isOverdue(reminder)) return "overdue";
            return "pending";
        },

        formatDate(date) {
            if (!date) return "";
            return new Date(date).toLocaleDateString("vi-VN", {
                weekday: "short",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        },

        formatTime(date) {
            if (!date) return "";
            return new Date(date).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
            });
        },
    },
};
</script>

<style scoped>
.reminders-page {
    background: #f8f9fa;
    min-height: 100vh;
}

.page-header .title {
    font-weight: 700;
    color: #1a1a2e;
}

.btn.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
}

/* Stat Cards */
.stat-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stat-card .stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
}

.stat-card.upcoming .stat-icon {
    background: #dbeafe;
    color: #3b82f6;
}

.stat-card.today .stat-icon {
    background: #fef3c7;
    color: #f59e0b;
}

.stat-card.sent .stat-icon {
    background: #d1fae5;
    color: #10b981;
}

.stat-info h3 {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0;
}

.stat-info p {
    margin: 0;
    color: #666;
}

/* Card */
.card {
    border: none;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* Reminder List */
.reminder-item {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #eee;
    transition: background 0.2s;
}

.reminder-item:hover {
    background: #f8f9fa;
}

.reminder-item:last-child {
    border-bottom: none;
}

.reminder-item.sent {
    opacity: 0.7;
}

.reminder-item.overdue {
    background: #fef2f2;
}

/* Time Section */
.reminder-time {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 180px;
}

.time-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.time-icon.pending {
    background: #dbeafe;
    color: #3b82f6;
}

.time-icon.sent {
    background: #d1fae5;
    color: #10b981;
}

.time-icon.overdue {
    background: #fee2e2;
    color: #ef4444;
}

.time-info {
    display: flex;
    flex-direction: column;
}

.time-info .date {
    font-weight: 600;
    font-size: 0.9rem;
}

.time-info .time {
    color: #666;
    font-size: 0.85rem;
}

/* Content Section */
.reminder-content {
    flex: 1;
    padding: 0 20px;
}

.task-title {
    font-weight: 600;
    color: #1a1a2e;
    text-decoration: none;
    display: block;
    margin-bottom: 4px;
}

.task-title:hover {
    color: #3b82f6;
}

.task-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.85rem;
}

.due-date {
    color: #666;
}

.status-badge {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
}

.status-badge.pending {
    background: #dbeafe;
    color: #3b82f6;
}

.status-badge.sent {
    background: #d1fae5;
    color: #10b981;
}

/* Actions */
.reminder-actions {
    display: flex;
    gap: 8px;
}

.btn-action {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.2s;
    color: white;
}

.btn-action.mark-sent {
    background: #10b981;
}

.btn-action.mark-sent:hover {
    background: #059669;
}

.btn-action.delete {
    background: #ef4444;
}

.btn-action.delete:hover {
    background: #b91c1c;
}

/* Empty State */
.empty-state {
    padding: 40px;
}

/* Page Wrapper - Full width without sidebar */
.reminders-page-wrapper {
    min-height: 100vh;
    background: #f8f9fa;
}

.reminders-page-wrapper .reminders-page {
    max-width: 1200px;
    margin: 0 auto;
}
</style>
