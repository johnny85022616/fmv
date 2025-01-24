import api from './apis/api.js';
import configs from './config/configs.js';
import invoicePrinting from './invoicePrinting.vue';
import Vue from 'vue';

Vue.config.productionTip = false

// export configs
Vue.prototype.configs = configs;
Vue.prototype.siteData = null;
Vue.prototype.api = api;

new Vue({
  render: (h) => h(invoicePrinting),
}).$mount('#app');