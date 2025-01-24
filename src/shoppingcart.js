import Vue from 'vue';
import shoppingcart from './shoppingcart.vue';
import tools from './utils/tools.js';
import api from './apis/api.js';
import configs from './config/configs.js';
import ga from './utils/ga.js';
import jwt from 'jsonwebtoken';

Vue.config.productionTip = false;

// export configs
Vue.prototype.configs = configs;
Vue.prototype.ga = ga;
Vue.prototype.tools = tools;
Vue.prototype.jwt = jwt;
Vue.prototype.api = api;

api.web.processSupplier().then((siteData) => {
  Vue.prototype.siteData = siteData;
  new Vue({
    render: (h) => h(shoppingcart),
  }).$mount('#app');
});
