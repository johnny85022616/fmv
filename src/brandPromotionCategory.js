import tools from './utils/tools.js';
import Vue from 'vue';
import brandPromotionCategory from './brandPromotionCategory.vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueCarousel from 'vue-carousel';
import VueLazyload from 'vue-lazyload';
import configs from './config/configs.js';
import api from './apis/api.js';
import storage from './utils/storage.js';
import ga from './utils/ga.js';
import seo from './utils/seo.js';

Vue.config.productionTip = false;

// export configs
Vue.prototype.api = api;
Vue.prototype.configs = configs;
Vue.prototype.storage = storage;
Vue.prototype.ga = ga;
Vue.prototype.seo = seo;
Vue.prototype.tools = tools;

// axios default setting
axios.defaults.baseURL = configs.apiPath();

Vue.use(VueCarousel);
Vue.use(VueLazyload);

Vue.use(VueAxios, axios);

api.web.processSupplier().then((siteData) => {
  Vue.prototype.siteData = siteData;
  new Vue({
    render: (h) => h(brandPromotionCategory),
  }).$mount('#app');
});
