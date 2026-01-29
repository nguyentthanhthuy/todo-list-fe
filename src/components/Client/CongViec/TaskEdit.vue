<template>
  <div class="task-page container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-xl-10">

        <!-- HEADER -->
        <div class="page-header mb-4">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <router-link to="/cong-viec" class="breadcrumb-item">
                <a href="#"><i class="fa-solid fa-home"></i> Trang chủ</a>
              </router-link>
              <li class="breadcrumb-item active">Chỉnh sửa</li>
            </ol>
          </nav>

          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2 class="mb-1">
                <i class="fa-solid fa-edit text-warning me-2"></i>
                Chỉnh sửa công việc
              </h2>
              <p class="text-muted mb-0">Cập nhật thông tin công việc</p>
            </div>

            <router-link to="/cong-viec" class="btn btn-outline-primary">
              <i class="fa-solid fa-arrow-left me-2"></i> Quay lại
            </router-link>
          </div>
        </div>

        <!-- FORM -->
        <form @submit.prevent="handleUpdate">
          <div class="row g-4">

            <!-- LEFT -->
            <div class="col-lg-8">

              <!-- Thông tin cơ bản -->
              <div class="card shadow-sm mb-4">
                <div class="card-header bg-white border-bottom">
                  <h5 class="mb-0">
                    <i class="fa-solid fa-circle-info text-primary me-2"></i>
                    Thông tin cơ bản
                  </h5>
                </div>

                <div class="card-body p-4">

                  <div class="mb-4">
                    <label class="form-label fw-semibold">Tên công việc *</label>
                    <input type="text" class="form-control form-control-lg" v-model="task.title" required />
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-semibold">Mô tả</label>
                    <textarea class="form-control" rows="5" v-model="task.description"></textarea>
                  </div>

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

              <!-- Tiến độ -->
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
                      <input type="number" min="0" max="100" class="form-control form-control-lg text-center"
                        v-model.number="task.progress" />
                    </div>

                    <div class="col-md-9">
                      <label class="form-label fw-semibold mb-2">Thanh tiến độ</label>
                      <div class="progress" style="height: 30px">
                        <div class="progress-bar progress-bar-striped"
                          :class="getProgressColor(task.progress)"
                          :style="{ width: task.progress + '%' }">
                          {{ task.progress }}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Người thực hiện -->
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

            <!-- RIGHT -->
            <div class="col-lg-4">

              <div class="card shadow-sm mb-4 sticky-top" style="top:20px">
                <div class="card-header bg-white border-bottom">
                  <h5 class="mb-0">
                    <i class="fa-solid fa-sliders text-warning me-2"></i> Thuộc tính
                  </h5>
                </div>

                <div class="card-body p-4">

                  <div class="mb-4">
                    <label class="form-label fw-semibold">Trạng thái</label>
                    <select v-model="task.status" class="form-select form-select-lg">
                      <option>Chưa bắt đầu</option>
                      <option>Đang thực hiện</option>
                      <option>Hoàn thành</option>
                      <option>Trì hoãn</option>
                      <option>Hủy bỏ</option>
                    </select>
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-semibold">Độ ưu tiên</label>
                    <select v-model="task.priority" class="form-select">
                      <option>Thấp</option>
                      <option>Trung bình</option>
                      <option>Cao</option>
                      <option>Khẩn cấp</option>
                    </select>
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-semibold">Hạn chót</label>
                    <input type="date" v-model="task.due_date" class="form-control" />
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-semibold">Thời gian ước tính</label>
                    <div class="input-group">
                      <input type="number" v-model="task.estimated_hours" class="form-control" min="0" />
                      <span class="input-group-text">giờ</span>
                    </div>
                  </div>

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

                  <button type="button" class="btn btn-outline-danger" @click="cancelEdit">
                    Hủy chỉnh sửa
                  </button>

                  <button type="submit" class="btn btn-primary btn-lg px-5">
                    Cập nhật công việc
                  </button>

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
  name: "EditTask",

  data() {
    return {
      task: {},
      projects: [],
      clients: []
    };
  },

  mounted() {
    this.loadProjects();
    this.loadUsers();
    this.loadDetail();
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

    async loadDetail() {
      const id = this.$route.params.id;
      const res = await api.get("tasks/detail/" + id);
      this.task = res.data.data;
    },

    async handleUpdate() {
      try {
        await api.put("tasks/update/" + this.$route.params.id, this.task);
        alert("Cập nhật thành công!");
        this.$router.push("/cong-viec");
      } catch (err) {
        alert("❌ Lỗi: " + err.response.data.message);
      }
    },

    cancelEdit() {
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
