<template>
  <div class="promotionPage">
    <navigation :windowY="200" v-on:stopBodyScroll="stopBodyScroll" />

    <div class="campaign-container">
      <!-- 導覽列 -->
      <breadcrumb v-if="promotionData.breadcrumbs && promotionData.breadcrumbs.length" :data="promotionData.breadcrumbs" />

      <!-- BANNER -->
      <banner v-if="promotionData.banners && promotionData.banners.length > 0 && sid !== '341'" :paginationEnabled="false" :items="promotionData.banners" />

      <!-- 促銷資訊 -->
      <onsaleInfo :title="onsaleTitle" :content="onsaleContent" :orderinfo="onsaleOrderInfo" :promotionData="promotionData" />

      <!-- 活動商品 -->
      <productBox v-if="promotionId && promotionGroupType !== null && promotionData.valid" :isSingleAddToCart="false" :promotionDetails="promotionDetails" :promotionType="promotionType" :promotionGroupType="promotionGroupType" />

      <!-- 活動過期 -->
      <div v-if="isApiReady && !promotionData.valid" class="promotion-page__expiration">
        <div>
          該活動已經結束，回首頁看更多活動喔！
          <button @click="backToHome">開始逛逛</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import breadcrumb from "./components/product/breadcrumb.vue"; // 麵包屑
import banner from "./components/category/banner.vue"; // 廣告Banner
import onsaleInfo from "./components/category/onsaleInfo.vue"; // cartA或促銷資訊
import productBox from "./components/common/productBox.vue"; // 商品區塊

export default {
  name: "PromotionPage",
  components: {
    navigation,
    breadcrumb,
    banner,
    onsaleInfo,
    productBox,
  },
  data() {
    return {
      isApiReady: false,
      promotionDetails: {}, // 活動內容
      promotionType: null, // 活動頁面類型 1:購物車限制出貨 2:促銷打折 3:促銷折現金 4:紅  5:紅配綠
      promotionGroupType: null, // 商品類型 0-一般促銷;1-紅區;2-綠區
      promotionId: 0,
      sid: null, // 館ID
      currentY: 0,
      isShowRedTop: true,
      isStopScrolling: false,
      windowY: 0,
      promotionData: {},
      onsaleTitle: "",
      onsaleContent: "",
      onsaleOrderInfo: "",
      catagoryOutlet: {}, // 品牌特賣匯專屬版位
    };
  },
  created() {
    const urlParams = this.tools.urlSearchToObj();
    let { promotionId, sid } = urlParams;

    // 取得Promotion ID
    if (/promotion\/page\/(\d+)$/i.test(location.pathname)) {
      const pathAry = location.pathname.match(/(\d+)$/);
      promotionId = pathAry[1];
    }

    // 取得SID
    if (sid) {
      this.sid = sid;
    }

    window.addEventListener(
      "scroll",
      () => {
        const wy = window.scrollY;
        this.windowY = wy;
        this.currentY = wy !== 70 && wy !== 0 ? wy : this.currentY;
        this.isShowRedTop = wy > 0 ? false : true;
      },
      {
        passive: true,
      }
    );

    this.promotionId = promotionId;
    this.getPromotion();
  },
  methods: {
    backToHome() {
      window.location.href = "/mobileweb";
    },
    getPromotion() {
      const params = this.sid
        ? {
            sid: this.sid,
          }
        : {};
      this.axios
        .get(`api/promotion/page?promotionId=${this.promotionId}`, {
          params: params,
        })
        .then((res) => {
          const data = res.data;
          if (data.code === 1) {
            if (data.payload && data.payload[0] && data.payload[0].page) {
              this.promotionData = data.payload[0].page;

              /**
               * 品特sid=341特殊處理
               */
              if (this.sid === "341") {
                this.catagoryOutlet = this.promotionData.outletDetail;
              }

              // 頁面類型
              this.promotionType = this.promotionData.type;
              if ([4, 5].includes(this.promotionType)) {
                this.promotionGroupType = 1;
              } else {
                this.promotionGroupType = 0;
              }

              // 促銷目錄促銷訊息
              const details = this.promotionData.detail;
              this.seo.promotionPage(details.name)
              this.promotionDetails = details;
              this.onsaleTitle = details.name;
              if (
                details.promotionRuleInfo &&
                details.promotionRuleInfo.ruleList
              ) {
                details.promotionRuleInfo.ruleList.forEach((v) => {
                  this.onsaleContent += v + "<br>";
                });
              } else if (details.rule) {
                this.onsaleContent = details.rule.message;
              }
              if (
                details.cat_pre_order_info &&
                details.cat_pre_order_info.message
              ) {
                this.onsaleOrderInfo = details.cat_pre_order_info.message;
              }
            }
          }
        })
        .finally(() => {
          this.isApiReady = true;
        });
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
  },
  computed: {},
};
</script>

<style lang="scss">
@import "./style/reset.module.scss";
@import "./style/flex.module.scss";
@import "./style/rwd.module.scss";
@import "./style/icons.module.scss";
@import "./style/global.module.scss";
</style>

<style lang="sass" scoped>
@import 'style/color.scss'
@import 'style/mixin.scss'

.campaign-container
  background-color: $background
  padding-bottom: 60px

.promotion-page
  &__expiration
    background-color: $background
    div
      padding: 100px 0 100px
      color: $web_main
      font-size: 1.6rem
      text-align: center
    button
      padding: 7px 0
      margin: 30px 0
      width: 200px
      background-color: $red
      color: $white
      font-size: 1.6rem
      border: 0
      border-radius: 10px
</style>
