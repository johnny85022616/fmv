<template>
  <div :class="navClass" :style="{ top: topVal, 'margin-top': isDownloadAppOpened ? '58px' : '0px' }">
    <template v-if="!onlyLogo">
      <div class="whiteBg">
        <div v-if="!isFetCircleTraffic" class="new-menu">
          <a href @click="showMenu">
            <img class="bottom" :src="mobileIconPathPath + 'menu.svg'" />
          </a>
        </div>

        <div :class="['new-logo', {
          'align-left': isFetCircleTraffic
        }]">
          <a href="/">
            <img :src="mobileIconPathPath + logoImgFile" />
          </a>
        </div>

        <div v-if="!isFetCircleTraffic" class="new-search">
          <a href="#" @click="showSearchInput">
            <img :src="searchImg" />
          </a>
        </div>

        <div v-if="!isFetCircleTraffic" class="new-people">
          <a href @click="showPeopleLinks">
            <img :src="peopleLinkImg" />
          </a>
        </div>

        <div class="new-cart">
          <a href="/shoppingcart">
            <img class="bottom" :src="mobileIconPathPath + 'cart.svg'" />
          </a>
          <span :class="{ active: isRedCartNumber }">{{ cartNum }}</span>
        </div>
      </div>

      <peopleLinks v-if="isShowPeopleLinks" :isDownloadAppOpened="isDownloadAppOpened" />

      <searchinput v-if="isShowSearchInput" v-on:closeSearchMenu="closeSearchMenu"
        :isDownloadAppOpened="isDownloadAppOpened" @searchinputstatus="goback" />

      <menutree v-if="isShowMenu" v-on:closeShowMenu="closeShowMenu" v-on:directBestbuy="directBestbuy"
        :isDownloadAppOpened="isDownloadAppOpened" />

    </template>
    <template v-if="onlyLogo">
      <div :class="['whiteBg', { 'redBg': isRedBg }]">
        <div class="new-logo align-center">
          <img :src="mobileIconPathPath + logoImgFile" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import peopleLinks from "./peoplelinks";
import searchinput from "./searchinput";
import menutree from "./menutree";

