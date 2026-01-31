<template>
    <div class="sidebar-modern vh-100 d-flex flex-column" style="width: 260px;">
        <div class="logo-section text-center py-4">
            <div class="logo-icon mb-2">
                <i class="fa-solid fa-briefcase"></i>
            </div>
            <h4 class="logo-text mb-0">WorkBuddy</h4>
        </div>

        <ul class="nav flex-column px-3 flex-grow-1">
            <li class="nav-item">
                <router-link to="/dashboard" class="nav-link-modern" :class="{ active: isActive('/dashboard') }">
                    <div class="icon-wrapper">
                        <i class="fa-solid fa-home"></i>
                    </div>
                    <span>Dashboard</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/cong-viec" class="nav-link-modern" :class="{ active: isActive('/cong-viec') || isActive('/tasks') }">
                    <div class="icon-wrapper">
                        <i class="fa-solid fa-list-check"></i>
                    </div>
                    <span>Công việc</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/projects" class="nav-link-modern" :class="{ active: isActive('/projects') }">
                    <div class="icon-wrapper">
                        <i class="fa-solid fa-bars-progress"></i>
                    </div>
                    <span>Dự án</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/lich" class="nav-link-modern" :class="{ active: isActive('/lich') }">
                    <div class="icon-wrapper">
                        <i class="fa-solid fa-calendar"></i>
                    </div>
                    <span>Lịch</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/tags" class="nav-link-modern" :class="{ active: isActive('/tags') }">
                    <div class="icon-wrapper">
                        <i class="fa-solid fa-tags"></i>
                    </div>
                    <span>Nhãn</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/teams" class="nav-link-modern" :class="{ active: isActive('/teams') }">
                    <div class="icon-wrapper">
                        <i class="fa-solid fa-users"></i>
                    </div>
                    <span>Teams</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/driver" class="nav-link-modern" :class="{ active: isActive('/driver') }">
                    <div class="icon-wrapper">
                        <i class="fa-brands fa-google-drive"></i>
                    </div>
                    <span>Google Drive</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/discord" class="nav-link-modern" :class="{ active: isActive('/discord') }">
                    <div class="icon-wrapper">
                        <i class="fa-brands fa-discord"></i>
                    </div>
                    <span>Discord</span>
                </router-link>
            </li>
            <li class="nav-item mt-auto">
                <router-link to="/profile" class="nav-link-modern" :class="{ active: isActive('/profile') }">
                    <div class="icon-wrapper">
                        <i class="fa-solid fa-user"></i>
                    </div>
                    <span>Hồ sơ</span>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "AppSidebar",

    methods: {
        isActive(path) {
            return this.$route.path.startsWith(path);
        },
    },
};
</script>

<style scoped>
.sidebar-modern {
    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
}

.sidebar-modern::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="white" opacity="0.03"/></svg>');
    pointer-events: none;
}

.logo-section {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    z-index: 1;
}

.logo-icon {
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    font-size: 1.5rem;
    color: white;
}

.logo-text {
    color: white;
    font-weight: 700;
    font-size: 24px;
    letter-spacing: -0.5px;
}

.nav-link-modern {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    border-radius: 12px;
    margin-bottom: 8px;
    transition: all 0.3s ease;
    font-weight: 500;
    font-size: 15px;
    position: relative;
}

.nav-link-modern:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transform: translateX(5px);
}

.nav-link-modern.active {
    background: white;
    color: #667eea;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.icon-wrapper {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    font-size: 18px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
}

.nav-link-modern.active .icon-wrapper {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.badge-count {
    margin-left: auto;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
}

.nav-link-modern.active .badge-count {
    background: #667eea;
    color: white;
}

/* Responsive */
@media (max-width: 992px) {
    .sidebar-modern {
        width: 80px !important;
    }

    .logo-text,
    .nav-link-modern span,
    .badge-count {
        display: none;
    }

    .nav-link-modern {
        justify-content: center;
    }

    .icon-wrapper {
        margin-right: 0;
    }
}
</style>
