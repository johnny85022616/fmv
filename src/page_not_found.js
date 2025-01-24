import tools from './utils/tools.js'

// prevent open browser in-app on LINE
tools.openExternalFromLine()

import Vue from 'vue'
import invoiceManagement from './page_not_found.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import configs from './config/configs.js'
import storage from './utils/storage.js'
import ga from './utils/ga.js'
import api from './apis/api.js';

Vue.config.productionTip = false

// export configs
Vue.prototype.configs = configs
Vue.prototype.storage = storage
Vue.prototype.tools = tools
Vue.prototype.ga = ga
Vue.prototype.api = api;

// axios default setting
axios.defaults.baseURL = configs.apiPath()

Vue.use(VueAxios, axios)

new Vue({
  render: (h) => h(invoiceManagement),
}).$mount('#app')
