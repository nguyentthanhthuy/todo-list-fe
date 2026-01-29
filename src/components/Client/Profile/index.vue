<template>
  <div class="profile-wrapper">
    <div class="container-custom">
      
      <!-- Main Profile Card -->
      <div class="profile-card-modern">
        
        <!-- Banner & Profile Header -->
        <div class="banner-container">
          <div class="banner-image-wrapper">
            <img src="../../../assets/assets/images/banner/banner2.jpg" alt="Banner" class="banner-img">
            <div class="banner-gradient"></div>
          </div>
          
          <div class="profile-header-section">
            <div class="profile-main-info">
              <!-- Avatar -->
              <div class="avatar-wrapper">
                <img src="../../../assets/assets/images/avatars/avatar-1.png" alt="Avatar" class="profile-avatar">
                
              </div>
              
              <!-- User Info -->
              <div class="user-info">
                <h1 class="user-name">Nguyễn Thị Thanh Thúy</h1>
                <p class="user-role">Senior Product Designer</p>
                
                <div class="user-meta-info">
                  <span class="meta-item">
                    <i class="fa-solid fa-envelope"></i>
                    <span>nttthuy1403@gmail.com</span>
                  </span>
                  <span class="meta-item">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>Đà Nẵng, Việt Nam</span>
                  </span>
                  <span class="meta-item">
                    <i class="fa-solid fa-calendar"></i>
                    <span>Tham gia từ 2020</span>
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="action-buttons">
              
              <router-link to="/update-thong-tin" class="btn-edit">
                <i class="fa-regular fa-pen-to-square"></i>
                <span>Cập Nhật Thông Tin</span>
              </router-link>
              <button class="btn-share">
                <i class="fa-solid fa-share-nodes"></i>
                <span>Chia sẻ</span>
              </button>
              <button class="btn-more">
                <i class="fa-solid fa-ellipsis-vertical"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Navigation Tabs -->
        <div class="tabs-navigation">
          <button class="tab-link active" onclick="showTab(event, 'tongQuan')">
            <i class="fa-solid fa-grip"></i>
            <span>Tổng quan</span>
          </button>
          <button class="tab-link" onclick="showTab(event, 'kingNghiem')">
            <i class="fa-solid fa-briefcase"></i>
            <span>Kinh nghiệm</span>
          </button>
          <button class="tab-link" onclick="showTab(event, 'giaoDuc')">
            <i class="fa-solid fa-graduation-cap"></i>
            <span>Giáo dục</span>
          </button>
          <button class="tab-link" onclick="showTab(event, 'soThich')">
            <i class="fa-solid fa-heart"></i>
            <span>Sở thích</span>
          </button>
        </div>
        
        <!-- Tab Content -->
        <div class="tabs-content">
          
          <!-- Tab: Tổng Quan -->
          <div id="tongQuan" class="tab-content-pane active">
            
            <!-- About Section -->
            <div class="content-card about-card">
              <div class="card-header-modern">
                <div class="header-icon-wrapper">
                  <i class="fa-solid fa-user"></i>
                </div>
                <h3>Giới thiệu</h3>
              </div>
              <div class="card-body-modern">
                <p class="about-text">
                  Passionate Product Designer với 3+ năm kinh nghiệm trong việc tạo ra các sản phẩm digital 
                  có tác động tích cực. Chuyên về UI/UX Design, Design System và User Research. 
                  Tôi tin rằng thiết kế tốt không chỉ đẹp mà còn giải quyết được vấn đề thực tế.
                </p>
                
                <div class="stats-row">
                  <div class="stat-item">
                    <i class="fa-solid fa-diagram-project"></i>
                    <div>
                      <h4>50+</h4>
                      <p>Dự án</p>
                    </div>
                  </div>
                  <div class="stat-item">
                    <i class="fa-solid fa-users"></i>
                    <div>
                      <h4>15+</h4>
                      <p>Khách hàng</p>
                    </div>
                  </div>
                  <div class="stat-item">
                    <i class="fa-solid fa-award"></i>
                    <div>
                      <h4>8</h4>
                      <p>Giải thưởng</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Skills Section -->
            <div class="content-card">
              <div class="card-header-modern">
                <div>
                  <div class="header-icon-wrapper">
                    <i class="fa-solid fa-star"></i>
                  </div>
                  <h3>Kỹ năng & Chuyên môn</h3>
                </div>
                <button class="btn-add-small">
                  <i class="fa-solid fa-plus"></i>
                  Thêm
                </button>
              </div>
              <div class="card-body-modern">
                <div class="skills-container">
                  <div class="skill-tag featured">
                    <i class="fa-solid fa-crown"></i>
                    <span>UI/UX Design</span>
                  </div>
                  <div class="skill-tag featured">
                    <i class="fa-brands fa-figma"></i>
                    <span>Figma</span>
                  </div>
                  <div class="skill-tag">Chiến lược sản phẩm</div>
                  <div class="skill-tag">Nghiên cứu người dùng</div>
                  <div class="skill-tag">Prototype</div>
                  <div class="skill-tag">Design System</div>
                  <div class="skill-tag">HTML / CSS</div>
                  <div class="skill-tag">
                    <i class="fa-brands fa-react"></i>
                    <span>React</span>
                  </div>
                  <div class="skill-tag">Wireframing</div>
                  <div class="skill-tag">Adobe XD</div>
                  <div class="skill-tag">User Testing</div>
                </div>
              </div>
            </div>
            
            <!-- Experience Section -->
            <div class="content-card">
              <div class="card-header-modern">
                <div>
                  <div class="header-icon-wrapper">
                    <i class="fa-solid fa-briefcase"></i>
                  </div>
                  <h3>Kinh nghiệm làm việc</h3>
                </div>
                <button class="btn-add-small">
                  <i class="fa-solid fa-plus"></i>
                  Thêm
                </button>
              </div>
              <div class="card-body-modern">
                
                <!-- Experience Item 1 -->
                <div class="experience-item">
                  <div class="experience-icon">
                    <i class="fa-solid fa-building"></i>
                  </div>
                  <div class="experience-content">
                    <div class="experience-header">
                      <div>
                        <h4>Senior Product Designer</h4>
                        <p class="company-name">TechCorp Inc. · Full-time</p>
                        <p class="location-text">
                          <i class="fa-solid fa-location-dot"></i>
                          San Francisco, USA
                        </p>
                      </div>
                      <span class="date-badge current">01/2022 – Hiện tại</span>
                    </div>
                    <p class="experience-desc">
                      Phụ trách thiết kế sản phẩm, quản lý nhóm 3 designer, nghiên cứu trải nghiệm người dùng 
                      và xây dựng hệ thống thiết kế cho các ứng dụng web và mobile.
                    </p>
                    <div class="skill-tags-small">
                      <span class="skill-badge">UI/UX</span>
                      <span class="skill-badge">Lãnh đạo đội nhóm</span>
                      <span class="skill-badge">Design System</span>
                    </div>
                  </div>
                </div>
                
                <!-- Experience Item 2 -->
                <div class="experience-item">
                  <div class="experience-icon">
                    <i class="fa-solid fa-building"></i>
                  </div>
                  <div class="experience-content">
                    <div class="experience-header">
                      <div>
                        <h4>Product Designer</h4>
                        <p class="company-name">StartupXYZ · Full-time</p>
                        <p class="location-text">
                          <i class="fa-solid fa-house-laptop"></i>
                          Làm từ xa
                        </p>
                      </div>
                      <span class="date-badge">03/2020 – 12/2021</span>
                    </div>
                    <p class="experience-desc">
                      Thiết kế giao diện web/mobile, nghiên cứu UX và thực hiện user testing 
                      cho các tính năng mới của ứng dụng.
                    </p>
                    <div class="skill-tags-small">
                      <span class="skill-badge">Mobile Design</span>
                      <span class="skill-badge">User Research</span>
                      <span class="skill-badge">Prototyping</span>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
            
          </div>
          
          <!-- Tab: Kinh Nghiệm -->
          <div id="kingNghiem" class="tab-content-pane">
            <div class="content-card">
              <div class="card-header-modern">
                <div>
                  <div class="header-icon-wrapper">
                    <i class="fa-solid fa-briefcase"></i>
                  </div>
                  <h3>Kinh nghiệm làm việc</h3>
                </div>
                <button class="btn-add-small">
                  <i class="fa-solid fa-plus"></i>
                  Thêm kinh nghiệm
                </button>
              </div>
              <div class="card-body-modern">
                
                <!-- Timeline -->
                <div class="timeline">
                  
                  <!-- Timeline Item 1 -->
                  <div class="timeline-item">
                    <div class="timeline-dot current"></div>
                    <div class="timeline-content">
                      <span class="date-badge current">01/2022 – Hiện tại</span>
                      <h4>Senior Product Designer</h4>
                      <p class="company-name">
                        <i class="fa-solid fa-building"></i>
                        TechCorp Inc. · Full-time
                      </p>
                      <p class="location-text">
                        <i class="fa-solid fa-location-dot"></i>
                        San Francisco, USA
                      </p>
                      <p class="experience-desc">
                        Phụ trách thiết kế sản phẩm, quản lý nhóm 3 designer, nghiên cứu trải nghiệm 
                        người dùng và xây dựng hệ thống thiết kế.
                      </p>
                      <div class="skill-tags-small">
                        <span class="skill-badge">UI/UX</span>
                        <span class="skill-badge">Lãnh đạo đội nhóm</span>
                        <span class="skill-badge">Design System</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Timeline Item 2 -->
                  <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                      <span class="date-badge">03/2020 – 12/2021</span>
                      <h4>Product Designer</h4>
                      <p class="company-name">
                        <i class="fa-solid fa-building"></i>
                        StartupXYZ · Full-time
                      </p>
                      <p class="location-text">
                        <i class="fa-solid fa-house-laptop"></i>
                        Làm từ xa
                      </p>
                      <p class="experience-desc">
                        Thiết kế giao diện web/mobile, nghiên cứu UX và test ứng dụng người dùng.
                      </p>
                      <div class="skill-tags-small">
                        <span class="skill-badge">Mobile Design</span>
                        <span class="skill-badge">User Research</span>
                        <span class="skill-badge">Prototyping</span>
                      </div>
                    </div>
                  </div>
                  
                </div>
                
              </div>
            </div>
          </div>
          
          <!-- Tab: Giáo Dục -->
          <div id="giaoDuc" class="tab-content-pane">
            <div class="content-card">
              <div class="card-header-modern">
                <div>
                  <div class="header-icon-wrapper">
                    <i class="fa-solid fa-graduation-cap"></i>
                  </div>
                  <h3>Giáo dục</h3>
                </div>
                <button class="btn-add-small">
                  <i class="fa-solid fa-plus"></i>
                  Thêm
                </button>
              </div>
              <div class="card-body-modern">
                
                <!-- Education Item 1 -->
                <div class="education-item">
                  <div class="education-icon">
                    <i class="fa-solid fa-user-graduate"></i>
                  </div>
                  <div class="education-content">
                    <div class="education-header">
                      <div>
                        <h4>Master of Design</h4>
                        <p class="school-name">
                          <i class="fa-solid fa-school"></i>
                          Design Institute of Technology
                        </p>
                        <p class="location-text">
                          <i class="fa-solid fa-location-dot"></i>
                          Boston, MA
                        </p>
                      </div>
                      <span class="date-badge">2016 - 2018</span>
                    </div>
                    <p class="education-desc">
                      Specialized in Human-Computer Interaction and User Experience Design
                    </p>
                  </div>
                </div>
                
                <!-- Education Item 2 -->
                <div class="education-item">
                  <div class="education-icon">
                    <i class="fa-solid fa-user-graduate"></i>
                  </div>
                  <div class="education-content">
                    <div class="education-header">
                      <div>
                        <h4>Bachelor of Arts in Graphic Design</h4>
                        <p class="school-name">
                          <i class="fa-solid fa-school"></i>
                          State University
                        </p>
                        <p class="location-text">
                          <i class="fa-solid fa-location-dot"></i>
                          Los Angeles, CA
                        </p>
                      </div>
                      <span class="date-badge">2012 - 2016</span>
                    </div>
                    <p class="education-desc">
                      Graduated with Honors, GPA: 3.8/4.0
                    </p>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
          
          <!-- Tab: Sở Thích -->
          <div id="soThich" class="tab-content-pane">
            <div class="content-card">
              <div class="card-header-modern">
                <div>
                  <div class="header-icon-wrapper">
                    <i class="fa-solid fa-heart"></i>
                  </div>
                  <h3>Sở thích</h3>
                </div>
                <button class="btn-add-small">
                  <i class="fa-solid fa-plus"></i>
                  Thêm
                </button>
              </div>
              <div class="card-body-modern">
                
                <div class="interests-grid">
                  
                  <!-- Interest Category 1 -->
                  <div class="interest-category">
                    <div class="interest-header">
                      <div class="interest-icon">
                        <i class="fa-solid fa-person-running"></i>
                      </div>
                      <h4>Hoạt động cá nhân</h4>
                    </div>
                    <div class="interest-tags">
                      <span class="interest-tag">
                        <i class="fa-solid fa-running"></i>
                        Chạy bộ
                      </span>
                      <span class="interest-tag">
                        <i class="fa-solid fa-spa"></i>
                        Yoga
                      </span>
                      <span class="interest-tag">
                        <i class="fa-solid fa-dumbbell"></i>
                        Gym
                      </span>
                    </div>
                  </div>
                  
                  <!-- Interest Category 2 -->
                  <div class="interest-category">
                    <div class="interest-header">
                      <div class="interest-icon">
                        <i class="fa-solid fa-film"></i>
                      </div>
                      <h4>Giải trí</h4>
                    </div>
                    <div class="interest-tags">
                      <span class="interest-tag">
                        <i class="fa-solid fa-clapperboard"></i>
                        Xem phim
                      </span>
                      <span class="interest-tag">
                        <i class="fa-solid fa-book"></i>
                        Đọc sách
                      </span>
                      <span class="interest-tag">
                        <i class="fa-solid fa-music"></i>
                        Nghe nhạc
                      </span>
                    </div>
                  </div>
                  
                  <!-- Interest Category 3 -->
                  <div class="interest-category">
                    <div class="interest-header">
                      <div class="interest-icon">
                        <i class="fa-solid fa-plane"></i>
                      </div>
                      <h4>Du lịch</h4>
                    </div>
                    <div class="interest-tags">
                      <span class="interest-tag">
                        <i class="fa-solid fa-umbrella-beach"></i>
                        Biển
                      </span>
                      <span class="interest-tag">
                        <i class="fa-solid fa-mountain"></i>
                        Núi rừng
                      </span>
                      <span class="interest-tag">
                        <i class="fa-solid fa-tree"></i>
                        Khám phá thiên nhiên
                      </span>
                    </div>
                  </div>
                  
                  <!-- Interest Category 4 -->
                  <div class="interest-category">
                    <div class="interest-header">
                      <div class="interest-icon">
                        <i class="fa-solid fa-palette"></i>
                      </div>
                      <h4>Sở thích sáng tạo</h4>
                    </div>
                    <div class="interest-tags">
                      <span class="interest-tag">
                        <i class="fa-solid fa-paintbrush"></i>
                        Vẽ
                      </span>
                      <span class="interest-tag">
                        <i class="fa-solid fa-pen-nib"></i>
                        Thiết kế
                      </span>
                      <span class="interest-tag">
                        <i class="fa-solid fa-camera"></i>
                        Nhiếp ảnh
                      </span>
                    </div>
                  </div>
                  
                </div>
                
              </div>
            </div>
          </div>
          
        </div>
        
      </div>
      
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfilePage",
  mounted() {
    // Tab switching functionality
    window.showTab = function(evt, tabName) {
      // Hide all tab content
      const tabContents = document.getElementsByClassName("tab-content-pane");
      for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
      }
      
      // Remove active class from all tabs
      const tabLinks = document.getElementsByClassName("tab-link");
      for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
      }
      
      // Show current tab and add active class
      document.getElementById(tabName).classList.add("active");
      evt.currentTarget.classList.add("active");
    }
  }
}
</script>

