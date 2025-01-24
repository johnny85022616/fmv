<template>
  <div>
    <div id="Homepage">
      <div class="advertise" v-if="isAdvertiseCoverShow">
        <div>
          <i @click="closeAdvertise"></i>
          <a :href="promoData.cover.url" target="_blank"><img :src="`${promoData.cover.img}?${tools.version()}`" alt=""></a>
        </div>
      </div>
      <navigation :isHomepage="true" v-on:stopBodyScroll="stopBodyScroll" v-on:disableShowSearchInput="disableShowSearchInput" v-on:directBestbuy="directBestbuy" :isComponentMaskShow="isComponentMaskShow" :directShowSearchInput="directShowSearchInput" v-on:setHotKeyword="setHotKeyword" :isBsite="isBsite" />
      
       <!-- 一般friDay, ai4 B1,B2 --> 
      <template v-if="!isB4">
        <template v-if="siteData && Number(siteData.skuCount) < 50 && isNotExposeToMeTag">
          <template v-if="isShowSimpleHomePage">
            <bsiteBanner />
            <div class="homepage-bottom">
              <aiRecProductsBsite :windowY="windowY" />
            </div>
          </template>
          <template v-else-if="isShowListHomePage">
            <div class="listPage">
              <aiProductItem v-if="notIsOthersExposeToMeData.length > 0" :itemList="notIsOthersExposeToMeData" />
            </div>
          </template>
        </template>
        <template v-else>
          <!-- <template v-if="isCouponDay1">
            <a href="https://go.shopping.friday.tw/event/202311/20231102-event/index.html" target="_blank">
              <img src="https://event.shopping.friday.tw/event/CP/20231111/A1_topbar_1200_1111.jpg" style="width:100%" />
            </a>
          </template>
<template v-else-if="isCouponDay2">
            <a href="https://event.shopping.friday.tw/event/CP/couponfriday/" target="_blank">
              <img src="https://event.shopping.friday.tw/event/CP/20231111/day2.jpg" style="width:100%" />
            </a>
          </template>
<template v-else-if="afterCouponDay">
            <a href="https://go.shopping.friday.tw/event/202311/20231102-event/index.html" target="_blank">
              <img src="https://event.shopping.friday.tw/event/CP/20231111/A1_topbar_1200_1112.jpg" style="width:100%" />
            </a>
          </template>
<template v-else>
            <a href="https://go.shopping.friday.tw/event/202311/20231102-event/index.html" target="_blank" title="雙雙11🔥🔥 先加入購物車，雙11自動降價😍">
              <img src="https://event.shopping.friday.tw/event/CP/20231111/A1_topbar_1200.jpg" style="width:100%" />
            </a>
          </template> -->

          <div class="homepage-top">
            <banners v-if="!isBsite" />
            <a href="https://go.shopping.friday.tw/event/202310/20231001-fcoin/index.html" target="_blank">
              <img v-if="isBillBanerShow" class="bill-banner" src="https://event.shopping.friday.tw/event/homepage/bill_banner.png" alt="">
            </a>
            <shortcutSlider v-if="!isBsite" />
            <campaignPromotion v-if="!isBsite" />
            <relatedCompanies v-if="!isBsite" />
            <div v-if="!isBsite && isAdvertiseMidShow" class="advertise2">
              <a :href="promoData.mid.url" target="_blank"><img :src="`${promoData.mid.img}?${tools.version()}`" alt=""></a>
            </div>
            <img v-if="siteData && siteData.urlSuffix === 'aptgfet'" src="https://event.shopping.friday.tw/event/homepage/watsons/mid_banner?.jpg" class="mb5" style="width: 100%;" />
            <tieupAd v-if="siteData" :blockNum="0" />
            <hourlyRec v-on:switchComponentMask="switchComponentMask" />
            <tieupAd v-if="siteData" :blockNum="2" />
            <topBanner v-if="isBsite" :supplierData="siteData"></topBanner>
            <bsiteAd v-if="isBsite" :supplierData="siteData" />
            <campaignPromotion v-if="isBsite" />

            <div style="font-size: 1.4rem; padding: 10px 0 2px;">
              <a href="https://shopping.friday.tw/ec2/anti_grift" target="_blank" style="color: red; text-decoration: none;">【慎防詐騙】 本公司不會主動聯繫要求您提供個人金融資料，也不會要求您操作ATM轉帳或網銀</a>
            </div>
          </div>
          <discountAndHot v-if="!isBsite" />
          <template v-if="isShowUnViewedComponent">
            <hotKeywods :isBsite="isBsite" />
            <bsiteBanner v-if="isBsite" />
            <brand v-if="isYsdt" />
            <div v-if="isBsite" class="homepage-bottom">
              <aiRecProductsBsite :windowY="windowY" />
            </div>
            <div v-else class="homepage-bottom">
              <aiRecProducts :windowY="windowY" />
            </div>
          </template>
        </template>
      </template>

      <!-- 主題網 -->
      <topic v-else />

    </div>
    <a class="goup" v-show="showGoUp" href="#" @click="backToTop">
      <i></i><span>TOP</span>
    </a>
  </div>
