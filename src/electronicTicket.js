import electronicTicket from './electronicTicket.vue';
import api from './apis';
import configs from './config/configs.js';
import tools from './utils/tools.js';
import Vue from 'vue';
import seo from './utils/seo.js';

Vue.config.productionTip = false;

// export configs
Vue.prototype.api = api;
Vue.prototype.configs = configs;
Vue.prototype.tools = tools;
Vue.prototype.seo = seo;

api.web.processSupplier().then((siteData) => {
  if (siteData) {
    Vue.prototype.siteData = siteData;
  }
  new Vue({
    render: (h) => h(electronicTicket),
  }).$mount('#app');
});
