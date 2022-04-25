import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import APlayer from '@moefe/vue-aplayer';
import musicPlayComImg from './assets/image/音乐.png'

Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.use(APlayer, {
  defaultCover: musicPlayComImg,
  productionTip: true,
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
