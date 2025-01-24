<template>
  <div>
    <navigation />
    <counterRedBar />
    <aiAllCategory :supplierData="supplierData" />
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import counterRedBar from "./components/brandPromotion/counterRedBar.vue";
import aiAllCategory from "./components/brandPromotion/aiAllCategory.vue";

export default {
  // 逛專櫃目錄
  name: "brandPromotioNCategory",
  data() {
    return {
      supplierData: window.fridayShopData,
    };
  },
  created() {},
  methods: {},
  computed: {},
  components: {
    navigation,
    counterRedBar,
    aiAllCategory,
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