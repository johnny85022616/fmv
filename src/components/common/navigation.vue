<template>
  <div class="navigation-bar">
    <div v-if="isBsite" class="redBg isBsite" :style="{ backgroundColor: `${siteData.headerColor ? siteData.headerColor : '#ddd5cc'}` }">
      <div class="mini-logo" @click="openBsiteSite">
        <p v-if="isSetLogoContentShow" class="setLogo" @click="(e)=>setLogo(e)">請設定logo</p>
        <img v-else :src="siteData.logoMobile" />
        <span v-if="isModifyShow" class="modify" @click="(e)=>setLogo(e)">修</span>
      </div>
      <div class="subSiteName" v-if="siteData.b2Info && siteData.b2Info.subSiteName">
        <p>{{ siteData.b2Info.subSiteName }}</p>
      </div>
      <div v-if="!isCampaignPage" class="new-search" @click="showSearchInput">
        <div :class="[{grayb: isBsite}]">
          <input v-model="inputTerms" @keydown="goSearchByEnter" ref="input" />
          <img src="https://event.shopping.friday.tw/event/CP/common/mobile_icon/search-gy.svg" @click="goSearch" />
        </div>
      </div>
    </div>
    <div v-else :class="['redBg', {haBack:isBackBtnShow}]" :style="{ backgroundColor: '#f5281e' }">
      <div v-if="isBackBtnShow" class="back" @click="historyBack">
        <i></i>
      </div>
      <template v-if="isShowLogo && isFetnetSource">
        <div class="mini-logo" @click="openFridaySite">
          <img src="../../images/friday_fetnet_logo.svg" />
        </div>
      </template>
      <template v-else-if="isShowLogo && !isFetnetSource">
        <div class="mini-logo" @click="openFridaySite">
          <img v-if="api.web.isFridayMall()" src="../../images/friday_mall_logo.svg" />
          <img v-else src="../../images/friday_logo.svg" />
        </div>
      </template>
      <div v-if="!isCampaignPage" class="new-search" @click="showSearchInput">
        <div :class="[{grayb: isBsite}]">
          <input v-model="inputTerms" @keydown="goSearchByEnter" ref="input" />
          <img src="https://event.shopping.friday.tw/event/CP/common/mobile_icon/search-gy.svg" @click="goSearch" />
        </div>
      </div>
      <div class="downLoadBtn">
        <appDownload />
      </div>
    </div>

    <peopleLinks v-if="isShowPeopleLinks && !isBsite" :logoHeight="logoHeight" />
    <peopleLinksBsite v-else-if="isShowPeopleLinks && isBsite" :supplierData="supplierData" />

    <searchinput v-if="isShowSearchInput" v-on:closeSearchMenu="closeSearchMenu" v-on:setHotKeyword="setHotKeyword" />

    <menutree v-if="isShowMenu" v-on:closeShowMenu="closeShowMenu" :supplierData="supplierData" />

    <navigationBottom ref="navigationBottom" v-if="isShowBottom" :supplierData="supplierData" v-on:showMenu="showMenu" v-on:showPeopleLinks="showPeopleLinks" />
  </div>
</template>

<script>
import navigationBottom from "./navigationBottom.vue"; // 共用底的導覽列
import searchinput from "./searchinput.vue"; // 搜尋框
import peopleLinks from "./peoplelinks"; // EC 選單
import peopleLinksBsite from "./peoplelinksBsite"; // BSite 選單
import menutree from "./menutree";
import appDownload from "../homepage/appDownload.vue";

