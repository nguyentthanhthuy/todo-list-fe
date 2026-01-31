<template>
  <div class="landing-page">
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
      </div>
      <div class="particles">
        <span v-for="n in 20" :key="n" class="particle"></span>
      </div>
    </div>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge animate-fade-in">
          <span class="badge-icon">🚀</span>
          <span>Nền tảng quản lý công việc #1 Việt Nam</span>
        </div>
        
        <h1 class="hero-title animate-slide-up">
          <span class="line-1">Quản lý công việc</span>
          <span class="line-2">
            <span class="highlight-text">thông minh</span> & 
            <span class="highlight-text-2">hiệu quả</span>
          </span>
        </h1>
        
        <p class="hero-description animate-slide-up delay-1">
          Tổ chức, theo dõi và hoàn thành mọi công việc một cách dễ dàng. 
          WorkBuddy giúp bạn và team đạt hiệu suất tối đa mỗi ngày.
        </p>
        
        <div class="hero-buttons animate-slide-up delay-2">
          <router-link to="/dang-ky" class="btn-primary">
            <span>Bắt đầu miễn phí</span>
            <i class="fa-solid fa-arrow-right"></i>
          </router-link>
          <router-link to="/login" class="btn-secondary">
            <i class="fa-solid fa-play"></i>
            <span>Đăng nhập</span>
          </router-link>
        </div>
        
        <div class="hero-stats animate-fade-in delay-3">
          <div class="stat-item">
            <div class="stat-number">
              <span class="counter">10,000+</span>
            </div>
            <div class="stat-label">Người dùng</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">
              <span class="counter">500K+</span>
            </div>
            <div class="stat-label">Công việc hoàn thành</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">
              <span class="counter">99.9%</span>
            </div>
            <div class="stat-label">Uptime</div>
          </div>
        </div>
      </div>
      
      <div class="hero-visual animate-float">
        <div class="dashboard-mockup">
          <div class="mockup-header">
            <div class="mockup-dots">
              <span></span><span></span><span></span>
            </div>
            <div class="mockup-title">WorkBuddy Dashboard</div>
          </div>
          <div class="mockup-content">
            <div class="mockup-sidebar">
              <div class="sidebar-item active"><i class="fa-solid fa-home"></i></div>
              <div class="sidebar-item"><i class="fa-solid fa-tasks"></i></div>
              <div class="sidebar-item"><i class="fa-solid fa-calendar"></i></div>
              <div class="sidebar-item"><i class="fa-solid fa-chart-bar"></i></div>
            </div>
            <div class="mockup-main">
              <div class="task-cards">
                <div class="task-card card-1">
                  <div class="task-priority high"></div>
                  <div class="task-title">Thiết kế UI Dashboard</div>
                  <div class="task-progress">
                    <div class="progress-bar" style="width: 75%"></div>
                  </div>
                  <div class="task-meta">
                    <span class="task-due">📅 Hôm nay</span>
                    <div class="task-avatar">A</div>
                  </div>
                </div>
                <div class="task-card card-2">
                  <div class="task-priority medium"></div>
                  <div class="task-title">Review Pull Request</div>
                  <div class="task-progress">
                    <div class="progress-bar" style="width: 45%"></div>
                  </div>
                  <div class="task-meta">
                    <span class="task-due">📅 Ngày mai</span>
                    <div class="task-avatar">B</div>
                  </div>
                </div>
                <div class="task-card card-3">
                  <div class="task-priority low"></div>
                  <div class="task-title">Cập nhật Documentation</div>
                  <div class="task-progress">
                    <div class="progress-bar" style="width: 90%"></div>
                  </div>
                  <div class="task-meta">
                    <span class="task-due">📅 Tuần này</span>
                    <div class="task-avatar">C</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Floating Elements -->
        <div class="floating-card float-1">
          <div class="float-icon success">✓</div>
          <div class="float-text">Hoàn thành 12 tasks</div>
        </div>
        <div class="floating-card float-2">
          <div class="float-icon warning">🔔</div>
          <div class="float-text">3 nhiệm vụ sắp hết hạn</div>
        </div>
        <div class="floating-card float-3">
          <div class="float-icon info">📊</div>
          <div class="float-text">Năng suất +25%</div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features" ref="featuresSection">
      <div class="section-header">
        <span class="section-badge">Tính năng nổi bật</span>
        <h2 class="section-title">Mọi thứ bạn cần để <span class="gradient-text">làm việc hiệu quả</span></h2>
        <p class="section-desc">Công cụ mạnh mẽ, giao diện đơn giản, kết quả ấn tượng</p>
      </div>
      
      <div class="features-grid">
        <div 
          class="feature-card" 
          v-for="(feature, index) in features" 
          :key="index"
          :class="{ 'animate-visible': visibleFeatures.includes(index) }"
          :style="{ transitionDelay: `${index * 0.1}s` }"
        >
          <div class="feature-icon" :class="feature.color">
            <i :class="feature.icon"></i>
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-desc">{{ feature.description }}</p>
          <div class="feature-link">
            <span>Tìm hiểu thêm</span>
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="how-it-works" ref="stepsSection">
      <div class="section-header">
        <span class="section-badge">Cách hoạt động</span>
        <h2 class="section-title">Bắt đầu chỉ trong <span class="gradient-text">3 bước đơn giản</span></h2>
      </div>
      
      <div class="steps-container">
        <div 
          class="step" 
          v-for="(step, index) in steps" 
          :key="index"
          :class="{ 'animate-visible': visibleSteps.includes(index) }"
          :style="{ transitionDelay: `${index * 0.2}s` }"
        >
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-connector" v-if="index < steps.length - 1"></div>
          <div class="step-content">
            <div class="step-icon" :class="step.color">
              <i :class="step.icon"></i>
            </div>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-desc">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials" ref="testimonialsSection">
      <div class="section-header">
        <span class="section-badge">Đánh giá</span>
        <h2 class="section-title">Được tin tưởng bởi <span class="gradient-text">hàng nghìn người</span></h2>
      </div>
      
      <div class="testimonials-slider">
        <div 
          class="testimonial-card" 
          v-for="(testimonial, index) in testimonials" 
          :key="index"
          :class="{ 'animate-visible': visibleTestimonials.includes(index) }"
          :style="{ transitionDelay: `${index * 0.15}s` }"
        >
          <div class="testimonial-stars">
            <i class="fa-solid fa-star" v-for="n in 5" :key="n"></i>
          </div>
          <p class="testimonial-text">"{{ testimonial.text }}"</p>
          <div class="testimonial-author">
            <div class="author-avatar" :style="{ background: testimonial.color }">
              {{ testimonial.avatar }}
            </div>
            <div class="author-info">
              <div class="author-name">{{ testimonial.name }}</div>
              <div class="author-role">{{ testimonial.role }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="cta-content">
        <div class="cta-bg-shapes">
          <div class="cta-shape cta-shape-1"></div>
          <div class="cta-shape cta-shape-2"></div>
        </div>
        <h2 class="cta-title">Sẵn sàng tăng năng suất?</h2>
        <p class="cta-desc">Tham gia cùng hàng nghìn người đang sử dụng WorkBuddy mỗi ngày</p>
        <div class="cta-buttons">
          <router-link to="/dang-ky" class="btn-primary btn-large">
            <span>Đăng ký miễn phí</span>
            <i class="fa-solid fa-rocket"></i>
          </router-link>
        </div>
        <div class="cta-features">
          <div class="cta-feature">
            <i class="fa-solid fa-check"></i>
            <span>Miễn phí mãi mãi</span>
          </div>
          <div class="cta-feature">
            <i class="fa-solid fa-check"></i>
            <span>Không cần thẻ tín dụng</span>
          </div>
          <div class="cta-feature">
            <i class="fa-solid fa-check"></i>
            <span>Hỗ trợ 24/7</span>
          </div>
        </div>
      </div>
    </section>

    
  </div>
</template>

<script>
export default {
  name: 'LandingPage',
  data() {
    return {
      visibleFeatures: [],
      visibleSteps: [],
      visibleTestimonials: [],
      features: [
        {
          icon: 'fa-solid fa-list-check',
          title: 'Quản lý Task',
          description: 'Tạo, sắp xếp và theo dõi công việc với giao diện kéo thả trực quan',
          color: 'purple'
        },
        {
          icon: 'fa-solid fa-calendar-days',
          title: 'Lịch thông minh',
          description: 'Xem toàn bộ lịch trình và deadline trong một cái nhìn tổng quan',
          color: 'blue'
        },
        {
          icon: 'fa-solid fa-users',
          title: 'Làm việc nhóm',
          description: 'Phân công, theo dõi tiến độ và giao tiếp hiệu quả với team',
          color: 'green'
        },
        {
          icon: 'fa-solid fa-bell',
          title: 'Nhắc nhở tự động',
          description: 'Không bao giờ bỏ lỡ deadline với hệ thống nhắc nhở thông minh',
          color: 'orange'
        },
        {
          icon: 'fa-solid fa-chart-line',
          title: 'Báo cáo chi tiết',
          description: 'Phân tích năng suất với biểu đồ và thống kê trực quan',
          color: 'pink'
        },
        {
          icon: 'fa-solid fa-cloud',
          title: 'Đồng bộ đám mây',
          description: 'Truy cập công việc mọi lúc, mọi nơi trên mọi thiết bị',
          color: 'cyan'
        }
      ],
      steps: [
        {
          icon: 'fa-solid fa-user-plus',
          title: 'Tạo tài khoản',
          description: 'Đăng ký miễn phí chỉ trong 30 giây với email của bạn',
          color: 'purple'
        },
        {
          icon: 'fa-solid fa-folder-plus',
          title: 'Tạo dự án',
          description: 'Thiết lập dự án và mời thành viên tham gia cùng bạn',
          color: 'blue'
        },
        {
          icon: 'fa-solid fa-rocket',
          title: 'Bắt đầu làm việc',
          description: 'Thêm công việc, đặt deadline và theo dõi tiến độ ngay',
          color: 'green'
        }
      ],
      testimonials: [
        {
          text: 'WorkBuddy đã thay đổi cách team chúng tôi làm việc. Năng suất tăng 40% chỉ sau 1 tháng sử dụng!',
          name: 'Nguyễn Văn An',
          role: 'CEO, Tech Startup',
          avatar: 'A',
          color: 'linear-gradient(135deg, #667eea, #764ba2)'
        },
        {
          text: 'Giao diện đơn giản nhưng cực kỳ mạnh mẽ. Tôi đã thử nhiều app quản lý nhưng WorkBuddy là tốt nhất.',
          name: 'Trần Thị Bình',
          role: 'Project Manager',
          avatar: 'B',
          color: 'linear-gradient(135deg, #f093fb, #f5576c)'
        },
        {
          text: 'Tính năng nhắc nhở tự động giúp tôi không bao giờ quên deadline. Highly recommended!',
          name: 'Lê Minh Châu',
          role: 'Freelancer',
          avatar: 'C',
          color: 'linear-gradient(135deg, #4facfe, #00f2fe)'
        }
      ]
    }
  },
  mounted() {
    this.initScrollAnimations();
  },
  methods: {
    initScrollAnimations() {
      const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      };

      // Features Observer
      const featuresObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.features.forEach((_, index) => {
              setTimeout(() => {
                if (!this.visibleFeatures.includes(index)) {
                  this.visibleFeatures.push(index);
                }
              }, index * 100);
            });
          }
        });
      }, observerOptions);

      // Steps Observer
      const stepsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.steps.forEach((_, index) => {
              setTimeout(() => {
                if (!this.visibleSteps.includes(index)) {
                  this.visibleSteps.push(index);
                }
              }, index * 200);
            });
          }
        });
      }, observerOptions);

      // Testimonials Observer
      const testimonialsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.testimonials.forEach((_, index) => {
              setTimeout(() => {
                if (!this.visibleTestimonials.includes(index)) {
                  this.visibleTestimonials.push(index);
                }
              }, index * 150);
            });
          }
        });
      }, observerOptions);

      // Observe sections
      if (this.$refs.featuresSection) {
        featuresObserver.observe(this.$refs.featuresSection);
      }
      if (this.$refs.stepsSection) {
        stepsObserver.observe(this.$refs.stepsSection);
      }
      if (this.$refs.testimonialsSection) {
        testimonialsObserver.observe(this.$refs.testimonialsSection);
      }
    }
  }
}
</script>

