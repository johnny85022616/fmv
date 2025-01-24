import myFcoin from './myFcoin.vue';
import api from './apis/api';
import configs from './config/configs.js';
import tools from './utils/tools.js';
import Vue from 'vue';

Vue.config.productionTip = false;

// export configs
Vue.prototype.api = api;
Vue.prototype.configs = configs;
Vue.prototype.tools = tools;

api.web.processSupplier().then((siteData) => {
  if (siteData) {
    Vue.prototype.siteData = siteData;
  }
  new Vue({
    render: (h) => h(myFcoin),
  }).$mount('#app');
});
