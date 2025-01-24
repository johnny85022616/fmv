<template>
  <div>
    <gotoTop></gotoTop>
    <navigation :isShowRedTop="isShowRedTop" :windowY="200" v-on:stopBodyScroll="stopBodyScroll" />
    <template v-if="isBsite">
      <h3 class="itembar">網站簡介</h3>
      <div class="mem_des">
        <p>歡迎來到{{siteData.siteName}}的網站！</p>
        <p>本網站是一家提供多種產品的電商網站，讓您輕鬆選購所需的商品。</p>
        <p>本網站的產品種類繁多，每一種產品都是我們經過嚴格挑選的優質商品。</p>
        <p>本網站提供方便快捷的網上訂購和送貨服務，並支持多種支付方式，讓您的購物體驗更加順暢。</p>
        <p>本網站還提供優質的售後服務，以確保您的購物滿意度。</p>
        <p><br></p>
        <p>本網站為{{siteData.siteName}}與遠時數位科技股份有限公司(以下稱 YSDT)合作。</p>
        <p>本網站所有 AI 生成技術及網站系統均是 YSDT 建置，</p>
        <p>日常營運之客服、金流、發票、退貨退款均由 YSDT 負責。</p>
        <p>本網站除了銷售本站商品外，也同時展示其它 YSDT 廠商的商品，而這些商品是透過 YSDT 獨家 AI「友商推薦商品」技術展示，並會顯示「友商推薦商品」標誌。</p>
      </div>
    </template>
    <template v-else>
      <h3 class="itembar">購物說明</h3>
      <div class="intro">
        <div class="intro__note">
          <p class="intro__note-word">
            歡迎光臨 friDay購物！為了幫助您購物更快更輕鬆，我們提供了詳細的購物說明，邀您一起享受夠你買、夠你逛、永不打烊的購物樂趣！
          </p>
        </div>
        <qa></qa>
      </div>
    </template>
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import qa from "./components/website/qa.vue";
import gotoTop from "./components/common/gotoTop.vue";

export default {
  name: "shoppingIntro",
  data() {
    return {
      isBsite: false,
      isShowRedTop: true,
      windowY: 0,
      isStopScrolling: false,
    };
  },
  components: {
    navigation,
    qa,
    gotoTop,
  },
  methods: {
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
  created() {
    this.isBsite = this.tools.isBsite();

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
  },
};
</script>

<style lang="scss">
@import "./style/reset.module.scss";
@import "./style/flex.module.scss";
@import "./style/rwd.module.scss";
@import "./style/icons.module.scss";
@import "./style/global.module.scss";
</style>

<style lang="scss" scoped>
@import "./style/_color.scss";

.mem_des {
  padding: 5px 20px 100px 20px;
  color: $web_main;
  font-size: 1.4rem;
  line-height: 1.8;
}
.itembar {
  background: url(./images/icons/itembar-icon.jpeg) 8px 12px no-repeat,
    $alabaster url(./images/icons/itembar-bg.jpeg) left top repeat-x;
  border-radius: 0;
  padding: 8px 8px 8px 24px;
  font-size: 1.5rem;
  color: $tundora;
  font-weight: 600;
  margin-bottom: 7%;
}

.intro {
  width: 95%;
  margin: 0 auto 60px auto;
  color: $tundora;

  &__note {
    width: 100%;
    margin-top: 1%;

    &-word {
      padding: 1% 2%;
      background-color: $concretesolid;
      line-height: 150%;
      border-radius: 5px;
      font-size: 1.3rem;
    }

    &::after {
      content: "";
      width: 0;
      height: 0;
      display: block;
      border-style: solid;
      border-width: 12px 12px 0 0;
      border-color: $concretesolid transparent transparent transparent;
      margin-left: 5%;
    }
  }
}
</style>