export default {
  name: "nagivation",
  components: {
    peopleLinks,
    searchinput,
    menutree,
  },
  data() {
    return {
      cartNum: 0,
      scrollBegin: 50, // how many window.scrollY start opacity animation.
      redCartBegin: 20,
      isShowPeopleLinks: false,
      isShowSearchInput: false,
      isShowMenu: false,
      isFetCircleTraffic: false,
      searchImg: "https://m.shopping.friday.tw/static/images/search.svg",
      peopleLinkImg: "https://m.shopping.friday.tw/static/images/member.svg",
      mobileIconPathPath:
        "https://event.shopping.friday.tw/event/CP/common/mobile_icon/",
      logoImgFile: "friday_fetnet_logo_small.svg",
      navClass: {
        "navigation-bar": true,
        sticky: false,
      },
      isUp: false,
      onlyLogo: false,
      isRedBg: false,
    };
  },
  props: {
    isShowRedTop: {
      type: Boolean,
      required: true,
    },
    windowY: {
      type: Number,
      required: true,
    },
    isDownloadAppOpened: {
      type: Boolean,
      required: true,
    },
  },
  created() {
    this.isFetCircleTraffic = this.tools.checkInSuperAppSessions();

    // 特殊位置參數只顯示LOGO
    if (this.configs.hiddenCommonHeader.test(location.search)) {
      this.onlyLogo = true;
    }

    // 特殊位置參數處理紅色底色
    if (this.configs.isRedBg.test(location.search)) {
      this.isRedBg = true;
      this.logoImgFile = "friday_logo_turnturn.svg";
    }
  },
  computed: {
    whiteBgTop() {
      return "translateY(" + this.windowY + "px)";
    },
    isRedCartNumber() {
      return true;
    },
    topVal() {
      if (this.isDownloadAppOpened && this.isUp) {
        return "58px";
      } else if (this.isup) {
        return "0";
      }
      return "0";
    },
  },
  watch: {
    //若為向上滾動則將天訂在最上方
    windowY(newY, oldY) {
      if (newY < oldY) {
        this.navClass["sticky"] = true;
        this.isUp = true;
      } else {
        this.navClass["sticky"] = false;
        this.isUp = false;
      }
    },
  },
  methods: {
    goback() {
      this.isShowSearchInput = !this.isShowSearchInput;
      this.searchImg = "https://m.shopping.friday.tw/static/images/search.svg";
      this.$emit("stopBodyScroll", "close");
    },
    closeShowMenu() {
      this.isShowMenu = false;
      this.$emit("stopBodyScroll", "close");
    },
    closeSearchMenu() {
      this.isShowSearchInput = false;
      this.$emit("stopBodyScroll", "close");
      this.$emit("disableShowSearchInput");
    },
    directBestbuy() {
      this.$emit("directBestbuy");
    },
    showMenu(evt) {
      if (evt) evt.preventDefault();
      if (!this.isShowMenu) {
        this.isShowSearchInput = false;
        this.isShowPeopleLinks = false;
        // setTimeout(() => {
        //   window.scrollTo(0, 70);
        // }, 0);
        this.isShowMenu = true;
        this.$emit("stopBodyScroll");
      } else {
        this.isShowMenu = false;
        this.$emit("stopBodyScroll", "close");
      }
    },
    showPeopleLinks(evt) {
      if (evt) evt.preventDefault();
      this.isShowPeopleLinks = !this.isShowPeopleLinks;
      if (this.isShowPeopleLinks) {
        this.isShowMenu = false;
        this.isShowSearchInput = false;
        this.peopleLinkImg =
          "https://m.shopping.friday.tw/static/images/member_active.svg";
        this.searchImg =
          "https://m.shopping.friday.tw/static/images/search.svg";
        if (this.isDownloadAppOpened) {
          setTimeout(function () {
            window.scrollTo(0, "50px");
          }, 0);
        }
        this.$emit("stopBodyScroll");
      } else {
        this.peopleLinkImg =
          "https://m.shopping.friday.tw/static/images/member.svg";
        this.$emit("stopBodyScroll", "close");
      }
    },
    showSearchInput(evt) {
      if (evt) evt.preventDefault();
      this.isShowSearchInput = !this.isShowSearchInput;
      if (this.isShowSearchInput) {
        this.isShowMenu = false;
        this.isShowPeopleLinks = false;
        this.searchImg =
          "https://m.shopping.friday.tw/static/images/search_active.svg";
        this.peopleLinkImg =
          "https://m.shopping.friday.tw/static/images/member.svg";
        if (this.isDownloadAppOpened) {
          setTimeout(function () {
            window.scrollTo(0, "50px");
          }, 0);
        }
        this.$emit("stopBodyScroll");
      } else {
        this.searchImg =
          "https://m.shopping.friday.tw/static/images/search.svg";
        this.$emit("stopBodyScroll", "close");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/color";

.navigation-bar {
  z-index: 10;
  position: relative;
  height: 45px;
  margin: 0;

  &.sticky {
    position: sticky;
  }

  .whiteBg {
    z-index: 1;
    position: static;
    width: 100%;
    height: 45px;
    background-color: $white;
    border-bottom: 1px solid $web_border;

    &.redBg {
      background-color: $turn-red;

      .new-logo {
        top: 12px;
        width: 100%;
        height: 25px;
      }
    }

    .new-logo {
      position: relative;
      top: 14px;
      left: 45px;
      width: 132px;
      height: 21px;

      &.align-left {
        left: 5%;
      }

      &.align-center {
        left: unset;
        margin: 0 auto;
      }

      img {
        width: 100%;
        height: 100%;
      }
    }

    .new-search {
      position: absolute;
      top: 0;
      right: 140px;
    }

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 45px;
      height: 45px;
    }

    .new-menu {
      position: absolute;
      left: 0;
    }

    .new-people {
      position: absolute;
      top: 0;
      right: 95px;
    }

    .new-cart {
      position: absolute;
      top: 0;
      right: 50px;

      span {
        position: absolute;
        top: 3px;
        right: -43px;
        color: $red;
        background-color: $white;
        border-radius: 25px;
        font-size: 1.2rem;
        font-weight: 500;
        width: 18px;
        height: 16px;
        padding: 1px 0 0 0;
        text-align: center;

        &.active {
          color: $white;
          background-color: $red;
        }
      }
    }
  }
}</style>