</template>

<script>
import ailog from "./utils/ailog.js";
import aiProductItem from "./components/common/aiProductItem.vue";
import aiRecProducts from "./components/homepage/aiRecProducts.vue"; // 下方商品推薦
import aiRecProductsBsite from "./components/homepage/aiRecProductsBsite.vue"; // 下方商品推薦
import banners from "./components/homepage/banners.vue"; // A1
import brand from "./components/homepage/brand.vue";
import bsiteAd from "./components/homepage/bsiteAd.vue"; // BSite Ad Banner
import bsiteBanner from "./components/homepage/bsiteBanner.vue"; // BSite Product A1
import campaignPromotion from "./components/homepage/campaignPromotion.vue"; // 活動劵
import discountAndHot from "./components/homepage/discountAndHot.vue"; // 限時搶購及熱銷
import hotKeywods from "./components/common/hotKeywords.vue"; //熱門關鍵字
import hourlyRec from "./components/homepage/hourlyRec.vue"; // 首頁整點特賣
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import shortcutSlider from "./components/homepage/shortcutSlider.vue"; // 首頁中間快捷版位
import tieupAd from "./components/homepage/tieupAd.vue";
import topic from "./components/topic/topic.vue";
import topBanner from "./components/homepage/topBanner.vue";
import relatedCompanies from "./components/homepage/relatedCompanies.vue";