export default {
  name: "nagivation",
  components: {
    appDownload,
    navigationBottom,
    searchinput,
    peopleLinks,
    peopleLinksBsite,
    // searchinput,
    menutree,
  },
  data() {
    return {
      isShowLogo: false, // 是否呈現LOGO
      isFetnetSource: false, // 是否遠傳來源
      isBsite: false,
      isLogin: false, // 是否已登入
      isShowBottom: true,
      isShowPeopleLinks: false,
      isShowSearchInput: false,
      isShowMenu: false,
      isShowArrow: false,
      searchInputHotKeyword: "",
      supplierData: null,
      logoHeight: 60,
      device: null,
      isModifyShow: false,
      inputTerms: "", // 搜尋關鍵字
    };
  },
  props: {
    isHomepage: {
      type: Boolean,
      default: () => false,
    },
    isComponentMaskShow: {
      type: Boolean,
      required: false,
    },
    directShowSearchInput: {
      type: Boolean,
    },
    openMenu: {
      type: Boolean,
    },
    //返回前頁按鈕
    isBackBtnShow: {
      type: Boolean,
      default: () => false,
    },
  },
  watch: {
    directShowSearchInput: function (n) {
      if (n) {
        this.showSearchInput();
      }
    },
    openMenu: function (n) {
      if (n) {
        this.showMenu();
      }
    },
  },
  async created() {
    if (!/brandPromotion/i.test(location.pathname)) {
      const { keyword, type } = this.tools.urlSearchToObj();
      const queryKws = keyword;
      if (queryKws && !type) this.inputTerms = queryKws;
    }

    // 登入判斷
    this.isLogin = this.api.member.isLogin;

    // 檢查LOGO用哪個
    this.checkLogoUI();

    if (
      history.length > 2 &&
      !/^(\/|\/[\w]+\/?|\/index\.html)$/.test(location.pathname)
    ) {
      this.isShowArrow = true;
    }

    const meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    meta.content = "#f5281e";
    document.getElementsByTagName("head")[0].appendChild(meta);

    // 是否為BSite
    if (window.siteData) {
      this.getBSiteCart();
      if (
        this.siteData.headerColor === "#ffffff" ||
        !this.siteData.headerColor
      ) {
        meta.content = "#ddd5cc";
      } else {
        meta.content = this.siteData.headerColor;
      }
      // const themeColor = document.querySelector("meta[name='theme-color']")
      this.isBsite = true;
    }

    if (/gohappyapp/i.test(navigator.userAgent)) {
      this.isShowBottom = false;
    }

    //app上商品相關處理
    const { device, modify } = this.tools.urlSearchToObj();
    if (device === "app") {
      this.device = "app";
      if (modify === "1" && this.siteData.logoMobile) {
        this.isModifyShow = true;
      }
    }
  },
  computed: {
    checkShowLogo() {
      return this.windowY > 50 ? false : true;
    },
    topLogoImgOpacity() {
      const n = 1 - this.windowY / this.scrollBegin;
      return n < 1 ? (n < 0 ? 0 : n) : 1;
    },
    topImgOpacity() {
      return this.windowY >= this.scrollBegin ? 0 : 1;
    },
    //app上商品設定logo文字顯示
    isSetLogoContentShow() {
      return !this.siteData.logoMobile && this.device === "app";
    },
    isCampaignPage() {
      return /(campaign|shipFeeProductList)/.test(location.pathname);
    },
  },
  methods: {
    // 檢查LOGO用哪個
    async checkLogoUI() {
      // 已登入，取得當前是否遠傳身分
      if (this.isLogin) {
        const isFetnetMemberCache = this.tools.getCache('isFetnetMember');
        
        if (isFetnetMemberCache === null) {
          // 如果沒有快取資料，請求一次 API 並更新快取
          const memberInfo = await this.api.member.getMember();
          // UI判斷已登入，但是API取不到，則轉導登入
          if (memberInfo === null) window.location.href = this.api.member.loginUrl();

          // 取fetId
          const isMember = Boolean(memberInfo.fetId); // 確保結果為布林值
          this.tools.setCache('isFetnetMember', isMember ? '1' : '0', 300);
          this.isFetnetSource = isMember;
        } else {
          // 使用快取資料（從字串轉為布林值）
          this.isFetnetSource = isFetnetMemberCache === '1';
        }
      } else {
        // 未登入情況，通過其他工具判斷
        this.isFetnetSource = this.api.web.isFetnetSource();
      }
      this.isShowLogo = true;
    },
    getCart() {
      this.$refs['navigationBottom'].getCart();
    },
    getBSiteCart() {
      this.api.cart.getCartBagCount().then(num => {
        this.cartCount = num;
        this.supplierData = Object.assign(this.siteData, {
          cartCount: num,
          isLogin: this.api.member.isLogin
        });
      });

      if (this.api.member.isLogin) {
        this.$emit("bsiteIsLogin", true);
      }
    },
    backUrl() {
      if (this.isShowMenu) {
        this.isShowMenu = !this.isShowMenu;
        window.scrollTo(0, 0);
      } else {
        history.go(-1);
      }
    },
    setHotKeyword(keyword) {
      this.searchInputHotKeyword = keyword;
      this.$emit("setHotKeyword", keyword);
    },
    closeSearchMenu() {
      this.isShowSearchInput = false;
      this.$emit("stopBodyScroll", "close");
      this.$emit("disableShowSearchInput");
    },
    closeShowMenu() {
      this.isShowMenu = false;
      this.$emit("stopBodyScroll", "close");
    },
    // 打開漢堡選單
    showMenu(evt) {
      if (evt) evt.preventDefault();
      if (!this.isShowMenu) {
        this.isShowSearchInput = false;
        this.isShowPeopleLinks = false;
        this.isShowMenu = true;
        this.$emit("stopBodyScroll");
      } else {
        this.isShowMenu = false;
        this.$emit("stopBodyScroll", "close");
        this.$emit("disableShowSearchInput");
        this.$emit("closeMenu");
      }
    },
    // 打開bSite主站
    openBsiteSite(evt) {
      if (evt) evt.preventDefault();
      window.location.href = "/" + this.siteData.urlSuffix;
    },
    // 打開friDay主站
    openFridaySite(evt) {
      if (evt) evt.preventDefault();
      window.location.href = "/";
    },
    // 打開會員中心
    showPeopleLinks(evt) {
      if (evt) evt.preventDefault();
      this.isShowPeopleLinks = !this.isShowPeopleLinks;
      if (this.isShowPeopleLinks) {
        this.isShowMenu = false;
        this.isShowSearchInput = false;
        // setTimeout(function () {
        //   window.scrollTo(0, 70);
        // }, 0);
        this.$emit("stopBodyScroll");
      } else {
        this.$emit("stopBodyScroll", "close");
        this.$emit("disableShowSearchInput");
      }
    },
    showSearchInput(evt) {
      if (evt) evt.preventDefault();
      this.isShowSearchInput = !this.isShowSearchInput;
      if (this.isShowSearchInput) {
        this.isShowMenu = false;
        this.isShowPeopleLinks = false;
        // setTimeout(function () {
        //   window.scrollTo(0, 70);
        // }, 0);
        this.$emit("stopBodyScroll");
      } else {
        this.$emit("stopBodyScroll", "close");
        this.$emit("disableShowSearchInput");
      }
    },
    async goSearch() {
      let keyword = this.$refs.input.value;
      const { urlSuffix } = this.siteData || {};
      // 自然搜尋判斷全站
      if (/^([0-9]{5,10})$/i.test(keyword)) {
        const pidInfo = await this.tools.getPidsInfo([keyword]);
        if (pidInfo && pidInfo[keyword]) {
          if (this.isBsite) {
            window.location.href = `${
              urlSuffix ? `/${urlSuffix}` : ""
            }/product/${keyword}`;
            return false;
          }
          window.location.href = `${
            urlSuffix ? `/${urlSuffix}` : ""
          }/product/${keyword}`;
          return false;
        }
      }
      if (keyword !== "") {
        window.location.href = `${
          urlSuffix ? `/${urlSuffix}` : ""
        }/aisearch?keyword=${encodeURIComponent(keyword)}`;
      }
    },
    goSearchByEnter(evt) {
      if (evt && evt.keyCode === 13) {
        // evt.preventDefault();
        this.goSearch();
        evt.stopPropagation();
      }
    },
    historyBack() {
      history.back();
    },
    setLogo(e) {
      e.stopPropagation();
      if (window.flutter_inappwebview !== undefined) {
        window.flutter_inappwebview
          .callHandler("openLogoSetting")
          .then(function () {});
      }
    },
  },
};
</script>
  
