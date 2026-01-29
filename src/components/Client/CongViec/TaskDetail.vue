<template>
    <div class="task-detail-wrapper">
        <div class="task-detail-page container-fluid py-4">
            <div class="row justify-content-center">
                <div class="col-12 col-xl-10">
                    <!-- Loading -->
                    <div v-if="loading" class="text-center py-5">
                        <i class="fa-solid fa-spinner fa-spin fa-2x"></i>
                        <p class="mt-2">Đang tải...</p>
                    </div>

                    <template v-else-if="task">
                        <!-- HEADER -->
                        <div class="page-header mb-4">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <router-link to="/cong-viec" class="btn btn-link text-muted px-0 mb-2">
                                        <i class="fa-solid fa-arrow-left me-2"></i> Quay lại
                                    </router-link>
                                    <h4 class="title mb-1">
                                        <i class="fa-solid fa-tasks me-2"></i>
                                    {{ task.title }}
                                </h4>
                                <p class="subtitle text-muted mb-0">{{ task.project?.name || 'Không có dự án' }}</p>
                            </div>
                            <div class="d-flex gap-2">
                                <router-link :to="'/tasks/edit/' + task.id" class="btn btn-outline-primary">
                                    <i class="fa-solid fa-pen me-1"></i> Chỉnh sửa
                                </router-link>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <!-- LEFT COLUMN - Task Info -->
                        <div class="col-lg-8">
                            <!-- Task Info Card -->
                            <div class="card mb-4">
                                <div class="card-header">
                                    <h6 class="mb-0"><i class="fa-solid fa-info-circle me-2"></i>Thông tin công việc</h6>
                                </div>
                                <div class="card-body">
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label class="form-label text-muted">Trạng thái</label>
                                            <div>
                                                <span class="badge fs-6" :class="getStatusClass(task.status)">
                                                    {{ task.status }}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label text-muted">Độ ưu tiên</label>
                                            <div>
                                                <span class="badge fs-6" :class="getPriorityClass(task.priority)">
                                                    {{ task.priority }}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label text-muted">Người thực hiện</label>
                                            <p class="mb-0 fw-medium">{{ task.assignee?.ho_va_ten || '-' }}</p>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label text-muted">Người giám sát</label>
                                            <p class="mb-0 fw-medium">{{ task.supervisor?.ho_va_ten || '-' }}</p>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label text-muted">Ngày bắt đầu</label>
                                            <p class="mb-0">{{ formatDate(task.start_date) || '-' }}</p>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label text-muted">Hạn chót</label>
                                            <p class="mb-0" :class="{ 'text-danger fw-bold': isOverdue }">
                                                {{ formatDate(task.due_date) || '-' }}
                                                <span v-if="isOverdue" class="ms-1">(Quá hạn)</span>
                                            </p>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label text-muted">Thời gian ước tính</label>
                                            <p class="mb-0">{{ task.estimated_hours ? task.estimated_hours + ' giờ' : '-'
                                                }}</p>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label text-muted">Tiến độ</label>
                                            <div class="d-flex align-items-center">
                                                <div class="progress flex-grow-1 me-2" style="height: 8px;">
                                                    <div class="progress-bar" :class="progressColor(task.progress)"
                                                        :style="{ width: task.progress + '%' }"></div>
                                                </div>
                                                <span class="fw-bold">{{ task.progress }}%</span>
                                            </div>
                                        </div>
                                        <div class="col-12" v-if="task.description">
                                            <label class="form-label text-muted">Mô tả</label>
                                            <p class="mb-0" style="white-space: pre-wrap;">{{ task.description }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Tags Section -->
                            <div class="card mb-4">
                                <div class="card-header d-flex justify-content-between align-items-center">
                                    <h6 class="mb-0"><i class="fa-solid fa-tags me-2"></i>Nhãn</h6>
                                    <button class="btn btn-sm btn-outline-primary" @click="showTagModal = true">
                                        <i class="fa-solid fa-plus me-1"></i> Thêm nhãn
                                    </button>
                                </div>
                                <div class="card-body">
                                    <div v-if="task.tags && task.tags.length" class="d-flex flex-wrap gap-2">
                                        <span v-for="tag in task.tags" :key="tag.id" class="badge tag-badge"
                                            :style="{ backgroundColor: tag.color || '#6c757d' }">
                                            {{ tag.name }}
                                            <button class="btn-close-tag" @click="removeTag(tag.id)">
                                                <i class="fa-solid fa-times"></i>
                                            </button>
                                        </span>
                                    </div>
                                    <p v-else class="text-muted mb-0">Chưa có nhãn nào</p>
                                </div>
                            </div>

                            <!-- Comments Section -->
                            <div class="card mb-4">
                                <div class="card-header">
                                    <h6 class="mb-0"><i class="fa-solid fa-comments me-2"></i>Bình luận ({{
                                        comments.length }})</h6>
                                </div>
                                <div class="card-body">
                                    <!-- Add Comment -->
                                    <div class="add-comment mb-4">
                                        <textarea v-model="newComment" class="form-control mb-2"
                                            placeholder="Viết bình luận..." rows="3"></textarea>
                                        <button class="btn btn-primary btn-sm" @click="addComment"
                                            :disabled="!newComment.trim()">
                                            <i class="fa-solid fa-paper-plane me-1"></i> Gửi
                                        </button>
                                    </div>

                                    <!-- Comments List -->
                                    <div v-if="comments.length" class="comments-list">
                                        <div v-for="comment in comments" :key="comment.id" class="comment-item">
                                            <div class="d-flex align-items-start">
                                                <div class="avatar me-3">
                                                    <img v-if="comment.client?.avatar" :src="comment.client.avatar"
                                                        class="rounded-circle" width="40" height="40">
                                                    <div v-else class="avatar-placeholder">
                                                        {{ getInitials(comment.client?.ho_va_ten) }}
                                                    </div>
                                                </div>
                                                <div class="flex-grow-1">
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <strong>{{ comment.client?.ho_va_ten || 'Ẩn danh' }}</strong>
                                                        <small class="text-muted">{{ formatDateTime(comment.created_at)
                                                            }}</small>
                                                    </div>
                                                    <p class="mb-0 mt-1">{{ comment.content }}</p>
                                                    <button v-if="canDeleteComment(comment)" class="btn btn-link btn-sm text-danger p-0 mt-1"
                                                        @click="deleteComment(comment.id)">
                                                        <i class="fa-solid fa-trash me-1"></i> Xóa
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p v-else class="text-muted mb-0">Chưa có bình luận nào</p>
                                </div>
                            </div>
                        </div>

                        <!-- RIGHT COLUMN - Reminders & Activity -->
                        <div class="col-lg-4">
                            <!-- Reminders Section -->
                            <div class="card mb-4">
                                <div class="card-header d-flex justify-content-between align-items-center">
                                    <h6 class="mb-0"><i class="fa-solid fa-bell me-2"></i>Nhắc nhở</h6>
                                    <button class="btn btn-sm btn-outline-primary" @click="showReminderModal = true">
                                        <i class="fa-solid fa-plus"></i>
                                    </button>
                                </div>
                                <div class="card-body">
                                    <div v-if="reminders.length" class="reminders-list">
                                        <div v-for="reminder in reminders" :key="reminder.id" class="reminder-item"
                                            :class="{ 'sent': reminder.is_sent }">
                                            <div class="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <i class="fa-solid fa-clock me-2"
                                                        :class="reminder.is_sent ? 'text-success' : 'text-warning'"></i>
                                                    {{ formatDateTime(reminder.remind_time) }}
                                                </div>
                                                <button class="btn btn-sm btn-link text-danger"
                                                    @click="deleteReminder(reminder.id)">
                                                    <i class="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                            <small v-if="reminder.is_sent" class="text-success">Đã gửi</small>
                                        </div>
                                    </div>
                                    <p v-else class="text-muted mb-0">Chưa có nhắc nhở</p>
                                </div>
                            </div>

                            <!-- Activity Log Section -->
                            <div class="card">
                                <div class="card-header">
                                    <h6 class="mb-0"><i class="fa-solid fa-history me-2"></i>Hoạt động</h6>
                                </div>
                                <div class="card-body">
                                    <div v-if="activityLogs.length" class="activity-list">
                                        <div v-for="log in activityLogs" :key="log.id" class="activity-item">
                                            <small class="text-muted d-block">{{ formatDateTime(log.created_at)
                                                }}</small>
                                            <span>{{ log.action }}</span>
                                        </div>
                                    </div>
                                    <p v-else class="text-muted mb-0">Chưa có hoạt động nào</p>
                                </div>
                            </div>
                            </div>
                        </div>
                    </template>

                    <!-- Not Found -->
                    <div v-else class="text-center py-5">
                        <i class="fa-solid fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                        <h5>Không tìm thấy công việc</h5>
                        <router-link to="/cong-viec" class="btn btn-primary mt-3">
                            Quay lại danh sách
                        </router-link>
                    </div>
                </div>
            </div>

            <!-- Tag Modal -->
            <div v-if="showTagModal" class="modal-backdrop" @click.self="showTagModal = false">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Quản lý nhãn</h5>
                    <button class="btn-close" @click="showTagModal = false"></button>
                </div>
                <div class="modal-body">
                    <!-- Create new tag -->
                    <div class="mb-4">
                        <h6>Tạo nhãn mới</h6>
                        <div class="d-flex gap-2">
                            <input v-model="newTag.name" type="text" class="form-control" placeholder="Tên nhãn">
                            <input v-model="newTag.color" type="color" class="form-control form-control-color"
                                style="width: 50px;">
                            <button class="btn btn-primary" @click="createTag" :disabled="!newTag.name.trim()">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Select existing tags -->
                    <div>
                        <h6>Chọn nhãn</h6>
                        <div class="tags-selection">
                            <label v-for="tag in allTags" :key="tag.id" class="tag-option">
                                <input type="checkbox" :value="tag.id" v-model="selectedTagIds">
                                <span class="tag-label" :style="{ backgroundColor: tag.color || '#6c757d' }">
                                    {{ tag.name }}
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" @click="showTagModal = false">Hủy</button>
                    <button class="btn btn-primary" @click="saveTags">Lưu</button>
                </div>
            </div>
        </div>

        <!-- Reminder Modal -->
        <div v-if="showReminderModal" class="modal-backdrop" @click.self="showReminderModal = false">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Thêm nhắc nhở</h5>
                    <button class="btn-close" @click="showReminderModal = false"></button>
                </div>
                <div class="modal-body">
                    <label class="form-label">Thời gian nhắc nhở</label>
                    <input v-model="newReminderTime" type="datetime-local" class="form-control">
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" @click="showReminderModal = false">Hủy</button>
                    <button class="btn btn-primary" @click="addReminder" :disabled="!newReminderTime">Thêm</button>
                </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
import api from "@/core/baseRequest";
import tagService from "@/services/tagService";
import commentService from "@/services/commentService";
import reminderService from "@/services/reminderService";
import activityLogService from "@/services/activityLogService";

export default {
    name: "TaskDetail",

    data() {
        return {
            task: null,
            loading: true,
            comments: [],
            reminders: [],
            activityLogs: [],
            allTags: [],
            selectedTagIds: [],
            newComment: "",
            newTag: { name: "", color: "#3b82f6" },
            newReminderTime: "",
            showTagModal: false,
            showReminderModal: false,
            currentUserId: null,
        };
    },

    computed: {
        isOverdue() {
            if (!this.task?.due_date) return false;
            return new Date(this.task.due_date) < new Date() && this.task.status !== 'Hoàn thành';
        }
    },

    async mounted() {
        await this.loadCurrentUser();
        await this.loadTask();
        await this.loadAllData();
    },

    methods: {
        async loadCurrentUser() {
            try {
                const res = await api.get("/client/profile/data");
                this.currentUserId = res.data.data?.id;
            } catch (e) {
                console.error("Error loading user:", e);
            }
        },

        async loadTask() {
            this.loading = true;
            try {
                const id = this.$route.params.id;
                const res = await api.get(`/tasks/detail/${id}`);
                this.task = res.data.data;
                this.selectedTagIds = this.task.tags?.map(t => t.id) || [];
            } catch (e) {
                console.error("Error loading task:", e);
                this.task = null;
            } finally {
                this.loading = false;
            }
        },

        async loadAllData() {
            const id = this.$route.params.id;
            try {
                const [commentsRes, remindersRes, tagsRes] = await Promise.all([
                    commentService.listByTask(id),
                    reminderService.listByTask(id),
                    tagService.list(),
                ]);
                this.comments = commentsRes.data.data || [];
                this.reminders = remindersRes.data.data || [];
                this.allTags = tagsRes.data.data || [];

                // Load activity logs
                try {
                    const logsRes = await activityLogService.list(20);
                    this.activityLogs = logsRes.data.data || [];
                } catch (e) {
                    this.activityLogs = [];
                }
            } catch (e) {
                console.error("Error loading data:", e);
            }
        },

        // Comments
        async addComment() {
            if (!this.newComment.trim()) return;
            try {
                await commentService.create(this.task.id, this.newComment);
                this.newComment = "";
                const res = await commentService.listByTask(this.task.id);
                this.comments = res.data.data || [];
            } catch (e) {
                alert("Lỗi khi thêm bình luận");
            }
        },

        async deleteComment(id) {
            if (!confirm("Xóa bình luận này?")) return;
            try {
                await commentService.delete(id);
                this.comments = this.comments.filter(c => c.id !== id);
            } catch (e) {
                alert("Lỗi khi xóa bình luận");
            }
        },

        canDeleteComment(comment) {
            return comment.client_id === this.currentUserId;
        },

        // Tags
        async createTag() {
            if (!this.newTag.name.trim()) return;
            try {
                const res = await tagService.create(this.newTag);
                this.allTags.push(res.data.data);
                this.newTag = { name: "", color: "#3b82f6" };
            } catch (e) {
                alert(e.response?.data?.message || "Lỗi khi tạo nhãn");
            }
        },

        async saveTags() {
            try {
                await tagService.attachToTask(this.task.id, this.selectedTagIds);
                await this.loadTask();
                this.showTagModal = false;
            } catch (e) {
                alert("Lỗi khi cập nhật nhãn");
            }
        },

        async removeTag(tagId) {
            try {
                await tagService.detachFromTask(this.task.id, tagId);
                this.task.tags = this.task.tags.filter(t => t.id !== tagId);
                this.selectedTagIds = this.selectedTagIds.filter(id => id !== tagId);
            } catch (e) {
                alert("Lỗi khi xóa nhãn");
            }
        },

        // Reminders
        async addReminder() {
            if (!this.newReminderTime) return;
            try {
                await reminderService.create(this.task.id, this.newReminderTime);
                const res = await reminderService.listByTask(this.task.id);
                this.reminders = res.data.data || [];
                this.newReminderTime = "";
                this.showReminderModal = false;
            } catch (e) {
                alert(e.response?.data?.message || "Lỗi khi tạo nhắc nhở");
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

        // Utilities
        formatDate(date) {
            if (!date) return "";
            return new Date(date).toLocaleDateString("vi-VN");
        },

        formatDateTime(datetime) {
            if (!datetime) return "";
            return new Date(datetime).toLocaleString("vi-VN");
        },

        getInitials(name) {
            if (!name) return "?";
            return name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
        },

        getStatusClass(status) {
            const map = {
                "Chưa bắt đầu": "bg-secondary",
                "Đang thực hiện": "bg-primary",
                "Hoàn thành": "bg-success",
                "Trì hoãn": "bg-warning",
                "Hủy bỏ": "bg-danger",
            };
            return map[status] || "bg-secondary";
        },

        getPriorityClass(priority) {
            const map = {
                "Thấp": "bg-info",
                "Trung bình": "bg-secondary",
                "Cao": "bg-warning",
                "Khẩn cấp": "bg-danger",
            };
            return map[priority] || "bg-secondary";
        },

        progressColor(progress) {
            if (progress >= 100) return "bg-success";
            if (progress >= 50) return "bg-primary";
            if (progress >= 25) return "bg-warning";
            return "bg-danger";
        },
    },
};
</script>

<style scoped>
.task-detail-wrapper {
    min-height: 100vh;
    background: #f8f9fa;
}

.task-detail-page {
    background: #f8f9fa;
    min-height: 100vh;
    max-width: 1400px;
    margin: 0 auto;
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

.card-header {
    background: white;
    border-bottom: 1px solid #eee;
    padding: 1rem 1.25rem;
}

/* Tags */
.tag-badge {
    padding: 6px 12px;
    border-radius: 20px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: white;
    font-size: 0.85rem;
}

.btn-close-tag {
    background: none;
    border: none;
    color: white;
    padding: 0;
    cursor: pointer;
    opacity: 0.7;
}

.btn-close-tag:hover {
    opacity: 1;
}

/* Comments */
.comment-item {
    padding: 1rem 0;
    border-bottom: 1px solid #eee;
}

.comment-item:last-child {
    border-bottom: none;
}

.avatar-placeholder {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #3b82f6;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.85rem;
}

/* Reminders */
.reminder-item {
    padding: 0.75rem;
    background: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 0.5rem;
}

.reminder-item.sent {
    opacity: 0.7;
}

/* Activity */
.activity-item {
    padding: 0.5rem 0;
    border-left: 2px solid #3b82f6;
    padding-left: 1rem;
    margin-bottom: 0.5rem;
}

/* Modal */
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
}

.modal-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header,
.modal-body,
.modal-footer {
    padding: 1rem 1.5rem;
}

.modal-header {
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-footer {
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}

/* Tags Selection */
.tags-selection {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tag-option {
    cursor: pointer;
}

.tag-option input {
    display: none;
}

.tag-option .tag-label {
    padding: 6px 12px;
    border-radius: 20px;
    color: white;
    font-size: 0.85rem;
    opacity: 0.5;
    transition: opacity 0.2s;
}

.tag-option input:checked+.tag-label {
    opacity: 1;
}

.tag-option:hover .tag-label {
    opacity: 0.8;
}
</style>