<style scoped>
/* ==================== GLOBAL STYLES ==================== */
.landing-page {
  font-family: 'Be Vietnam Pro', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #fafafa;
  color: #1a1a2e;
  overflow-x: hidden;
}

.hero-title {
  font-family: 'Be Vietnam Pro', 'Inter', sans-serif;
  font-weight: 800;
}

.hero-description {
  font-family: 'Be Vietnam Pro', 'Inter', sans-serif;
  font-weight: 400;
}

.hero-badge {
  font-family: 'Be Vietnam Pro', 'Inter', sans-serif;
  font-weight: 500;
}

.btn-primary, .btn-secondary {
  font-family: 'Be Vietnam Pro', 'Inter', sans-serif;
  font-weight: 600;
}

.stat-number {
  font-family: 'Be Vietnam Pro', 'Inter', sans-serif;
  font-weight: 700;
}

.stat-label {
  font-family: 'Be Vietnam Pro', 'Inter', sans-serif;
  font-weight: 400;
}

/* ==================== ANIMATED BACKGROUND ==================== */
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -200px;
  right: -100px;
  animation: orbFloat 20s ease-in-out infinite;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  bottom: 0;
  left: -100px;
  animation: orbFloat 15s ease-in-out infinite reverse;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  top: 50%;
  left: 50%;
  animation: orbFloat 18s ease-in-out infinite 2s;
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(50px, -50px) scale(1.1); }
  50% { transform: translate(-30px, 30px) scale(0.9); }
  75% { transform: translate(30px, 50px) scale(1.05); }
}

