import tools from './utils/tools.js';
// prevent open browser in-app on LINE
tools.openExternalFromLine();

import Vue from 'vue';
import creditCardManagement from './CreditCardManagement.vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueCarousel from 'vue-carousel';
import VueLazyload from 'vue-lazyload';
import configs from './config/configs.js';
import storage from './utils/storage.js';
import ga from './utils/ga.js';
import seo from './utils/seo.js';
import api from './apis';

Vue.config.productionTip = false;

// export configs
Vue.prototype.configs = configs;
Vue.prototype.storage = storage;
Vue.prototype.ga = ga;
Vue.prototype.seo = seo;
Vue.prototype.tools = tools;
Vue.prototype.api = api;

// axios default setting
axios.defaults.baseURL = configs.apiPath();

// Invoke friday component
Vue.prototype.fridayComponent = window.fridayComponent;

Vue.use(VueCarousel);
Vue.use(VueLazyload);
Vue.use(VueAxios, axios);

api.web.processSupplier().then((siteData) => {
  Vue.prototype.siteData = siteData;
  new Vue({
    render: (h) => h(creditCardManagement),
  }).$mount('#app');
});
