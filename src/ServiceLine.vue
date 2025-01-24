<template>
  <div>
    <navigation :isShowRedTop="isShowRedTop" :windowY="200" v-on:stopBodyScroll="stopBodyScroll" />
    <div class="serviceLine">
      <div class="serviceLine__header">
        <p class="serviceLine__header-content">客服專線</p>
      </div>
      <div class="serviceLine__info">
        <div class="serviceLine__info-block">
          <h2 class="serviceLine__info-title">friDay購物</h2>
          <p class="serviceLine__info-content">
            訂單相關問題，請登入[<a class="link-0" href="/memberCenter">會員中心</a>]後於訂單中點選「我要提問」，接獲您的訊息後，客服人員將儘速回覆予您，感謝您的協助與配合。
          </p>
        </div>
        <div class="serviceLine__info-block">
          <h2 class="serviceLine__info-title">愛買線上購物</h2>
          <p class="serviceLine__info-content">
            愛買線上購物服務專線：02 -77415688
          </p>
          <p class="serviceLine__info-content">
            服務時間：週一到週五9:00 到18:00（例假日除外）
          </p>
          <p class="serviceLine__info-content">
            非服務時段，可登入[<a class="link-0" href="/memberCenter">會員中心</a>]後於訂單中點選「我要提問」，接獲您的訊息後，客服人員將儘速回覆予您，感謝您的協助與配合。
          </p>
          <p class="serviceLine__info-content">
            特別提醒您: 遠傳friDay購物不會主動以電話通知您因誤設分期，要求您提供信用卡銀行電話， 或要求您前往ATM操作設定，若接到可疑電話，請拒絕回應...<a href="https://go.shopping.friday.tw/event/104802/10480217-event/index.html" target="_blank">了解更多</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列

export default {
  name: "serviceLine",
  data() {
    return {
      isShowRedTop: true,
      windowY: 0,
      isStopScrolling: false,
    };
  },
  components: {
    navigation,
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
.serviceLine {
  &__header {
    background: url(//shopping.friday.tw/images/sysimg/newtitle-box-bg.jpg);
    background-size: cover;

    &-content {
      border-left: 4px solid $pomegranateapprox;
      font-size: 1.9rem;
      text-align: left;
      color: $pomegranateapprox;
      padding-left: 16px;
      margin-left: 5px;
    }
  }

  &__info {
    &-block {
      margin: 20px 0;
    }

    &-title {
      font-weight: bold;
      font-size: 1.6rem;
      padding: 0px 10px 10px 10px;
      border-bottom: 2px solid $gallery;
      color: $tundora;
      font-family: Arial, Helvetica, sans-serif, "新細明體";
    }

    &-content {
      letter-spacing: 0.4px;
      text-align: left;
      color: $mine-shaft;
      margin: 20px;
      font-size: 1.6rem;

      a {
        color: $pomegranateapprox;
      }
    }
  }
}
</style>
