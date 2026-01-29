<template>
    <footer class="footer bg-light py-5 border-top">
        <div class="container">
    <div class="row gy-4">
      <!-- Logo & Mô tả -->
      <div class="col-lg-4 col-md-6">
        <div class="d-flex align-items-center mb-3">
          
          <h5 class="fw-bold mb-0 text-dark">WorkBuddy</h5>
        </div>
        <p class="text-muted small">
          Cùng hàng triệu người tìm kiếm công việc mơ ước và phát triển sự nghiệp với WorkBuddy.
        </p>
      </div>

      <!-- Tính năng -->
      <div class="col-lg-2 col-md-6">
        <h6 class="fw-bold mb-3 text-dark">Tính năng</h6>
        <ul class="list-unstyled text-muted small">
          <li><a href="#" class="footer-link">Tìm việc làm</a></li>
          <li><a href="#" class="footer-link">Đăng tuyển dụng</a></li>
          <li><a href="#" class="footer-link">Tạo CV online</a></li>
          <li><a href="#" class="footer-link">Gợi ý công việc</a></li>
          <li><a href="#" class="footer-link">Công cụ phỏng vấn</a></li>
        </ul>
      </div>

      <!-- Tài nguyên -->
      <div class="col-lg-3 col-md-6">
        <h6 class="fw-bold mb-3 text-dark">Tài nguyên</h6>
        <ul class="list-unstyled text-muted small">
          <li><a href="#" class="footer-link">Trung tâm hỗ trợ</a></li>
          <li><a href="#" class="footer-link">Cẩm nang nghề nghiệp</a></li>
          <li><a href="#" class="footer-link">Chia sẻ từ ứng viên</a></li>
          <li><a href="#" class="footer-link">Đối tác doanh nghiệp</a></li>
          <li><a href="#" class="footer-link">API dành cho nhà tuyển dụng</a></li>
        </ul>
      </div>

      <!-- Công ty -->
      <div class="col-lg-2 col-md-6">
        <h6 class="fw-bold mb-3 text-dark">Công ty</h6>
        <ul class="list-unstyled text-muted small">
          <li><a href="#" class="footer-link">Về WorkBuddy</a></li>
          <li>
            <a href="#" class="footer-link d-flex align-items-center">
              Tuyển dụng
              <span class="badge bg-success-subtle text-success ms-2 fw-normal">Đang tuyển!</span>
            </a>
          </li>
          <li><a href="#" class="footer-link">Blog nghề nghiệp</a></li>
          <li><a href="#" class="footer-link">Liên hệ</a></li>
          <li><a href="#" class="footer-link">Truyền thông</a></li>
        </ul>
      </div>

      <!-- Mạng xã hội -->
      <div class="col-lg-1 col-md-12 d-flex align-items-start justify-content-lg-end justify-content-start gap-3">
        <a href="#"><i class="fab fa-facebook fs-5 text-dark"></i></a>
        <a href="#"><i class="fab fa-linkedin fs-5 text-dark"></i></a>
        <a href="#"><i class="fab fa-instagram fs-5 text-dark"></i></a>
        <a href="#"><i class="fab fa-youtube fs-5 text-dark"></i></a>
      </div>
    </div>

    <hr class="my-4" />

    <!-- Dòng bản quyền -->
    <div class="d-flex flex-wrap justify-content-between align-items-center text-muted small">
      <div>
        <a href="#" class="text-muted me-3">Bảo mật</a>
        <a href="#" class="text-muted me-3">Điều khoản</a>
        <a href="#" class="text-muted">Tùy chọn cookie</a>
      </div>
      <div>&copy; 2025 WorkBuddy Inc. All rights reserved.</div>
    </div>
  </div>
    </footer>
</template>
<script>
export default {

}
</script>
<style>
.footer {
  background-color: #fffaf6;
  color: #333;
}

.footer-link {
  color: #555;
  text-decoration: none;
  display: inline-block;
  margin-bottom: 6px;
}

.footer-link:hover {
  color: #000;
}

.badge.bg-success-subtle {
  background-color: #e9fbe7 !important;
  font-size: 0.75rem;
  border-radius: 5px;
}
</style>
