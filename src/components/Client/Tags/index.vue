<template>
    <AppLayout pageTitle="Quản lý nhãn">
        <div class="tags-page container-fluid py-4">
            <div class="row justify-content-center">
                <div class="col-12 col-xl-10">
                    <!-- HEADER -->
                    <div class="page-header mb-4">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h4 class="title mb-1">
                                    <i class="fa-solid fa-tags me-2"></i>
                                    Quản lý nhãn
                                </h4>
                                <p class="subtitle text-muted mb-0">Tạo và quản lý các nhãn để phân loại công việc</p>
                            </div>
                            <button class="btn-create" @click="showCreateModal = true">
                                <i class="fa-solid fa-plus me-2"></i> Thêm nhãn mới
                            </button>
                        </div>
                    </div>

                    <!-- Tags Grid -->
                    <div class="row g-4">
                        <div v-for="tag in tags" :key="tag.id" class="col-md-4 col-lg-3">
                            <div class="tag-card">
                                <div class="tag-header" :style="{ backgroundColor: tag.color || '#6c757d' }">
                                    <span class="tag-name">{{ tag.name }}</span>
                                </div>
                                <div class="tag-body">
                                    <div class="tag-stats">
                                        <i class="fa-solid fa-list-check me-1"></i>
                                        <span>{{ tag.tasks_count || 0 }} công việc</span>
                                    </div>
                                    <div class="tag-actions">
                                        <button class="btn-action edit" @click="editTag(tag)" title="Sửa">
                                            <i class="fa-solid fa-pen"></i>
                                        </button>
                                        <button class="btn-action delete" @click="deleteTag(tag.id)" title="Xóa">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Empty State -->
                        <div v-if="!loading && tags.length === 0" class="col-12">
                            <div class="empty-state text-center py-5">
                                <i class="fa-solid fa-tags fa-4x text-muted mb-3"></i>
                                <h5>Chưa có nhãn nào</h5>
                                <p class="text-muted">Tạo nhãn đầu tiên để bắt đầu phân loại công việc</p>
                                <button class="btn btn-primary" @click="showCreateModal = true">
                                    <i class="fa-solid fa-plus me-2"></i> Tạo nhãn
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Loading -->
                    <div v-if="loading" class="text-center py-5">
                        <i class="fa-solid fa-spinner fa-spin fa-2x"></i>
                    </div>
                </div>
            </div>

            <!-- Create/Edit Modal -->
            <div v-if="showCreateModal || showEditModal" class="modal-backdrop" @click.self="closeModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ showEditModal ? 'Chỉnh sửa nhãn' : 'Tạo nhãn mới' }}</h5>
                        <button class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Tên nhãn <span class="text-danger">*</span></label>
                            <input v-model="formData.name" type="text" class="form-control" placeholder="Nhập tên nhãn">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Màu sắc</label>
                            <div class="d-flex align-items-center gap-3">
                                <input v-model="formData.color" type="color" class="form-control form-control-color"
                                    style="width: 60px; height: 40px;">
                                <div class="color-presets">
                                    <button v-for="color in presetColors" :key="color" class="color-preset"
                                        :style="{ backgroundColor: color }"
                                        :class="{ active: formData.color === color }" @click="formData.color = color">
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Xem trước</label>
                            <div>
                                <span class="tag-preview" :style="{ backgroundColor: formData.color }">
                                    {{ formData.name || 'Tên nhãn' }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click="closeModal">Hủy</button>
                        <button class="btn btn-primary" @click="saveTag" :disabled="!formData.name.trim()">
                            <i class="fa-solid fa-save me-1"></i>
                            {{ showEditModal ? 'Cập nhật' : 'Tạo mới' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script>
import tagService from "@/services/tagService";
import AppLayout from "@/components/Common/AppLayout.vue";

export default {
    name: "TagsManager",

    components: {
        AppLayout,
    },

    data() {
        return {
            tags: [],
            loading: true,
            showCreateModal: false,
            showEditModal: false,
            formData: {
                id: null,
                name: "",
                color: "#3b82f6",
            },
            presetColors: [
                "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
                "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1"
            ],
        };
    },

    async mounted() {
        await this.loadTags();
    },

    methods: {
        async loadTags() {
            this.loading = true;
            try {
                const res = await tagService.list();
                this.tags = res.data.data || [];
            } catch (e) {
                console.error("Error loading tags:", e);
            } finally {
                this.loading = false;
            }
        },

        editTag(tag) {
            this.formData = {
                id: tag.id,
                name: tag.name,
                color: tag.color || "#3b82f6",
            };
            this.showEditModal = true;
        },

        async saveTag() {
            if (!this.formData.name.trim()) return;

            try {
                if (this.showEditModal) {
                    await tagService.update(this.formData.id, {
                        name: this.formData.name,
                        color: this.formData.color,
                    });
                } else {
                    await tagService.create({
                        name: this.formData.name,
                        color: this.formData.color,
                    });
                }
                await this.loadTags();
                this.closeModal();
            } catch (e) {
                alert(e.response?.data?.message || "Có lỗi xảy ra");
            }
        },

        async deleteTag(id) {
            if (!confirm("Xóa nhãn này? Nhãn sẽ bị gỡ khỏi tất cả công việc.")) return;

            try {
                await tagService.delete(id);
                this.tags = this.tags.filter(t => t.id !== id);
            } catch (e) {
                alert("Lỗi khi xóa nhãn");
            }
        },

        closeModal() {
            this.showCreateModal = false;
            this.showEditModal = false;
            this.formData = { id: null, name: "", color: "#3b82f6" };
        },
    },
};
</script>

<style scoped>
.tags-page {
    background: #f8f9fa;
    min-height: 100vh;
}

.page-header .title {
    font-weight: 700;
    color: #1a1a2e;
}

.btn-create {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    font-weight: 600;
    transition: transform 0.2s, box-shadow 0.2s;
}

.btn-create:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* Tag Card */
.tag-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: transform 0.2s, box-shadow 0.2s;
}

.tag-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.tag-header {
    padding: 20px;
    color: white;
    text-align: center;
}

.tag-name {
    font-size: 1.1rem;
    font-weight: 600;
}

.tag-body {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.tag-stats {
    color: #666;
    font-size: 0.9rem;
}

.tag-actions {
    display: flex;
    gap: 8px;
}

.btn-action {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.2s;
    color: white;
}

.btn-action.edit {
    background: #3b82f6;
}

.btn-action.edit:hover {
    background: #1d4ed8;
}

.btn-action.delete {
    background: #ef4444;
}

.btn-action.delete:hover {
    background: #b91c1c;
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
    max-width: 450px;
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

/* Color Presets */
.color-presets {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.color-preset {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid transparent;
    cursor: pointer;
    transition: 0.2s;
}

.color-preset:hover {
    transform: scale(1.1);
}

.color-preset.active {
    border-color: #333;
    box-shadow: 0 0 0 2px white, 0 0 0 4px #333;
}

/* Tag Preview */
.tag-preview {
    display: inline-block;
    padding: 8px 16px;
    border-radius: 20px;
    color: white;
    font-weight: 500;
}

/* Empty State */
.empty-state {
    background: white;
    border-radius: 12px;
    padding: 40px;
}
</style>
