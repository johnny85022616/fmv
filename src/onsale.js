import tools from './utils/tools.js'

// prevent open browser in-app on LINE
tools.openExternalFromLine()

import Vue from 'vue'
import onsale from './onsale.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import configs from './config/configs.js'
import seo from './utils/seo.js'
import ga from './utils/ga.js'
import VueLazyload from 'vue-lazyload'
import api from './apis/api.js';

Vue.config.productionTip = false

// export configs
Vue.prototype.configs = configs
Vue.prototype.tools = tools
Vue.prototype.seo = seo
Vue.prototype.ga = ga
Vue.prototype.api = api;

// axios default setting
axios.defaults.baseURL = configs.apiPath()
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8;'

Vue.use(VueAxios, axios)
Vue.use(VueLazyload)

api.web.processSupplier().then((siteData) => {
  if (siteData) {
    Vue.prototype.siteData = siteData
  }
  new Vue({
    render: (h) => h(onsale),
  }).$mount('#app')
})