<template>
    <div class="register-page d-flex align-items-center justify-content-center min-vh-100 bg-light">
        <div class="card shadow-lg border-0 rounded-4 p-4" style="max-width: 460px; width: 100%;">
            <div class="text-center mb-4">
                <h4 class="mt-2 fw-bold text-primary">ĐĂNG KÝ TÀI KHOẢN</h4>

            </div>

            <!-- Form đăng ký -->
            <form @submit.prevent="DangKy">
                <div class="mb-3">
                    <label class="form-label fw-semibold">Họ và tên</label>
                    <input v-model="user.ho_va_ten" type="text" class="form-control rounded-pill py-2"
                        placeholder="Nhập họ tên của bạn" />
                </div>

                <div class="mb-3">
                    <label class="form-label fw-semibold">Email</label>
                    <input v-model="user.email" type="email" class="form-control rounded-pill py-2"
                        placeholder="Nhập email của bạn" />
                </div>
                <div class="mb-3">
                    <label class="form-label fw-semibold">Số điện thoại</label>
                    <input v-model="user.so_dien_thoai" type="number" class="form-control rounded-pill py-2"
                        placeholder="Nhập số điện thoại của bạn" />
                </div>
                <div class="mb-3">
                    <label class="form-label fw-semibold">Địa chỉ</label>
                    <input v-model="user.address" type="text" class="form-control rounded-pill py-2"
                        placeholder="Nhập địa chỉ của bạn" />
                </div>
                <div class="mb-3">
                    <label class="form-label fw-semibold">Mật khẩu</label>
                    <input v-model="user.password" type="password" class="form-control rounded-pill py-2"
                        placeholder="Tạo mật khẩu" />
                </div>

                <div class="mb-3">
                    <label class="form-label fw-semibold">Xác nhận mật khẩu</label>
                    <input v-model="user.password_confirmation" type="password" class="form-control rounded-pill py-2"
                        placeholder="Nhập lại mật khẩu" />
                </div>

                <div class="form-check mb-3">
                    <input type="checkbox" class="form-check-input" id="agreeTerms" />
                    <label for="agreeTerms" class="form-check-label small text-muted">
                        Tôi đồng ý với <a href="#" class="text-primary text-decoration-none">Điều khoản & Chính sách</a>
                    </label>
                </div>

                <button type="submit" class="btn btn-primary w-100 rounded-pill py-2 fw-semibold">
                    <i class="fas fa-user-plus me-2"></i>Đăng ký
                </button>
            </form>

            <!-- Hoặc đăng ký bằng -->
            <div class="text-center mt-4 mb-2">
                <span class="text-muted small">Hoặc đăng ký bằng</span>
            </div>

            <!-- Social Buttons -->
            <div class="social-login d-flex flex-column gap-3 mt-3">
                <button @click="registerWithGoogle"
                    class="btn-social w-100 border rounded-pill py-2 d-flex align-items-center justify-content-center gap-2">
                    <span class="fw-semibold text-dark"><i class="fa-brands fa-google"></i> Tiếp tục với Google</span>
                </button>

                <button
                    class="btn-social w-100 border rounded-pill py-2 d-flex align-items-center justify-content-center gap-2">
                    <span class="fw-semibold text-dark"><i class="fa-brands fa-facebook-f"></i> Tiếp tục với
                        Facebook</span>
                </button>

                <button
                    class="btn-social w-100 border rounded-pill py-2 d-flex align-items-center justify-content-center gap-2">
                    <span class="fw-semibold text-dark"><i class="fa-brands fa-apple"></i> Tiếp tục với Apple</span>
                </button>
            </div>

            <div class="text-center mt-4">
                <p class="text-muted small mb-0">
                    Đã có tài khoản?
                    <router-link to="/login" href="#" class="text-primary fw-semibold text-decoration-none">Đăng nhập ngay</router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"
export default {
    data() {
        return {
            user: {
                ho_va_ten: "",
                email: "",
                password: "",
                so_dien_thoai:"",
                address:"",
                password_confirmation: "",
            }
        }
    },
    methods: {
        async DangKy() {
            try {
                const res = await axios.post("http://localhost:8000/api/auth/register", this.user);

                if (res?.data?.status) {
                    alert("Đăng ký thành công!");
                    this.$router.push("/login");
                } else {
                    alert(res?.data?.message || "Đăng ký thất bại!");
                }
            } catch (err) {
                const errors = err?.response?.data?.errors;
                if (errors) {
                    Object.values(errors).forEach(errorArr => {
                        if (errorArr?.length) alert(errorArr[0]);
                    });
                } else {
                    alert(err?.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại!");
                }
            }
        },

        registerWithGoogle() {
            window.location.href = "http://localhost:8000/auth/google/register";

        }
    }
};
</script>


<style scoped>
.register-page {
    background: linear-gradient(135deg, #f3f5ff, #ffffff);
}

.card {
    background: #fff;
    animation: fadeIn 0.6s ease-in-out;
}

.btn-social:hover {
    background-color: #f5f5f5;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.btn-social i {
    font-size: 18px;
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
