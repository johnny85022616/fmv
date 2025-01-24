<template>
<div>
  <gotoTop></gotoTop>
  <navigation
    :isShowRedTop="isShowRedTop"
    :windowY="200"
    v-on:stopBodyScroll="stopBodyScroll"
    />
  <div class="privacy">
    <h3 class="privacy__itembar">隱私權保護政策</h3>
    <bsite_privacy v-if="isBsite" />
    <ec_privacy v-else />
  </div>
</div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import gotoTop from './components/common/gotoTop.vue';
import ec_privacy from './components/website/ec_privacy.vue';
import bsite_privacy from './components/website/bsite_privacy.vue';

export default {
  name: "privacyIntro",
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
    ec_privacy,
    bsite_privacy
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
.privacy {
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
}
</style>
