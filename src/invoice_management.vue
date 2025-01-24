<template>
  <div>
    <div id="invoiceManagement">
      <div id="skyWrapper">
        <navigation :isShowRedTop="isShowRedTop" :windowY="200" v-on:stopBodyScroll="stopBodyScroll" />
        <div class="titleWrapper">
          <i class="angle-left" @click="backPage"></i>
          <h2>發票管理</h2>
        </div>
      </div>
      <div id="invoice-wrap" :style="wrapTop">
        <invoiceItem v-on:stopBodyScroll="stopBodyScroll" />
      </div>
    </div>
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import invoiceItem from "./components/invoice/invoiceItem.vue"; // 發票item

export default {
  name: "invoiceManagement",
  components: {
    navigation,
    invoiceItem,
  },
  data() {
    return {
      currentY: 0,
      windowY: 0,
      isShowRedTop: true,
      isStopScrolling: false,
      // scrollBar: true
    };
  },
  watch: {
    windowY() {
      const skyWrapper = document.querySelector(
        "#invoiceManagement #skyWrapper"
      );
      // const couponWrap = document.querySelector('#Coupon #coupon-wrap');
      if (!this.scrollBar) {
        return;
      }

      if (this.scrollBar) {
        if (this.scrollYNow < this.windowY) {
          if (this.windowY <= document.body.scrollHeight - window.innerHeight) {
            skyWrapper.className = "downloadUp";
            this.scrollYNow = this.windowY;
          }
        } else if (this.scrollYNow > this.windowY) {
          if (this.windowY >= 0) {
            skyWrapper.className = "";
            this.scrollYNow = this.windowY;
          }
        }
      }
    },
  },
  methods: {
    backPage() {
      window.history.back();
    },
    nowStatus(status) {
      this.scrollBar = status;
    },
    closeDialog() {
      this.isShowSortMenu = false;
      this.isShowFilterDialog = false;
    },
    stopBodyScroll(action, jumpCurrentY = true) {
      const body = document.body;
      if (!this.isStopScrolling) {
        body.style = "padding:0;margin:0;height:100%;overflow:hidden";
        this.isStopScrolling = !this.isStopScrolling;
      }
      if (action === "close") {
        body.style = "padding:0;margin:0;";
        if (jumpCurrentY) {
          setTimeout(() => {
            window.scrollTo(0, 0);
            // window.scrollTo(0, this.currentY);
          }, 0);
        }
        this.isStopScrolling = false;
      }
    },
    directBestbuy() {
      this.directJumpToBestBuy = true;
      setTimeout(() => {
        this.directJumpToBestBuy = false;
      }, 100);
    },
  },
  computed: {
    wrapTop() {
      return {
        "padding-top": "112px",
      };
    },
  },
};
</script>

<style lang="scss">
@import "./style/reset.module.scss";
@import "./style/flex.module.scss";
@import "./style/rwd.module.scss";
@import "./style/icons.module.scss";
@import "./style/global.module.scss";
:focus {
  outline: 0;
}

#invoiceManagement {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0 0 20px 0;
  box-sizing: border-box;
  position: relative;
  color: #3c3c3c;
  background-color: #f4f4f4;
  min-height: 100vh;
  overflow: hidden;

  #skyWrapper {
    z-index: 1;
    left: 0;
    width: 100%;
    position: fixed;
    transition: 0.3s;

    &.downloadUp {
      transform: translateY(-99px);
    }
  }

  .titleWrapper {
    padding: 13px 0 12px;
    box-sizing: border-box;
    position: relative;
    border-bottom: 1px solid #e0e0e0;
    background-color: #ffffff;

    h2 {
      font-size: 1.8rem;
      text-align: center;
      color: #3c3c3c;
      font-weight: 500;
    }

    span {
      position: absolute;
      right: 20px;
      bottom: 15px;
      font-size: 1.4rem;
      color: #3c3c3c;
      font-weight: 500;
    }
  }

  ul {
    li {
      list-style-type: none;
    }
  }

  .tabWrapper {
    button {
      padding: 10px 0;
      background-color: #fff;
      font-size: 1.4rem;
      width: 33.3%;
      margin: 0;
      border: none;
      border-bottom: 1px solid #e0e0e0;

      &.active {
        color: #f34f59;
        border-bottom: 2px solid #f34f59;
        padding: 10px 0 8px 0;
      }
    }
  }

  #notice {
    position: fixed;
    left: 0;
    top: 0;
    transform: translate(100%, 0);
    width: 100%;
    height: 100%;
    z-index: 100;
    background-color: #fff;
    opacity: 0;
    transition: 0.5s;
    overflow: scroll;

    &.open {
      transform: translate(0, 0);
      opacity: 1;
      overflow: scroll;
    }

    .titleWrapper {
      padding: 10px 0;

      i.close {
        position: absolute;
        right: 15px;
        bottom: 10px;
      }
    }

    .content {
      padding: 20px;
      height: calc(100% - 46px);

      ul {
        padding-left: 20px;

        li {
          list-style: disc;
          font-size: 1.4rem;
          padding: 20px 0;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.arrow-right {
  vertical-align: middle;
  display: inline-block;
  width: 16px;
  height: 16px;
  background-size: 16px;
  background-repeat: no-repeat;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIKADAAQAAAABAAAAIAAAAACshmLzAAABL0lEQVRYCe3UMQuCUBAH8CxzqqCpTbfGPkCoEK4NbQ19vqCP0BKIOrbU6mZDNDWGi3Y35NTDe+8uauhAkOue/58G1+n868tfoEfJ931/6rruzvO8U1EUN8oZ6kyXMmjb9siyrAXMHoIgmFHOUGdIgDiOjwDYwEPH0giLKsW5MAzXdV1v4fYOV5Sm6Rn7nNICYJA0QhsgjTACSCKMAVIIFkACwQZwESIADkIMYIoQBbxBzGBZXbGvKtIqVh1W9C/Qf8A1hPU9UMw0bVEAbMl5VVV7eHofVvYqSZK8SVLciP0Fr3B4awfDsyxDSGuJAEzDUccGcMLZAG44CyARbgyQCjcCSIZrA6TDtQCfCCcDoiialGWZ6y4ZDGgr0ip2HAd3+x423JK64dqC/7//zBd4Ag916vX/xl6rAAAAAElFTkSuQmCC");
}
</style>
