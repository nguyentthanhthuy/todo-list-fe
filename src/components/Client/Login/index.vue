<template>
  <div class="login-page d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <div class="card shadow-lg border-0 rounded-4 p-4" style="max-width: 420px; width: 100%;">
      <div class="text-center mb-4">
        <h4 class="mt-2 fw-bold text-primary">ĐĂNG NHẬP</h4>
      </div>

      <!-- Form đăng nhập -->
      <form @submit.prevent="DangNhap">
        <div class="mb-3">
          <label class="form-label fw-semibold">Email</label>
          <input v-model="user.email" type="email" class="form-control rounded-pill py-2"
            placeholder="Nhập email của bạn" required />
        </div>
        <div class="mb-3">
          <label class="form-label fw-semibold">Mật khẩu</label>
          <input v-model="user.password" type="password" class="form-control rounded-pill py-2"
            placeholder="Nhập mật khẩu" required />
        </div>

        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="rememberMe" />
            <label for="rememberMe" class="form-check-label small text-muted">Ghi nhớ đăng nhập</label>
          </div>
          <a href="#" class="text-primary small text-decoration-none">Quên mật khẩu?</a>
        </div>

        <button type="submit" class="btn btn-primary w-100 rounded-pill py-2 fw-semibold">
          <i class="fas fa-sign-in-alt me-2"></i>Đăng nhập
        </button>
      </form>

      <!-- Hoặc đăng nhập bằng -->
      <div class="text-center mt-4 mb-2">
        <span class="text-muted small">Hoặc đăng nhập bằng</span>
      </div>

      <div class="social-login d-flex flex-column gap-3 mt-4">
        <button @click="loginWithGoogle"
          class="btn-social w-100 border rounded-pill py-2 d-flex align-items-center justify-content-center gap-2">
          <span class="fw-semibold text-dark"><i class="fa-brands fa-google"></i> Continue with Google</span>
        </button>

        <button
          class="btn-social w-100 border rounded-pill py-2 d-flex align-items-center justify-content-center gap-2">
          <span class="fw-semibold text-dark"><i class="fa-brands fa-facebook-f"></i> Continue with Facebook</span>
        </button>

        <button
          class="btn-social w-100 border rounded-pill py-2 d-flex align-items-center justify-content-center gap-2">
          <span class="fw-semibold text-dark"><i class="fa-brands fa-apple"></i> Continue with Apple</span>
        </button>
      </div>

      <div class="text-center mt-4">
        <p class="text-muted small mb-0">
          Chưa có tài khoản?
          <router-link to="/dang-ky" href="#" class="text-primary fw-semibold text-decoration-none">Đăng ký ngay</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginPage',
  data() {
    return {
      user: {
        email: '',
        password: ''
      }
    };
  },
  methods: {
    async DangNhap() {
      try {
        const res = await axios.post('http://localhost:8000/api/login', this.user);

        if (res?.data?.status) {
          alert(res.data.message || "Đăng nhập thành công!");
          localStorage.setItem("auth_token", res.data.token);
          localStorage.setItem('ho_va_ten', res.data.ho_va_ten);
          this.user = { email: '', password: '' };
          this.$router.push('/');
        } else {
          alert(res?.data?.message || "Đăng nhập thất bại!");
        }

      } catch (err) {
        const errors = err?.res?.data?.errors;
        if (errors) {
          Object.values(errors).forEach(errorArr => {
            if (errorArr?.length) alert(errorArr[0]);
          });
        } else {
          alert(err?.res?.data?.message || "Đăng nhập thất bại, vui lòng thử lại!");
        }
      }
    },

    loginWithGoogle() {
      window.location.href = "http://localhost:8000/api/auth/google";
    },

    async handleGoogleCallback(email) {


      try {
        const res = await axios.post('http://localhost:8000/api/auth/google/callback', { email });

        if (res?.data?.status) {
          // Lưu token và tên người dùng
          localStorage.setItem("auth_token", res.data.token);
          localStorage.setItem('ho_va_ten', res.data.ho_va_ten);
          alert(res.data.message || "Đăng nhập Google thành công!");
          this.$router.push('/');
        } else {
          alert(res?.data?.message || "Email không tồn tại trong hệ thống!");
        }
      } catch (err) {
        alert(err?.res?.data?.message || "Đăng nhập Google thất bại!");
      }
    }
  }

};
</script>

<style scoped>
.login-page {
  background: linear-gradient(135deg, #f3f5ff, #ffffff);
}

.card {
  background: #fff;
  animation: fadeIn 0.6s ease-in-out;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}

.btn-outline-primary:hover {
  background-color: #0d6efd;
  color: white;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  color: white;
}

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
</style>
