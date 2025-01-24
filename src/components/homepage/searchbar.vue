<template>
  <div class="search-bar-wrap" :style="{ transform: barTop }" @click="openBar">
    <span class="search-icon">
      <img src="https://event.shopping.friday.tw/event/CP/common/mobile_icon/search-gy@2x.png" />
    </span>
    <span class="search-gap-line">
      <span></span>
    </span>
    <span class="search-input"></span>
  </div>
</template>

<script>
export default {
  name: "homeSearchBar",
  props: {
    windowY: {
      type: Number,
      required: true
    },
    searchInputHotKeyword: {
      type: String,
      default: () => ''
    }
  },
  computed: {
    barTop: function() {
      let ty = 0;
      if (this.windowY > 60) {
        ty = 0 - this.windowY;
      }
      return "translateY(" + ty + "px)";
    }
  },
  methods: {
    openBar() {
      this.$emit("jumpToSearchInput");
    }
  }
};
</script>

<style lang="scss" scoped>
.search-bar-wrap {
  position: inherit;
  display: block;
  width: 99%;
  height: 36px;
  border-radius: 10px;
  background-color: #ffffff;
  margin-bottom: 10px;
  will-change: transform;
  transform: translateY(0px);
  border: 3px solid rgba(255, 0, 0, 0.5);

  .search-icon {
    display: inline-block;
    width: 40px;
    text-align: center;
    line-height: 24px;

    img {
      vertical-align: middle;
      width: 24px;
      height: 24px;
    }
  }

  .search-gap-line {
    display: inline-block;
    width: 4px;
    line-height: 24px;

    span {
      vertical-align: middle;
      display: inline-block;
      width: 1px;
      height: 22px;
      border-radius: 0.5px;
      background-color: #adadad;
    }
  }

  .search-input {
    color: #adadad;
    font-size: 1.6rem;
    line-height: 36px;
    vertical-align: middle;
  }
}
</style>
