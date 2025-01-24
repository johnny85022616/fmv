import tools from './utils/tools.js';

// prevent open browser in-app on LINE
tools.openExternalFromLine();

import Vue from 'vue';
import VueLazyload from 'vue-lazyload';
import shipFeeProductList from './shipFeeProductList.vue';
import configs from './config/configs.js';
import ga from './utils/ga.js';
import api from './apis/api.js';

// export configs
Vue.prototype.configs = configs;
Vue.prototype.tools = tools;
Vue.prototype.ga = ga;
Vue.prototype.api = api;
Vue.use(VueLazyload);

api.web.processSupplier().then((siteData) => {
  Vue.prototype.siteData = siteData;
  new Vue({
    render: (h) => h(shipFeeProductList),
  }).$mount('#app');
});
