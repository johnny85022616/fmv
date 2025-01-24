<template>
<div>
  <gotoTop></gotoTop>
  <navigation
    :isShowRedTop="isShowRedTop"
    :windowY="200"
    v-on:stopBodyScroll="stopBodyScroll"
    />
  <div class="shoppingAggrement">
    <h3 class="shoppingAggrement__itembar">購物約定條款</h3>
    <bsite_agreement v-if="isBsite" />
    <ec_agreement v-else />
  </div>
</div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import gotoTop from "./components/common/gotoTop.vue";
import ec_agreement from "./components/website/ec_agreement.vue";
import bsite_agreement from "./components/website/bsite_agreement.vue";

export default {
  name: "shoppingAggreementIntro",
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
    gotoTop,
    ec_agreement,
    bsite_agreement
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
    this.isBsite = this.tools.isBsite()

    window.addEventListener(
      "scroll",
      () => {
        const wy = window.scrollY;
        this.windowY = wy;
        this.currentY = wy !== 70 && wy !== 0 ? wy : this.currentY;
        this.isShowRedTop = wy > 0 ? false : true;
      }, {
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
.shoppingAggrement {
  margin-bottom: 60px;
  &__itembar {
    background: url(./images/icons/itembar-icon.jpeg) 8px 12px no-repeat,
      $alabaster url(./images/icons/itembar-bg.jpeg) left top repeat-x;
    border-radius: 0;
    padding: 8px 8px 8px 24px;
    font-size: 1.5rem;
    color: $tundora;
    font-weight: 600;
  }

  &__info {
    padding: 5%;

    &-content {
      color: $web_main;
      font-size: 1.6rem;
      text-align: justify;
      text-justify: inter-ideograph;
      margin-bottom: 20px;
    }

    &-subtitle {
      color: $elf-green;
      font-size: 2rem;
      margin-bottom: 5px;
    }

    ul {
      padding: 0.5em 0em 1.5em 0em;
      font-size: 1.6rem;
      list-style-type: decimal;

      li {
        margin-left: 6%;
        list-style-image: inherit;
        padding-bottom: 10px;
        text-align: justify;
        color: $web_main;

        ol {
          padding: 0.5em 0em 1.5em 0.7em;
        }
      }
    }

    &-ver {
      text-align: right;
    }
  }
}
</style>
