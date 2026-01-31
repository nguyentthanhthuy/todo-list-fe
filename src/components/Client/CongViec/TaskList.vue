<template>
    <div class="task-page-wrapper">
        <div class="task-page container-fluid py-4">
            <div class="row justify-content-center">
                <div class="col-12">
                    
                    <!-- HEADER -->
                    <div class="page-header-modern mb-4">
                        <div class="header-content">
                            <div class="header-left">
                                <div class="header-icon">
                                    <i class="fa-solid fa-tasks"></i>
                                </div>
                                <div class="header-text">
                                    <h2 class="header-title">Danh sách công việc</h2>
                                    <p class="header-subtitle">Quản lý và theo dõi tiến độ công việc</p>
                                </div>
                            </div>
                            <div class="header-actions">
                                <div class="search-box">
                                    <i class="fa-solid fa-search"></i>
                                    <input type="text" v-model="searchQuery" placeholder="Tìm kiếm công việc..." class="search-input">
                                </div>
                                <router-link to="/them-moi-cong-viec" class="btn-add-task">
                                    <i class="fa-solid fa-plus"></i>
                                    <span>Thêm công việc</span>
                                </router-link>
                            </div>
                        </div>
                    </div>

                    <!-- STATS CARDS -->
                    <div class="stats-row mb-4">
                        <div class="stat-card total">
                            <div class="stat-icon"><i class="fa-solid fa-layer-group"></i></div>
                            <div class="stat-info">
                                <span class="stat-number">{{ tasks.length }}</span>
                                <span class="stat-label">Tổng công việc</span>
                            </div>
                        </div>
                        <div class="stat-card completed">
                            <div class="stat-icon"><i class="fa-solid fa-check-circle"></i></div>
                            <div class="stat-info">
                                <span class="stat-number">{{ completedCount }}</span>
                                <span class="stat-label">Hoàn thành</span>
                            </div>
                        </div>
                        <div class="stat-card in-progress">
                            <div class="stat-icon"><i class="fa-solid fa-spinner"></i></div>
                            <div class="stat-info">
                                <span class="stat-number">{{ inProgressCount }}</span>
                                <span class="stat-label">Đang thực hiện</span>
                            </div>
                        </div>
                        <div class="stat-card pending">
                            <div class="stat-icon"><i class="fa-solid fa-clock"></i></div>
                            <div class="stat-info">
                                <span class="stat-number">{{ pendingCount }}</span>
                                <span class="stat-label">Chờ xử lý</span>
                            </div>
                        </div>
                    </div>

                    <!-- TASK TABLE -->
                    <div class="table-container">
                        <div class="table-header">
                            <h5 class="table-title">
                                <i class="fa-solid fa-list me-2"></i>
                                Tất cả công việc
                            </h5>
                            <div class="table-filters">
                                <select v-model="filterStatus" class="filter-select">
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="Chưa bắt đầu">Chưa bắt đầu</option>
                                    <option value="Đang thực hiện">Đang thực hiện</option>
                                    <option value="Hoàn thành">Hoàn thành</option>
                                </select>
                            </div>
                        </div>

                        <div class="table-responsive">
                            <table class="modern-table">
                                <thead>
                                    <tr>
                                        <th class="th-id">#</th>
                                        <th class="th-title">Công việc</th>
                                        <th class="th-project">Dự án</th>
                                        <th class="th-tags">Nhãn</th>
                                        <th class="th-assignee">Người thực hiện</th>
                                        <th class="th-progress">Tiến độ</th>
                                        <th class="th-status">Trạng thái</th>
                                        <th class="th-deadline">Hạn chót</th>
                                        <th class="th-actions">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(t, index) in filteredTasks" :key="t.id" class="task-row">
                                        <td class="td-id">{{ index + 1 }}</td>
                                        <td class="td-title">
                                            <router-link :to="'/tasks/detail/' + t.id" class="task-name">
                                                {{ t.title }}
                                            </router-link>
                                        </td>
                                        <td class="td-project">
                                            <span class="project-badge">{{ t.project?.name || 'Không có' }}</span>
                                        </td>
                                        <td class="td-tags">
                                            <div class="tags-wrapper">
                                                <span v-for="tag in (t.tags || []).slice(0, 2)" :key="tag.id" 
                                                    class="tag-chip" :style="{ backgroundColor: tag.color || '#6c757d' }">
                                                    {{ tag.name }}
                                                </span>
                                                <span v-if="(t.tags || []).length > 2" class="tag-more">
                                                    +{{ t.tags.length - 2 }}
                                                </span>
                                            </div>
                                        </td>
                                        <td class="td-assignee">
                                            <div class="assignee-info">
                                                <div class="assignee-avatar">
                                                    {{ getInitials(t.assignee?.ho_va_ten) }}
                                                </div>
                                                <span class="assignee-name">{{ t.assignee?.ho_va_ten || '-' }}</span>
                                            </div>
                                        </td>
                                        <td class="td-progress">
                                            <div class="progress-wrapper">
                                                <div class="progress-bar-bg">
                                                    <div class="progress-bar-fill" 
                                                        :class="getProgressClass(t.progress)"
                                                        :style="{ width: t.progress + '%' }">
                                                    </div>
                                                </div>
                                                <span class="progress-text">{{ t.progress }}%</span>
                                            </div>
                                        </td>
                                        <td class="td-status">
                                            <span class="status-badge" :class="getStatusClass(t.status)">
                                                <i :class="getStatusIcon(t.status)"></i>
                                                {{ t.status }}
                                            </span>
                                        </td>
                                        <td class="td-deadline">
                                            <span class="deadline-text" :class="{ 'overdue': isOverdue(t.due_date, t.status) }">
                                                <i class="fa-regular fa-calendar me-1"></i>
                                                {{ formatDate(t.due_date) }}
                                            </span>
                                        </td>
                                        <td class="td-actions">
                                            <div class="action-buttons">
                                                <router-link :to="'/tasks/detail/' + t.id" class="action-btn view" title="Xem chi tiết">
                                                    <i class="fa-solid fa-eye"></i>
                                                </router-link>
                                                <router-link :to="'/tasks/edit/' + t.id" class="action-btn edit" title="Chỉnh sửa">
                                                    <i class="fa-solid fa-pen"></i>
                                                </router-link>
                                                <button class="action-btn delete" @click="deleteTask(t.id)" title="Xóa">
                                                    <i class="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Empty State -->
                        <div v-if="filteredTasks.length === 0" class="empty-state">
                            <i class="fa-solid fa-inbox"></i>
                            <h4>Không có công việc nào</h4>
                            <p>Bắt đầu bằng cách tạo công việc mới</p>
                            <router-link to="/them-moi-cong-viec" class="btn-add-task">
                                <i class="fa-solid fa-plus me-2"></i> Thêm công việc
                            </router-link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    
