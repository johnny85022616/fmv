import tools from './utils/tools.js';

// prevent open browser in-app on LINE
tools.openExternalFromLine();

import api from './apis/api.js';
import configs from './config/configs.js';
import ga from './utils/ga.js';
import myCampaign from './myCampaign.vue';
import seo from './utils/seo.js';
import Vue from 'vue';

// export configs
Vue.prototype.api = api;
Vue.prototype.configs = configs;
Vue.prototype.ga = ga;
Vue.prototype.seo = seo;
Vue.prototype.tools = tools;

api.web.processSupplier().then((siteData) => {
  Vue.prototype.siteData = siteData;
  new Vue({
    render: (h) => h(myCampaign),
  }).$mount('#app');
});