<style lang="scss" scoped>
@import "../../style/color";
@import "../../style/mixin";

.navigation-bar {
  position: relative;
  height: 60px;
  margin: 0;
  @include shadow;

  .redBg {
    width: 100%;
    height: 60px; // this.logoHeight
    display: flex;
    z-index: 2;
    position: fixed;
    will-change: transform;
    padding: 0 20px;
    box-sizing: border-box;
    &.haBack {
      padding: 0 20px 0 10px;
      .mini-logo {
        flex: 1 1 20%;
      }
    }
    .back {
      i {
        display: inline-block;
        width: 25px;
        height: 25px;
        background-image: url(../../images/icons/index_arrow.png);
        background-repeat: no-repeat;
        background-position-x: 50%;
        background-position-y: 8%;
        background-size: 85%;
      }
    }

    &.isBsite {
      .mini-logo img {
        width: auto;
        // max-height: 42px;
        max-height: 35px;
        margin-right: 15px;
      }

      .new-search input {
        border: 3px solid $gallery !important;
      }
    }

    > div {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mini-logo {
      flex: 1 1 30%;
      img {
        width: 100px;
        margin: 0 auto !important;
      }
      &.fetnet {
        img {
          width: 55px;
        }
      }
    }
    .subSiteName {
      flex: 1 1 20%;
      font-size: 16px;
      p {
        color: $white;
        background-color: rgba($color: $black, $alpha: 0.2);
        line-height: 35px;
        letter-spacing: 1px;
        border: 1px solid $white;
        border-radius: 5px;
        padding: 0 4px;
        box-sizing: border-box;
      }
    }

    .new-search {
      flex: 1 1 50%;
      > div {
        position: relative;
        width: 90%;
        input {
          display: inline-flex;
          position: relative;
          align-items: center;
          box-sizing: border-box;
          width: 100%;
          height: 40px;
          border: 3px solid rgba(255, 0, 0, 0.5);
          border-radius: 10px;
          background-color: $white;
          padding-left: 10px;
          font-size: 1.5rem;
          &.grayb {
            border: 3px solid $gallery;
          }
        }
      }

      a {
        text-decoration: none;
      }

      span {
        color: $web_minor;
        font-size: 1.4rem;
        margin-left: 10px;
      }

      img {
        width: 20px;
        height: 20px;
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-10px);
      }
    }
  }

  .new-logo {
    position: relative;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    transition: all 0.2s;
    display: inline-block;
    width: 155px;
    height: 25px;

    &.is-bsite {
      top: 5px;
    }

    img {
      width: 100%;
    }
  }
}
.setLogo {
  color: blue;
  font-size: 15px;
  text-decoration: underline;
}
.modify {
  color: blue;
  margin: 0 3px;
  font-size: 15px;
  align-self: flex-end;
  margin-bottom: 10px;
  text-decoration: underline;
}
</style>