</template>

<script>
import api from "@/core/baseRequest";

export default {
    name: "TaskList",

    data() {
        return {
            tasks: [],
            searchQuery: '',
            filterStatus: ''
        };
    },

    computed: {
        filteredTasks() {
            let result = this.tasks;
            
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(t => 
                    t.title?.toLowerCase().includes(query) ||
                    t.project?.name?.toLowerCase().includes(query)
                );
            }
            
            if (this.filterStatus) {
                result = result.filter(t => t.status === this.filterStatus);
            }
            
            return result;
        },
        completedCount() {
            return this.tasks.filter(t => t.status === 'Hoàn thành').length;
        },
        inProgressCount() {
            return this.tasks.filter(t => t.status === 'Đang thực hiện').length;
        },
        pendingCount() {
            return this.tasks.filter(t => t.status === 'Chưa bắt đầu').length;
        }
    },

    mounted() {
        this.loadTasks();
    },

    methods: {
        getStatusClass(status) {
            const classes = {
                "Chưa bắt đầu": "status-pending",
                "Đang thực hiện": "status-progress",
                "Hoàn thành": "status-completed",
                "Hủy bỏ": "status-cancelled"
            };
            return classes[status] || "status-default";
        },

        getStatusIcon(status) {
            const icons = {
                "Chưa bắt đầu": "fa-solid fa-circle-pause",
                "Đang thực hiện": "fa-solid fa-spinner fa-spin",
                "Hoàn thành": "fa-solid fa-circle-check",
                "Hủy bỏ": "fa-solid fa-circle-xmark"
            };
            return icons[status] || "fa-solid fa-circle";
        },

        getProgressClass(progress) {
            if (progress >= 100) return 'progress-complete';
            if (progress >= 60) return 'progress-good';
            if (progress >= 30) return 'progress-medium';
            return 'progress-low';
        },

        getInitials(name) {
            if (!name) return '?';
            return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
        },

        isOverdue(date, status) {
            if (!date || status === 'Hoàn thành') return false;
            return new Date(date) < new Date();
        },

        formatDate(date) {
            if (!date) return "-";
            return new Date(date).toLocaleDateString('vi-VN');
        },

        async loadTasks() {
            const res = await api.get("tasks/list");
            this.tasks = res.data.data;
        },

        async deleteTask(id) {
            if (!confirm("Bạn có chắc muốn xóa công việc này?")) return;
            await api.delete("tasks/delete/" + id);
            this.loadTasks();
        }
    }
};
</script>

<style scoped>
/* ==================== PAGE WRAPPER ==================== */
.task-page-wrapper {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
    padding: 20px;
}

/* ==================== HEADER ==================== */
.page-header-modern {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 20px;
}

.header-icon {
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: white;
    backdrop-filter: blur(10px);
}

