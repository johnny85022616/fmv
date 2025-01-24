/**
 * friDay Mweb Configurations
 */

const {
  VUE_APP_IMG_DOMAIN,
  VUE_APP_MSERVICE_API_DOMAIN,
  VUE_APP_MOBILE_DOMAIN,
  VUE_APP_DESKTOP_DOMAIN,
  VUE_APP_YSDT_DOMAIN,
  VUE_APP_MOBILE_API_DOMAIN,
  VUE_APP_AI_API_DOMAIN,
  VUE_APP_AI_CLOUD_API_DOMAIN,
  VUE_APP_AI_SERVICE_DOMAIN,
  VUE_APP_AI_SERVICE_WEB_DOMAIN,
  VUE_APP_AI_SEARCH_DOMAIN,
  VUE_APP_IMG_JSON_DOMAIN,
  VUE_APP_FRONT_API_DOMAIN,
  VUE_APP_CONFIG_API_DOMAIN,
  VUE_APP_FRONT_CLOUD_API_DOMAIN,
  VUE_APP_HOURS_API_PATH,
  VUE_APP_AIDISCOUNT_API_DOMAIN,
} = process.env;

/*
 * 定義
 * isLocal , for 本機測試
 * Front API 環境
 */
if (typeof window !== 'undefined') {
  window.isLocal = /^(localhost:8080|127)/i.test(location.host);
}

module.exports = {
  title: '遠傳friDay購物',
  description:
    '遠傳friDay購物提供遠東百貨、SOGO百貨、愛買量販、品牌outlet及3C、居家、流行等全品類共超過80萬件商品，享折價券現領現折、HAPPY GO點數累兌點，7日猶豫期。(原GoHappy快樂購物網)',
  baseUrlPath: () => {
    return VUE_APP_MOBILE_DOMAIN;
  },
  // 大網對應DOMAIN
  desktopDomain: () => {
    return VUE_APP_DESKTOP_DOMAIN;
  },
  // BSite對應DOMAIN
  ysdtDomain: () => {
    return VUE_APP_YSDT_DOMAIN;
  },
  aiDiscountDomain() {
    return VUE_APP_AIDISCOUNT_API_DOMAIN;
  },
  // 設定特定WT.me_id參數 不顯示APP下載及共用天
  hiddenCommonHeader: new RegExp('WT.(me|md)_id=(shopping|kol|turnturn|\\w+_AI)', 'i'),
  isRedBg: new RegExp('_AI', ''), // 心生活fetmc_appshopping_ai要小心衝突
  simpleProductCnt: new RegExp('_AI', 'i'),
  directToCheckout: new RegExp('_AI', ''), // 心生活fetmc_appshopping_ai要小心衝突
  // 判斷商品是否只能遠傳幣折抵，product.vue, buyitem.vue 皆需要判讀
  isRestrictCoinCheckout: (productInfo) => {
    return productInfo.isFullRedeem;
  },
  apiPath: (overwriteRoot) => {
    let apiRoot = '/mobileapi/';
    if (overwriteRoot && typeof overwriteRoot !== 'undefined') apiRoot = overwriteRoot;
    return VUE_APP_MOBILE_API_DOMAIN + apiRoot;
  },
  imgDomain: VUE_APP_IMG_DOMAIN,
  imgJsonDomain: VUE_APP_IMG_JSON_DOMAIN,
  aiApiPath: VUE_APP_AI_API_DOMAIN,
  aiCloudApiPath: VUE_APP_AI_CLOUD_API_DOMAIN,
  frontApiPath: () => {
    return `${VUE_APP_FRONT_API_DOMAIN}/frontendapi/`;
  },
  frontCloudApiPath: () => {
    return `${VUE_APP_FRONT_CLOUD_API_DOMAIN}/frontendapi/`;
  },
  bconfigApiPath: () => {
    return `${VUE_APP_CONFIG_API_DOMAIN}/frontendapi/`;
  },
  mserviceApiPath: (overwriteRoot) => {
    let apiRoot = '/api/';
    if (overwriteRoot && typeof overwriteRoot !== 'undefined') apiRoot = overwriteRoot;
    return VUE_APP_MSERVICE_API_DOMAIN + apiRoot;
  },
  hoursApiPath: () => {
    return VUE_APP_HOURS_API_PATH;
  },
  aiServiceApiPath: (overwriteRoot) => {
    let apiRoot = '/api/';
    if (overwriteRoot && typeof overwriteRoot !== undefined) apiRoot = overwriteRoot;
    return VUE_APP_AI_SERVICE_DOMAIN + apiRoot;
  },
  aiSearchWebApiPath: () => {
    return VUE_APP_AI_SERVICE_WEB_DOMAIN + '/';
  },
  aiSearchApiPath: () => {
    return VUE_APP_AI_SEARCH_DOMAIN + '/aisearch';
  },
  loginDomain: () => {
    if (location.hostname === 'localhost') {
      return '//m.shopping.friday.tw/';
    }
    return location.href;
  },
  searchAPI: () => {
    const uat = /ec2-(sit|sit2|uat)/i.test(location.origin) ? '-uat' : '';
    return `https://mservice-event${uat}.shopping.friday.tw/`;
  },
  appConfigs: {
    apn: () => (/ec2-muat/i.test(location.host) ? 'com.gohappy.mobileapp.uat' : 'com.gohappy.mobileapp'),
    isi: '785988886',
    ibi: 'tw.com.gohappy.www',
    efr: '1',
    utmcode: 'utm_source=friDay&utm_medium=mweb-bar',
    firebaseLink: () =>
      /ec2-muat/i.test(location.host) ? 'https://fridayshoppingbeta.page.link/' : 'https://fri.page.link/',
  },
  homepageCoverAdExpire: 259200,
  productionDomain: 'https://m.shopping.friday.tw',
  productionProductPage: 'https://m.shopping.friday.tw/product',
  livesyncApiPath: 'https://mservice-event.shopping.friday.tw/api/livesync',
  homepageProjectFolder: 'https://event.shopping.friday.tw/event/homepage/',
  homepageSuperbrandJson: (fileName = 'homepage') => {
    const versionDate = new Date();
    const version =
      versionDate.getMonth() + '' + versionDate.getDate() + '' + versionDate.getHours() + '' + versionDate.getMinutes();
    let isBeta = '';
    if (/^(ec2-)/i.test(location.host)) {
      isBeta = '_beta';
    }
    return 'https://event.shopping.friday.tw/event/homepage/' + fileName + isBeta + '.json?' + version;
  },
  //定義:檢查商品圖片路徑方法(全站)
  checkImgSrc(src) {
    if (!src) {
      return 'static/images/space.gif';
    }
    if (/^(http:|https:|\/\/)/i.test(src)) {
      return src;
    }
    if (/\/images\/product\//i.test(src)) {
      // 入商品
      src = VUE_APP_IMG_DOMAIN + src;
    } else if (/\/product\//i.test(src)) {
      // 入商品
      src = VUE_APP_IMG_DOMAIN + '/images' + src;
    } else {
      src = VUE_APP_IMG_DOMAIN + 'cmsimg' + src;
    }

    return src;
  },
  prefixUrl(pUrl) {
    //基本上入稿時是以大網為主，所以要導到大網去，再讓大網導回小網
    if (null === pUrl) {
      return '#';
    } else if (!/^http/i.test(pUrl) && /\/ec2/i.test(pUrl)) {
      pUrl = pUrl.replace('/ec2', '/mobileweb');
      return pUrl;
    }
    return pUrl;
  },
  blockCache: 600,
};
