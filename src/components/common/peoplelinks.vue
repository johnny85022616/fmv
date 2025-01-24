<template>
  <div class="wrap" :style="{ top: `${logoHeight}px`, height: menuHeight }">
    <ul>
      <li>
        <div>
          <a :href="api.member.loginUrl()">我的帳戶</a>
        </div>
      </li>
      <li @click="openMenu('service')" class="menu">
        客服中心
        <i class="arrow"></i>
      </li>
      <li v-if="isShowMenu.service">
        <a href="/intro/commonProblem">常見問題</a>
      </li>
      <li v-if="isShowMenu.service">
        <a href="/intro/service_line">聯絡客服</a>
      </li>
    </ul>
    <div class="copyright" :style="api.member.isLogin ? { position: 'static' } : { position: 'fixed' }">
      遠時數位科技股份有限公司為遠傳電信集團關係企業/版權所有Copyright © 2017
      All Rights Reserved by YSDT.{{ isSuperAPPCookie }}<br />營業人名稱: 遠時數位科技股份有限公司
      統一編號: 54349098
    </div>
  </div>
</template>

<script>
export default {
  name: "peopleLinks",
  data() {
    return {
      isShowMenu: {
        checkout: false,
        service: false,
        rights: false,
        follow: false,
      },
      menuHeight: "0px",
      isSuperAppSession: false,
      myFcoinAmount: 0
    };
  },
  props: {
    logoHeight: {
      type: Number,
    },
  },
  created() {
    this.calcHeight();
    window.addEventListener(
      "resize",
      () => {
        this.calcHeight();
      },
      {
        passive: true,
      }
    );

    this.isSuperAppSession = this.tools.checkInSuperAppSessions();
  },
  methods: {
    openMenu: function (key) {
      Object.keys(this.isShowMenu).forEach((k) => {
        if (k === key) {
          this.isShowMenu[k] = true;
        } else {
          this.isShowMenu[k] = false;
        }
      });
    },
    calcHeight: function () {
      this.menuHeight = window.innerHeight - 120 + "px";
    },
    goOrderPage(e) {
      e.preventDefault();
      sessionStorage.removeItem("visitorCellPhone");
      sessionStorage.removeItem("visitorOtp");
      location.href = "/mobileweb/member/ListMyOrderMenu";
    },
  },
  computed: {
    isSuperAPPCookie() {
      const c = this.tools.getCookie("FEEC-B2C-DEVICE");
      return c === "SUPER-APP" ? "1" : "0";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/icons.module.scss";
@import "../../style/color";

.wrap {
  position: fixed;
  z-index: 3;
  width: 100%;
  background-color: #ffffff;
  overflow: scroll;

  .loginStatus {
    position: relative;

    a {
      justify-content: center;
    }

    .loggout {
      position: absolute;
      top: 13px;
      right: 0;
      width: 58px;
      height: 23px;
      line-height: 23px;
      font-size: 1.2rem;
      border: 1px solid #4a4a4a;
      border-radius: 12px;
      text-align: center;
      box-sizing: border-box;
    }
  }

  ul {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    overflow-y: auto;

    li {
      position: relative;
      line-height: 48px;
      border-bottom: 1px solid #efefef;
      padding: 0 15px;
      box-sizing: border-box;
      list-style-type: none;
      font-size: 1.5rem;
      color: #333333;

      &.menu {
        background-color: #f9f9f9;

        i.arrow {
          position: absolute;
          top: 10px;
          right: 15px;
          display: block;
          background: #f9f9f9 url("https://m.shopping.friday.tw/static/images/down.svg") no-repeat;
          width: 24px;
          height: 24px;
        }
      }

      a {
        display: flex;
        color: #333333;
        text-decoration: none;
      }
    }
  }

  .copyright {
    font-size: 1rem;
    padding: 0 16px;
    margin: 20px 0 10px 0;
    line-height: 16px;
    text-align: center;
    color: #9b9b9b;
    bottom: 60px;
  }

  .swordCount {
    color: $special;
    margin-left: 10px;
  }
}

.myfcoin {
  color: #f5281e;
}
</style>
