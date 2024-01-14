import { createApp } from 'vue'
import 'vuetify/styles'

// import "./style.css"
import App from './App.vue'
import './samples/node-api'
import vuetify from './plugins/vuetify';
import router from './router'
import { ipcRenderer } from 'electron';

// createApp(App)
//   .use(vuetify)
//   .use(router)
//   .mount('#app')
//   .$nextTick(() => {
//     postMessage({ payload: 'removeLoading' }, '*')
//   })
const app  = createApp(App);
app.use(router).use(vuetify);
if (import.meta.env.MODE === 'electron') {
  app.config.globalProperties.$ipcRenderer = ipcRenderer;
}
app.mount('#app').$nextTick(() => {
  // Send a message to the Electron main process
  postMessage({ payload: 'removeLoading' }, '*')
  // if (import.meta.env.MODE === 'electron') {
  //   ipcRenderer.send('some-message', { payload: 'removeLoading' }, '*');
  // }
});