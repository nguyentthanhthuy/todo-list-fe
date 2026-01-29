import axios from "axios";

// 🔧 Cấu hình baseURL — trỏ đến API Laravel của bạn
const api = axios.create({
  baseURL: "http://localhost:8000/api", // đổi nếu backend bạn chạy ở domain khác
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 🪄 Tự động thêm Bearer token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // token lưu khi login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//  Xử lý lỗi tự động (ví dụ: token hết hạn)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn(" Token hết hạn hoặc không hợp lệ. Đăng xuất...");
      localStorage.removeItem("token");
      window.location.href = "/login"; // điều hướng về trang đăng nhập
    }
    return Promise.reject(error);
  }
);

export default api;
