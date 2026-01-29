<template>
  <div class="container-fluid p-4">
    <!-- Tiêu đề -->
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h4 class="fw-bold mb-0">
        <i class="fa-brands fa-google-drive text-success me-2"></i>
        Drive của tôi
        <i class="fa-solid fa-caret-down ms-1"></i>
      </h4>
      <router-link to="/driver/upload" class="btn btn-primary">
        <i class="fa-solid fa-cloud-arrow-up me-1"></i> Tải lên
      </router-link>
    </div>

    <!-- Tabs -->
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <a class="nav-link" :class="{ active: tab === 'my-drive' }" @click="tab = 'my-drive'">
          <i class="fa-solid fa-folder text-warning me-1"></i> Drive của tôi
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: tab === 'shared' }" @click="tab = 'shared'">
          <i class="fa-solid fa-share-nodes me-1"></i> Được chia sẻ với tôi
        </a>
      </li>
    </ul>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
      <div class="mt-3">Đang tải...</div>
    </div>

    <!-- Nội dung -->
    <div v-else>
      <!-- DRIVE CỦA TÔI -->
      <div v-if="tab === 'my-drive'">
        <!-- Thư mục -->
        <div v-if="folders.length" class="mb-4">
          <h6 class="fw-bold text-muted mb-3">Thư mục</h6>
          <div class="d-flex flex-wrap gap-3">
            <div class="folder-card text-center" v-for="folder in folders" :key="folder.id" @click="openFile(folder)">
              <div class="folder-thumb">
                <i class="fa-solid fa-folder text-warning"></i>
              </div>
              <div class="small mt-2 text-truncate">{{ folder.name }}</div>
            </div>
          </div>
        </div>

        <!-- Tệp -->
        <div>
          <h6 class="fw-bold text-muted mb-3">Tệp</h6>
          <div class="row g-3">
            <div class="col-6 col-sm-4 col-md-3 col-lg-2" v-for="file in files" :key="file.id">
              <div class="file-card">
                <div class="file-thumb" @click="openFile(file)">
                  <i class="fa-solid" :class="getFileIcon(file.mimeType)"></i>
                </div>
                <div class="small text-truncate mt-2">{{ file.name }}</div>
                <div class="file-menu">
                  <button class="btn btn-sm btn-light" @click.stop="downloadFile(file)">
                    <i class="fa-solid fa-download"></i>
                  </button>
                  <button class="btn btn-sm btn-light" @click.stop="shareFile(file)">
                    <i class="fa-solid fa-share-nodes text-primary"></i>
                  </button>
                  <button class="btn btn-sm btn-light text-danger" @click.stop="deleteFile(file)">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FILE ĐƯỢC CHIA SẺ VỚI TÔI -->
      <div v-if="tab === 'shared'">
        <h6 class="fw-bold text-muted mb-3">Được chia sẻ với tôi</h6>
        <div class="row g-3">
          <div class="col-6 col-sm-4 col-md-3 col-lg-2" v-for="file in sharedFiles" :key="file.id">
            <div class="file-card">
              <div class="file-thumb" @click="openFile(file)">
                <i class="fa-solid" :class="getFileIcon(file.mimeType)"></i>
              </div>
              <div class="small text-truncate mt-2">{{ file.name }}</div>
              <div class="file-menu">
                <button class="btn btn-sm btn-light" @click.stop="downloadFile(file)">
                  <i class="fa-solid fa-download"></i>
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
import api from "@/plugins/axios";

