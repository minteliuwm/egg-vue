import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import mixin from './mixin';

import { Message } from 'element-ui';

Vue.prototype.$message = Message;

Vue.mixin(mixin);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h: any) => h(App)
}).$mount('#app');
