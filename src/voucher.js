import tools from './utils/tools.js';

// prevent open browser in-app on LINE
tools.openExternalFromLine();

import Vue from 'vue';
import voucher from './voucher.vue';
import configs from './config/configs.js';
import seo from './utils/seo.js';
import ga from './utils/ga.js';
import api from './apis/api.js';
import VueLazyload from 'vue-lazyload';

Vue.config.productionTip = false;

// export configs
Vue.prototype.configs = configs;
Vue.prototype.tools = tools;
Vue.prototype.seo = seo;
Vue.prototype.ga = ga;
Vue.prototype.api = api;

Vue.use(VueLazyload);

api.web.processSupplier().then((siteData) => {
  if (siteData) {
    Vue.prototype.siteData = siteData;
  }
  new Vue({
    render: (h) => h(voucher),
  }).$mount('#app');
});