.floating-shapes .shape {
  position: absolute;
  background: linear-gradient(135deg, #667eea20, #764ba220);
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  animation: shapeFloat 10s ease-in-out infinite;
}

.shape-1 { width: 80px; height: 80px; top: 20%; left: 10%; animation-delay: 0s; }
.shape-2 { width: 60px; height: 60px; top: 60%; left: 80%; animation-delay: 2s; }
.shape-3 { width: 100px; height: 100px; top: 80%; left: 20%; animation-delay: 4s; }
.shape-4 { width: 50px; height: 50px; top: 30%; right: 10%; animation-delay: 1s; }
.shape-5 { width: 70px; height: 70px; bottom: 20%; right: 30%; animation-delay: 3s; }

@keyframes shapeFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* Particles */
.particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  opacity: 0.4;
  animation: particleFloat 15s infinite linear;
}

.particle:nth-child(1) { left: 5%; top: 20%; animation-delay: 0s; }
.particle:nth-child(2) { left: 15%; top: 60%; animation-delay: 1s; }
.particle:nth-child(3) { left: 25%; top: 40%; animation-delay: 2s; }
.particle:nth-child(4) { left: 35%; top: 80%; animation-delay: 3s; }
.particle:nth-child(5) { left: 45%; top: 30%; animation-delay: 4s; }
.particle:nth-child(6) { left: 55%; top: 70%; animation-delay: 5s; }
.particle:nth-child(7) { left: 65%; top: 50%; animation-delay: 6s; }
.particle:nth-child(8) { left: 75%; top: 90%; animation-delay: 7s; }
.particle:nth-child(9) { left: 85%; top: 10%; animation-delay: 8s; }
.particle:nth-child(10) { left: 95%; top: 45%; animation-delay: 9s; }
.particle:nth-child(11) { left: 10%; top: 85%; animation-delay: 10s; }
.particle:nth-child(12) { left: 20%; top: 15%; animation-delay: 11s; }
.particle:nth-child(13) { left: 30%; top: 55%; animation-delay: 12s; }
.particle:nth-child(14) { left: 40%; top: 25%; animation-delay: 13s; }
.particle:nth-child(15) { left: 50%; top: 65%; animation-delay: 14s; }
.particle:nth-child(16) { left: 60%; top: 35%; animation-delay: 0.5s; }
.particle:nth-child(17) { left: 70%; top: 75%; animation-delay: 1.5s; }
.particle:nth-child(18) { left: 80%; top: 5%; animation-delay: 2.5s; }
.particle:nth-child(19) { left: 90%; top: 55%; animation-delay: 3.5s; }
.particle:nth-child(20) { left: 3%; top: 95%; animation-delay: 4.5s; }

