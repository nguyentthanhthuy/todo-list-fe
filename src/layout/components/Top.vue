<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-2">
    <div class="container-fluid">
      <!-- Logo -->
      <router-link to="/" class="navbar-brand d-flex align-items-center gap-2">
      <span class="logo-text">WorkBuddy</span>
    </router-link>

      <!-- Nút toggle trên mobile -->
      <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse"
      data-bs-target="#mainNavbar">
      <i class="fas fa-bars"></i>
    </button>

      <!-- Menu chính -->
      <div class="collapse navbar-collapse" id="mainNavbar">
        <ul class="navbar-nav mx-auto mb-2 mb-lg-0 nav-main-menu">
          <li class="nav-item">
          <router-link class="nav-link nav-link-custom" to="/">
            <i class="fas fa-home"></i>
            Trang chủ
          </router-link>
        </li>
          <li class="nav-item">
          <router-link class="nav-link nav-link-custom" to="/cong-viec">
            <i class="fas fa-tasks"></i>
            Công việc
          </router-link>
        </li>
          <li class="nav-item">
          <router-link class="nav-link nav-link-custom" to="/lich">
            <i class="fas fa-briefcase"></i>
            Lịch
          </router-link>
        </li>
          <li class="nav-item">
          <router-link class="nav-link nav-link-custom" to="/dashboard">
            <i class="fas fa-chart-line"></i>
            Báo cáo
          </router-link>
        </li>
        </ul>
        <!-- User Dropdown khi đã đăng nhập -->
        <div v-if="isLoggedIn" class="user-box dropdown">
          <a class="d-flex align-items-center nav-link dropdown-toggle dropdown-toggle-nocaret" href="#" role="button"
            data-bs-toggle="dropdown" aria-expanded="false">
            <img :src="userProfile.avatar || '../../../assets/images/avatars/avatar-1.png'"
              class="user-img rounded-circle border border-2 border-primary" alt="user avatar"
              style="width: 40px; height: 40px; object-fit: cover;">
            <div class="user-info ps-3">
              <p class="user-name mb-0 fw-semibold text-dark">{{ userProfile.ho_va_ten || 'Người dùng' }}</p>
              <small class="text-muted">{{ userProfile.email || '' }}</small>
            </div>
          </a>
          <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0">
            <li>
              <router-link to="/profile" class="dropdown-item">
                <i class="fas fa-user-circle me-2 text-primary"></i>
                <span>Thông tin cá nhân</span>
              </router-link>
            </li>

            <li>
              <router-link to="/doi-mat-khau" class="dropdown-item">
                <i class="fa-solid fa-key me-2 text-secondary"></i>
                <span>Đổi mật khẩu</span>
              </router-link>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>
            <li>
              <a class="dropdown-item text-danger" href="javascript:;" @click="logout()">
                <i class="fas fa-sign-out-alt me-2 text-danger"></i>
                <span>Đăng xuất</span>
              </a>
            </li>
            <li>
              <a class="dropdown-item text-danger" href="javascript:;" @click="logoutAll()">
                <i class="fas fa-door-open me-2 text-danger"></i>
                <span>Đăng xuất tất cả</span>
              </a>
            </li>
          </ul>
        </div>
        <!-- 🔒 Chưa đăng nhập -->
        <div v-else class="d-flex gap-2">
          <router-link to="/dang-ky">
            <button class="btn btn-outline-primary rounded-pill px-4">
              <i class="fas fa-user-plus me-2"></i>Đăng ký
            </button>
          </router-link>
          <router-link to="/login">
            <button class="btn btn-primary rounded-pill px-4">
              <i class="fas fa-sign-in-alt me-2"></i>Đăng nhập
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import baseRequestClient from '../../core/baseRequestClient';
export default {
  data() {
    return {
      isLoggedIn: false,
      userProfile: {
        ho_va_ten: '',
        email: '',
        avatar: ''
      }
    }
  },
  mounted() {
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('auth_token');
      if (token) {
        this.isLoggedIn = true;
        this.loadUserProfile();
      } else {
        this.isLoggedIn = false;
      }
    },
    loadUserProfile() {
      baseRequestClient.get('client/profile/data', {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("auth_token"),
        },
      })
        .then(res => {
          if (res.data.status) {
            this.userProfile = res.data.data;
          }
        })
        .catch((err) => {
          alert("Không thể tải thông tin người dùng");
          console.error(err);
        });
    },
    logout() {
      baseRequestClient.post('client/logout', {}, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("auth_token"),
        },
      })
        .then(res => {
          if (res.data.status) {
            this.isLoggedIn = false;
            localStorage.removeItem('auth_token');
            localStorage.removeItem('ho_va_ten');
            alert(res.data.message || "Đăng xuất thành công!");
            this.$router.push('/');
          }
        })
        .catch((err) => {
          alert("Đăng xuất thất bại!");
          console.error(err);
        });
    },
    logoutAll() {
      baseRequestClient.post('client/logout-all', {}, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("auth_token"),
        },
      })
        .then(res => {
          if (res.data.status) {
            this.isLoggedIn = false;
            localStorage.removeItem('auth_token');
            localStorage.removeItem('ho_va_ten');
            alert(res.data.message || "Đăng xuất khỏi tất cả thiết bị!");
            this.$router.push('/');
          }
        })
        .catch((err) => {
          alert("Đăng xuất tất cả thất bại!");
          console.error(err);
        });
    }
  },
  watch: {
    '$route'() {
      this.checkLoginStatus();
    }
  }
}
</script>

<style scoped>
/* Background & tổng thể */
.top-nav {
  background: #ffffff;
  border-bottom: 1px solid #f3f3f3;
}

/* Logo */
.logo-text {
  font-size: 1.7rem;
  font-weight: 700;
  color: #5A4FF3 !important;
  letter-spacing: -0.5px;
  font-family: 'Inter', sans-serif;
}

/* Menu chính */
.nav-main-menu .nav-link-custom {
  font-size: 1rem;
  font-weight: 600;
  color: #4a4a4a;
  display: flex;
  align-items: center;
  gap: .6rem;
  padding: .65rem 1rem;
  transition: all .25s ease;
  font-family: 'Inter', sans-serif;
}

/* Icon trong menu */
.nav-main-menu .nav-link-custom i {
  font-size: 1.1rem;
  color: #6a6a6a;
  transition: all .25s ease;
}

/* Hover effect */
.nav-main-menu .nav-link-custom:hover {
  color: #5A4FF3;
  background: #f7f6ff;
  border-radius: 10px;
}

.nav-main-menu .nav-link-custom:hover i {
  color: #5A4FF3;
}

/* Active link */


/* Nút toggle mobile */
.navbar-toggler i {
  font-size: 1.3rem;
  color: #5A4FF3;
}
.navbar-nav .nav-link {
  position: relative;
  padding: 0.5rem 1rem;
  color: var(--bs-dark);
  transition: all 0.3s ease;
}

.navbar-nav .nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: var(--bs-primary);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.navbar-nav .nav-link:hover::after,
.navbar-nav .nav-link.router-link-active::after {
  width: 80%;
}

.navbar-nav .nav-link:hover,
.navbar-nav .nav-link.router-link-active {
  color: var(--bs-primary);
}

.navbar-nav .nav-link i {
  transition: all 0.3s ease;
}

.navbar-nav .nav-link:hover i,
.navbar-nav .nav-link.router-link-active i {
  color: var(--bs-primary) !important;
}

.dropdown-menu {
  border: none;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.dropdown-item {
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background-color: var(--bs-primary);
  color: white;
}

.dropdown-item:hover i {
  color: white !important;
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
}
</style>
