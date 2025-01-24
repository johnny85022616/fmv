import aiViewed from './aiViewed.vue'
import api from './apis';
import axios from 'axios'
import configs from './config/configs.js'
import ga from './utils/ga.js'
import seo from './utils/seo.js'
import tools from './utils/tools.js'
import Vue from 'vue'
import VueAxios from 'vue-axios'
import VueLazyload from 'vue-lazyload'

Vue.config.productionTip = false

// export configs
Vue.prototype.api = api
Vue.prototype.configs = configs
Vue.prototype.tools = tools
Vue.prototype.seo = seo
Vue.prototype.ga = ga

// axios default setting
axios.defaults.baseURL = configs.apiPath()
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8;'

// Append EC Category Rules
const head = document.querySelector('head')
const campaignJS = document.createElement('script')
// campaignJS.src = 'https://ec2-muat.shopping.friday.tw/static/js/campaign.js?' + new Date().getTime()
campaignJS.src = configs.baseUrlPath() + '/static/js/campaign.js?' + new Date().getTime()
campaignJS.type = 'text/javascript'
head.appendChild(campaignJS)

// Invoke friday component
Vue.prototype.fridayComponent = window.fridayComponent

Vue.use(VueAxios, axios)
Vue.use(VueLazyload)

api.web.processSupplier().then((siteData) => {
  if (siteData) {
    Vue.prototype.siteData = siteData
  }
  new Vue({
    render: (h) => h(aiViewed),
  }).$mount('#app')
})