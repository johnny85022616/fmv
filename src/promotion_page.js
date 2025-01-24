import tools from './utils/tools.js'

tools.openExternalFromLine()

import Vue from 'vue'
import Campaign from './PromotionPage.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCarousel from 'vue-carousel'
import VueLazyload from 'vue-lazyload'
import configs from './config/configs.js'
import seo from './utils/seo.js'
import ga from './utils/ga.js'
import api from './apis/api.js';

// export configs
Vue.prototype.configs = configs
Vue.prototype.tools = tools
Vue.prototype.seo = seo
Vue.prototype.ga = ga
Vue.prototype.api = api;

// axios default setting
axios.defaults.baseURL = configs.apiPath()
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8;'

Vue.use(VueCarousel)
Vue.use(VueLazyload)
Vue.use(VueAxios, axios)

new Vue({
  render: (h) => h(Campaign),
}).$mount('#app')
