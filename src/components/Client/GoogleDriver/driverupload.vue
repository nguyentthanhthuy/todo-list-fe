<template>
  <div class="container py-4">
    <h4 class="fw-bold mb-3">⬆️ Upload File lên Google Drive</h4>

    <div class="card p-3 mb-4 shadow-sm">
      <label class="fw-semibold mb-2">Chọn thư mục Google Drive (tùy chọn)</label>
      <input v-model="folderId" type="text" class="form-control" placeholder="Folder ID (tùy chọn)" />
    </div>

    <div class="card p-4 text-center">
      <input ref="fileInput" type="file" class="form-control mb-3" @change="onFileChange" />
      <button class="btn btn-success w-100" :disabled="!file" @click="uploadFile">
        <i class="fa-solid fa-cloud-arrow-up me-2"></i> Upload
      </button>

      <div v-if="uploadStatus" class="alert mt-3"
        :class="{ 'alert-success': uploadStatus.includes('thành công'), 'alert-warning': uploadStatus.includes('⚠️'), 'alert-danger': uploadStatus.includes('thất bại') }">
        {{ uploadStatus }}
      </div>

      <router-link to="/driver" class="btn btn-link mt-3">⬅️ Quay lại Drive</router-link>
    </div>
  </div>
</template>

<script>
import api from "@/plugins/axios";

export default {
  data() { return { file: null, folderId: "root", uploadStatus: "" }; },
  methods: {
    onFileChange(e) { this.file = e.target.files[0]; },
    async uploadFile() {
      if (!this.file) { this.uploadStatus = "⚠️ Chưa chọn file."; return; }
      const token = localStorage.getItem("auth_token");
      if (!token) { this.uploadStatus = "Chưa đăng nhập"; this.$router.push("/login"); return; }

      const formData = new FormData();
      formData.append("file", this.file);
      formData.append("folder_id", this.folderId || "root");

      try {
        const res = await api.post("/google/driver/upload", formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
        });
        if (res.data.status) {
          this.uploadStatus = "Upload thành công!";
          this.file = null;
          this.$refs.fileInput.value = "";
          setTimeout(() => this.uploadStatus = "", 3000);
        } else this.uploadStatus = "⚠️ " + res.data.message;
      } catch (err) {
        console.error("Upload error:", err.response?.data || err);
        if (err.response?.status === 401) {
          alert("Phiên đăng nhập hết hạn");
          this.$router.push("/login");
        } else this.uploadStatus = "Upload thất bại, xem console.";
      }
    }
  }
};
</script>
