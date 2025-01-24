import tools from './utils/tools.js';

// prevent open browser in-app on LINE
tools.openExternalFromLine();

import api from './apis';
import axios from 'axios';
import configs from './config/configs.js';
import ga from './utils/ga.js';
import happygo from './happygo.vue';
import seo from './utils/seo.js';
import Vue from 'vue';
import VueAxios from 'vue-axios';

Vue.config.productionTip = false;

// export configs
Vue.prototype.api = api
Vue.prototype.configs = configs;
Vue.prototype.ga = ga;
Vue.prototype.seo = seo;
Vue.prototype.tools = tools;

// axios default setting
axios.defaults.baseURL = configs.apiPath();

Vue.use(VueAxios, axios);

api.web.processSupplier().then((siteData) => {
  if (siteData) {
    Vue.prototype.siteData = siteData;
  }
  new Vue({
    render: (h) => h(happygo),
  }).$mount('#app');
});
