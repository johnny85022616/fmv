<template>
  <div>
    <fadeAlert v-if="isfadeAlertOpen" :message="'已登記到貨通知'" @closeFadeAlert="closeFadeAlert" />
    <div v-if="isApiRequested" class="product">
      <!-- 選單 天 -->
      <navigation ref="navigation" v-if="!hiddenNavigation" :isShowRedTop="isShowRedTop" :windowY="200" v-on:stopBodyScroll="stopBodyScroll" v-on:bsiteIsLogin="bsiteIsLogin" />
      <brandNav v-if="nvSiteData" :supplierData="nvSiteData" />

      <!-- 商品圖 -->
      <mainimage :images="pInfo.images" :video="pInfo.videos" :pInfo="pInfo" />

      <!-- 商品價格 -->
      <basicinfo :data="pInfo" v-on:stopBodyScroll="stopBodyScroll" :tags="pInfo.tags" :friendRecommandation="friendRecommandation" :isSimpleProductCnt="isSimpleProductCnt" />

      <div v-if="showOnLighthouse" :style="fixInAppMargin">
        <!-- 活動資訊、折價券 -->
        <campaign v-if="(!isSimpleProductCnt) && (!isBsite || (isBsite && isEmploySite)) && isCampaignDataLoaded" :pInfo="pInfo" :bsiteLogin="bsiteLogin" />

        <!-- 商品資訊 -->
        <basicintro v-if="pInfo.intro && !isSimpleProductCnt" :intro="pInfo.intro" />

        <!-- 組合商品 -->
        <comboCnt v-if="comboInfo && !isSimpleProductCnt" :comboData="comboInfo" />

        <!-- 贈品 -->
        <gift v-if="giftItems.length > 0 && !isSimpleProductCnt" :giftItems="giftItems" />

        <!-- 加購商品 -->
        <additional v-if="accItems && accItems.length > 0" :itemData="accItems" v-on:stopBodyScroll="stopBodyScroll" />

        <!-- 聯名卡宣傳 -->
        <div class="coBrandingCard" @click="gocoBrandingCardPage">
          <div>
            <span>【必備神卡】 friDay聯名卡</span>
            <span class="red">8%遠傳幣回饋</span>
            <i class="icon-next"></i>
          </div>
        </div>

        <div v-if="!isTopic" class="similarKW">
          <span>
            <a v-for="kw in keywords" :key="kw" :href="`/aisearch?keyword=${encodeURIComponent(kw)}`">#{{ kw }}</a>
          </span>
        </div>

        <div class="gap-line"></div>

        <ul v-if="!isTopic" class="relatedBox">
          <li>相關商品<a :href="`/aisearch?keyword=${encodeURIComponent(keywords.toString())}&type=seeMore`">去看看<i class="arrow-right inline"></i></a></li>
          <li>本類商品<a :href="`/aisearch?bid=${bid}&pid=${pid}&type=categoryRelated`">去看看<i class="arrow-right inline"></i></a></li>
          <!-- <li>看相關分類<a href="">去看看<i class="arrow-right inline"></i></a></li> -->
        </ul>

        <!-- 商品說明 -->
        <basicadv :currentY="currentY" :isSimpleProductCnt="isSimpleProductCnt" :pid="pid" />

        <!-- 購物須知 -->
        <shoppingguide v-if="pInfo.pid && !isBsite" :guideurl="pInfo.guide" v-on:stopBodyScroll="stopBodyScroll" />

        <!-- 溫馨提醒 -->
        <reminder v-if="pInfo.pid && pInfo.cid" :pid="pInfo.pid" :currentY="currentY" />

        <!-- 推薦商品 -->
        <!-- <recommandation v-if="!hiddenRecommendation && !isSimpleProductCnt && pInfo.pid" :currentY="currentY" /> -->
      </div>

      <!-- 頁腳按鈕 -->
      <div :class="[
        'd-flex bottom-btn',
        { 'sold-out': pInfo.isSoldOut},
        { mb0: isTurnApp }
      ]">
        <template v-if="directToCheckout && !pInfo.isSoldOut">
          <span class="flex-auto wish-box">
          </span>
          <span class="flex-auto btns btn-1"></span>
          <span class="flex-auto btns btn-3">
            <button @click="goToCart(true)">
              {{ directToCheckoutButtonTxt }}<img v-if="isShowGoShopAnimation" src="https://go.shopping.friday.tw/cycle/turn/img/Reload-1s-200px.gif" class="product-btns__goshop-animation" />
            </button>
          </span>
        </template>
        <template v-else>
          <template v-if="pInfo.isSale && !pInfo.isSoldOut && pInfo.price.memberPrice">
            <span class="flex-auto wish-box">
              <i :class="['wish', { active: wishActive }]" @click="addWish"></i>
            </span>
            <template v-if="isStoreProduct">
              <span class="flex-auto btns btn-5">
                <button @click="goToCart(false, 2)">加入超商取貨</button>
              </span>
              <span class="flex-auto btns btn-2">
                <button @click="goToCart(false)">加入宅配購物車</button>
              </span>
            </template>
            <template v-else>
              <span class="flex-auto btns btn-1">
                <button @click="goToCart(true)">立即購買</button>
              </span>
              <span class="flex-auto btns btn-2">
                <button @click="goToCart(false)">加入購物車</button>
              </span>
            </template>
          </template>

          <template v-else-if="pInfo.isSale && !pInfo.isSoldOut && !pInfo.price.memberPrice">
            <span class="flex-auto wish-box">
              <i :class="['wish', { active: wishActive }]" @click="addWish"></i>
            </span>
            <span class="flex-auto btns btn-4">
              <button @click="givePrice()">
                趕快顯示價格給我！
              </button>
            </span>
          </template>

          <template v-else>
            <span class="flex-auto wish-box">
              <i :class="['wish', { active: wishActive }]" @click="addWish"></i>
            </span>
            <span class="flex-auto btns btn-1 btn-full">
              <!-- <button v-if="isPreventSoldoutNotice">缺貨補貨中</button> -->
              <button class="notSaleBtn soldout" v-if="!pInfo.isSale" @click="sendProductNotification()">
                補貨中，貨到通知
              </button>
              <!-- <button class="notSaleBtn" v-if="!pInfo.isSale">
                尚未開賣
              </button> -->
              <button v-else @click="sendProductNotification()">補貨中，貨到通知</button>
            </span>
          </template>

        </template>
      </div>
      <!-- 頁腳按鈕 End -->

      <buyitem v-if="showCartDialog" :isBuyRedirect="isBuyRedirect" :parentSelectedCartId="nowSelectedCartId" :pInfo="pInfo" :gifts="giftItems" :isCombo="isCombo" :promotionId="promotionId" :directToCheckout="directToCheckout" :directToCheckoutNoPopup="directToCheckoutNoPopup" :comboInfo="comboInfo" @stopBodyScroll="stopBodyScroll" @closeBuyItem="closeBuyItem" @sendProductNotification="sendProductNotification" @setCartComboData="setCartComboData" @setGoShopAnimation="setGoShopAnimation" @changeSpecInfo="changeSpecInfo" @flushCartBag="flushCartBag" />

      <popupDialog :title="'會員EMAIL資料不存在'" :callback="() => bsiteNotification(emailVal)" v-if="isEmailPopupOpen" @closeCenterDialog="closeCenterDialog">
        <div class="emailDialog">
          <p>請先建立EMAIL資料</p>
          <input type="email" placeholder="請輸入信箱" v-model.lazy="emailVal">
          <p v-if="isEmailErrorMsgShow" class="error">*信箱格式錯誤</p>
        </div>
      </popupDialog>
    </div>
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import mainimage from "./components/product/mainimage.vue"; // 商品主圖
import basicinfo from "./components/product/basicinfo.vue"; // 基本資訊、價格
import campaign from "./components/product/campaign.vue"; // 折價券 活動
import gift from "./components/product/gift.vue"; // 贈品
import additional from "./components/product/additional.vue"; // 加購
import comboCnt from "./components/product/comboProducts.vue"; // 組合商品
import basicintro from "./components/product/basicintro.vue"; // 券、點我再折icon、基本簡介、保險
import basicadv from "./components/product/basicadv.vue"; // 商品說明
import shoppingguide from "./components/product/shoppingguide.vue"; // 購物須知
import reminder from "./components/product/reminder.vue"; // 溫馨小提醒
// import recommandation from "./components/product/recommandation.vue"; // 推薦商品
// import fullscreendialog from "./components/common/fullscreenDialog.vue"; // 全畫面蓋版提示框
import buyitem from "./components/product/buyitem";
import popupDialog from "./components/common/popupDialog.vue";
import fadeAlert from "./components/common/fadeAlert.vue";
import brandNav from "./components/product/brandPromotionNavigation.vue";

