import tools from './utils/tools.js';

// prevent open browser in-app on LINE
tools.openExternalFromLine();

import Vue from 'vue';
import step2 from './checkout_step2.vue';
import configs from './config/configs.js';
import ga from './utils/ga.js';
import api from './apis/api.js';

// export configs
Vue.prototype.configs = configs;
Vue.prototype.tools = tools;
Vue.prototype.ga = ga;
Vue.prototype.api = api;

api.web.processSupplier().then((siteData) => {
  Vue.prototype.siteData = siteData;
  new Vue({
    render: (h) => h(step2),
  }).$mount('#app');
});
