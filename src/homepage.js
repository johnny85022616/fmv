import tools from './utils/tools.js';

// prevent open browser in-app on LINE
tools.openExternalFromLine();

import api from './apis';
import axios from 'axios';
import configs from './config/configs.js';
import ga from './utils/ga.js';
import Homepage from './Homepage.vue';
import seo from './utils/seo.js';
import storage from './utils/storage.js';
import Vue from 'vue';
import VueAxios from 'vue-axios';
import VueCarousel from 'vue-carousel';
import VueLazyload from 'vue-lazyload';

Vue.config.productionTip = false;

// export configs
Vue.prototype.api = api;
Vue.prototype.configs = configs;
Vue.prototype.ga = ga;
Vue.prototype.seo = seo;
Vue.prototype.storage = storage;
Vue.prototype.tools = tools;

// axios default setting
axios.defaults.baseURL = configs.apiPath();

Vue.use(VueCarousel);
Vue.use(VueLazyload);
Vue.use(VueAxios, axios);

api.web.processSupplier().then((siteData) => {
  Vue.prototype.siteData = siteData;
  new Vue({
    render: (h) => h(Homepage),
  }).$mount('#app');
});
