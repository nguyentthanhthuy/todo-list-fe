<template>
  <div class="update-profile-page">
    <!-- Header -->
    <div class="header">
      <h1>Cập nhật thông tin cá nhân</h1>
      <p>Chỉnh sửa thông tin của bạn bên dưới và nhấn “Lưu thay đổi”.</p>
    </div>

    <!-- Form cập nhật -->
    <div class="form-container">
      <form class="update-form">
        <!-- Ảnh đại diện -->
        <div class="avatar-section">
          <img
            src="https://cdn-icons-png.flaticon.com/512/219/219983.png"
            alt="User Avatar"
            class="avatar-preview"
          />
          <label class="upload-label">
            <i class="fa-solid fa-camera"></i> Thay ảnh
            <input type="file" accept="image/*" hidden />
          </label>
        </div>

        <!-- Thông tin cơ bản -->
        <div class="form-group">
          <label>Họ và tên</label>
          <input type="text" placeholder="Nguyễn Văn A" />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" placeholder="nguyenvana@example.com" />
        </div>

        <div class="form-group">
          <label>Số điện thoại</label>
          <input type="tel" placeholder="0901 234 567" />
        </div>

        <div class="form-group">
          <label>Địa chỉ</label>
          <input type="text" placeholder="Hồ Chí Minh, Việt Nam" />
        </div>

        <div class="form-group">
          <label>Nghề nghiệp</label>
          <input type="text" placeholder="Frontend Developer" />
        </div>

        <!-- Giới thiệu -->
        <div class="form-group">
          <label>Giới thiệu bản thân</label>
          <textarea rows="4" placeholder="Giới thiệu ngắn gọn về bạn..."></textarea>
        </div>

        <!-- Nút hành động -->
        <div class="form-actions">
          <button type="button" class="btn-cancel">Hủy</button>
          <button type="submit" class="btn-save">Lưu thay đổi</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "UpdateThongTin",
};
</script>

<style scoped>
.update-profile-page {
  font-family: "Poppins", sans-serif;
  background: #fafafa;
  min-height: 100vh;
  padding: 2rem 0;
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 2rem;
}
.header h1 {
  font-size: 1.8rem;
  color: #333;
}
.header p {
  color: #666;
}

/* Form */
.form-container {
  max-width: 700px;
  background: #fff;
  margin: 0 auto;
  padding: 2rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.05);
}
.update-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

/* Avatar */
.avatar-section {
  text-align: center;
  margin-bottom: 1rem;
}
.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #007bff;
  object-fit: cover;
  margin-bottom: 0.5rem;
}
.upload-label {
  display: inline-block;
  background: #007bff;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: 0.3s;
}
.upload-label:hover {
  background: #005dc1;
}

/* Form nhóm */
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-weight: 500;
  margin-bottom: 0.3rem;
}
.form-group input,
.form-group textarea {
  padding: 0.7rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: 0.3s;
}
.form-group input:focus,
.form-group textarea:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.2);
}

/* Nút */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
.btn-cancel,
.btn-save {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s;
}
.btn-cancel {
  background: #e4e4e4;
  color: #333;
}
.btn-cancel:hover {
  background: #d1d1d1;
}
.btn-save {
  background: #007bff;
  color: white;
}
.btn-save:hover {
  background: #005dc1;
}
</style>
