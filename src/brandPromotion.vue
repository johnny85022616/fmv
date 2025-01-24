<template>
  <div class="brandPromotion">
    <navigation :windowY="200" :isComponentMaskShow="false" :directShowSearchInput="true" :isBackBtnShow="true" />
    <counterRedBar />
    <div class="content">
      <home :supplierData="supplierData" />
    </div>
  </div>
</template>

<script>
import counterRedBar from "./components/brandPromotion/counterRedBar.vue";
import home from "./components/brandPromotion/home.vue";
import navigation from "./components/common/navigation.vue";

export default {
  name: "brandPromotion",
  data() {
    return {
      supplierData: window.fridayShopData,
    };
  },
  async created() {},
  methods: {},
  components: {
    counterRedBar,
    home,
    navigation,
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

.brandPromotion {
  .search {
    margin-top: 15px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;

    p {
      font-size: 1.8rem;
    }

    .input {
      width: 80%;
      position: relative;

      input {
        width: 100%;
        box-sizing: border-box;
        padding: 0 10px;
        height: 40px;
        border-radius: 10px;
        background-color: #fff;
        border: 1px solid $sliver;
      }

      img {
        position: absolute;
        top: 8px;
        right: 15px;
      }
    }
  }
}
</style>