export default {
  name: "DrivePage",
  data() {
    return {
      tab: "my-drive",
      files: [],
      folders: [],
      sharedFiles: [],
      loading: false,
    };
  },
  mounted() {
    this.loadFiles();
  },
  methods: {
    async loadFiles() {
      this.loading = true;
      try {
        const res = await api.get("/google/driver/list", {
          headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` }
        });
        if (res.data.status) {
          this.folders = res.data.data.filter(f => f.mimeType === "application/vnd.google-apps.folder");
          this.files = res.data.data.filter(f => f.mimeType !== "application/vnd.google-apps.folder");
        } else alert(res.data.message || "Không tải được file");
      } catch (err) {
        console.error("Load files error:", err);
        if (err.response?.status === 401) {
          alert("Phiên đăng nhập hết hạn, vui lòng login lại.");
          this.$router.push("/login");
        } else alert("Không tải được file, kiểm tra console");
      }
      this.loading = false;
    },

    async loadShared() {
      this.loading = true;
      try {
        const res = await api.get("/google/driver/share", {
          headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` }
        });
        if (res.data.status) this.sharedFiles = res.data.data;
        else alert(res.data.message || "Không tải được file chia sẻ");
      } catch (err) {
        console.error("Load shared error:", err);
        if (err.response?.status === 401) {
          alert("Phiên đăng nhập hết hạn, vui lòng login lại.");
          this.$router.push("/login");
        } else alert("Không tải được file chia sẻ, kiểm tra console");
      }
      this.loading = false;
    },

    openFile(file) {
      if (file.webViewLink) window.open(file.webViewLink, "_blank");
      else alert("File không có link để mở");
    },

    getFileIcon(type) {
      if (type.includes("pdf")) return "fa-file-pdf text-danger";
      if (type.includes("word")) return "fa-file-word text-primary";
      if (type.includes("sheet") || type.includes("excel")) return "fa-file-excel text-success";
      if (type.includes("image")) return "fa-file-image text-warning";
      return "fa-file text-muted";
    },

    async downloadFile(file) {
      try {
        const token = localStorage.getItem("auth_token");
        const url = `http://localhost:8000/api/google/driver/download/${file.id}`;
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Không thể tải file");
        const blob = await res.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = file.name;
        link.click();
        URL.revokeObjectURL(link.href);
      } catch (err) {
        console.error("Download error:", err);
        alert("Tải file thất bại!");
      }
    },

    async deleteFile(file) {
      if (!confirm(`Bạn có chắc muốn xóa "${file.name}"?`)) return;
      try {
        const res = await api.delete(`/google/driver/delete/${file.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` }
        });
        if (res.data.status) {
          alert("Đã xóa file thành công!");
          this.loadFiles();
        } else alert(res.data.message);
      } catch (err) {
        console.error("Delete error:", err.response?.data || err);
        if (err.response?.status === 401) {
          alert("Phiên đăng nhập hết hạn, vui lòng login lại.");
          this.$router.push("/login");
        } else alert(err.response?.data?.message || "Xóa file thất bại!");
      }
    },

    async shareFile(file) {
      const email = prompt("Nhập email muốn chia sẻ:");
      if (!email) return;
      try {
        const res = await api.post("/google/driver/share", { file_id: file.id, email }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` }
        });
        alert(res.data.message || "Đã chia sẻ thành công!");
      } catch (err) {
        console.error("Share error:", err.response?.data || err);
        if (err.response?.status === 401) {
          alert("Phiên đăng nhập hết hạn, vui lòng login lại.");
          this.$router.push("/login");
        } else alert("Chia sẻ thất bại!");
      }
    },
  },
  watch: {
    tab(val) {
      if (val === "shared") this.loadShared();
      else if (val === "my-drive") this.loadFiles();
    }
  }
};
</script>

<style scoped>
.folder-card {
  width: 130px;
  background: #f8f9fa;
  border-radius: 10px;
  padding: 15px 10px;
  cursor: pointer;
  transition: .2s;
}

.folder-card:hover {
  background: #e9f2ff;
}

.folder-thumb i {
  font-size: 2.3rem;
}

.file-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  position: relative;
  cursor: pointer;
  transition: .2s;
}

.file-card:hover {
  box-shadow: 0 3px 10px rgba(0, 0, 0, .1);
}

.file-thumb i {
  font-size: 2.5rem;
}

.file-menu {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 3px;
  opacity: 0;
  transition: .2s;
}

.file-card:hover .file-menu {
  opacity: 1;
}
</style>
