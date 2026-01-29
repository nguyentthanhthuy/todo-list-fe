<template>
  <AppLayout pageTitle="Quản lý dự án">
    <div class="task-page container-fluid py-4">

      <div class="row justify-content-center">
        <div class="col-12 col-xl-10">

          <!-- HEADER - Nhỏ gọn hơn -->
          <div class="page-header mb-4">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h4 class="title mb-1">
                  <i class="fa-solid fa-folder-open me-2"></i>
                  Danh sách Projects
                </h4>
                <p class="subtitle text-muted mb-0">Quản lý toàn bộ dự án của khách hàng</p>
              </div>

              <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#createProjectModal">
                <i class="fa-solid fa-plus me-1"></i> Tạo Project
              </button>

            </div>
          </div>

          <!-- CARD GRID -->
          <div class="row g-3">
            <div class="col-md-6 col-lg-4" v-for="project in projects" :key="project.id">

              <div class="project-card">

                <!-- HEADER -->
                <div class="card-header-custom">
                  <h6 class="mb-0 fw-semibold">{{ project.name }}</h6>
                  <span class="badge-custom">Project</span>
                </div>

                <!-- BODY -->
                <div class="card-body-custom">

                  <div class="info-row">
                    <i class="fa-solid fa-user-tie"></i>
                    <span><strong>Client ID:</strong> {{ project.client_id }}</span>
                  </div>

                  <div class="description-box">
                    {{ project.description || "Không có mô tả" }}
                  </div>

                  <div class="info-row">
                    <i class="fa-solid fa-calendar"></i>
                  <span>{{ formatDate(project.start_date) }}</span>
                </div>

                <div class="info-row">
                  <i class="fa-solid fa-calendar-check"></i>
                  <span>{{ formatDate(project.end_date) }}</span>
                </div>
              </div>

              <!-- ACTIONS -->
              <div class="card-footer-custom">

                <button class="btn btn-sm btn-outline-primary" @click="openEditModal(project)">
                  <i class="fa-solid fa-pen"></i> 
                </button>

                <button class="btn btn-sm btn-outline-danger me-2" @click="deleteProject(project.id)">
                  <i class="fa-solid fa-trash"></i> 
                </button>

              </div>

            </div>

          </div>
        </div>

        <!-- EMPTY STATE -->
        <div v-if="projects.length === 0" class="empty-state">
          <i class="fa-solid fa-folder-open fa-3x mb-3 text-muted"></i>
          <p class="text-muted">Chưa có project nào.</p>
        </div>

      </div>
    </div>

    <!-- CREATE MODAL -->
  <div class="modal fade" id="createProjectModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">

        <!-- HEADER -->
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fa-solid fa-plus me-2"></i>
            Tạo Project mới
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <!-- BODY -->
        <div class="modal-body">

          <!-- CLIENT ID -->
          <div class="mb-3">
            <label class="form-label">Client ID</label>
            <input v-model="form.client_id" type="number" class="form-control" placeholder="Nhập ID khách hàng">
          </div>

          <!-- NAME -->
          <div class="mb-3">
            <label class="form-label">Tên Project</label>
            <input v-model="form.name" type="text" class="form-control" placeholder="Nhập tên dự án">
          </div>

          <!-- DESCRIPTION -->
          <div class="mb-3">
            <label class="form-label">Mô tả</label>
            <textarea v-model="form.description" rows="3" class="form-control"
              placeholder="Mô tả dự án (không bắt buộc)"></textarea>
          </div>

          <!-- START DATE -->
          <div class="mb-3">
            <label class="form-label">Ngày bắt đầu</label>
            <input v-model="form.start_date" type="date" class="form-control">
          </div>

          <!-- END DATE -->
          <div class="mb-3">
            <label class="form-label">Ngày kết thúc</label>
            <input v-model="form.end_date" type="date" class="form-control">
          </div>

        </div>

        <!-- FOOTER -->
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            Hủy
          </button>

          <button type="button" class="btn btn-primary" @click="createProject">
            <i class="fa-solid fa-check me-1"></i> Lưu
          </button>
        </div>

      </div>
    </div>
  </div>

  <!-- EDIT MODAL -->
  <div class="modal fade" id="editProjectModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">

        <!-- HEADER -->
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fa-solid fa-pen-to-square me-2"></i>
            Cập nhật Project
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <!-- BODY -->
        <div class="modal-body">

          <!-- CLIENT ID -->
          <div class="mb-3">
            <label class="form-label">Client ID</label>
            <input v-model="editForm.client_id" type="number" class="form-control">
          </div>

          <!-- NAME -->
          <div class="mb-3">
            <label class="form-label">Tên Project</label>
            <input v-model="editForm.name" type="text" class="form-control">
          </div>

          <!-- DESCRIPTION -->
          <div class="mb-3">
            <label class="form-label">Mô tả</label>
            <textarea v-model="editForm.description" rows="3" class="form-control"></textarea>
          </div>

          <!-- START -->
          <div class="mb-3">
            <label class="form-label">Ngày bắt đầu</label>
            <input v-model="editForm.start_date" type="date" class="form-control">
          </div>

          <!-- END -->
          <div class="mb-3">
            <label class="form-label">Ngày kết thúc</label>
            <input v-model="editForm.end_date" type="date" class="form-control">
          </div>

        </div>

        <!-- FOOTER -->
        <div class="modal-footer">

          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            Hủy
          </button>

          <button type="button" class="btn btn-primary" @click="updateProject">
            <i class="fa-solid fa-check me-1"></i>
            Cập nhật
          </button>

        </div>

      </div>
    </div>
  </div>
  </AppLayout>
