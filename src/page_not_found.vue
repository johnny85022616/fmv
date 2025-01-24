<template>
<div>
  <navigation
    :windowY="200"
    v-on:stopBodyScroll="stopBodyScroll"
    />
  <notfound />
</div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import notfound from "./components/common/notfound.vue"; // 頁面警告提示

export default {
  name: "invoiceManagement",
  components: {
    navigation,
    notfound,
  },
  data() {
    return {
    
    };
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
  }
};
</script>

<style lang="scss">
@import "./style/reset.module.scss";
@import "./style/flex.module.scss";
@import "./style/rwd.module.scss";
@import "./style/icons.module.scss";
</style>
