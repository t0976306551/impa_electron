import { createApp } from 'vue'
import 'vuetify/styles'

// import "./style.css"
import App from './App.vue'
import './samples/node-api'
import vuetify from './plugins/vuetify';
import router from './router'

createApp(App)
  .use(vuetify)
  .use(router)
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
