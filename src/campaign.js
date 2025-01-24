import api from './apis';
import axios from 'axios';
import campaign from './campaign.vue';
import configs from './config/configs.js';
import ga from './utils/ga.js';
import seo from './utils/seo.js';
import tools from './utils/tools.js';
import Vue from 'vue';
import VueAxios from 'vue-axios';
import VueLazyload from 'vue-lazyload';

Vue.config.productionTip = false;

// export configs
Vue.prototype.api = api;
Vue.prototype.configs = configs;
Vue.prototype.ga = ga;
Vue.prototype.seo = seo;
Vue.prototype.tools = tools;

// axios default setting
axios.defaults.baseURL = configs.apiPath();
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8;';

Vue.use(VueAxios, axios);
Vue.use(VueLazyload);

api.web.processSupplier().then((siteData) => {
  Vue.prototype.siteData = siteData;
  new Vue({
    render: (h) => h(campaign),
  }).$mount('#app');
});
