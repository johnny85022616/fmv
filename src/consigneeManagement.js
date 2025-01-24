import tools from './utils/tools.js'

// prevent open browser in-app on LINE
tools.openExternalFromLine()

import Vue from 'vue'
import ConsigneeManagement from './consigneeManagement.vue'
import configs from './config/configs.js'
import ga from './utils/ga.js'
import seo from './utils/seo.js'
import api from './apis/api.js';


Vue.config.productionTip = false

// export configs
Vue.prototype.configs = configs
Vue.prototype.api = api;
Vue.prototype.tools = tools
Vue.prototype.ga = ga
Vue.prototype.seo = seo

// Invoke friday component
Vue.prototype.fridayComponent = window.fridayComponent

new Vue({
  render: (h) => h(ConsigneeManagement),
}).$mount('#app')
