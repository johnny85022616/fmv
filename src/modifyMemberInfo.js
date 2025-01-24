import api from './apis';
import configs from './config/configs.js';
import ga from './utils/ga.js';
import modifyMemberInfo from './modifyMemberInfo.vue';
import seo from './utils/seo.js';
import tools from './utils/tools.js';
import Vue from 'vue';

// export configs
Vue.prototype.api = api;
Vue.prototype.configs = configs;
Vue.prototype.ga = ga;
Vue.prototype.seo = seo;
Vue.prototype.tools = tools;

api.web.processSupplier().then((siteData) => {
  if (siteData) {
    Vue.prototype.siteData = siteData;
  }
  new Vue({
    render: (h) => h(modifyMemberInfo),
  }).$mount('#app');
});
