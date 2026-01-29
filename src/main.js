import { createApp, nextTick } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import Default from './Layout/Wrapper/index.vue'
import Toast, { POSITION } from 'vue-toastification'
import vue3GoogleLogin from 'vue3-google-login'
import 'vue-toastification/dist/index.css';


const app = createApp(App)
app.use(vue3GoogleLogin, {
  clientId: '87240509698-qvv6v13l9c5kdh16lsruue9dl7nljnve.apps.googleusercontent.com',
})
app.component('default-layout', Default)
app.use(router)

// Sử dụng Toastification
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 2500,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
})


app.mount('#app')
 
nextTick(() => {
  import('bootstrap/dist/js/bootstrap.bundle.min.js').then((bootstrap) => {
    window.bootstrap = bootstrap
  })
})