<style scoped>
/* ==================== GLOBAL STYLES ==================== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.profile-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  padding: 2rem 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container-custom {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ==================== MAIN CARD ==================== */
.profile-card-modern {
  background: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

/* ==================== BANNER SECTION ==================== */
.banner-container {
  position: relative;
}

.banner-image-wrapper {
  position: relative;
  height: 280px;
  overflow: hidden;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 150px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
}

/* ==================== PROFILE HEADER ==================== */
.profile-header-section {
  padding: 0 3rem 2rem;
  margin-top: -80px;
  position: relative;
  z-index: 10;
}

.profile-main-info {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.profile-avatar {
  width: 180px;
  height: 180px;
  border-radius: 100px;
  border: 6px solid #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  object-fit: cover;
}

.status-indicator {
  position: absolute;
  bottom: 15px;
  right: 15px;
  width: 24px;
  height: 24px;
  background: #10b981;
  border: 4px solid #ffffff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
}

/* User Info */
.user-info {
  flex: 1;
  margin-top: 1rem;
}

.user-name {
  font-size: rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.25rem;
}

.user-role {
  font-size: 1.125rem;
  color: #aeb5c2;
  margin-bottom: 1rem;
}

.user-meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #4b5563;
}

.meta-item i {
  color: #8b5cf6;
  font-size: 1.1rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn-edit, .btn-share, .btn-more {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-share {
  background: #f3f4f6;
  color: #374151;
}

.btn-share:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
}

.btn-more {
  background: #f3f4f6;
  color: #374151;
  padding: 0.75rem 1rem;
}

.btn-more:hover {
  background: #e5e7eb;
}

/* ==================== TABS NAVIGATION ==================== */
.tabs-navigation {
  display: flex;
  padding: 0 3rem;
  border-bottom: 2px solid #f3f4f6;
  gap: 0.5rem;
}

.tab-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: #6b7280;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.tab-link:hover {
  color: #8b5cf6;
  background: #faf5ff;
}

.tab-link.active {
  color: #8b5cf6;
  border-bottom-color: #8b5cf6;
}

.tab-link i {
  font-size: 1.1rem;
}

/* ==================== TAB CONTENT ==================== */
.tabs-content {
  padding: 2.5rem 3rem;
}

.tab-content-pane {
  display: none;
  animation: fadeIn 0.5s ease;
}

.tab-content-pane.active {
  display: block;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ==================== CONTENT CARDS ==================== */
.content-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.content-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.card-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-header-modern > div:first-child {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon-wrapper {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.card-header-modern h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
}

.btn-add-small {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  color: #374151;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add-small:hover {
  background: #8b5cf6;
  color: white;
  border-color: #8b5cf6;
  transform: translateY(-2px);
}

.card-body-modern {
  color: #4b5563;
  line-height: 1.6;
}

/* ==================== ABOUT SECTION ==================== */
.about-card {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border: none;
}

.about-text {
  font-size: 1.05rem;
  color: #4b5563;
  line-height: 1.8;
  margin-bottom: 2rem;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stat-item i {
  font-size: 2rem;
  color: #8b5cf6;
}

.stat-item h4 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.stat-item p {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
}

/* ==================== SKILLS SECTION ==================== */
.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  color: #374151;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.skill-tag:hover {
  background: #8b5cf6;
  color: white;
  border-color: #8b5cf6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.skill-tag.featured {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.skill-tag.featured:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.skill-tag i {
  font-size: 1rem;
}

/* ==================== EXPERIENCE SECTION ==================== */
.experience-item {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #fafafa;
  border-radius: 16px;
  margin-bottom: 1.25rem;
  transition: all 0.3s ease;
}

.experience-item:hover {
  background: #f3f4f6;
  transform: translateX(5px);
}

.experience-item:last-child {
  margin-bottom: 0;
}

.experience-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.experience-content {
  flex: 1;
}

.experience-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.experience-header h4 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.25rem;
}

.company-name {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.location-text {
  font-size: 0.9rem;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.date-badge {
  padding: 0.5rem 1rem;
  background: #e5e7eb;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

.date-badge.current {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.experience-desc {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.skill-tags-small {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-badge {
  padding: 0.4rem 0.9rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #374151;
  font-weight: 500;
}

/* ==================== TIMELINE (Experience Tab) ==================== */
.timeline {
  position: relative;
  padding-left: 2.5rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 18px;
  top: 20px;
  bottom: 20px;
  width: 2px;
  background: linear-gradient(to bottom, #8b5cf6, #ec4899);
}

.timeline-item {
  position: relative;
  margin-bottom: 2.5rem;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -2.3rem;
  top: 8px;
  width: 16px;
  height: 16px;
  background: #8b5cf6;
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0 0 0 4px #ede9fe;
  z-index: 2;
}

.timeline-dot.current {
  width: 20px;
  height: 20px;
  background: #10b981;
  box-shadow: 0 0 0 4px #d1fae5;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 4px #d1fae5; }
  50% { box-shadow: 0 0 0 8px #d1fae5; }
}

.timeline-content {
  background: #fafafa;
  padding: 1.5rem;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.timeline-content:hover {
  background: #f3f4f6;
  transform: translateX(5px);
}

.timeline-content h4 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0.75rem 0 0.5rem;
}

/* ==================== EDUCATION SECTION ==================== */
.education-item {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #fafafa;
  border-radius: 16px;
  margin-bottom: 1.25rem;
  transition: all 0.3s ease;
}

.education-item:hover {
  background: #f3f4f6;
  transform: translateX(5px);
}

.education-item:last-child {
  margin-bottom: 0;
}

.education-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.education-content {
  flex: 1;
}

.education-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.education-header h4 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.school-name {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.education-desc {
  color: #4b5563;
  line-height: 1.6;
  font-style: italic;
}

/* ==================== INTERESTS SECTION ==================== */
.interests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.interest-category {
  background: #fafafa;
  padding: 1.5rem;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.interest-category:hover {
  background: #f3f4f6;
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.interest-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.interest-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.interest-header h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a202c;
}

.interest-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.interest-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  color: #374151;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.interest-tag:hover {
  background: #8b5cf6;
  color: white;
  border-color: #8b5cf6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.interest-tag i {
  font-size: 1rem;
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 768px) {
  .container-custom {
    padding: 0 1rem;
  }
  
  .profile-header-section {
    padding: 0 1.5rem 1.5rem;
  }
  
  .profile-main-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .user-meta-info {
    justify-content: center;
  }
  
  .action-buttons {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .tabs-navigation {
    padding: 0 1rem;
    overflow-x: auto;
  }
  
  .tab-link {
    white-space: nowrap;
  }
  
  .tabs-content {
    padding: 1.5rem 1rem;
  }
  
  .content-card {
    padding: 1.5rem;
  }
  
  .card-header-modern {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .experience-item,
  .education-item {
    flex-direction: column;
  }
  
  .experience-header,
  .education-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .date-badge {
    align-self: flex-start;
  }
  
  .interests-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-row {
    grid-template-columns: 1fr;
  }
  
  .user-name {
    font-size: 1.5rem;
  }
  
  .profile-avatar {
    width: 140px;
    height: 140px;
  }
}

@media (max-width: 480px) {
  .banner-image-wrapper {
    height: 180px;
  }
  
  .profile-avatar {
    width: 120px;
    height: 120px;
  }
  
  .tab-link span {
    display: none;
  }
  
  .tab-link {
    padding: 1rem;
  }
}
</style>
