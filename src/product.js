import tools from './utils/tools.js';

// prevent open browser in-app on LINE
tools.openExternalFromLine();

import Vue from 'vue';
import Product from './Product.vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueCarousel from 'vue-carousel';
import VueLazyload from 'vue-lazyload';
import VueYoutube from 'vue-youtube-embed';
import configs from './config/configs.js';
import storage from './utils/storage.js';
import ga from './utils/ga.js';
import seo from './utils/seo.js';
import ailog from './utils/ailog.js';
import api from './apis/api.js';
import jwt from 'jsonwebtoken';

Vue.config.productionTip = false;

// export configs
Vue.prototype.configs = configs;
Vue.prototype.storage = storage;
Vue.prototype.tools = tools;
Vue.prototype.ga = ga;
Vue.prototype.seo = seo;
Vue.prototype.ailog = ailog;
Vue.prototype.jwt = jwt;
Vue.prototype.api = api;

// axios default setting
axios.defaults.baseURL = configs.apiPath();

// Invoke friday component
Vue.prototype.fridayComponent = window.fridayComponent;

Vue.use(VueCarousel);
if (!tools.isLighthouse) {
  Vue.use(VueYoutube);
  Vue.use(VueLazyload);
}
Vue.use(VueAxios, axios);

api.web.processSupplier().then((siteData) => {
  if (siteData) {
    Vue.prototype.siteData = siteData;
  }
  new Vue({
    render: (h) => h(Product),
  }).$mount('#app');
});
