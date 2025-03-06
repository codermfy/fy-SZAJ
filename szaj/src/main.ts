import './assets/style/reset.scss';
import './assets/style/theme.scss';
import jweixin from 'weixin-js-sdk'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
// import VConsole from 'vconsole';
// let vconsole = new VConsole();
const app = createApp(App)

app.config.globalProperties.$wx=jweixin
const pinia=createPinia().use(piniaPluginPersistedstate)
app.use(pinia);

app.use(router)

app.mount('#app')