export default {
  name: "Product",
  components: {
    navigation,
    mainimage,
    basicinfo,
    campaign,
    gift,
    comboCnt,
    basicintro,
    basicadv,
    shoppingguide,
    reminder,
    // recommandation,
    // fullscreendialog,
    additional,
    buyitem,
    popupDialog,
    fadeAlert,
    brandNav,
  },
  data() {
    return {
      isBsite: false, // 是否為Ai4
      bsiteLogin: false, // Ai4網站是否登入
      showOnLighthouse: true, // 是否為google lighthouse測試模式
      pInfo: {}, // 商品資料物件
      isApiRequested: false, // 商品資料是否已取得
      isSimpleProductCnt: false, // 是否顯示簡單版商品畫面
      directToCheckout: false, // 設定不進購物車行為
      directToCheckoutButtonTxt: "下一步", // 設定不進購物車按鈕文案
      directToCheckoutNoPopup: false, // 設定不進購物車行為中 是否可以不用在彈跳出選擇對話框（規格、貨態、數量）
      hiddenNavigation: false, // 是否隱藏頁頭天
      hiddenRecommendation: false, // 是否隱藏AI推薦商品
      pid: null, // 商品PID
      sid: null, // 商品SID
      bid: null, // 商品底層目錄ID
      promotionId: null, // 活動ID
      friendRecommandation: false, // 是否顯示友商推薦連結
      currentY: 0, // 畫面捲動高度PX
      windowY: 0, // 畫面捲動高度PX
      isShowRedTop: true,
      isStopScrolling: false,
      isBuyRedirect: false, // 是否直接轉購物車，不會跳選規格POPUP
      isPreventSoldoutNotice: false, // 是否顯示缺貨補貨中
      giftItems: [], // 贈品資料
      accItems: [], // 加購品資料
      comboInfo: null, // 組合商品資料
      isCombo: false, // 是否為組合商品
      catalogLevel: "",
      showCartDialog: false, // 是否顯示選規格POPUP
      wishActive: false, // 我的最愛狀態
      cartComboData: [], // 組合商品購物車內容
      isShowGoShopAnimation: false, // 單一去結帳按鈕旁的動畫是否顯示
      keywords: [], // 商品相關關鍵字
      isFetchAiAPI: false, // 控制是否取得AI推薦商品，避免重複XHR
      isTopic: false, // 主題網的商品，不出現商品AI關鍵字
      isEmailPopupOpen: false, // 貨到通知EMAIL填寫框是否顯示
      emailVal: "", // 貨到通知EMAIL
      isEmailErrorMsgShow: false, // 貨到通知EMAIL
      nowSpecInfo: null, // 貨到通知，當前的商品規格
      isfadeAlertOpen: false, // 貨到通知
      isEmploySite: false, // 是否為員購網
      isTurnApp: false, // 是否為再轉轉商品頁
      nvSiteData: null, // 判斷專櫃頁進入商品頁的專櫃資料
      isNoticeApiLoaded: false, // 是否貨到通知API觸法
      isCampaignDataLoaded: false, //是否已取得到活動資料
      cartType: 1, // 購物車類型 1=宅配 2=超取
    };
  },
  async created() {
    // B Site 商品頁判斷
    if (this.siteData) {
      this.isBsite = true;
      this.isPreventSoldoutNotice = true;
      if (this.siteData.siteType === "B4") {
        this.isTopic = true;
      }
      if (this.siteData.siteType === "B2") {
        this.isEmploySite = true;
      }
    }

    // 延續逛專櫃的廠商資料 在商品頁組一樣的版頭
    if (/(brandPromotion|shop)/.test(document.referrer)) {
      this.getBrandPromotionData(document.referrer);
    }

    // save product api data
    const { pid, cid, fetId, mc_w, mc_s, aipc } = this.tools.urlSearchToObj();
    // 新版url
    if (!pid) {
      const urlSku = location.pathname.match(/product\/(\d+)/);
      if (urlSku && urlSku[1]) {
        this.pid = urlSku[1];
      }
    } else {
      //舊版url
      this.pid = parseInt(pid);
    }
    if (cid) this.cid = parseInt(cid);

    window.productsPool = {};
    this.showOnLighthouse = this.lighthouse ? false : true;
    if (aipc) {
      sessionStorage.setItem("PARTNER_CODE_AI", aipc);
    }

    // 隱藏推薦機制
    this.hiddenRecommendation = this.tools.checkInSuperAppSessions();

    // 來自APP UIWEBVIEW及特定導購碼
    if (this.configs.hiddenCommonHeader.test(location.search)) {
      this.isPreventSoldoutNotice = true;

      if (/device=app/i.test(location.search)) {
        this.hiddenNavigation = true;
        this.isTurnApp = true;

        // 預設訂給結帳第2動隱藏天
        window.sessionStorage.setItem("turnturn_AI", "app");

        // 設定COOKIE 提供結帳判斷裝置
        document.cookie = `FEEC-B2C-DEVICE=APP; max-age=${
          60 * 60
        }; path=/; secure;`;
      }
    }

    // 特殊位置參數 處理簡易版的商品資料顯示
    if (this.configs.simpleProductCnt.test(location.search)) {
      this.isSimpleProductCnt = true;
    }

    // 特殊位置參數 處理購買行為不經購物車 直接進結帳頁
    if (this.configs.directToCheckout.test(location.search)) {
      this.directToCheckout = true;
    }

    // 若為心生活特殊純幣商品清單 就已純幣為唯一
    if (/(fcoin=exchange|mg_id=fetmc_appfcoin)/i.test(location.search)) {
      this.hiddenNavigation = true;
      this.isTurnApp = true;
      this.directToCheckout = true;
      this.directToCheckoutNoPopup = false;
      this.directToCheckoutButtonTxt = "兌換";
    }

    // 取得當前商品資料
    this.getProductDetail(this.pid);

    // get mobilecircle fetId
    if (fetId) {
      window.sessionStorage.setItem("mcid", fetId);
    }

    // 心生活取得加密文，換取fetId
    if (mc_w && mc_s) {
      this.getMobileCircleFetId(mc_w, mc_s);
    }

    // 判斷是否執行過貨到通知
    const isNotify = window.sessionStorage.getItem("productNotification");
    if (/feec-b2c-uid/i.test(document.cookie) && isNotify) {
      this.sendProductNotification(JSON.parse(isNotify));
    }

    // 滾動畫面監聽
    window.addEventListener(
      "scroll",
      () => {
        const wy = window.scrollY;
        this.windowY = wy;
        // this.currentY = wy !== 70 && wy !== 0 ? wy : this.currentY;
        if (this.windowY === 0) {
          this.currentY = 0;
        } else {
          this.currentY = this.windowY;
        }
        this.isShowRedTop = wy > 0 ? false : true;
      },
      {
        passive: true,
      }
    );
  },
  watch: {
    currentY(n) {
      if (n > 70) {
        if (!this.isFetchAiAPI) {
          this.isFetchAiAPI = true;

          // 取麵包屑資料
          this.getProductBreadcrumb();

          // get similar keywords
          this.getSimilarKW(this.pid);
        }
      }
    },
  },
  methods: {
    // 預計開賣時間轉換
    formatDateTime(dateTimeStr) {
      let date = new Date(dateTimeStr);
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let formattedTime = `${hours}:${minutes.toString().padStart(2, "0")}`;

      // 返回格式化后的日期时间字符串
      return `${month}/${day} ${formattedTime}`;
    },
    autoAddCart(storageData) {
      const { cartData, nowSelectedCartId } = storageData || {};
      const o = this.pInfo;
      this.api.cart.addCart(nowSelectedCartId, cartData, o).then((res) => {
        if (res.resultCode === 0) {
          sessionStorage.removeItem("buyItemData");

          // GA LOG
          const price = (o.price && o.price.promoPrice) || o.price.memberPrice;
          this.api.ga.addToCart({ ...o, qty: cartData?.quantity, price });

          document.cookie = `CHANNEL_ID0=;expires=${new Date(
            0
          )};path=/;domain=.shopping.friday.tw`;

          // 購物車數字刷新
          this.flushCartBag();

          // 設定購物車頁位置
          const cartUrl = "/shoppingcart";

          if (!this.directToCheckout) {
            window.location.href = cartUrl;
            return;
          }

          // 直接轉結帳行為
          const extendsObj = {};

          if (/mg_id=fetmc_appfcoin/i.test(location.search)) {
            extendsObj["fcoinPrice"] = true;
          }
          extendsObj["pid"] = o.pid;

          // 轉購物車頁
          this.api.cart.directGoCheckoutProcess(extendsObj);
        } else if (res.resultCode === 1009) {
          this.api.ui.alert.getFadeAlert(res.resultMsg);
        }
      });
    },
    // 解析前頁為專櫃的尾碼
    async getBrandPromotionData(url) {
      if (/^http/.test(url)) {
        const matchData = url.match(/shop\/(\w+)/);
        const urlSuffix = matchData?.[1];
        if (urlSuffix) {
          let bd = await this.tools.getBwebApiData(
            "GET",
            `/config?urlSuffix=${urlSuffix}`
          );
          if (bd) {
            this.nvSiteData = bd?.[0];
          }
        }
      }
    },
    //打app Api取得價格
    givePrice() {
      // 保險商品及對應連結
      const insuranceProducts = {
        8660471: "https://dna360.tw/yWxNq",
        8660466: "https://dna360.tw/iIrmy",
        8660459: "https://dna360.tw/Se0Xe",
        8660455: "https://dna360.tw/HaXsU",
        8660452: "https://dna360.tw/Gp9Nh",
        8660445: "https://dna360.tw/eLKaX",
        8660152: "https://dna360.tw/4FZvn",
      };
      // 如果是保險商品就開啟連結 不是就打API
      if (insuranceProducts[this.pid]) {
        window.open(insuranceProducts[this.pid]);
        return;
      }

      fetch(this.configs.frontApiPath() + "product/notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: this.pid,
          type: "quotation",
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.resultCode === 0) {
            alert("已收到請求，將盡快補上價格！祝您購物愉快~");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    closeFadeAlert() {
      this.isfadeAlertOpen = false;
    },
    bsiteIsLogin(opts) {
      this.bsiteLogin = opts;
    },
    // 打相同關鍵字api
    async getSimilarKW(pid) {
      const res = await this.api.ai.getAiData("getklist", {
        target: "pseudoid",
        list_fun: "PidToKWS",
        list_args: "content",
        list_remote: "m",
        list_pids: pid,
      });
      if (res?.pids?.[0]) {
        const data = res.pids[0];
        this.keywords = data?.kids.map(v => v.kcontent);
      }
    },
    //導到聯名卡推廣頁面
    gocoBrandingCardPage() {
      window.open(
        "https://go.shopping.friday.tw/event/202307/20230701-promotecard/index.html",
        "_blank"
      );
    },
    //取得麵包屑資料
    async getProductBreadcrumb() {
      const data = await this.api.ai.getAiData("getvlist", {
        list_args: "content",
        list_click: this.pid,
        list_fun: "breadCrumb",
        list_remote: "b01",
        method: "getvlist",
        target: "pseudoid",
      });
      const { groupings } = data;
      if (groupings && groupings.length > 0) {
        const groupKey = Object.keys(groupings[0]);
        const big = groupKey.find((v) => /^L/i.test(v));
        const mid = groupKey.find((v) => /^M/i.test(v));
        const bid = groupKey.find((v) => /^B/i.test(v));
        const breadCrumbData = [
          {
            url: `/category/${big}`,
            name: groupings[0][big],
          },
          {
            url: `/category/${big}/${mid}`,
            name: groupings[0][mid],
          },
          {
            url: `/category/${big}/${mid}/${bid}`,
            name: groupings[0][bid],
            last: true,
          },
        ];
        this.bid = bid;
        this.breadCrumbData = breadCrumbData;
      }
    },
    //取得簡介、詳情、規格區塊資料
    getbasicAdvAndTabsData() {
      fetch(`${this.configs.apiPath()}productDesc?pid=${this.pid}`, {
        credentials: "omit",
      })
        .then((res) => res.json())
        .then((res) => {
          const { response, payload } = res;
          this.basicAdvAndTabsData = {};
          if (response.status === "OK") {
            this.basicAdvAndTabsData.productGuide =
              payload.productDescVO.strDescBrief;
            this.basicAdvAndTabsData.productSpec =
              payload.productDescVO.strDescSpecification;
            this.basicAdvAndTabsData.productDescription =
              payload.productDescVO.strDescDescription;
          }
        });
    },
    async getProductDetail(pid) {
      if (window.serverProductData) {
        this.parseProductDetail(window.serverProductData);
      } else {
        // member cookie
        let loginInfo = null;
        const feecInfo = this.tools.getCookie("FEEC-B2C-INFO");
        if (feecInfo) {
          loginInfo = feecInfo.data;
        }

        // get product info
        const apiHeaders = {};

        // localhost cors issue.
        if (loginInfo && loginInfo.tid && !/localhost/i.test(location.host)) {
          apiHeaders["memberId"] = loginInfo.tid;
        }
        const data = await this.api.product.getProduct(pid);
        if (data) {
          this.parseProductDetail(data);
        } else {
          this.pInfo = {};
          this.isApiRequested = true;

          setTimeout(() => {
            this.seo.productSoldout();
            alert("抱歉，該商品已下架，請試試其他商品");
          }, 200);
        }
      }
    },
    parseProductDetail(productInfo) {
      // 全額折抵付款方式限定
      if (this.configs.isRestrictCoinCheckout(productInfo)) {
        this.directToCheckout = true;
        this.directToCheckoutNoPopup = false;
        this.directToCheckoutButtonTxt = "兌換";
      }

      // 付款方式調整
      productInfo["payMethodList"] = ["CASH"];

      // 若為心生活特殊純幣商品清單 就已純幣為唯一
      if (/(fcoin=exchange|mg_id=fetmc_appfcoin)/i.test(location.search)) {
        productInfo["payMethodList"] = ["LIFE_EXCHANGE_POINT"];
        productInfo["rewardPointInfo"] = {
          lifeExchangePoint: productInfo.price.promoPrice
            ? productInfo.price.promoPrice
            : productInfo.price.memberPrice,
        };
      }

      // 覆蓋deliveryInfos
      productInfo["deliveryInfos"] = [
        {
          deliveryType: "HOME",
          cartTypeId: 1,
          deliveryName: "宅配/電子票劵",
        },
      ];

      // 是否為超取商品
      if (productInfo.tags.some((v) => v === "STORE_DELIVER")) {
        productInfo["deliveryInfos"].push({
          deliveryType: "STORE",
          cartTypeId: 2,
          deliveryName: "超商取貨",
        });
      }

      // 取得商品小標
      // this.getProductLabels();

      // 有贈品及加購品才取得資料
      if (productInfo.tags.some((v) => v === "ACC")) {
        this.getAccessoryData();
      }

      // 有組合商品才取得資料
      if (productInfo.tags.some((v) => v === "COMBO")) {
        this.getComboData();
      }

      // 有活動才取得資料
      if (productInfo.tags.some((v) => v === "PROMOTION")) {
        this.getPromotionData();
      }

      this.pInfo = productInfo;
      this.pid = parseInt(this.pInfo.pid);
      this.supplierId = productInfo.supplierId;

      if (
        this.siteData &&
        this.supplierId.toString() !== this.siteData.supplierId &&
        !this.siteData.isOneSite
      ) {
        this.friendRecommandation = true;
      }

      this.api.ga.viewContent([
        {
          item_id: productInfo.pid,
          item_name: productInfo.name,
          price: productInfo.price.memberPrice,
          quantity: 1,
        },
      ]);

      // ailog
      this.ailog.productPage(productInfo.pid, productInfo.name);
      this.isApiRequested = true;

      // 取得活動資訊
      this.getCampaignData();

      //
      this.seo.common();

      const buyItemData = this.api.ai.getCache("buyItemData");
      if (buyItemData && this.api.member.isLogin) {
        this.autoAddCart(buyItemData);
      }
    },
    //取得campaig資料
    async getCampaignData() {
      const myCampaignIds = await this.api.campaign.getMyCampaigns();
      const newPinfo = await this.api.product.getProductCampaign(
        this.pInfo,
        myCampaignIds
      );
      if (newPinfo) {
        this.pInfo = newPinfo;
        this.isCampaignDataLoaded = true;
      }
    },
    getProductLabels() {
      fetch(`${this.configs.frontCloudApiPath()}product/v2/${this.pid}/labels`)
        .then((res) => res.json())
        .then((res) => {
          const { resultCode, resultData } = res;

          if (
            resultCode === 0 &&
            resultData.promotionLabels &&
            resultData.promotionLabels.length > 0
          ) {
            this.pInfo["promotionLabels"] = resultData.promotionLabels.map(
              (v) => v.text
            );
          }
        });
    },
    getAccessoryData() {
      fetch(
        `${this.configs.frontCloudApiPath()}product/v2/${this.pid}/accessory`
      )
        .then((res) => res.json())
        .then((res) => {
          const { addOnList, giftList } = res.resultData;

          if (giftList && giftList.length > 0) {
            this.giftItems = giftList.filter((v) => v.qty > 0);
          }
          if (addOnList && addOnList.length > 0) {
            this.accItems = addOnList;
            this.pInfo["additional"] = addOnList;
          }
        });
    },
    getComboData() {
      this.api.product.getComboProduct(this.pid).then((res) => {
        if (res.cartComboData.length > 0) {
          this.isCombo = true;
          this.comboInfo = res;
        } else {
          this.pInfo.isSoldOut = true;
        }
      });
    },
    getPromotionData() {
      fetch(
        `${this.configs.frontCloudApiPath()}product/v2/${this.pid}/promotion`
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.resultData && res.resultData.length > 0) {
            this.promotionId = res.resultData[0].promotionId;
          }
        });
    },
    setGoShopAnimation() {
      this.isShowGoShopAnimation = true;
    },
    async goToCart(directBuy, cartType = 1) {
      this.isBuyRedirect = directBuy ? true : false;
      this.nowSelectedCartId = cartType;
      this.showCartDialog = true;
      this.stopBodyScroll();
    },
    // 組合商品的購物車資料
    setCartComboData(data) {
      this.cartComboData = data;
    },
    getCatalogLevel(level) {
      this.catalogLevel = level;
    },
    stopBodyScroll(action, jumpCurrentY = true) {
      const body = document.body;
      if (!this.isStopScrolling) {
        body.style = "padding:0;margin:0;height:100%;overflow:hidden";
        this.isStopScrolling = !this.isStopScrolling;
      }
      if (action === "close") {
        body.style = "padding:0;margin:0;overflow:scroll";
        if (jumpCurrentY) {
          setTimeout(() => {
            // window.scrollTo(0, 0);
            window.scrollTo(0, this.currentY);
          }, 0);
        }
        this.isStopScrolling = false;
      }
    },
    closeBuyItem() {
      this.showCartDialog = false;
    },
    addWish() {
      if (this.isBsite) {
        this.bsiteAddWish();
      } else {
        this.ecAddWish();
      }
    },
    bsiteAddWish() {
      if (this.bsiteLogin) {
        const url = `${this.configs.ysdtDomain()}/FetchFavorite/add_favorite`;
        // /FetchFavorite/add_favorite POST {"pid":"8041311"}
        fetch(url, {
          method: "POST",
          body: JSON.stringify({
            pid: this.pid,
            site_type: this.siteData.siteType,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.status === 200) {
              this.wishActive = true;
            }
          });
      } else {
        window.location.href = `/login?redirectUrl=${encodeURIComponent(
          location.href
        )}`;
      }
    },
    async ecAddWish() {
      const isLogin = this.api.member.isLogin;
      if (isLogin) {
        if (!this.wishActive) {
          const data = await this.api.product.addFavorite(this.pid);
          if (data.resultCode === 0) {
            this.wishActive = true;
          }
        } else {
          this.delWish();
        }
      } else {
        window.location.href = this.api.member.loginUrl();
      }
    },
    delWish() {
      if (this.isBsite) {
        this.bsiteDelWish();
      } else {
        this.ecDelWish();
      }
    },
    bsiteDelWish() {
      if (this.bsiteLogin) {
        // /FetchFavorite/del_favorite POST {"pid":"8041311"}
        fetch(`/FetchFavorite/del_favorite`, {
          method: "POST",
          body: JSON.stringify({ pid: this.pid }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.status === 200) {
              this.wishActive = false;
            }
          });
      } else {
        window.location.href = `/login?redirectUrl=${encodeURIComponent(
          location.href
        )}`;
      }
    },
    async ecDelWish() {
      const data = await this.api.product.deleteFavorite(this.pid);
      if (data.resultCode === 0) {
        this.wishActive = false;
      }
    },
    sendProductNotification(notifyData) {
      if (this.isNoticeApiLoaded) return;
      this.isNoticeApiLoaded = true;
      if (this.siteData) {
        this.bsiteNotification();
        return false;
      }
      this.firdayNotification(notifyData);
    },
    async bsiteNotification(email) {
      const hash =
        this.siteData.siteType === "B2"
          ? window.localStorage.getItem("b_email_hash")
          : window.localStorage.getItem("b_hash");

      if (email !== undefined) {
        const isPass = this.tools.checkEmail(email);
        if (!isPass) {
          this.emailVal = "";
          this.isEmailErrorMsgShow = true;
          return false;
        }
      }

      let p;
      let payload = {
        hash: hash,
        pid: this.pid,
        url: `${this.configs.ysdtDomain()}/${this.siteData.urlSuffix}/product/${
          this.pid
        }`,
        email: email,
      };
      if (this.nowSpecInfo && this.nowSpecInfo.specId) {
        payload.specId = this.nowSpecInfo.specId;
      }
      if (hash) {
        p = await this.axios
          .post(
            `${this.configs.aiServiceApiPath("/")}productApi/notice/add`,
            payload
          )
          .then((res) => {
            const data = res.data;
            this.isNoticeApiLoaded = false;
            if (data.status === 1) {
              alert("已登記貨到通知");
              return true;
            } else {
              if (data.code === "9998" && !this.isEmailPopupOpen) {
                this.openCenterDialog();
              } else {
                alert(data.message);
              }
              console.log("貨到通知ERROR：" + data.message);
              return true;
            }
          });
      } else {
        this.api.ui.alert.getFadeAlert('請先登入會員');
      }
      return p;
    },
    firdayNotification(notifyData) {
      if (!this.api.member.isLogin) {
        window.sessionStorage.setItem(
          "productNotification",
          JSON.stringify(notifyData)
        );
        window.location.href = this.api.member.loginUrl();
        return;
      }

      const ticket = this.api.member.faToken;

      if (!notifyData) {
        notifyData = {
          pid: this.pInfo.pid,
          specId: this.pInfo.variants[0].id,
        };
      }

      if (ticket) {
        this.axios
          .get("api/product/notification", {
            params: notifyData,
            headers: {
              authorization: ticket,
              requestId: new Date().getTime(),
            },
          })
          .then((res) => {
            const data = res.data;
            this.isNoticeApiLoaded = false;
            if (data.code === 1) {
              this.isfadeAlertOpen = true;
              window.sessionStorage.removeItem("productNotification");
            }
          });
      }
    },
    getMobileCircleFetId(mcw, mcs) {
      const apiPath = `api/member/fetId?mcw=${mcw}&mcs=${mcs}`;

      this.axios
        .get(apiPath)
        .then((res) => {
          const data = res.data;
          if (data.status === 1) {
            window.sessionStorage.setItem("mcid", data.data[0].fetId);
            this.mobileCircleFetId = data.data[0].fetId;
            console.log("get mobilecircle fetid success.");
          } else {
            console.log("get mobilecircle api ok, but fetid fail.");
          }
        })
        .catch((err) => {
          console.error(err);
          console.error("get mobilecircle fetid api fail.");
        });
    },
    openCenterDialog() {
      this.isEmailPopupOpen = true;
    },
    closeCenterDialog() {
      this.isEmailErrorMsgShow = false;
      this.emailVal = "";
      this.isEmailPopupOpen = false;
    },
    changeSpecInfo(nowSpecInfo) {
      this.nowSpecInfo = nowSpecInfo;
    },
    // 刷新購物車頁
    flushCartBag() {
      window.sessionStorage.removeItem("cart_bag_count");
      this.$refs["navigation"]?.getCart();
    },
  },
  computed: {
    fixInAppMargin() {
      const styleObj = {};
      if (this.hiddenRecommendation) {
        styleObj["margin-bottom"] = "62px";
      }
      return styleObj;
    },
    // 是否為超取商品
    isStoreProduct() {
      return this.pInfo &&
        this.pInfo.tags &&
        this.pInfo.tags.some((v) => v === "STORE_DELIVER")
        ? 1
        : 0;
    },
  },
};
</script>

<style lang="scss">
@import "./style/reset.module.scss";
@import "./style/flex.module.scss";
@import "./style/rwd.module.scss";
@import "./style/icons.module.scss";
@import "./style/global.module.scss";
@import "./style/product.module.scss";
@import "./style/color.scss";

html {
  scroll-behavior: smooth;
}

.product {
  margin: 0;
  padding: 0 0 60px 0;
  box-sizing: border-box;
  position: relative;
  color: #3c3c3c;

  .similarKW {
    color: $web_main;
    font-size: 1.4rem;
    padding: 15px 0 15px 20px;

    span {
      width: 100%;
      display: flex;
      flex-direction: row;
      gap: 5px;
      overflow: scroll;

      &::-webkit-scrollbar {
        display: none;
        -ms-overflow-style: none;
        /* IE and Edge */
        scrollbar-width: none;
        /* Firefox */
      }
    }

    a {
      color: $web_main;
      background-color: $gallery;
      width: fit-content;
      border: 1px solid $alto;
      border-radius: 15px;
      text-decoration: none;
      padding: 5px 10px;
      white-space: nowrap;

      &:last-child {
        margin-right: 20px;
      }
    }
  }

  .relatedBox {
    color: $web_main;
    font-size: 1.4rem;
    padding: 10px 20px;

    li {
      font-weight: bold;
      padding: 5px 0;

      &::before {
        content: " ";
        border-left: 3px $red solid;
        margin-right: 5px;
      }
    }

    a {
      color: $web_main;
      font-weight: initial;
      border: 1px solid $gray;
      border-radius: 5px;
      text-decoration: none;
      padding: 1px 3px;
      float: right;
      transform: translateY(-2px);

      i {
        width: 1.4rem;
        height: 1.4rem;
        background-size: 1.4rem;
        position: unset;
      }
    }
  }

  .coBrandingCard {
    background-color: $background;

    > div {
      padding: 10px 0;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        font-size: 1.4rem;

        &.red {
          font-size: 1.8rem;
          color: $red;
        }

        &:first-of-type {
          margin-right: 5px;
        }
      }

      .goIcon {
        margin-left: 10px;
        background-color: $red;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        color: white;
      }
    }
  }

  &-btns {
    &__goshop-animation {
      width: 20px;
      vertical-align: sub;
      margin-left: 2px;
    }
  }

  ul {
    li {
      list-style-type: none;
    }
  }

  .control-bar {
    position: relative;

    .control-bar-title {
      font-size: 1.4rem;
      padding: 10px 20px;
    }
  }

  .gift-box,
  .additional-box {
    box-sizing: border-box;
    font-size: 1.4rem;
    white-space: nowrap;

    .items {
      width: 100%;
      overflow-x: scroll;
      overflow-y: hidden;
      padding-left: 20px;
      box-sizing: border-box;

      .items-list {
        position: relative;
        display: inline-block;
        padding: 0 5px 10px 5px;

        &.sold-out {
          .sold-out-txt {
            display: block;
          }

          .price {
            color: $sliver;
          }
        }

        font {
          display: block;
        }

        img {
          border: 1px solid $web_border;
          width: 90px;
          height: 90px;
          border-radius: 10px;
          background-color: $background;

          &.sold-out {
            opacity: 0.5;
          }
        }

        .sold-out-txt {
          display: none;
          position: absolute;
          left: 20px;
          top: 15px;
          width: 60px;
          height: 60px;
          line-height: 60px;
          border-radius: 50px;
          background-color: $black;
          opacity: 0.6;
          text-align: center;

          font {
            font-size: 1.3rem;
            color: $white;
          }
        }
      }
    }
  }

  .bottom-btn {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 60px;
    background-color: $white;
    border-top: 1px solid $web_border;

    &.mb0 {
      bottom: 0;
    }

    .wish-box {
      display: flex;
      flex: 1 1 16%;
      justify-content: center;
      align-items: center;
    }

    button {
      width: 100%;
      height: 40px;
      text-align: center;
      font-size: 1.6rem;
      font-weight: 500;
      border-radius: 10px;
    }

    .btns {
      flex: 1 1 42%;
      line-height: 40px;
      text-align: center;
      padding: 9px 9px 9px 0;
      box-sizing: border-box;

      &.btn-full {
        padding: 9px;
      }
    }

    .btn-1 {
      button {
        color: $red;
        background-color: $white;
        border: 1px solid $red;
      }
    }

    .btn-2 {
      button {
        color: $white;
        background-color: $red;
        border: 0;
      }
    }

    .btn-3 {
      flex: 1 1 25%;

      button {
        height: 35px;
        border: 0;
        border-radius: 28px;
        color: $white;
        background-color: $pomegranate;
      }
    }

    .btn-4 {
      flex: 1 1 84%;

      button {
        color: $white;
        background-color: $dodger-blue;
        border: 1px solid $dodger-blue;
      }
    }

    .btn-5 {
      button {
        color: $white;
        background-color: $olivine;
        border: 1px solid $olivine;
      }
    }

    &.sold-out {
      .btns {
        flex: 1 1 84%;
      }

      .btn-1 {
        button {
          color: $white;
          background-color: $special;
          border: unset;
        }
      }
    }
  }

  .pd-list-items {
    color: $special;

    overflow: hidden;

    .flex-container {
      display: flex;
      max-height: 100px;
      margin-bottom: 10px;
      background-color: $white;
      border-radius: 10px;

      .flexBox {
        padding: 0;

        &:first-child {
          width: 30%;
          overflow: hidden;
          border-radius: 10px;

          img {
            width: 100%;
            height: 100%;
            max-height: 100px;
          }
        }

        &:nth-child(2) {
          width: 70%;
          padding: 5px 0 5px 10px;
          text-align: left;
          position: relative;

          h3 {
            color: #333;
            font-size: 1.4rem;
            max-width: 191px;

            &.price {
              color: $red;
              font-size: 2.2rem;

              &::before {
                content: "$";
                font-size: 1.4rem;
              }
            }
          }
        }
      }
    }
  }

  .emailDialog {
    margin-bottom: 20px;

    p {
      margin-bottom: 10px;
      font-size: 1.3rem;

      &.error {
        margin-top: 2px;
        color: $red;
      }
    }

    input {
      width: 100%;
      background-color: #f4f4f4;
      border: unset;
      border-radius: 10px;
      padding: 10px;
      display: inline-block;
      box-sizing: border-box;
    }
  }
  .notSaleBtn {
    background-color: #ffbd39 !important;
    border: 1px solid #ffbd39 !important;
    color: $mine-shaft !important;
    &.soldout {
      color: $white !important;
      border: 1px solid $special !important;
      background-color: $special !important;
    }
  }
}

.product-component-container {
  padding: 15px 20px;
  font-size: 1.4rem;

  img {
    width: 100%;
  }
}

.product-component-blocks {
  > div {
    display: flex;
    position: relative;
    padding: 5px 0;
  }

  label {
    width: 20%;
    color: $sliver;
  }

  span {
    flex: 0 1 12%;
  }
}
</style>

<style lang="scss">
.arrow-right {
  position: absolute;
  right: 20px;
  top: 12px;

  &.inline {
    right: 0;
    top: 8px;
  }
}

.block-split {
  background-color: #f4f4f4;
  display: block;
  height: 44px;
  line-height: 44px;
  color: #adadad;
  text-align: center;
  font-size: 1.4rem;
}
</style>
