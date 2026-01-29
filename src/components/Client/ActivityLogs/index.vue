<template>
    <div class="activity-page-wrapper">
        <div class="activity-page container-fluid py-4">
            <div class="row justify-content-center">
                <div class="col-12 col-xl-10">
                    <!-- HEADER -->
                    <div class="page-header mb-4">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h4 class="title mb-1">
                                    <i class="fa-solid fa-history me-2"></i>
                                    Lịch sử hoạt động
                                </h4>
                                <p class="subtitle text-muted mb-0">Theo dõi các hoạt động gần đây của bạn</p>
                            </div>
                            <button class="btn btn-outline-secondary" @click="loadLogs">
                                <i class="fa-solid fa-refresh me-1"></i> Làm mới
                            </button>
                        </div>
                    </div>

                    <!-- Activity Timeline -->
                    <div class="card">
                        <div class="card-body">
                            <div v-if="loading" class="text-center py-5">
                                <i class="fa-solid fa-spinner fa-spin fa-2x"></i>
                            </div>

                            <div v-else-if="logs.length === 0" class="empty-state text-center py-5">
                                <i class="fa-solid fa-clock-rotate-left fa-3x text-muted mb-3"></i>
                                <h5>Chưa có hoạt động nào</h5>
                                <p class="text-muted">Các hoạt động của bạn sẽ được ghi lại tại đây</p>
                            </div>

                            <div v-else class="activity-timeline">
                                <div v-for="(group, date) in groupedLogs" :key="date" class="timeline-group">
                                    <div class="timeline-date">
                                        <span>{{ formatGroupDate(date) }}</span>
                                    </div>

                                    <div class="timeline-items">
                                        <div v-for="log in group" :key="log.id" class="timeline-item">
                                            <div class="timeline-icon" :class="getActionClass(log.action)">
                                                <i :class="getActionIcon(log.action)"></i>
                                            </div>
                                            <div class="timeline-content">
                                                <p class="activity-text">{{ parseAction(log.action) }}</p>
                                                <span class="activity-time">{{ formatTime(log.created_at) }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Load More -->
                            <div v-if="logs.length >= limit" class="text-center mt-4">
                                <button class="btn btn-outline-primary" @click="loadMore">
                                    <i class="fa-solid fa-plus me-1"></i> Tải thêm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import activityLogService from "@/services/activityLogService";

export default {
    name: "ActivityLogsPage",

    data() {
        return {
            logs: [],
            loading: true,
            limit: 50,
        };
    },

    computed: {
        groupedLogs() {
            const groups = {};
            this.logs.forEach(log => {
                const date = new Date(log.created_at).toDateString();
                if (!groups[date]) {
                    groups[date] = [];
                }
                groups[date].push(log);
            });
            return groups;
        },
    },

    async mounted() {
        await this.loadLogs();
    },

    methods: {
        async loadLogs() {
            this.loading = true;
            try {
                const res = await activityLogService.list(this.limit);
                this.logs = res.data.data || [];
            } catch (e) {
                console.error("Error loading logs:", e);
            } finally {
                this.loading = false;
            }
        },

        async loadMore() {
            this.limit += 50;
            await this.loadLogs();
        },

        parseAction(action) {
            // Remove metadata if exists
            return action.split(' | ')[0];
        },

        getActionIcon(action) {
            const actionLower = action.toLowerCase();
            if (actionLower.includes('tạo') || actionLower.includes('thêm')) {
                return 'fa-solid fa-plus';
            }
            if (actionLower.includes('cập nhật') || actionLower.includes('sửa')) {
                return 'fa-solid fa-pen';
            }
            if (actionLower.includes('xóa')) {
                return 'fa-solid fa-trash';
            }
            if (actionLower.includes('bình luận') || actionLower.includes('comment')) {
                return 'fa-solid fa-comment';
            }
            if (actionLower.includes('nhắc nhở') || actionLower.includes('reminder')) {
                return 'fa-solid fa-bell';
            }
            if (actionLower.includes('đăng nhập')) {
                return 'fa-solid fa-right-to-bracket';
            }
            if (actionLower.includes('đăng xuất')) {
                return 'fa-solid fa-right-from-bracket';
            }
            return 'fa-solid fa-circle-info';
        },

        getActionClass(action) {
            const actionLower = action.toLowerCase();
            if (actionLower.includes('tạo') || actionLower.includes('thêm')) {
                return 'create';
            }
            if (actionLower.includes('cập nhật') || actionLower.includes('sửa')) {
                return 'update';
            }
            if (actionLower.includes('xóa')) {
                return 'delete';
            }
            if (actionLower.includes('bình luận')) {
                return 'comment';
            }
            return 'default';
        },

        formatGroupDate(dateStr) {
            const date = new Date(dateStr);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (date.toDateString() === today.toDateString()) {
                return 'Hôm nay';
            }
            if (date.toDateString() === yesterday.toDateString()) {
                return 'Hôm qua';
            }
            return date.toLocaleDateString('vi-VN', {
                weekday: 'long',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        },

        formatTime(datetime) {
            return new Date(datetime).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
            });
        },
    },
};
</script>

<style scoped>
.activity-page {
    background: #f8f9fa;
    min-height: 100vh;
}

.page-header .title {
    font-weight: 700;
    color: #1a1a2e;
}

.card {
    border: none;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* Timeline */
.activity-timeline {
    position: relative;
}

.timeline-group {
    margin-bottom: 30px;
}

.timeline-group:last-child {
    margin-bottom: 0;
}

.timeline-date {
    margin-bottom: 16px;
}

.timeline-date span {
    background: #e5e7eb;
    color: #374151;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
}

.timeline-items {
    position: relative;
    padding-left: 40px;
}

.timeline-items::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #e5e7eb;
}

.timeline-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 20px;
    position: relative;
}

.timeline-item:last-child {
    margin-bottom: 0;
}

.timeline-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: -40px;
    background: white;
    border: 2px solid #e5e7eb;
    font-size: 0.8rem;
}

.timeline-icon.create {
    background: #d1fae5;
    border-color: #10b981;
    color: #10b981;
}

.timeline-icon.update {
    background: #dbeafe;
    border-color: #3b82f6;
    color: #3b82f6;
}

.timeline-icon.delete {
    background: #fee2e2;
    border-color: #ef4444;
    color: #ef4444;
}

.timeline-icon.comment {
    background: #fef3c7;
    border-color: #f59e0b;
    color: #f59e0b;
}

.timeline-icon.default {
    background: #f3f4f6;
    border-color: #9ca3af;
    color: #9ca3af;
}

.timeline-content {
    flex: 1;
    background: #f8f9fa;
    padding: 12px 16px;
    border-radius: 8px;
}

.activity-text {
    margin: 0 0 4px 0;
    color: #1f2937;
}

.activity-time {
    font-size: 0.8rem;
    color: #9ca3af;
}

/* Empty State */
.empty-state {
    padding: 40px;
}

/* Page Wrapper - Full width without sidebar */
.activity-page-wrapper {
    min-height: 100vh;
    background: #f8f9fa;
}

.activity-page-wrapper .activity-page {
    max-width: 1200px;
    margin: 0 auto;
}
</style>