@keyframes particleFloat {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: 0.4; }
  90% { opacity: 0.4; }
  100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
}

/* ==================== HERO SECTION ==================== */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 100px 80px;
  position: relative;
  z-index: 1;
  gap: 60px;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #667eea20, #764ba220);
  border: 1px solid #667eea40;
  padding: 10px 20px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  color: #667eea;
  margin-bottom: 30px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(102, 126, 234, 0); }
}

.badge-icon {
  font-size: 18px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.hero-title {
  font-size: 64px;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
}

.hero-title .line-1 {
  display: block;
  color: #1a1a2e;
}

.hero-title .line-2 {
  display: block;
}

.highlight-text {
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.highlight-text::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 8px;
  background: linear-gradient(135deg, #667eea40, #764ba240);
  border-radius: 4px;
  z-index: -1;
  animation: underlineGrow 1s ease forwards 0.5s;
  transform: scaleX(0);
  transform-origin: left;
}

@keyframes underlineGrow {
  to { transform: scaleX(1); }
}

.highlight-text-2 {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 18px;
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 40px;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 50px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 16px 32px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
}

.btn-primary i {
  transition: transform 0.3s ease;
}

.btn-primary:hover i {
  transform: translateX(5px);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: white;
  color: #1a1a2e;
  padding: 16px 32px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-3px);
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 30px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  margin-top: 4px;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #e2e8f0;
}

/* Hero Visual */
.hero-visual {
  flex: 1;
  position: relative;
  max-width: 650px;
}

.dashboard-mockup {
  background: white;
  border-radius: 20px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
  transition: transform 0.5s ease;
}

.dashboard-mockup:hover {
  transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
}

.mockup-header {
  background: #f8fafc;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-bottom: 1px solid #e2e8f0;
}

.mockup-dots {
  display: flex;
  gap: 8px;
}

.mockup-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.mockup-dots span:nth-child(1) { background: #ef4444; }
.mockup-dots span:nth-child(2) { background: #f59e0b; }
.mockup-dots span:nth-child(3) { background: #10b981; }

.mockup-title {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.mockup-content {
  display: flex;
  min-height: 350px;
}

.mockup-sidebar {
  width: 60px;
  background: linear-gradient(180deg, #667eea, #764ba2);
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.sidebar-item {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
  cursor: pointer;
}

.sidebar-item.active,
.sidebar-item:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.mockup-main {
  flex: 1;
  padding: 20px;
}

.task-cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.task-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  border-left: 4px solid;
  transition: all 0.3s ease;
  animation: cardSlideIn 0.5s ease forwards;
  opacity: 0;
}

.task-card:hover {
  transform: translateX(10px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.task-card.card-1 { border-color: #ef4444; animation-delay: 0.2s; }
.task-card.card-2 { border-color: #f59e0b; animation-delay: 0.4s; }
.task-card.card-3 { border-color: #10b981; animation-delay: 0.6s; }

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.task-priority {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-bottom: 8px;
  animation: glow 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px currentColor; }
  50% { box-shadow: 0 0 15px currentColor; }
}

.task-priority.high { background: #ef4444; color: #ef4444; }
.task-priority.medium { background: #f59e0b; color: #f59e0b; }
.task-priority.low { background: #10b981; color: #10b981; }

.task-title {
  font-weight: 600;
  font-size: 14px;
  color: #1a1a2e;
  margin-bottom: 10px;
}

.task-progress {
  height: 6px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.task-progress .progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 10px;
  transition: width 1s ease;
  animation: progressPulse 2s ease-in-out infinite;
}

@keyframes progressPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-due {
  font-size: 12px;
  color: #64748b;
}

.task-avatar {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Floating Cards */
.floating-card {
  position: absolute;
  background: white;
  padding: 14px 20px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 12px;
  animation: float 3s ease-in-out infinite;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.5);
}

.float-1 {
  top: 20px;
  right: -30px;
  animation-delay: 0s;
}

.float-2 {
  bottom: 120px;
  left: -40px;
  animation-delay: 1s;
}

.float-3 {
  bottom: 30px;
  right: 20px;
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
}

.float-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.float-icon.success { background: #d1fae5; }
.float-icon.warning { background: #fef3c7; }
.float-icon.info { background: #dbeafe; }

.float-text {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a2e;
}

/* ==================== SECTIONS COMMON ==================== */
.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-badge {
  display: inline-block;
  background: linear-gradient(135deg, #667eea20, #764ba220);
  color: #667eea;
  padding: 8px 20px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 20px;
}

.section-title {
  font-size: 42px;
  font-weight: 800;
  color: #1a1a2e;
  margin-bottom: 16px;
}

.gradient-text {
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-desc {
  font-size: 18px;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
}

/* ==================== FEATURES SECTION ==================== */
.features {
  padding: 100px 80px;
  position: relative;
  z-index: 1;
  background: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.feature-card {
  background: #fafafa;
  border-radius: 20px;
  padding: 35px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid transparent;
  opacity: 0;
  transform: translateY(30px);
}

.feature-card.animate-visible {
  opacity: 1;
  transform: translateY(0);
}

.feature-card:hover {
  background: white;
  border-color: #667eea30;
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.15);
  transform: translateY(-10px) scale(1.02);
}

.feature-icon {
  width: 65px;
  height: 65px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 25px;
  color: white;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
}

.feature-icon.purple { background: linear-gradient(135deg, #667eea, #764ba2); }
.feature-icon.blue { background: linear-gradient(135deg, #3b82f6, #2563eb); }
.feature-icon.green { background: linear-gradient(135deg, #10b981, #059669); }
.feature-icon.orange { background: linear-gradient(135deg, #f59e0b, #d97706); }
.feature-icon.pink { background: linear-gradient(135deg, #ec4899, #db2777); }
.feature-icon.cyan { background: linear-gradient(135deg, #06b6d4, #0891b2); }

.feature-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 12px;
}

.feature-desc {
  font-size: 15px;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 20px;
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #667eea;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: gap 0.3s ease;
}

.feature-link:hover {
  gap: 12px;
}

/* ==================== HOW IT WORKS ==================== */
.how-it-works {
  padding: 100px 80px;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  position: relative;
  z-index: 1;
}

.steps-container {
  display: flex;
  justify-content: center;
  gap: 30px;
  position: relative;
}

.step {
  text-align: center;
  position: relative;
  flex: 1;
  max-width: 320px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.step.animate-visible {
  opacity: 1;
  transform: translateY(0);
}

.step-number {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  margin: 0 auto 30px;
  position: relative;
  z-index: 2;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  transition: transform 0.3s ease;
}

.step:hover .step-number {
  transform: scale(1.1);
}

.step-connector {
  position: absolute;
  top: 25px;
  left: calc(50% + 40px);
  width: calc(100% - 50px);
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  z-index: 1;
}

.step-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
  margin: 0 auto 25px;
  transition: transform 0.3s ease;
}

.step:hover .step-icon {
  transform: rotate(10deg) scale(1.05);
}

.step-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 12px;
}

.step-desc {
  font-size: 15px;
  color: #64748b;
  line-height: 1.6;
}

/* ==================== TESTIMONIALS ==================== */
.testimonials {
  padding: 100px 80px;
  background: white;
  position: relative;
  z-index: 1;
}

.testimonials-slider {
  display: flex;
  gap: 30px;
  overflow-x: auto;
  padding: 20px 0;
  scroll-snap-type: x mandatory;
}

.testimonials-slider::-webkit-scrollbar {
  display: none;
}

.testimonial-card {
  flex: 0 0 380px;
  background: #fafafa;
  border-radius: 20px;
  padding: 35px;
  scroll-snap-align: start;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  opacity: 0;
  transform: scale(0.95);
}

.testimonial-card.animate-visible {
  opacity: 1;
  transform: scale(1);
}

.testimonial-card:hover {
  background: white;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  transform: scale(1.02);
}

.testimonial-stars {
  color: #f59e0b;
  margin-bottom: 20px;
}

.testimonial-stars i {
  margin-right: 4px;
  animation: starPulse 1s ease-in-out infinite;
}

.testimonial-stars i:nth-child(1) { animation-delay: 0s; }
.testimonial-stars i:nth-child(2) { animation-delay: 0.1s; }
.testimonial-stars i:nth-child(3) { animation-delay: 0.2s; }
.testimonial-stars i:nth-child(4) { animation-delay: 0.3s; }
.testimonial-stars i:nth-child(5) { animation-delay: 0.4s; }

@keyframes starPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.testimonial-text {
  font-size: 16px;
  color: #374151;
  line-height: 1.7;
  margin-bottom: 25px;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 15px;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 18px;
  transition: transform 0.3s ease;
}

.testimonial-card:hover .author-avatar {
  transform: rotate(10deg);
}

.author-name {
  font-weight: 700;
  color: #1a1a2e;
}

.author-role {
  font-size: 14px;
  color: #64748b;
}

/* ==================== CTA SECTION ==================== */
.cta {
  padding: 100px 80px;
  position: relative;
  z-index: 1;
}

.cta-content {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 30px;
  padding: 80px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-bg-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.cta-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: ctaShapeFloat 10s ease-in-out infinite;
}

.cta-shape-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -100px;
}

.cta-shape-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  left: -50px;
  animation-delay: 2s;
}

@keyframes ctaShapeFloat {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.2) rotate(180deg); }
}

.cta-title {
  font-size: 42px;
  font-weight: 800;
  color: white;
  margin-bottom: 16px;
  position: relative;
}

.cta-desc {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40px;
  position: relative;
}

.cta-buttons {
  margin-bottom: 40px;
  position: relative;
}

.cta .btn-primary {
  background: white;
  color: #667eea;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.cta .btn-primary:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.btn-large {
  padding: 18px 40px;
  font-size: 17px;
}

.cta-features {
  display: flex;
  justify-content: center;
  gap: 40px;
  position: relative;
}

.cta-feature {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
}

.cta-feature i {
  color: #10b981;
}

/* ==================== FOOTER ==================== */
.footer {
  background: #1a1a2e;
  padding: 80px 80px 30px;
  position: relative;
  z-index: 1;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 60px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
}

.footer-logo i {
  color: #667eea;
}

.footer-tagline {
  color: #64748b;
  font-size: 15px;
}

.footer-links {
  display: flex;
  gap: 80px;
}

.footer-column h4 {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
}

.footer-column a {
  display: block;
  color: #94a3b8;
  text-decoration: none;
  font-size: 15px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.footer-column a:hover {
  color: #667eea;
  transform: translateX(5px);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 30px;
  border-top: 1px solid #2d2d44;
}

.footer-bottom p {
  color: #64748b;
  font-size: 14px;
}

.footer-social {
  display: flex;
  gap: 20px;
}

.footer-social a {
  color: #64748b;
  font-size: 20px;
  transition: all 0.3s ease;
}

.footer-social a:hover {
  color: #667eea;
  transform: translateY(-3px);
}

/* ==================== ANIMATIONS ==================== */
.animate-fade-in {
  animation: fadeIn 0.8s ease forwards;
}

.animate-slide-up {
  animation: slideUp 0.8s ease forwards;
}

.animate-float {
  animation: heroFloat 6s ease-in-out infinite;
}

.delay-1 { animation-delay: 0.2s; }
.delay-2 { animation-delay: 0.4s; }
.delay-3 { animation-delay: 0.6s; }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes heroFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 1200px) {
  .hero {
    padding: 80px 40px;
  }
  
  .hero-title {
    font-size: 48px;
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 992px) {
  .hero {
    flex-direction: column;
    text-align: center;
    padding: 60px 30px;
  }
  
  .hero-content {
    max-width: 100%;
  }
  
  .hero-buttons {
    justify-content: center;
  }
  
  .hero-stats {
    justify-content: center;
  }
  
  .hero-visual {
    max-width: 100%;
  }
  
  .dashboard-mockup {
    transform: none;
  }
  
  .steps-container {
    flex-direction: column;
    align-items: center;
  }
  
  .step-connector {
    display: none;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 40px;
  }
  
  .footer-links {
    gap: 40px;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }
  
  .section-title {
    font-size: 32px;
  }
  
  .features, .how-it-works, .testimonials, .cta, .footer {
    padding: 60px 20px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-content {
    padding: 50px 30px;
  }
  
  .cta-features {
    flex-direction: column;
    gap: 15px;
  }
  
  .floating-card {
    display: none;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 20px;
  }
  
  .stat-divider {
    width: 40px;
    height: 1px;
  }
}
</style>
