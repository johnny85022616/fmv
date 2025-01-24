import tools from './utils/tools.js';

// prevent open browser in-app on LINE
tools.openExternalFromLine();

import api from './apis/api.js';
import configs from './config/configs.js';
import ga from './utils/ga.js';
import GetCoupon from './GetCoupon.vue';
import seo from './utils/seo.js';
import Vue from 'vue';

// export configs
Vue.prototype.configs = configs;
Vue.prototype.tools = tools;
Vue.prototype.ga = ga;
Vue.prototype.api = api;
Vue.prototype.seo = seo;

api.web.processSupplier().then((siteData) => {
  Vue.prototype.siteData = siteData;
  new Vue({
    render: (h) => h(GetCoupon),
  }).$mount('#app');
});
