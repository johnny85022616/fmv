<template>
  <div>
    <div id="Coupon">
      <navigation :isShowRedTop="isShowRedTop" :windowY="200" v-on:stopBodyScroll="stopBodyScroll" v-on:directBestbuy="directBestbuy" />
      <div id="skyWrapper">
        <div class="titleWrapper">
          <h2>折價券</h2>
          <span @click="receiveCoupon">領取折價券</span>
        </div>
        <div class="tabWrapper">
          <button v-for="(item,key) in buttons" :key="key" :class="{ 'active' : key === selectBtn}" @click="select(key)">{{item}}</button>
        </div>
      </div>
      <bsiteCouponList :selectBtnp="selectBtn" :windowY="windowY" @moreBtnAlive="nowStatus" :receiveCount="receiveCount" />
      <div class="sucessPopup" v-if="isPopupOpen">
        <p v-if="isCouponReceive">折價券已索取完畢</p>
        <p v-else>恭喜您!成功獲得折價券</p>
        <span @click="closePopup">OK</span>
      </div>
    </div>
  </div>
</template>

<script>
import navigation from "../common/navigation.vue"; // 共用天的導覽列
import bsiteCouponList from "../coupon/bsiteCouponList.vue";

export default {
  name: "bsiteCoupon",
  components: {
    navigation,
    bsiteCouponList,
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
      isPopupOpen: false,
      isCouponReceive: false, //coupon是否已被領取
      receiveCount: 0,
    };
  },
  created() {
    this.windowY = 0;
    window.addEventListener("scroll", () => {
      const wy = window.scrollY;
      this.windowY = wy;
    });
    this.seo.discount();
  },
  watch: {
    windowY() {
      const skyWrapper = document.querySelector("#Coupon #skyWrapper");
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
    receiveCoupon() {
      this.axios
        .get(
          `${this.configs.ysdtDomain()}/${
            this.siteData.urlSuffix
          }/FetchCoupon/getall`
        )
        .then((res) => {
          if (res && res.data) {
            const { status } = res.data;
            if (status === 200) {
              this.isPopupOpen = true;
              //若在其他tab則跳回已生效
              if (this.selectBtn !== 0) {
                this.select(0);
              } else {
                //若原本就在已生效tab用select(0)處發不了狀態變動因誤用另一個tag判斷
                this.receiveCount++;
              }
            } else if (status === 205) {
              this.isPopupOpen = true;
              this.isCouponReceive = true;
            }
          }
        })
        .catch((e) => {
          console.error(e);
        });
    },
    nowStatus(status) {
      this.scrollBar = status;
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
    closePopup() {
      this.isPopupOpen = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/color";
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

  .sucessPopup {
    position: fixed;
    left: 50%;
    top: 300px;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.16);
    text-align: center;
    padding: 30px 70px;
    background-color: white;
    font-size: 1.4rem;
    p {
      margin-bottom: 15px;
      white-space: nowrap;
    }
    span {
      background-color: $red;
      padding: 5px 25px;
      color: $white;
      border-radius: 10px;
    }
  }

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
      color: $dodger-blue;

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
