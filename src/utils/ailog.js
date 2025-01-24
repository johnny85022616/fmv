const apiPath = 'https://ailog.shopping.friday.tw/logs';
const headers = {
  'Content-Type': 'application/json',
};
// Get loggin user id
const getMemberId = () => {
  const b2cCookie = getCookieValueByName('FEEC-B2C-INFO');
  if (!b2cCookie) {
    return {
      tid: null,
      fid: null,
    };
  }

  const b2cObj = JSON.parse(decodeURIComponent(b2cCookie));
  return {
    fid: b2cObj.data.fid,
    tid: b2cObj.data.tid,
  };
};

// Get GA ID
const getGaId = () => {
  const gaCookie = getCookieValueByName('_ga');
  if (!gaCookie) return 'None';
  return gaCookie.match(/(\d+)\.(\d+)$/gi)[0];
};

// Get url querystring
const getUrlParams = (name) => {
  const urlParams = new URLSearchParams(location.search);
  return urlParams.get(name);
};

// Get cookie data by name
const getCookieValueByName = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : '';
};

// base64 encode function
const base64Encode = (str) => {
  const bytes = new TextEncoder().encode(str);
  const binString = String.fromCodePoint(...bytes);
  return btoa(binString);
};

module.exports = {
  productPage: (productId, productName) => {
    if (!productId) return;

    const { fid, tid } = getMemberId();
    const us = new URLSearchParams(location.search);
    const appSudoId = getUrlParams('gid'); // app gid
    const keyword = us.get('kw'); // keyword from search page.
    const keywordCount = us.get('kwc'); // search result amount from search page.
    const keywordIdx = us.get('kwi'); // user click product index from search page.
    const keywordTimestamp = us.get('kwts'); // user search timestamp.
    let remoteName = window.siteData ? 'ym' : 'm';
    let sudoId = null;

    // if url include gid then over write gaId.
    if (appSudoId) {
      sudoId = appSudoId;
      remoteName = 'a';
    } else {
      sudoId = getGaId();
    }

    const body = {
      tid: tid ? tid : -999,
      uid: fid ? fid : -999,
      pid: productId,
      pseudoid: sudoId,
      remote: remoteName,
      searchtext: [],
    };

    if (keyword && keywordCount && typeof keywordIdx !== 'undefined') {
      body['searchtext'] = [
        {
          search: keyword,
          search64: base64Encode(keyword),
          title: productName,
          title64: base64Encode(productName),
          ts: parseInt(keywordTimestamp),
          result: parseInt(keywordCount),
          hit: parseInt(keywordIdx),
          fuzzy: 3,
        },
      ];
    }

    fetch(apiPath, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
  homepage: (siteId) => {
    const us = new URLSearchParams(location.search);
    const appSudoId = us.get('gid'); // app gid
    let remoteName = window.siteData ? 'yw' : 'w';
    let sudoId = null;

    // if url include gid then over write gaId.
    if (appSudoId) {
      sudoId = appSudoId;
      remoteName = 'a';
    } else {
      sudoId = getGaId();
    }

    const body = {
      tid: -999,
      uid: -999,
      pseudoid: sudoId,
      remote: remoteName,
      site_id: siteId || window.siteData.siteId,
    };

    fetch('https://ailog.shopping.friday.tw/bweb_logs', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    }).then((res) => res.json());
  },
};