.header-title {
    color: white;
    font-size: 28px;
    font-weight: 700;
    margin: 0;
}

.header-subtitle {
    color: rgba(255, 255, 255, 0.8);
    margin: 5px 0 0 0;
    font-size: 15px;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 15px;
}

.search-box {
    position: relative;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    backdrop-filter: blur(10px);
}

.search-box i {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.7);
}

.search-input {
    background: transparent;
    border: none;
    padding: 12px 15px 12px 45px;
    color: white;
    width: 250px;
    font-size: 14px;
}

.search-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
}

.search-input:focus {
    outline: none;
}

.btn-add-task {
    background: white;
    color: #667eea;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 600;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-add-task:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    color: #764ba2;
}

/* ==================== STATS CARDS ==================== */
.stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}

.stat-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

.stat-card.total .stat-icon {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.stat-card.completed .stat-icon {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
}

.stat-card.in-progress .stat-icon {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
}

.stat-card.pending .stat-icon {
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
    color: white;
}

.stat-info {
    display: flex;
    flex-direction: column;
}

.stat-number {
    font-size: 28px;
    font-weight: 700;
    color: #1f2937;
}

.stat-label {
    color: #6b7280;
    font-size: 14px;
}

/* ==================== TABLE CONTAINER ==================== */
.table-container {
    background: white;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #f1f5f9;
}

.table-title {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
}

.filter-select {
    padding: 10px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    font-size: 14px;
    color: #374151;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
}

.filter-select:focus {
    outline: none;
    border-color: #667eea;
}

/* ==================== MODERN TABLE ==================== */
.modern-table {
    width: 100%;
    border-collapse: collapse;
}

.modern-table thead {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.modern-table th {
    padding: 16px 20px;
    text-align: left;
    font-weight: 600;
    color: #64748b;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid #e2e8f0;
}

.modern-table td {
    padding: 18px 20px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
}

.task-row {
    transition: all 0.2s ease;
}

.task-row:hover {
    background: linear-gradient(135deg, #faf5ff 0%, #f5f3ff 100%);
}

/* Table Cells */
.td-id {
    width: 50px;
    color: #94a3b8;
    font-weight: 600;
}

.task-name {
    color: #1f2937;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.2s;
}

.task-name:hover {
    color: #667eea;
}

.project-badge {
    background: #f1f5f9;
    color: #475569;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
}

/* Tags */
.tags-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.tag-chip {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    color: white;
    font-weight: 500;
}

.tag-more {
    background: #e5e7eb;
    color: #374151;
    padding: 4px 8px;
    border-radius: 20px;
    font-size: 12px;
}

/* Assignee */
.assignee-info {
    display: flex;
    align-items: center;
    gap: 10px;
}

.assignee-avatar {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 600;
}

.assignee-name {
    color: #374151;
    font-weight: 500;
}

/* Progress */
.progress-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
}

.progress-bar-bg {
    width: 100px;
    height: 8px;
    background: #e5e7eb;
    border-radius: 10px;
    overflow: hidden;
}

.progress-bar-fill {
    height: 100%;
    border-radius: 10px;
    transition: width 0.5s ease;
}

.progress-complete { background: linear-gradient(90deg, #10b981 0%, #059669 100%); }
.progress-good { background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%); }
.progress-medium { background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); }
.progress-low { background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%); }

.progress-text {
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    min-width: 40px;
}

/* Status Badge */
.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
}

.status-pending {
    background: #f1f5f9;
    color: #64748b;
}

.status-progress {
    background: #fef3c7;
    color: #d97706;
}

.status-completed {
    background: #d1fae5;
    color: #059669;
}

.status-cancelled {
    background: #fee2e2;
    color: #dc2626;
}

/* Deadline */
.deadline-text {
    color: #64748b;
    font-size: 14px;
}

.deadline-text.overdue {
    color: #ef4444;
    font-weight: 600;
}

/* Action Buttons */
.action-buttons {
    display: flex;
    gap: 8px;
}

.action-btn {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
}

.action-btn:hover {
    transform: scale(1.1);
}

.action-btn.view {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.action-btn.edit {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.action-btn.delete {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 60px 20px;
}

.empty-state i {
    font-size: 64px;
    color: #d1d5db;
    margin-bottom: 20px;
}

.empty-state h4 {
    color: #374151;
    margin-bottom: 10px;
}

.empty-state p {
    color: #9ca3af;
    margin-bottom: 20px;
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 1200px) {
    .stats-row {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        text-align: center;
    }
    
    .header-left {
        flex-direction: column;
    }
    
    .header-actions {
        width: 100%;
        flex-direction: column;
    }
    
    .search-input {
        width: 100%;
    }
    
    .stats-row {
        grid-template-columns: 1fr;
    }
    
    .table-header {
        flex-direction: column;
        gap: 15px;
    }
}
</style>
