<template>
  <div class="counterRedBar">
    <p>friDay旗艦專櫃</p>
  </div>
</template>

<script>
export default {
  name: "counterRedBar",
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";
.counterRedBar {
  position: sticky;
  z-index: 1;
  top: 60px;
  p {
    padding: 5px;
    background-color: $sundown;
    color: $white;
    text-align: center;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100vw;
    box-sizing: border-box;

    &::before,
    &::after {
      margin: 0 10px;
      content: "";
      display: inline-block;
      width: 33%;
      height: 1px;
      background-color: $white;
    }
  }
}
</style>
