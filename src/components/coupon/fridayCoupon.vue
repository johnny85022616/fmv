<template>
  <div>
    <div id="Coupon">
      <navigation :isShowRedTop="isShowRedTop" :windowY="200" v-on:stopBodyScroll="stopBodyScroll"
        v-on:directBestbuy="directBestbuy" />
      <div id="skyWrapper">
        <div class="titleWrapper">
          <h2>我的折價券</h2>
          <span @click="openNotice">注意事項</span>
          <div id="notice">
            <div class="titleWrapper">
              <h2>注意事項</h2>
              <i class="close" @click="closeNotice"></i>
            </div>
            <section class="content">
              <ul>
                <li>每張折價券皆有使用效期，提醒您於使用效期前使用完畢，逾期則視為棄權，無法申請補發。</li>
                <li>折價券使用是以每筆訂單為單位，請依照商品頁標示該商品可否使用折價券來進行折抵。</li>
                <li>每筆訂單限抵用一張折價券，若該商品同時有2張以上適用折價券，仍須符合一張券限用一訂單之原則。</li>
                <li>折價券限會員本人使用，不得轉讓、不得折抵現金、找零或折換其他贈品。</li>
                <li>折價券一經使用，若辦理取消訂單或退貨，該次消費使用之折價券將無法退回。</li>
                <li>訂單取消/退貨時，退款的金額，是以「購買時實際支付的金額」計算，也就是扣除折價券後的金額。</li>
                <li>折價券不再另開立發票，開立發票金額，以該訂單「購買時實際支付的金額」計算。</li>
              </ul>
            </section>
          </div>
        </div>
        <div class="tabWrapper">
          <button v-for="(item, key) in buttons" :key="key" :class="{ 'active': key === selectBtn }"
            @click="select(key)">{{ item }}</button>
        </div>
      </div>
      <couponlist :selectBtnp="selectBtn" :windowY="windowY" @moreBtnAlive="nowStatus" />
    </div>
  </div>
</template>

<script>
import navigation from "../common/navigation.vue"; // 共用天的導覽列
import couponlist from "../coupon/couponlist.vue";

export default {
  name: "fridayCoupon",
  components: {
    navigation,
    couponlist,
  },
  data() {
    return {
      showOnLighthouse: true,
      currentY: 0,
      windowY: 0,
      isShowRedTop: true,
      isStopScrolling: false,
      buttons: ["已生效", "已使用", "待生效"],
      selectBtn: 0,
      notice: false,
      scrollYNow: 2,
      scrollBar: true,
    };
  },
  created() {
    // const wy = window.scrollY;
    // this.windowY = wy;
    this.windowY = 0;
    window.addEventListener("scroll", () => {
      const wy = window.scrollY;
      this.windowY = wy;
      // // this.currentY = wy !== 70 && wy !== 0 ? wy : this.currentY;
      // this.isShowRedTop = wy > 0 ? false : true;
    });
    // this.showOnLighthouse = this.lighthouse ? false : true;
    // window.addEventListener(
    //   "scroll",
    //   () => {
    //     const wy = window.scrollY;
    //     this.windowY = wy;
    //     // this.currentY = wy !== 70 && wy !== 0 ? wy : this.currentY;
    //     this.isShowRedTop = wy > 0 ? false : true;
    //   }, {
    //     passive: true,
    //   }
    // );
  },
  watch: {
    windowY() {
      const skyWrapper = document.querySelector("#Coupon #skyWrapper");
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
    nowStatus(status) {
      this.scrollBar = status;
    },
    openNotice() {
      this.notice = true;
      let notice = document.getElementById("notice");
      notice.className = "open";
      document.body.style = "padding:0;margin:0;overflow: hidden;";
    },
    closeNotice() {
      this.notice = false;
      let notice = document.getElementById("notice");
      notice.className = "";
      document.body.style = "padding:0;margin:0;";
    },
    formatPrice(p) {
      return this.tools.priceFormat(p);
    },
    isSoldout(qty) {
      return qty === 0 ? true : false;
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
    select(i) {
      this.selectBtn = i;
      window.scrollTo(0, 0);
    },
  },
};
</script>

<style lang="scss" scoped>
:focus {
  outline: 0;
}

#Coupon {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0 0 60px 0;
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
      transform: translateY(-55px);
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
