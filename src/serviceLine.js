import tools from './utils/tools.js'

// prevent open browser in-app on LINE
tools.openExternalFromLine()

import api from './apis/api.js';
import axios from 'axios'
import configs from './config/configs.js'
import ga from './utils/ga.js'
import seo from './utils/seo.js'
import serviceLine from './ServiceLine.vue'
import storage from './utils/storage.js'
import Vue from 'vue'
import VueAxios from 'vue-axios'

// export configs
Vue.prototype.api = api;
Vue.prototype.configs = configs
Vue.prototype.storage = storage
Vue.prototype.ga = ga
Vue.prototype.seo = seo
Vue.prototype.tools = tools

// axios default setting
axios.defaults.baseURL = configs.apiPath()

Vue.use(VueAxios, axios)

api.web.processSupplier().then((siteData) => {
  if (siteData) {
    Vue.prototype.siteData = siteData
  }
  new Vue({
    render: (h) => h(serviceLine),
  }).$mount('#app')
})