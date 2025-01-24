import tools from './utils/tools.js'

// redirect to desktop if not use mobile device.
const desktopPath = location.pathname.replace('/mobileweb/intro/privacy-intro','/ec2/privacy') + '.html'
tools.checkMweb(desktopPath)
// prevent open browser in-app on LINE
tools.openExternalFromLine()

import Vue from 'vue'
import privacyIntro from './PrivacyIntro.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCarousel from 'vue-carousel'
import VueLazyload from 'vue-lazyload'
import configs from './config/configs.js'
import storage from './utils/storage.js'
import ga from './utils/ga.js'
import seo from './utils/seo.js'
import api from './apis/api.js';

Vue.config.productionTip = false

// export configs
Vue.prototype.configs = configs
Vue.prototype.storage = storage
Vue.prototype.ga = ga
Vue.prototype.seo = seo
Vue.prototype.tools = tools
Vue.prototype.api = api;

// axios default setting
axios.defaults.baseURL = configs.apiPath()

Vue.use(VueCarousel)
Vue.use(VueLazyload)
Vue.use(VueAxios, axios)

api.web.processSupplier().then((siteData) => {
  if (siteData) {
    Vue.prototype.siteData = siteData
  }
  new Vue({
    render: (h) => h(privacyIntro),
  }).$mount('#app')
})