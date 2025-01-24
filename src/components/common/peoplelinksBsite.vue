<template>
  <div class="wrap" :style="{ height: menuHeight }">
    <ul>
      <template v-if="isLogin">
        <li v-if="isEmploySite">
          <a @click="goEmployLogout($event)">員購登出</a>
        </li>
        <li v-else>
          <a @click="goEmployLogout($event)">會員登出</a>
        </li>
        <li>
          <a :href="`/${siteData.urlSuffix}/orderlist`">訂單記錄</a>
        </li>
        <li>
          <a v-if="isEmploySite" :href="`/${siteData.urlSuffix}/discount`">我的優惠</a>
        </li>
        <li>
          <a v-if="!hg.isBinding" href="" @click="(e)=>setHappyGoTag(true, e)">綁定HappyGo點數</a>
          <a v-else>HappyGo點數<span class="red">{{this.tools.priceFormat(hg.point)}}</span>點</a>
        </li>
        <!-- <li>
          <a href="/order_otp">手機號碼查訂單</a>
        </li> -->
        <li>
          <a :href="`/${siteData.urlSuffix}/member/favorite`">我的最愛</a>
        </li>
        <li>
          <a :href="`/${siteData.urlSuffix}/member/tickets`">電子序號</a>
        </li>
      </template>
      <template v-else>
        <li v-if="isEmploySite">
          <a @click="goEmployLogin($event)">員購登入</a>
        </li>
        <li v-else>
          <a @click="goLogin($event)">會員登入</a>
        </li>
        <li v-if="isEmploySite">
          <a @click="goEmployRegist($event)">員購註冊</a>
        </li>
        <li>
          <a :href="`/${siteData.urlSuffix}/orderlist`">查訂單</a>
        </li>
      </template>

      <li>
        <a :href="`/${siteData.urlSuffix}/website/intro`">網站簡介</a>
      </li>
      <li>
        <a :href="`/${siteData.urlSuffix}/website/service`">服務條款</a>
      </li>
      <li>
        <a :href="`/${siteData.urlSuffix}/website/appointment`">購物約定條款</a>
      </li>
      <li>
        <a :href="`/${siteData.urlSuffix}/website/cheat`">防詐騙宣導</a>
      </li>
      <li>
        <a :href="`/${siteData.urlSuffix}/website/privacy`">隱私權說明</a>
      </li>
      <!-- <li @click="openMenu('follow')" class="menu">
        追蹤我們
        <i class="arrow"></i>
      </li>
      <li v-if="isShowMenu.follow"><a href="https://www.facebook.com/fridayshopping" target="_blank"><i class="fb"></i>Facebook</a></li>
      <li v-if="isShowMenu.follow"><a href="https://maac.io/1xDKI" target="_blank"><i class="line"></i>LINE</a></li>
      <li v-if="isShowMenu.follow"><a href="https://fri.page.link/open_shopping_app" target="_blank"><i class="appDownload"></i>App下載</a></li> -->
    </ul>
    <div class="copyright" :style="isLogin ? {position: 'static'} : {position: 'fixed'}">
      遠時數位科技 提供技術服務,包含AI生成網站,金流,發票及客服 Powered by YSDT
    </div>
    <HappyGo :showDialog="showDialog" @setHappyGoTag="setHappyGoTag" @hgStatusUpdate="hgStatusUpdate" />
  </div>
</template>

<script>
import HappyGo from "../happyGo/happyGo.vue";
export default {
  name: "peopleLinks",
  data() {
    return {
      isEmploySite: false,
      isLogin: false,
      menuHeight: "0px",
      showDialog: false,
      hg: {
        isBinding: false,
        point: 0,
      },
    };
  },
  components: {
    HappyGo,
  },
  async created() {
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

    if (this.supplierData) {
      this.isLogin = this.api.member.isLogin;
    }
    this.isLogin = this.api.member.isLogin;
    if (this.siteData) {
      const { siteType } = this.siteData || {};
      if (siteType && siteType === "B2") {
        this.isEmploySite = true;
      }
    }
    await this.checkIsBinding();
    if (this.hg.isBinding) {
      await this.getHGPPoint();
    }
  },
  props: {
    supplierData: {
      type: Object,
      default: () => null,
    },
  },
  methods: {
    async checkIsBinding() {
      await fetch(
        `${this.configs.ysdtDomain()}/${
          this.siteData.urlSuffix
        }/FetchCoupon/hg_checkfederate`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res && res.status === 200) {
            this.hg.isBinding = true;
          } else {
            this.hg.isBinding = false;
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async getHGPPoint() {
      await fetch(
        `${this.configs.ysdtDomain()}/${
          this.siteData.urlSuffix
        }/FetchCoupon/hg_getpoints`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res && res.data) {
            this.hg.point = res.data.remainPoint;
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    hgStatusUpdate(point) {
      this.hg.isBinding = true;
      this.hg.point = point;
    },
    calcHeight: function () {
      this.menuHeight = window.innerHeight - 120 + "px";
    },
    goEmployLogout(e) {
      e.preventDefault();
      const urlSuffix = this.siteData.urlSuffix;
      fetch(`/FetchMember/setLogout/${urlSuffix}`)
        .then((res) => res.json())
        .then(() => {
          window.localStorage.removeItem("b_token");
          window.localStorage.removeItem("b_mbid");
          window.localStorage.removeItem(urlSuffix + "_b_token");
          window.localStorage.removeItem(urlSuffix + "_b_mbid");
          window.location.reload();
        });
    },
    goLogin(e) {
      e.preventDefault();
      if (this.siteData) {
        this.tools.goBsiteLoginUrl();
      } else {
        alert("請到桌機版操作會員登入");
      }
    },
    goEmployLogin(e) {
      e.preventDefault();
      if (this.siteData) {
        this.tools.goBsiteLoginUrl();
      } else {
        alert("請到桌機版操作員購登入");
      }
    },
    goEmployRegist(e) {
      e.preventDefault();
      if (this.siteData) {
        const { urlSuffix } = this.siteData;
        window.location.href = `/login?em=1&sc=${urlSuffix}&r=1&redirectUrl=${encodeURIComponent(
          location.href
        )}`;
      } else {
        alert("請到桌機版操作員購註冊");
      }
    },
    setHappyGoTag(tag, e) {
      if (e) {
        e.preventDefault();
      }
      this.showDialog = tag;
    },
  },
  computed: {
    orderlistUrl() {
      return `/${this.supplierData.urlSuffix}/orderlist`;
    },
    favoriteUrl() {
      return `/${this.supplierData.urlSuffix}/member/favorite`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/icons.module.scss";
@import "../../style/color";
.wrap {
  position: fixed;
  top: 60px;
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
          background: #f9f9f9
            url("https://m.shopping.friday.tw/static/images/down.svg") no-repeat;
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
  .red {
    color: $red;
  }
}
</style>
