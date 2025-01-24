import tools from './utils/tools.js'

// redirect to desktop if not use mobile device.
const desktopPath = location.pathname.replace('/mobileweb','') + '.html'
tools.checkMweb(desktopPath)
// prevent open browser in-app on LINE
tools.openExternalFromLine()

import Vue from 'vue'
import Category from './Category.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCarousel from 'vue-carousel'
import VueLazyload from 'vue-lazyload'
import configs from './config/configs.js'
import seo from './utils/seo.js'
import ga from './utils/ga.js'

Vue.config.productionTip = false

// export configs
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

Vue.use(VueCarousel)
Vue.use(VueLazyload)
Vue.use(VueAxios, axios)

new Vue({
  render: (h) => h(Category),
}).$mount('#app')
