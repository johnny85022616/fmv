/**
 * 頁面組合schema結構化資訊
 */
const configs = require('../config/configs.js');
const webSiteTitle = 'friDay購物｜AI為您打造獨一無二的購物體驗';
const webSiteDesc =
  'friDay購物AI為您挑選出熱銷商品，3C家電、美妝保健、流行服飾配件、生活用品、挑戰最低價，隨時有折扣，在這血拼真的很可以！';
const websiteData = {
  '@context': 'http://schema.org',
  '@type': 'WebSite',
  url: window.location.href,
  name: 'friDay購物',
  potentialAction: {
    '@type': 'SearchAction',
    target: '/aisearch?keyword={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
  logo: 'https://shopping.friday.tw/static/images/header_logo.png',
  sameAs: [
    'https://www.facebook.com/fridayshopping/',
    'https://www.youtube.com/channel/UC3AkhVCWPmlkjMoOVygAhQw',
    'https://play.google.com/store/apps/details?id=com.gohappy.mobileapp',
    'https://apps.apple.com/tw/app/id785988886',
  ],
};

const appendJsonLD = (data) => {
  const script = document.createElement('script');
  script.id = 'json-ld';
  script.type = 'application/ld+json';
  script.innerHTML = JSON.stringify(data);
  document.body.prepend(script);
};

const appendTitle = (titleStr, addPrefix = true) => {
  if (window.siteData) {
    const { siteName } = window.siteData;
    document.title = addPrefix ? titleStr + ' - ' + siteName : siteName;
  } else {
    document.title = titleStr + ' - ' + webSiteTitle;
  }
  const meta = document.createElement('meta');
  meta.setAttribute('property', 'og:title');
  meta.content = titleStr;
  document.getElementsByTagName('head')[0].appendChild(meta);
};

const appendFavicon = (imgObj) => {
  const { logo, favicon } = imgObj;
  const icoDom1 = document.querySelector('link[rel="shortcut icon"]');
  if (icoDom1) {
    const i1 = favicon ? favicon : logo;
    icoDom1.setAttribute('href', i1);
  }
  const icoDom2 = document.querySelector('link[rel="apple-touch-icon"]');
  if (icoDom2 && logo) {
    icoDom2.setAttribute('href', logo);
  }
  const icoDom3 = document.querySelector('link[rel="icon"]');
  if (icoDom3) {
    const i3 = favicon ? favicon : logo;
    icoDom3.setAttribute('href', i3);
  }
};

const appendCanonical = (url) => {
  const canonicalDom = document.querySelector('link[rel=canonical]');
  if (canonicalDom) {
    canonicalDom.setAttribute('href', url);
  } else {
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = url;
    document.getElementsByTagName('head')[0].appendChild(link);
  }
};

const appendRobots = (rules) => {
  const meta = document.createElement('meta');
  meta.setAttribute('name', 'robots');
  meta.content = rules;
  document.getElementsByTagName('head')[0].appendChild(meta);
};

const appendDescription = (context) => {
  const metaDom = document.querySelector('meta[name="description"]');
  if (metaDom) {
    metaDom.setAttribute('content', context);
  } else {
    const link = document.createElement('meta');
    link.name = 'description';
    link.content = context;
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  const meta = document.createElement('meta');
  meta.setAttribute('property', 'og:description');
  meta.content = context;
  document.getElementsByTagName('head')[0].appendChild(meta);
};

//  取得網站描述API
const getWebsiteMetaApi = async (siteCode) => {
  return await fetch(`${configs.bconfigApiPath()}seo/website?sid=${siteCode}&requestId=${new Date().getTime()}`)
    .then((res) => res.json())
    .then((res) => {
      if (res && res.resultCode === 0 && res.resultData.metaDescription) {
        return res.resultData.metaDescription;
      }
    });
};

module.exports = {
  common: async () => {
    if (window.siteData) {
      appendFavicon(window.siteData);
      appendTitle(window.siteData.siteName, false);

      const desc = await getWebsiteMetaApi(window.siteData.siteId);
      if (desc) appendDescription(desc);
    }
  },
  homepage: async () => {
    appendCanonical(window.location.href);
    appendRobots('index,follow');
    appendJsonLD(websiteData);
    if (window.siteData) {
      appendFavicon(window.siteData);
      appendTitle(window.siteData.siteName, false);

      const desc = await getWebsiteMetaApi(window.siteData.siteId);
      if (desc) appendDescription(desc);
    } else {
      appendDescription(webSiteDesc);
    }
  },
  productSoldout: () => {
    appendRobots('noindex,nofollow');
  },
  breadcrumb: (data) => {
    const jsonObj = {
      '@context': 'http://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: data.map((v, i) => {
        return {
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@id': v.url,
            name: v.name,
          },
        };
      }),
    };
    appendJsonLD(jsonObj);
  },
  search: (extendData, keyword) => {
    appendJsonLD(websiteData);
    if (Array.isArray(extendData)) {
      extendData.forEach((value) => {
        appendJsonLD(value);
      });
    }
    appendCanonical(window.location.href);
    appendTitle(`你在找【${keyword}】嗎?`);
    const yy = new Date().getFullYear();
    appendDescription(
      `找"${keyword}"來friDay購物就對了！推薦您${yy}年評價最高的"${keyword}"，教你如何用最優惠的價格買到"${keyword}"。`
    );
  },
  category: () => {
    appendRobots('noindex,nofollow');
  },
  promotionPage: (title) => {
    appendTitle(`${title}`);
  },
  aiLCategory: () => {
    if (window.siteData) {
      appendFavicon(window.siteData);
      appendTitle(window.siteData.siteName);
    }
    appendCanonical(window.location.href);
    appendRobots('noindex,nofollow');
  },
  aiAllCategory: (breadcrumbData) => {
    const catgTitle = breadcrumbData
      .map((v) => v.name)
      .reverse()
      .join(',');
    const dateTitle =
      new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月';

    if (window.siteData) {
      appendFavicon(window.siteData);
      appendTitle(catgTitle + ' ' + dateTitle + window.siteData.siteName);
    } else {
      appendTitle(catgTitle + ' ' + dateTitle);
    }
    appendCanonical(window.location.href);
    appendRobots('index,follow');
  },
  discount: () => {
    if (window.siteData) {
      appendFavicon(window.siteData);
      appendTitle(window.siteData.siteName);
    }
  },
};
