<template>
    <div class="d-flex app-wrapper">
        <!-- SIDEBAR -->
        <Sidebar />

        <!-- MAIN CONTENT -->
        <div class="flex-grow-1 main-content" style="margin-left: 260px;">
            <!-- TOPBAR -->
            <nav class="navbar bg-white border-bottom px-4 sticky-top">
                <div class="d-flex align-items-center w-100">
                    <!-- Breadcrumb / Title -->
                    <div class="flex-grow-1">
                        <h5 class="mb-0 fw-semibold">{{ pageTitle }}</h5>
                    </div>
                    
                    <!-- User Menu -->
                    <div class="d-flex align-items-center gap-3">
                        <router-link to="/dashboard" class="btn btn-light position-relative" title="Dashboard">
                            <i class="fa-solid fa-home"></i>
                        </router-link>
                        <router-link to="/profile" class="d-flex align-items-center text-decoration-none text-dark">
                            <div class="avatar-sm me-2">
                                <img v-if="user?.avatar" :src="user.avatar" class="rounded-circle" width="36" height="36">
                                <div v-else class="avatar-placeholder-sm">
                                    {{ getInitials(user?.ho_va_ten) }}
                                </div>
                            </div>
                            <span class="fw-medium">{{ user?.ho_va_ten || 'User' }}</span>
                        </router-link>
                    </div>
                </div>
            </nav>

            <!-- PAGE CONTENT -->
            <div class="page-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
import Sidebar from '@/components/Common/Sidebar.vue';
import api from '@/core/baseRequest';

export default {
    name: "AppLayout",

    components: {
        Sidebar,
    },

    props: {
        pageTitle: {
            type: String,
            default: '',
        },
    },

    data() {
        return {
            user: null,
        };
    },

    async mounted() {
        await this.loadUser();
    },

    methods: {
        async loadUser() {
            try {
                const res = await api.get('/client/profile/data');
                this.user = res.data.data;
            } catch (e) {
                console.error('Error loading user:', e);
            }
        },

        getInitials(name) {
            if (!name) return '?';
            return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
        },
    },
};
</script>

<style scoped>
.app-wrapper {
    min-height: 100vh;
    background: #f8f9fa;
}

.main-content {
    min-height: 100vh;
}

.navbar {
    height: 65px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.page-content {
    padding: 0;
}

.avatar-placeholder-sm {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.85rem;
}
</style>
