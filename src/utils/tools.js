const configs = require('../config/configs');
// const fetchPostHeaders = {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// };
const fetchGetHeaders = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};

const Url = {
  // public method for url encoding
  encode: function (string) {
    return escape(this._utf8_encode(string));
  },
  // public method for url decoding
  decode: function (string) {
    return this._utf8_decode(unescape(string));
  },
  // private method for UTF-8 encoding
  _utf8_encode: function (string) {
    string = string.replace(/\r\n/g, '\n');
    var utftext = '';
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  },
  // private method for UTF-8 decoding
  _utf8_decode: function (utftext) {
    var string = '';
    var i = 0,
      c2,
      c3;
    var c = (c2 = 0);
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if (c > 191 && c < 224) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  },
};

const getVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^"#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
};

const getYoutubeIframe = (vid) => {
  const docWidth = document.body.clientWidth;
  const videoHeight = Math.floor(docWidth / 1.77);
  return `<iframe width="100%" height="${videoHeight}" src="https://www.youtube.com/embed/${vid}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
};

// 商品連結
const productionProductPage = 'https://m.shopping.friday.tw/product';

// 是否專櫃網站
const isShop = /^\/(shop|brandPromotion)/i.test(location.pathname) || /\/shop\//i.test(document.referrer);

module.exports = {
  isShop,
  version() {
    const versionDate = new Date();
    return (
      versionDate.getMonth() + '' + versionDate.getDate() + '' + versionDate.getHours() + '' + versionDate.getMinutes()
    );
  },
  checkInAppSessions() {
    return (/FEEC-B2C-DEVICE=APP/i.test(document.cookie));
  },
  checkInSuperAppSessions() {
    return (/fet\//i.test(navigator.userAgent));
  },
  getYoutubeId(url) {
    return getVideoId(url);
  },
  isMobile() {
    return /mobi(le)?/i.test(navigator.userAgent);
  },
  checkMweb(path) {
    if (!/(localhost|127)/i.test(location.host) && location.protocol === 'http:') {
      window.location.replace(location.href.replace('http:', 'https:'));
      return;
    }

    const pathname = path ? path : '';
    const userAgent = navigator.userAgent;
    if (!/(android|iphone)/i.test(userAgent) && !/localhost/i.test(location.origin)) {
      if (/ysdt\.com\.tw/i.test(location.host)) {
        window.location.href = `https://${location.hostname}/${pathname}${location.search}`;
      } else {
        const localSub = location.origin.match(/ec(2|3)-m(sit2|sit|uat2|uat|stage)/i);
        let dsub = '';
        if (localSub && localSub[1]) {
          dsub = `ec${localSub[1]}-${localSub[2]}.`;
        }
        const cloudSub = location.origin.match(/(ec-m(-uat)?)/i);
        if (cloudSub && cloudSub[1]) {
          dsub = cloudSub[1].replace('m', 'w') + '.';
        }
        window.location.href = `https://${dsub}shopping.friday.tw${pathname}${location.search}`;
      }
    }
  },
  openExternalFromLine() {
    let href = window.location.href;

    const u = navigator.userAgent;
    const isLineApp = u.indexOf('Line') > -1; // Line 內建瀏覽器
    // const ua = navigator.userAgent.toLowerCase()
    // const isFbApp = u.indexOf('FBAV') > -1 // FB App 內建瀏覽器
    // const isWeixinApp = ua.match(/MicroMessenger/i) == 'micromessenger' // 微信內建瀏覽器

    if (isLineApp) {
      if (href.indexOf('openExternalBrowser') < 0) {
        // http 網址才處理
        if (href.indexOf('http') != 0 || href.indexOf('//') < 0) {
          return;
        }
        // 網址沒有參數 ? 時, 直接加參數
        if (href.indexOf('?') < 0) {
          href += '?openExternalBrowser=1';
        } else {
          // 網址有參數 ? 時, 用 & 加參數
          href += '&openExternalBrowser=1';
        }

        window.location.href = href;
      }
    }
  },
  isLighthouse: (() => {
    return /lighthouse/i.test(navigator.userAgent) ? true : false;
  })(),
  priceFormat(x) {
    return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : x;
    // 每三個數字的位置中間加入 ,
  },
  getProductPageLink(o, exUrl) {
    return productionProductPage + `?sid=${o.sid}&cid=${o.cid}&pid=${o.pid}&mid=${o.mid}${exUrl}`;
  },
  urlSearchToObj() {
    const pairs = window.location.search.substring(1).split('&');
    let obj = {};
    let pair, i;
    for (i in pairs) {
      if (pairs[i] === '') continue;

      pair = pairs[i].split('=');
      obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    return obj;
  },
  replaceLineBreak(str) {
    let content = str;
    return content.replace(/\\r\\n/g, '');
  },
  replaceTplImagePath(str) {
    let content = str;
    if (content) {
      content = content.replace(/"http:\/\/img.gohappy\.com\.tw\/tpl/gi, '"https://img.shopping.friday.tw/tpl');
      content = content.replace(/("\/tpl)/gi, '"https://img.shopping.friday.tw/tpl');
    }
    return content;
  },
  replaceWidthAndHeight(str) {
    let content = str;
    if (content) {
      content = content.replace(/height:\s?\d+px;?/gi, '');
      content = content.replace(/(width):\s?\d+px;?/gi, 'width:100%;');
      content = content.replace(/(height="(\d+)")/gi, '');
      content = content.replace(/(width="(\d+)")/gi, 'width="100%"');
    }
    return content;
  },
  figureToIframe(content) {
    const figureAry = content.match(/<figure(.*?)>(.*?)<\/figure>/gi);
    if (!figureAry || figureAry.length === 0) return content;

    figureAry.forEach((str) => {
      const vId = getVideoId(str);
      if (vId) {
        content = content.replace(str, getYoutubeIframe(vId));
        // content += getYoutubeIframe(vId);
      }
    });

    return content;
  },
  // 金額顯示 依幣金或是純現金
  displayProductPrice(info) {
    let price = 0;
    price = info.price;

    // 幣金顯示處理
    if (info.rewardPointInfo) {
      // 純幣
      if (info.rewardPointInfo.lifeExchangePoint) {
        price = 0;
      }
      // 幣+金
      if (info.rewardPointInfo.lifePartialPoint && info.rewardPointInfo.lifePartialPrice) {
        price = info.rewardPointInfo.lifePartialPrice;
      }
    }
    if (info.salePrice) {
      price = info.salePrice;
    }
    if (info.lifeProduct) {
      price = info.lifePartialPrice;
    }
    return parseInt(price);
  },
  getCookie(name) {
    var mycookie = document.cookie.split('; ');
    for (var i = 0; i < mycookie.length; i++) {
      var cookie1 = mycookie[i].split('=');
      if (cookie1[0] === name) {
        return Url.decode(cookie1[1]);
      }
    }
    return null;
  },
  setCookie(name, value, days) {
    var expires = '';
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
  },

  //將api時間格式轉為date格式
  apiTimeFormat(apiDate) {
    if (typeof apiDate !== 'string') {
      return null;
    }
    let dateArr = apiDate.split(' ');
    let datePieces = dateArr[0].split('/');
    let timePieces = dateArr[1].split(':');
    let formatDate = new Date(
      datePieces[0],
      datePieces[1] - 1,
      timePieces[2],
      timePieces[0],
      timePieces[1],
      timePieces[2]
    );
    return this.isValidDate(formatDate) ? formatDate : apiDate;
  },
  isValidDate(d) {
    return d instanceof Date && !isNaN(d);
  },

  //姓名防呆
  checkName(name) {
    let nameAlert = '';
    var otherChar = name.replace(/[A-Za-z-\s\u4e00-\u9fa5]/g, ''); //取代非特殊字元正則
    var tabChar = name.search(/\t/); //存在tab正則
    var onlyChinese = name.replace(/[A-Za-z-\s]/g, ''); //英文取代正則
    name = name.replace(/\s+/g, '');
    //是否為空值
    if (null == name || name.trim().length <= 0) {
      nameAlert += '本欄位不可為空';
    }
    //不可存在-特殊字元
    else if (otherChar != '') {
      nameAlert += '不可輸入數字或特殊字元';
    }
    //不可存在-TAB鍵(\t)
    else if (tabChar != -1) {
      nameAlert += '不可輸入特殊字元';
    }
    //當英文被取代掉時候 應只剩下中文
    else if (onlyChinese != '' && name.length != onlyChinese.length) {
      nameAlert += '不可中英夾雜';
    }
    //姓名如輸入中文，最少需輸入兩個字
    else if (onlyChinese.length < 2 && onlyChinese.length != 0) {
      nameAlert += '需輸入兩個以上中文字元';
    }
    //不可輸入超過20個字
    else if (name.length > 20) {
      nameAlert += '不可輸入超過20個字';
    }
    return nameAlert;
  },

  //手機防呆
  checkMoblie(phone) {
    let phoneAlert = '';
    var re = /^09/; //09開頭正則
    phone = phone.replace(/\s+/g, '');
    if (phone.length != 0) {
      if (isNaN(phone) == true) {
        phoneAlert += '不可包含其他字元';
      } else if (null == phone || phone.length < 10) {
        phoneAlert += '字數不足';
      } else if (phone.match(re) == null) {
        phoneAlert += '必須為09開頭';
      }
    } else {
      phoneAlert += '請填寫手機號碼';
    }
    return phoneAlert;
  },

  //市話防呆
  checkTel(tel) {
    let telAlert = '';
    if (tel.length > 0) {
      var telFormat = /^(0\d{1,3})?-?\d{5,8}(#\d{1,6})?$/;
      if (tel.length != 0 && telFormat.test(tel) == false) {
        telAlert += '格式錯誤';
      }
    }
    return telAlert;
  },

  // //email防呆
  // checkEmail(email) {
  //   let emailAlert = '';
  //   //開頭第一個字一定要為英文或數字，第一字之後可為多個英數字.號-號組合(ex: ab-c@、ab.c-1234@、abc.123-acv@)，@為必要，＠後最後一個.前接多個.或-加上英數字組合但第一字一定要為英數字(ex: @abc.a-c.com.tw、＠c-sdf-fds-w.c.com.tw)
  //   var emailRule = /^\w+((-\w+)|(\.\w+)|(\+\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

  //   if (null == email || email.length <= 0) {
  //     emailAlert = '本欄位不可為空';
  //   } else if (email != '' && email.search(emailRule) == -1) {
  //     emailAlert += '信箱格式錯誤';
  //   }
  //   return emailAlert;
  // },

  //地址防呆
  checkAddress(city, region, road) {
    let addressAlert = '';
    var addrFormat = new RegExp('[路街道號]'); //街道正則
    var otherChar = road.replace(/[\w-\s\u4e00-\u9fa5]/g, ''); //非特殊字元取代

    //縣市
    if (city === '') {
      addressAlert = '縣市錯誤,本欄位不可為空';
    }
    //區域
    else if (region === '') {
      addressAlert = '區域錯誤,本欄位不可為空';
    }
    //街道
    else if (null == road || road.trim().length <= 0) {
      addressAlert += '地址錯誤,請輸入地址';
    } else if (addrFormat.test(road) == false) {
      addressAlert += '地址錯誤,須包含路、街、道、號其中一個字元';
    } else if (otherChar != '') {
      addressAlert += '地址錯誤,不可輸入特殊字元';
    }
    return addressAlert;
  },

  //數量檢查
  checkSelect(val, msg) {
    let errorMessage = '';
    if (!val) {
      errorMessage = msg;
    }
    return errorMessage;
  },

  checkCreditCardInfo(number) {
    let errorMessage = '';

    // 檢查卡號
    if (!number.length) {
      errorMessage = '請輸入信用卡卡號';
      return errorMessage;
    } else {
      // 長度檢查
      if (number.length < 16) {
        errorMessage = '請輸入16碼信用卡卡號';
        return errorMessage;
      }

      // 必須為數字
      if (isNaN(parseInt(number))) {
        errorMessage = '錯誤的信用卡卡號格式,請重新輸入';
        return errorMessage;
      }

      // 不可使用的卡別（第一碼 為3/4/5以外的卡。)
      if (!number.startsWith('3') && !number.startsWith('4') && !number.startsWith('5')) {
        errorMessage = '輸入卡片資料無效/無法使用,請重新輸入或更換卡片';
        return errorMessage;
      }
    }
    return errorMessage;
  },
  checkCreditExpire(year, month) {
    let errorMessage = '';
    // 檢查到期日資料長度
    if (month.length < 2 || year.length < 2) {
      errorMessage = '請輸入有效期限';
      return errorMessage;
    } else {
      year = '20' + year;
      // 檢查到期日
      var today = new Date();
      if (today.getFullYear() > year || (today.getFullYear() == year && today.getMonth() + 1 > month)) {
        errorMessage = '有效期限已過期,請重新輸入';
        return errorMessage;
      }

      if (month < 0 || month > 12) {
        errorMessage = '錯誤的有效期限,請重新輸入';
        return errorMessage;
      }
    }
    return errorMessage;
  },
  //檢查安全碼
  checkCavv(cavv) {
    if (!cavv) {
      return '請輸入安全碼';
    }
    if (cavv && cavv.length > 0 && cavv.length < 3) {
      return '安全碼長度不足';
    }
    return '';
  },
  // 檢查統一編號, 規則來自http://service.etax.nat.gov.tw/etwmain/resources/web/js/etw.commonUtil.js
  checkVat(value) {
    var banResult = false;
    if (value.length != 8 || value.trim() == '') {
      banResult = false;
    }
    var intMod; //餘數變數
    var intSum; //合計數變數
    var intX = new Array(1, 2, 1, 2, 1, 2, 4, 1);
    var intY = new Array(7);
    var intCount; //計數變數
    for (intCount = 0; intCount < 8; intCount++) {
      if (value.charAt(intCount) < '0' || value.charAt(intCount) > '9') {
        banResult = false;
      }
    }
    for (intCount = 0; intCount < 8; intCount++) {
      intX[intCount] *= parseInt(value.charAt(intCount));
    }
    intY[0] = parseInt(intX[1] / 10);
    intY[1] = intX[1] % 10;
    intY[2] = parseInt(intX[3] / 10);
    intY[3] = intX[3] % 10;
    intY[4] = parseInt(intX[5] / 10);
    intY[5] = intX[5] % 10;
    intY[6] = parseInt(intX[6] / 10);
    intY[7] = intX[6] % 10;

    intSum =
      intX[0] +
      intX[2] +
      intX[4] +
      intX[7] +
      intY[0] +
      intY[1] +
      intY[2] +
      intY[3] +
      intY[4] +
      intY[5] +
      intY[6] +
      intY[7];
    intMod = intSum % 10;

    if (value.charAt(6) == '7') {
      if (intMod == 0) {
        banResult = true;
      } else {
        intSum = intSum + 1;
        intMod = intSum % 10;
        if (intMod == 0) {
          banResult = true;
        } else {
          banResult = false;
        }
      }
    } else {
      if (intMod == 0) {
        banResult = true;
      } else {
        banResult = false;
      }
    }
    return banResult;
  },
  getCookies(cname) {
    var mycookie = document.cookie.split('; ');
    for (var i = 0; i < mycookie.length; i++) {
      var cookie1 = mycookie[i].split('=');
      if (cookie1[0] == cname) {
        return decodeURIComponent(cookie1[1]);
      }
    }
    return null;
  },
  // 站台ID
  aiUserId() {
    // AI API target_value
    // 設定 ai api target_value
    let aiUserId = '0';
    const gaCookie = this.getCookies('_ga');
    if (gaCookie) {
      aiUserId = gaCookie.match(/(\d+)\.(\d+)$/gi)[0];
    }
    return aiUserId;
  },
  getCache: (name) => {
    if (!name || typeof name !== 'string') return null;

    const cache = window.sessionStorage.getItem(name);
    if (!cache) return null;

    const obj = JSON.parse(cache);
    const { data, expires } = obj;
    if (data && expires > new Date().getTime()) {
      return obj.data;
    } else {
      return null;
    }
  },
  setCache: (name, value, plusSeconds) => {
    if (!name || !value || !plusSeconds) return false;

    const now = new Date();
    if (typeof plusSeconds === 'number') {
      now.setSeconds(now.getSeconds() + plusSeconds);
    }

    window.sessionStorage.setItem(
      name,
      JSON.stringify({
        data: value,
        expires: now.getTime(),
      })
    );
  },
  strlen(str) {
    return str.replace(/[^\\x00-\\xff]/g, 'xx').length;
  },
  goProductPage(e, pid, extendData, target = '_self', searchDataCount = 0, searchClickedIndex = 0) {
    if (e) {
      e.preventDefault();
    }

    let exSearchParams = '';

    // extendData 如果帶整個商品資料 則放sessionStorage來加速轉入商品頁的圖片出現速度
    if (typeof extendData === 'object') {
      const { pid, name, image_url, img, price, id3, exSearch, discount } = extendData;
      if (pid && name && (image_url || img) && price) {
        let imgPath = image_url;
        if (img) {
          imgPath = img;
        }
        window.sessionStorage.setItem(
          'cache_' + pid,
          JSON.stringify({
            pid: pid,
            name: name,
            sampleImages: [imgPath],
            price: price,
            discount,
          })
        );
      }

      if (id3) {
        exSearchParams = `?WT.me_id=${id3}`;
      }
      if (exSearch) {
        exSearchParams += /\?/i.test(exSearchParams) ? exSearch : exSearch.replace('&', '?');
      }
    }

    let { keyword } = this.urlSearchToObj();
    if (!keyword) keyword = '';
    keyword = encodeURIComponent(keyword);

    let url = '';
    let urlSuffix = '';
    if (window.siteData) {
      urlSuffix = `/${window.siteData.urlSuffix}`;
    }

    // BSite商品頁網址不同

    url = `${urlSuffix}/product/${pid}${exSearchParams}${
      keyword ? `${exSearchParams.includes('?') ? '&' : '?'}kw=${keyword}` : ''
    }`;

    // 搜尋結果頁點擊商品來的資料 搜尋結果總筆數
    if (searchDataCount > 0) {
      url += `&kwc=${searchDataCount}&kwi=${searchClickedIndex}&kwts=${Math.round(new Date().getTime() / 1000)}`;
    }

    if (target === '_self') {
      location.href = url;
    } else {
      window.open(url);
    }
  },
  genProductUrl(pid, extendData) {
    let exSearchParams = '';

    // extendData 如果帶整個商品資料 則放sessionStorage來加速轉入商品頁的圖片出現速度
    if (typeof extendData === 'object') {
      const { id3, exSearch } = extendData;

      if (id3) {
        exSearchParams = `?WT.me_id=${id3}`;
      }
      if (exSearch) {
        exSearchParams += exSearch;
      }
    }

    let urlSuffix = '';
    if (window.siteData) {
      urlSuffix = `/${window.siteData.urlSuffix}`;
    }

    const url = `${urlSuffix}/product/${pid}${exSearchParams}`;

    return url;
  },
  //取得多商品價格資料
  async getPidsInfo(pids, type = 1) {
    return await fetch(`${configs.frontCloudApiPath()}product/v2/productinfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestId: new Date().toLocaleString(),
        param: {
          productIdList: pids,
          type,
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res && res.resultData && res.resultData.length > 0) {
          const o = {};
          res.resultData.forEach((v) => {
            o[v.productId] = v;
            o[v.productId].image_url = v.images;
            o[v.productId].img = v.images;
            o[v.productId].price = v.price || null;
            o[v.productId].soldout = !v.isQuantity;
          });
          return o;
        } else {
          return null;
        }
      })
      .catch((err) => {
        console.error(`getPidsPrice faliure`);
        console.error(err);
      });
  },
  //判斷背景色為深淺色系
  isDarkColor(color) {
    var red = parseInt(color.substring(1, 3), 16);
    var green = parseInt(color.substring(3, 5), 16);
    var blue = parseInt(color.substring(5, 7), 16);

    // 計算亮度
    var brightness = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

    if (brightness <= 0.5) {
      return true; // 深色系
    } else {
      return false; // 浅色系
    }
  },
  //色碼hex轉rgb
  hexToRgb(hex) {
    //除去hex前面的＃
    hex = hex.replace('#', '');

    var red = parseInt(hex.substring(0, 2), 16);
    var green = parseInt(hex.substring(2, 4), 16);
    var blue = parseInt(hex.substring(4, 6), 16);

    return `rgb(${red},${green}, ${blue})`;
  },
  //bweb api
  async getBwebApiData(method, urlSuffix, payload) {
    const option = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (/^(POST|PUT)$/i.test(method) && payload) {
      option.body = JSON.stringify({
        payload,
      });
    }
    const data = await fetch(`${configs.bconfigApiPath()}bWeb${urlSuffix}`, option)
      .then((res) => res.json())
      .then((res) => {
        return res && res.resultData ? res.resultData : null;
      })
      .catch((err) => {
        console.error(`get bweb ${urlSuffix} faliure.`);
        console.error(err);
      });
    return data;
  },
  async getImgJsonData(urlSuffix) {
    const data = await fetch(`${configs.imgJsonDomain}${urlSuffix}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          return res;
        }
      })
      .catch(() => {});
    return data;
  },
  checkEmail(val) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(val);
  },
  goBsiteLoginUrl() {
    const { urlSuffix, siteType } = window.siteData;
    let targetUrl = '';
    if (siteType === 'B2') {
      // Email 登入
      targetUrl = `/login?em=1&sc=${urlSuffix}&redirectUrl=${encodeURIComponent(location.href)}`;
    } else {
      // 手機 登入
      targetUrl = `/login?sc=${urlSuffix}&redirectUrl=${encodeURIComponent(location.href)}`;
    }
    window.location.href = targetUrl;
  },
  //確認是否為遠傳導購
  getFetCode() {
    const fetCode = /mg_id=fetuser/.test(location.search);
    const CHANNEL_ID7 = this.getCookies('CHANNEL_ID7');
    if (fetCode) {
      const seachParm = this.urlSearchToObj();
      return seachParm['WT.mg_id'];
    }
    return CHANNEL_ID7 === 'fetuser' ? CHANNEL_ID7 : null;
  },
  /**
   * 取得曝光目錄B型資料 回傳一連串pid
   * @param {String} promotionId 曝光目錄ID
   * @returns Array
   */
  async getPromotionGatherApi(promotionId) {
    return await fetch(`${configs.frontApiPath()}ai/promotion/gather/${promotionId}`, fetchGetHeaders)
      .then((res) => res.json())
      .then((res) => {
        if (res && res.resultData) {
          return res.resultData;
        }
        return null;
      })
      .catch(() => {
        return null;
      });
  },
  //取得url上的目錄結構
  getUrlCategoryConstruction(path) {
    if (!window.isLocal) {
      const catConstruction = path.match(/category\/([^?]+)/)?.[1];
      if (catConstruction) {
        const catArr = catConstruction.split('/');
        return catArr;
      }
    }
    const { category } = this.urlSearchToObj();
    if (category) {
      const catArr = category.split(',');
      return catArr;
    }
  },
  // 取得目錄網址的cid
  processUrlCid() {
    let catgObj = {};
    let catgArr = [];
    let urlAryLen = [];

    const { catg1, catg2, catg3, catg4 } = this.urlSearchToObj();
    if (catg1 || catg2 || catg3 || catg4) {
      catgArr.push(catg1, catg2, catg3, catg4);
      urlAryLen = catgArr.filter((catg) => catg !== undefined).length;
    }
    catgArr = catgArr.filter((v) => !!v);

    const pathname = location.pathname;
    if (/\/category/.test(pathname)) {
      catgArr = pathname.match(/\/category\/(.+)/)[1].split('/');
      urlAryLen = catgArr.length;
    }

    if (catgArr.length) {
      const filteredCatgArr = catgArr.filter((v) => typeof v !== 'undefined');
      const categoryId = filteredCatgArr[0];
      const lastCategoryId = filteredCatgArr[filteredCatgArr.length - 1];
      catgObj['catgArr'] = catgArr;
      catgObj['urlAryLen'] = urlAryLen;
      catgObj['categoryId'] = categoryId;
      catgObj['lastCategoryId'] = lastCategoryId;
      return catgObj;
    }
  },
  // base64 encode function
  base64Encode(str) {
    const bytes = new TextEncoder().encode(str);
    const binString = String.fromCodePoint(...bytes);
    return btoa(binString);
  },
  //未達特定長度向前補字
  padStartFormat(data, count = 2, content = '0') {
    return String(data).padStart(count, content);
  },
};
