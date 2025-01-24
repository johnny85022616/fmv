<template>
  <div class="product-restrict">
    <div class="product-restrict-box">
      <div class="product-restrict-top">
        <div></div>
        <div>
          <h2>敬告啟示</h2>
          <h3>若您未滿18歲請勿進入</h3>本類商品為限制級商品，限18歲以上會員始可瀏覽及購買。
        </div>
      </div>
      <div class="product-restrict-bottom">
        <div>
          friDay購物 網站內容依據台灣網路內容分級辦法處理，年滿18歲以上或達當地國家法定年齡人士；且願接受本站內容及各項條款方可進入。
        </div>
      </div>
      <div class="product-restrict-button">
        <button @click="passR18">我已滿18歲且同意»</button>
        <button @click="goHomePage">我未滿18歲»</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "restrict",
  data() {
    return {};
  },
  methods: {
    passR18() {
      this.$emit("passRestrictOkay");
      this.tools.setCookie("r18", true);
    },
    goHomePage() {
      window.location.href = "/";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/color.scss";

.product-restrict {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: $white;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;

  &-box {
    width: 80%;
    border: 1px solid #999;
    box-shadow: 0 3px 4px #ccc;
    padding: 10px;
    display: block;
  }

  &-top {
    display: flex;

    > div {
      &:first-child {
        flex: 1 1 30%;
        display: flex;
        height: 120px;
        background: url("https://m.shopping.friday.tw/static/images/eighteen-ico.png")
          center center no-repeat;
        background-size: contain;
      }
      &:last-child {
        flex: 1 1 70%;
        font-size: 12px;
        color: #666;
        * {
          box-sizing: border-box;
        }
        h2 {
          font-size: 38px;
          padding-bottom: 6px;
          color: $black;
          text-align: center;
        }
        h3 {
          font-size: 19px;
          padding-bottom: 6px;
          color: $red;
          text-align: center;
        }
      }
    }
  }

  &-bottom {
    padding: 5px;
    margin-top: 5px;
    color: #666;
    background-color: #eee;
  }

  &-button {
    padding: 10px;
    margin-top: 5px;
    color: #666;
    background-color: #eee;
    text-align: center;
    button {
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
