<template>
  <div class="fridayCardNotice">
    <span>{{todayMonth}}/{{todayDate}}限定，刷friDay卡回饋最高 {{discount}} f幣</span>
  </div>
</template>

<script>
export default {
  name: "fridayCardNotice",
  data() {
    return {};
  },
  props: {
    pInfo: {
      type: Object,
    },
  },
  computed: {
    discount() {
      var result = Math.min(Math.round(this.pInfo.price.memberPrice * 0.08), 1000);
      return result;
    },
    todayMonth() {
      return new Date().getMonth() + 1;
    },
    todayDate() {
      return new Date().getDate();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/color";

.fridayCardNotice {
  span {
    padding: 8px 10px;
    font-weight: 800;
    font-size: 15px;
    color: $web_main;
    background-color: $fcoin;
    display: inline;
    border-bottom-right-radius: 15px;
    position: absolute;
    left: 0;
    z-index: 1;
  }
}
</style>
