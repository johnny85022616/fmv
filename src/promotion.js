import tools from './utils/tools.js'

// prevent open browser in-app on LINE
tools.openExternalFromLine()

import api from './apis/api.js';
import axios from 'axios'
import Campaign from './Promotion.vue'
import configs from './config/configs.js'
import ga from './utils/ga.js'
import seo from './utils/seo.js'
import Vue from 'vue'
import VueAxios from 'vue-axios'
import VueCarousel from 'vue-carousel'
import VueLazyload from 'vue-lazyload'

// export configs
Vue.prototype.api = api;
Vue.prototype.configs = configs
Vue.prototype.ga = ga
Vue.prototype.seo = seo
Vue.prototype.tools = tools

// axios default setting
axios.defaults.baseURL = configs.apiPath()
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8;'

// Invoke friday component
Vue.prototype.fridayComponent = window.fridayComponent

Vue.use(VueCarousel)
Vue.use(VueLazyload)
Vue.use(VueAxios, axios)

new Vue({
  render: (h) => h(Campaign),
}).$mount('#app')
