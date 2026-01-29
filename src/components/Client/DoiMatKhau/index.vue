<template>
  <div class="reset-wrapper d-flex justify-content-center align-items-center">
    <div class="reset-card shadow-lg">

      <!-- Logo -->
      <div class="text-center mb-4">
        <img src="../../../assets/assets/images/login-images/logo_wordbuddy.png" class="logo" alt="logo" />
        <h3 class="mt-3 fw-bold">Đặt lại mật khẩu</h3>
        <p class="text-muted">Nhập mật khẩu mới để hoàn tất</p>
      </div>

      <!-- Form -->
      <div>
        <!-- Mật khẩu mới -->
        <div class="form-group mb-3">
          <label class="form-label fw-semibold">Mật khẩu mới</label>
          <div class="password-group">
            <input 
              :type="showPass ? 'text' : 'password'"
              v-model="form.password"
              class="form-control"
              placeholder="Nhập mật khẩu mới"
            >
            <i 
              class="fa-solid"
              :class="showPass ? 'fa-eye-slash' : 'fa-eye'"
              @click="showPass = !showPass"
            ></i>
          </div>
        </div>

        <!-- Xác nhận mật khẩu -->
        <div class="form-group mb-4">
          <label class="form-label fw-semibold">Xác nhận mật khẩu</label>
          <div class="password-group">
            <input 
              :type="showPassConfirm ? 'text' : 'password'"
              v-model="form.password_confirmation"
              class="form-control"
              placeholder="Nhập lại mật khẩu"
            >
            <i 
              class="fa-solid"
              :class="showPassConfirm ? 'fa-eye-slash' : 'fa-eye'"
              @click="showPassConfirm = !showPassConfirm"
            ></i>
          </div>
        </div>

        <!-- Buttons -->
        <button class="btn btn-primary w-100 py-2 mb-3" @click="doiMatKhauClient">
          <i class="fa-solid fa-key me-2"></i> Thay đổi mật khẩu
        </button>

        <router-link to="/login" class="btn btn-outline-secondary w-100">
          <i class="fa-solid fa-arrow-left me-1"></i> Quay lại trang chủ
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import baseRequestClient from "../../../core/baseRequestClient";

export default {
  data() {
    return {
      form: {
        password: "",
        password_confirmation: "",
      },
      showPass: false,
      showPassConfirm: false,
    };
  },

  methods: {
    doiMatKhauClient() {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        alert("Bạn chưa đăng nhập!");
        this.$router.push("/login");
        return;
      }

      // Validate đơn giản trước khi gửi BE
      if (!this.form.password || !this.form.password_confirmation) {
        alert("Vui lòng nhập đầy đủ các trường!");
        return;
      }
      if (this.form.password.length < 6) {
        alert("Mật khẩu phải tối thiểu 6 ký tự!");
        return;
      }
      if (this.form.password !== this.form.password_confirmation) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
      }

      baseRequestClient
        .post("client/doi-mat-khau", this.form, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          alert(res.data.message || "Đổi mật khẩu thành công!");
          this.$router.push("/login");
        })
        .catch((err) => {
          if (err.response?.data?.errors) {
            Object.values(err.response.data.errors).forEach((e) => alert(e[0]));
          } else {
            alert(err.response?.data?.message || "Lỗi không xác định!");
          }
        });
    },
  },
};
</script>

<style scoped>
.reset-wrapper {
  height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.reset-card {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 16px;
  padding: 35px 30px;
}

.logo {
  width: 160px;
}

.password-group {
  position: relative;
}

.password-group i {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #666;
}

.password-group i:hover {
  color: #000;
}
</style>
