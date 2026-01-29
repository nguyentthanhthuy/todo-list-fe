import { createRouter, createWebHistory } from "vue-router"; // cài vue-router: npm install vue-router@next --save

const routes = [
    {
        path : '/',
        component: ()=>import('../components/Client/TrangChu/index.vue'),
      
    },
    {
        path : '/profile',
        component: ()=>import('../components/Client/Profile/index.vue'),
      
    },
    {
        path : '/update-thong-tin',
        component: ()=>import('../components/Client/CapNhatThongTin/index.vue'),
      
    },
    {
        path : '/doi-mat-khau',
        component: ()=>import('../components/Client/DoiMatKhau/index.vue'),
        
        
    },
    
     {
        path : '/dang-ky',
        component: ()=>import('../components/Client/DangKy/index.vue'),
      
    },
     {
        path : '/login',
        component: ()=>import('../components/Client/Login/index.vue'),
      
    },
    {
        path : '/dashboard',
        component: ()=>import('../components/Client/BaoCao/index.vue'),
      
    },
    {
        path : '/projects',
        component: ()=>import('../components/Client/Projects/index.vue'),
      
    },
    {
        path : '/lich',
        
        component: ()=>import('../components/Client/Calendar/index.vue'),
      
    },
    {
        path : '/them-moi-cong-viec',
        
        component: ()=>import('../components/Client/CongViec/TaskCreate.vue'),
      
    },
    {
        path: "/cong-viec",
        name: "TaskList",
        component: ()=>import('../components/Client/CongViec/TaskList.vue')
    },
    
    {
        path: "/tasks/edit/:id",
        name: "TaskEdit",
        component: ()=>import('../components/Client/CongViec/TaskEdit.vue'),
        props: true,  // để $route.params.id có thể dùng như props
    },
    {
        path: "/tasks/detail/:id",
        name: "TaskDetail",
        component: ()=>import('../components/Client/CongViec/TaskDetail.vue'),
        props: true,
    },
    {
        path: "/tags",
        name: "Tags",
        component: ()=>import('../components/Client/Tags/index.vue'),
    },
    {
        path: "/reminders",
        name: "Reminders",
        component: ()=>import('../components/Client/Reminders/index.vue'),
    },
    {
        path: "/activity-logs",
        name: "ActivityLogs",
        component: ()=>import('../components/Client/ActivityLogs/index.vue'),
    },
    {
        path : '/driver',
        component: ()=>import('../components/Client/GoogleDriver/index.vue'),
      
    },
    {
        path : '/driver/upload',
        component: ()=>import('../components/Client/GoogleDriver/driverupload.vue'),
      
    },
    {
        path: '/auth/callback',
        name: 'AuthCallback',
        component: () => import('../views/AuthCallback.vue')
    },
    {
        path: '/auth/callregisterback',
        name: 'AuthRegisterCallback',
        component: () => import('../views/AuthRegisterCallback.vue')
    }

    
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router