</template>

<script>
import api from "@/core/baseRequest";
import AppLayout from "@/components/Common/AppLayout.vue";

export default {
  name: "ProjectList",

  components: {
    AppLayout,
  },

  data() {
    return {
      projects: [],
      form: {
        client_id: "",
        name: "",
        description: "",
        start_date: "",
        end_date: "",
      },
      editForm: {
        id: "",
        client_id: "",
        name: "",
        description: "",
        start_date: "",
        end_date: "",
      }
    };
  },

  mounted() {
    this.loadProjects();
  },

  methods: {
    async loadProjects() {
      const res = await api.get("projects");
      this.projects = res.data.data;
    },

    formatDate(date) {
      if (!date) return "-";
      return date.split("T")[0];
    },

    async deleteProject(id) {
      if (!confirm("Bạn có chắc muốn xóa project này?")) return;
      await api.delete("projects/delete/" + id);
      this.loadProjects();
    },
    async createProject() {
      try {
        const res = await api.post("projects/create", this.form);

        // Đóng modal
        const modal = bootstrap.Modal.getInstance(document.getElementById("createProjectModal"));
        modal.hide();

        alert("Đã tạo project thành công!");

        // Reset form
        this.form = {
          client_id: "",
          name: "",
          description: "",
          start_date: "",
          end_date: "",
        };

        this.loadProjects(); // Load lại danh sách
      } catch (err) {
        console.log(err);
        alert("Tạo project thất bại!");
      }
    },
    openEditModal(project) {
      this.editForm = {
        id: project.id,
        client_id: project.client_id,
        name: project.name,
        description: project.description,
        start_date: project.start_date,
        end_date: project.end_date,
      };

      // Mở modal
      let modal = new bootstrap.Modal(document.getElementById("editProjectModal"));
      modal.show();
    },
    async updateProject() {
      try {
        const res = await api.post("projects/update/" + this.editForm.id, this.editForm);

        // đóng modal
        const modal = bootstrap.Modal.getInstance(document.getElementById("editProjectModal"));
        modal.hide();

        alert("Cập nhật project thành công!");

        this.loadProjects(); // reload list
      } catch (err) {
        console.log(err);
        alert("Cập nhật thất bại!");
      }
    }

  }
};
</script>

<style scoped>
/* HEADER - Đơn giản & nhỏ gọn */
.page-header {
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.subtitle {
  font-size: 0.875rem;
}

/* CARD - Thiết kế tối giản */
.project-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.project-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-header-custom {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge-custom {
  background: #eff6ff;
  color: #3b82f6;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.card-body-custom {
  padding: 1rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.625rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.info-row i {
  width: 16px;
  color: #9ca3af;
}

.description-box {
  background: #f9fafb;
  padding: 0.625rem;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
  min-height: 3rem;
  max-height: 3.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-footer-custom {
  padding: 0.75rem 1rem;
  background: #f9fafb;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

/* BUTTONS - Outline style */
.btn-outline-primary {
  border-width: 1px;
}

.btn-outline-primary:hover {
  background: #3b82f6;
  border-color: #3b82f6;
}

.btn-outline-danger:hover {
  background: #ef4444;
  border-color: #ef4444;
}

.btn-outline-secondary:hover {
  background: #6b7280;
  border-color: #6b7280;
}

/* EMPTY STATE */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

/* MODAL */
.modal-header {
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 1.25rem;
}

.modal-footer {
  border-top: 1px solid #e5e7eb;
  padding: 1rem 1.25rem;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.375rem;
}
</style>