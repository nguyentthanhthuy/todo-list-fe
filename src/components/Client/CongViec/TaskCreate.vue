<template>
  <div class="task-page container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-xl-10">

        <!-- Header -->
        <div class="page-header mb-4">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <router-link to="/cong-viec" class="breadcrumb-item">
                <a href="#"><i class="fa-solid fa-home"></i> Trang chủ</a>
              </router-link>
              <li class="breadcrumb-item active">Tạo mới</li>
            </ol>
          </nav>

          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-1">
                <i class="fa-solid fa-tasks text-primary me-2"></i>
                Tạo công việc mới
              </h2>
              <p class="text-muted mb-0">Quản lý và theo dõi tiến độ công việc</p>
            </div>

            <router-link to="/cong-viec" class="btn btn-outline-primary">
              <i class="fa-solid fa-arrow-left me-2"></i> Quay lại
            </router-link>
          </div>
        </div>

        <!-- FORM -->
        <form @submit.prevent="handleSubmit">
          <div class="row g-4">

            <!-- LEFT COLUMN -->
            <div class="col-lg-8">

              <!-- BASIC INFO -->
              <div class="card shadow-sm mb-4">
                <div class="card-header bg-white border-bottom">
                  <h5 class="mb-0">
                    <i class="fa-solid fa-circle-info text-primary me-2"></i>
                    Thông tin cơ bản
                  </h5>
                </div>

                <div class="card-body p-4">

                  <!-- Title -->
                  <div class="mb-4">
                    <label class="form-label fw-semibold">Tên công việc *</label>
                    <input type="text" class="form-control form-control-lg" v-model="task.title" required />
                  </div>

                  <!-- Description -->
                  <div class="mb-4">
                    <label class="form-label fw-semibold">Mô tả</label>
                    <textarea class="form-control" rows="5" v-model="task.description"></textarea>
                  </div>

                  <!-- Project -->
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Dự án *</label>
                    <select v-model="task.project_id" class="form-select" required>
                      <option value="">-- Chọn dự án --</option>
                      <option v-for="p in projects" :key="p.id" :value="p.id">
                        {{ p.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- PROGRESS -->
              <div class="card shadow-sm mb-4">
                <div class="card-header bg-white border-bottom">
                  <h5 class="mb-0">
                    <i class="fa-solid fa-chart-line text-success me-2"></i> Tiến độ
                  </h5>
                </div>

                <div class="card-body p-4">
                  <div class="row align-items-center">
                    <div class="col-md-3">
                      <label class="form-label fw-semibold">Tiến độ (%)</label>
                      <input type="number" class="form-control form-control-lg text-center" min="0" max="100"
                        v-model.number="task.progress" />
                    </div>

                    <div class="col-md-9">
                      <label class="form-label fw-semibold mb-2">Thanh tiến độ</label>
                      <div class="progress" style="height: 30px">
                        <div class="progress-bar progress-bar-striped" :class="getProgressColor(task.progress)"
                          :style="{ width: task.progress + '%' }">
                          {{ task.progress }}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ASSIGNEE -->
              <div class="card shadow-sm">
                <div class="card-header bg-white border-bottom">
                  <h5 class="mb-0">
                    <i class="fa-solid fa-users text-info me-2"></i> Phân công
                  </h5>
                </div>

                <div class="card-body p-4">
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Người thực hiện</label>
                    <select v-model="task.assignee_id" class="form-select">
                      <option value="">-- Chọn --</option>
                      <option v-for="u in clients" :key="u.id" :value="u.id">
                        {{ u.ho_va_ten }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            <!-- RIGHT COLUMN -->
            <div class="col-lg-4">

              <div class="card shadow-sm mb-4 sticky-top" style="top:20px">
                <div class="card-header bg-white border-bottom">
                  <h5 class="mb-0">
                    <i class="fa-solid fa-sliders text-warning me-2"></i> Thuộc tính
                  </h5>
                </div>

                <div class="card-body p-4">

                  <!-- Status -->
                  <div class="mb-4">
                    <label class="form-label fw-semibold">Trạng thái</label>
                    <select v-model="task.status" class="form-select form-select-lg">
                      <option value="Chưa bắt đầu">Chưa bắt đầu</option>
                      <option value="Đang thực hiện">Đang thực hiện</option>
                      <option value="Hoàn thành">Hoàn thành</option>
                      <option value="Trì hoãn">Trì hoãn</option>
                      <option value="Hủy bỏ">Hủy bỏ</option>
                    </select>
                  </div>

                  <!-- Priority -->
                  <div class="mb-4">
                    <label class="form-label fw-semibold">Độ ưu tiên</label>
                    <select v-model="task.priority" class="form-select">
                      <option>Thấp</option>
                      <option>Trung bình</option>
                      <option>Cao</option>
                      <option>Khẩn cấp</option>
                    </select>
                  </div>

                  <!-- Deadline -->
                  <div class="mb-4">
                    <label class="form-label fw-semibold">Hạn chót</label>
                    <input type="date" v-model="task.due_date" class="form-control" />
                  </div>

                  <!-- Estimated time -->
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Thời gian ước tính</label>
                    <div class="input-group">
                      <input type="number" v-model="task.estimated_hours" class="form-control" min="0" />
                      <span class="input-group-text">giờ</span>
                    </div>
                  </div>

                  <!-- Tags -->
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Nhãn</label>
                    <input type="text" class="form-control" v-model="task.tags" />
                  </div>

                </div>
              </div>

            </div>

          </div>

          <!-- ACTION BUTTONS -->
          <div class="row mt-4">
            <div class="col-12">
              <div class="card shadow-sm">
                <div class="card-body p-4 d-flex justify-content-between">

                  <div>
                    <button type="button" class="btn btn-outline-secondary me-2" @click="handleReset">
                      Làm mới
                    </button>

                    <button type="button" class="btn btn-outline-danger" @click="handleCancel">
                      Hủy bỏ
                    </button>
                  </div>

                  <div>
                    <button type="submit" class="btn btn-primary btn-lg px-5">
                      Tạo công việc
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
  </div>
</template>

<script>
import api from "@/core/baseRequest";

export default {
  name: "TaskCreate",

  data() {
    return {
      projects: [],
      clients: [],
      task: {
        project_id: "",
        title: "",
        description: "",
        priority: "Trung bình",
        status: "Chưa bắt đầu",
        progress: 0,
        due_date: "",
        assignee_id: "",
        estimated_hours: "",
        tags: "",
      }
    };
  },

  mounted() {
    this.loadProjects();
    this.loadUsers();
  },

  methods: {
    async loadProjects() {
      const res = await api.get("projects/list");
      this.projects = res.data.data;
    },

    async loadUsers() {
      const res = await api.get("clients/list");
      this.clients = res.data.data;
    },

    async handleSubmit() {
      try {
        await api.post("tasks/create", this.task);
        alert("Tạo mới thành công!");
        this.$router.push("/cong-viec");
      } catch (err) {
        alert("❌ Lỗi: " + err.response.data.message);
      }
    },

    handleReset() {
      if (confirm("Làm mới form?")) {
        Object.assign(this.$data.task, this.$options.data().task);
      }
    },

    handleCancel() {
      this.$router.push("/cong-viec");
    },

    getProgressColor(p) {
      if (p < 30) return "bg-danger";
      if (p < 60) return "bg-warning";
      if (p < 90) return "bg-info";
      return "bg-success";
    }
  }
};
</script>

<style scoped>
.task-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.page-header h2 {
  font-weight: 600;
  color: #2c3e50;
}

.card {
  border: none;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.card-header {
  border-top-left-radius: 12px !important;
  border-top-right-radius: 12px !important;
  padding: 1rem 1.5rem;
}

.card-header h5 {
  font-weight: 600;
  font-size: 1.1rem;
}

.form-label {
  color: #495057;
  margin-bottom: 0.5rem;
}

.form-control:focus,
.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
}

.form-control-lg {
  font-size: 1.1rem;
  padding: 0.75rem 1rem;
}

.progress {
  border-radius: 8px;
  background-color: #e9ecef;
}

.progress-bar {
  border-radius: 8px;
  font-weight: 600;
  transition: width 0.6s ease;
}

.badge {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 6px;
}

.btn {
  border-radius: 8px;
  padding: 0.5rem 1.25rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-lg {
  padding: 0.75rem 2rem;
  font-size: 1rem;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.breadcrumb {
  background-color: transparent;
  padding: 0;
  margin-bottom: 1rem;
}

.breadcrumb-item a {
  color: #6c757d;
  text-decoration: none;
}

.breadcrumb-item a:hover {
  color: #0d6efd;
}

.breadcrumb-item.active {
  color: #495057;
  font-weight: 500;
}

.sticky-top {
  position: sticky;
  z-index: 1020;
}

.bg-light {
  background-color: #f8f9fa !important;
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fadeIn 0.5s ease-out;
}

/* Responsive */
@media (max-width: 991px) {
  .sticky-top {
    position: relative !important;
  }
}

@media (max-width: 767px) {
  .page-header .d-flex {
    flex-direction: column;
    gap: 1rem;
  }

  .btn-lg {
    width: 100%;
  }

  .card-body.p-4 {
    padding: 1.5rem !important;
  }
}
</style>