export default {
  name: "Homepage",
  data() {
    return {
      isShowUnViewedComponent: true,
      showOnLighthouse: true,
      currentY: 0,
      windowY: 0,
      isShowRedTop: false,
      isStopScrolling: false,
      background_red_top: 0,
      isComponentMaskShow: false,
      directShowSearchInput: false,
      directJumpToBestBuy: false,
      showGoUp: false,
      searchInputHotKeyword: "",
      supplierData: null,
      isBsite: false,
      logoHeight: 0,
      isYsdt: false,
      isB4: false, //topic tag
      isBillBannerShow: false,
      isShowListHomePage: false,
      isShowSimpleHomePage: false,
      notIsOthersExposeToMeData: null,
      isNotExposeToMeTag: false,
      promoData: null,
      isAdvertiseCoverShow: false,
      isAdvertiseMidShow: false,
    };
  },
  components: {
    aiProductItem,
    aiRecProducts,
    aiRecProductsBsite,
    banners,
    brand,
    bsiteAd,
    bsiteBanner,
    campaignPromotion,
    relatedCompanies,
    discountAndHot,
    hotKeywods,
    hourlyRec,
    navigation,
    shortcutSlider,
    tieupAd,
    topic,
    topBanner,
  },
  async created() {
    this.setPromoData();
    // 供應商資料取得
    if (this.siteData) {
      // 有供應商代號且有cache
      ailog.homepage();
      this.supplierData = this.siteData;
      this.isBsite = true;
      if (this.supplierData.urlSuffix === "ysdt") {
        this.isYsdt = true;
      }
      if (this.siteData.siteType === "B4") {
        this.isB4 = true;
      }
      if (
        ["B1", "b1"].includes(this.siteData.siteType) &&
        this.siteData.isOthersExposeToMe === "N"
      ) {
        this.isNotExposeToMeTag = true;
        const data = await this.getNotIsOthersExposeToMeData();
        if (data) {
          if (data.length >= 50) {
            this.isShowSimpleHomePage = true;
          } else {
            this.isShowListHomePage = true;
            this.notIsOthersExposeToMeData = data.map((ele) => {
              return {
                img: ele.image_url,
                name: ele.name,
                pid: ele.pid,
                price: ele.price,
              };
            });
          }
        }
      }
    } else {
      // 展延Token
      this.api.member.getTokenRefresh();
    }

    // 心生活取得加密文，換取fetId
    const { mc_w, mc_s } = this.tools.urlSearchToObj();
    if (mc_w && mc_s) {
      this.getMobileCircleFetId(mc_w, mc_s);
    }

    this.showOnLighthouse = this.lighthouse ? false : true;
    window.addEventListener(
      "scroll",
      () => {
        const wy = window.scrollY;
        this.windowY = wy;
        this.currentY = wy !== 70 && wy !== 0 ? wy : this.currentY;
        this.background_red_top = (0 - wy) * 1.5;
        this.isShowRedTop = wy > 0 ? false : true;
        this.showGoUp = wy > 0 ? true : false;
      },
      {
        passive: true,
      }
    );
    this.seo.homepage();
  },
  computed: {
    // 先Mark掉 雙12可能要用
    // isCouponDay1() {
    //   const m = new Date().getMonth() + 1;
    //   const d = new Date().getDate();
    //   return m === 11 && d === 11;
    // },
    // isCouponDay2() {
    //   const m = new Date().getMonth() + 1;
    //   const d = new Date().getDate();
    //   return m === 11 && d === 12;
    // },
    // afterCouponDay() {
    //   const m = new Date().getMonth() + 1;
    //   const d = new Date().getDate();
    //   return m === 11 && d >= 13 && d <= 19;
    // },
    translateY: function () {
      let top = this.background_red_top;
      if (top > 0) {
        top = 0;
      }
      return "translateY(" + top + "px)";
    },
    isBillBanerShow() {
      const fetCode = this.tools.getFetCode();
      if (fetCode) {
        return true;
      }
      return false;
    },
  },
  methods: {
    // 蓋板及腰帶
    async setPromoData() {
      const data = await this.api.promotion.getPromoExpos("homepage");
      const isTodayLook = this.checkTodayLook();
      const { mobile } = data || {};
      if (mobile) {
        this.promoData = mobile;
        this.isAdvertiseCoverShow = !isTodayLook && mobile?.cover?.img;
        this.isAdvertiseMidShow = mobile?.mid?.img;
      }
    },
    //確認今天是否看過
    checkTodayLook() {
      const todayString = this.getTodayString();
      const advertiseStorage = this.api.ai.getCache("advise1LookToday");
      if (!advertiseStorage) {
        this.api.ai.setCache("advise1LookToday", todayString, 3600);
        return false;
      } else if (todayString === advertiseStorage) {
        return true;
      }
    },
    getTodayString() {
      const today = new Date();
      const year = today.getFullYear().toString();
      const month = (today.getMonth() + 1).toString();
      const day = today.getDate().toString();
      const td = year + month + day;
      return td;
    },
    closeAdvertise() {
      this.isAdvertiseCoverShow = false;
    },
    async getNotIsOthersExposeToMeData() {
      let postData = {
        type: "3",
        q1_x: 0.5,
        supplier_y: 1,
        list_num: 100,
      };
      const sid = this.siteData.supplierId || "";
      postData.filter = {
        k: "1000",
        v: [sid, "", "", ""],
      };

      const data = await this.api.ai.getAiData("getalist", postData);
      if (data) {
        return data;
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
    // 設定搜尋欄熱搜關鍵字
    setHotKeyword(keyword) {
      this.searchInputHotKeyword = keyword;
    },
    // 展開搜尋列
    jumpToSearchInput() {
      this.directShowSearchInput = true;
    },
    stopBodyScroll(action, jumpCurrentY = true) {
      const body = document.body;
      if (!this.isStopScrolling) {
        body.style = "padding:0;margin:0;overflow:hidden;height:100%";
        this.isStopScrolling = !this.isStopScrolling;
      }
      if (action === "close") {
        body.style = "padding:0;margin:0;";
        if (jumpCurrentY) {
          setTimeout(() => {
            window.scrollTo(0, this.currentY);
          }, 0);
        }
        this.isStopScrolling = false;
      }
    },
    disableShowSearchInput() {
      this.directShowSearchInput = false;
    },
    //前往無敵大好康頁面
    directBestbuy() {
      this.directJumpToBestBuy = true;
      setTimeout(() => {
        this.directJumpToBestBuy = false;
      }, 100);
    },
    backToTop(evt) {
      evt.preventDefault();
      window.scrollTo(0, 0);
    },
    switchComponentMask(opts) {
      this.isComponentMaskShow = opts;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./style/reset.module.scss";
@import "./style/flex.module.scss";
@import "./style/rwd.module.scss";
@import "./style/icons.module.scss";
@import "./style/global.module.scss";
@import "./style/color";

#Homepage {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  position: relative;

  .homepage-top {
    position: inherit;
    z-index: 1;
    padding: 0 15px 10px;
    margin-top: 10px;

    a {
      .bill-banner {
        width: 100%;
        margin-top: 15px;
      }
    }
  }

  .homepage-bottom {
    background-color: $background;
  }
}

.goup {
  width: 51px;
  height: 38px;
  font-size: 12px;
  font-weight: 600;
  color: $white;
  text-decoration: none;
  background-color: rgba($web_main, 0.6);
  border-radius: 100px 0 0 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  bottom: 65px;
  right: 0;
  z-index: 1;
}

i {
  width: 20px;
  height: 20px;
  display: inline-block;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0xOC4wODQgMTQuMDQ3YS42NDIuNjQyIDAgMCAwLS4xODUtLjQ0NmwtNy41MTYtNy41MTVhLjYxMS42MTEgMCAwIDAtLjQ0NS0uMTg2LjYxMS42MTEgMCAwIDAtLjQ0Ni4xODZsLTcuNDA2IDcuNDA2YS42Mi42MiAwIDAgMC0uMTg2LjQ1M2MwIC4xNzguMDYyLjMzLjE4Ni40NTRhLjYxMS42MTEgMCAwIDAgLjQ0NS4xODVsLjEwMS0uMDA3YS42MS42MSAwIDAgMCAuMzQ1LS4xNzhsNi45Ni02Ljk2MSA3LjA1NSA3LjA1NWEuNjIuNjIgMCAwIDAgLjQ1My4xODUuNjIuNjIgMCAwIDAgLjQ1NC0uMTg1LjYyMy42MjMgMCAwIDAgLjE4Ni0uNDQ2eiIgZmlsbD0iI0ZGRiIgZmlsbC1ydWxlPSJub256ZXJvIi8+Cjwvc3ZnPgo=");
}

.listPage {
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  box-sizing: border-box;
}

.advertise {
  width: 90vw;
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;

  > div {
    position: relative;

    i {
      background-color: $emperor;
      z-index: 1;
      position: absolute;
      right: 0;
      top: 0;
      display: block;
      width: 45px;
      height: 45px;
      background-size: 45px;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAWqADAAQAAAABAAAAWgAAAABJfIu3AAAClUlEQVR4Ae3asW7iQBDG8YAoOaWMlJIy1Z3yBpGo4VGhRsobRHfVlZSRUp6OEkH2S9goQjaxzSwzVv4uYkzWM7M/W8va2qsrNgQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQACB7ysw8Oz6crn8sdvt7sfj8e/pdPqvRC2r1ep6s9n8Gg6HT7PZ7H+JHE1iukELebvd/klFTgaDwXOCmM7n879Nim7aZrFY3KULudrv97fpnPVoNPrphT1sWrR1O93JKeZEcQWRjh8FY5XngPx4QFbYySGnVYpWcdygNVzoTs7VJpAbK+xPyDc5vnIpZz6+9N4NWmOyhosE8JI7bYFdg/yiXKV+B3L9p/ZuY3Qu6gTMQ9sx2zJWrs9q7w6tjlgAWcSwQq2KEwL6XOzoyOpfGOiu2H1ADgfdFrsvyCGhm2L3CTks9FfY+r/m3JoO6rM2TRPTFK71TOX97PJ/Q43Rx92tu2vVrk/Iqjc0tAqswtb3eYt+J3/UmT9E3tdh9wVZtm6P4JEvbInaGDpKqFbEDA1dNWTkl1D8GFZczS5f1SFrCqd4TO+6qB6dcwo5v9Fr0uYorOthuKGjDWCbtq7KKXko6C5wXc7xQA8DfQ7YOedeCj0EtAWURYyS6O7QlkCWsazRXaFLwJSIaYHu9giuFURpLqzFLaavOjX901w7P9gISTmUSzkt0LrEcIPWMq0EoBVEb5vlC6Ia7FvlzPkuvXeDTnfdU+rsWh1OyFoSZvrS/hN2XqSzPuS8tPFbPtcx+jstcnS5uiRFAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEAgi8Ao5d1NEIRZWQAAAAABJRU5ErkJggg==);
    }

    a {
      position: relative;
      width: 100%;

      img {
        width: 100%;
      }
    }
  }
}

.advertise2 {
  width: 100%;

  a {
    display: inline-block;
    width: 100%;

    img {
      width: 100%;
    }
  }
}
</style>
