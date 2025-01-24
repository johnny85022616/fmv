<template>
  <div class="memberCenter">
    <navigation :windowY="200" :directShowSearchInput="true" />
    <div class="header">
      <p>會員中心</p>
    </div>
    <div class="center">
      <div class="memberInfo">
        <div class="name">
          <i class="fridayLogo"></i>
          <p>{{ name }}</p>
        </div>
        <div v-if="memberType" class="memberType">
          {{ memberType }}
        </div>
      </div>
      <div class="ticket">
        <a class="ticketBox" href="/member/voucher/list">
          <p>{{ voucher || 0 }}</p>
          <p>購物金</p>
        </a>
        <a class="ticketBox" href="/member/myCampaign">
          <p>{{ couponAmount || 0 }}</p>
          <p>我的優惠</p>
        </a>
        <a v-if="isShowFcoin" href="/member/myFcoin" class="ticketBox">
          <p>{{ fcoin || 0 }}</p>
          <p>遠傳幣</p>
        </a>
        <div class="ticketBox">
          <template v-if="hgBundleStatus.isApiOk">
            <a v-if="!hgBundleStatus.status" href="/member/memberBundleHappygoPoint">綁定卡片</a>
            <p v-else>{{hgPoint}}</p>
          </template>
          <p>Happy Go</p>
        </div>
      </div>
      <div class="icon">
        <a class="iconBox" @click="(e) => goOrderPage(e)">
          <i class="order"></i>
          <p>訂單記錄</p>
        </a>
        <a class="iconBox" href="member/tickets">
          <i class="electronicTicket"></i>
          <p>電子序號</p>
        </a>
        <a class="iconBox" href="/member/favorite">
          <i class="favorite"></i>
          <p>我的最愛</p>
        </a>
      </div>
      <div class="menu">
        <div class="title">個人管理</div>
        <ul>
          <li><a href="/member/edit">查看會員資料</a></li>
          <li><a href="/member/receiver">收貨人通訊錄</a></li>
          <li><a href="/member/creditCard">信用卡綁定</a></li>
          <li><a href="/member/cvsInfo">取貨門市設定</a></li>
          <li><a href="/member/einvoiceInfo">電子發票(手機)載具設定</a></li>
        </ul>
      </div>
      <div class="menu">
        <div class="title">客服中心</div>
        <ul>
          <li><a href="/intro/commonProblem">常見問題 Q&A</a></li>
          <li><a href="/intro/service_line">聯絡客服</a></li>
        </ul>
      </div>
      <div class="menu">
        <div class="title">會員權益</div>
        <ul>
          <li><a href="/intro/shopping_intro">購物說明</a></li>
          <li><a href="/intro/privacy-intro">隱私權說明</a></li>
          <li><a href="/intro/memterms-intro">服務條款</a></li>
          <li><a href="/intro/conditions-intro">購物約定條款</a></li>
          <li class="logout"><a @click="logout">登出</a></li>
        </ul>
      </div>
      <div class="menu copyright">
        遠時數位科技股份有限公司為遠傳電信集團關係企業/版權所有 Copyright © 2017 All Rights Reserved by YSDT.<br />營業人名稱:
        遠時數位科技股份有限公司 統一編號: 54349098

      </div>
    </div>
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
export default {
  name: "memberCenter",
  data() {
    return {
      isBsite: false,
      isShowRedTop: true,
      windowY: 0,
      isStopScrolling: false,
      memberInfo: null,
      voucher: 0,
      fcoin: 0,
      hgPoint: 0,
      couponAmount: 0,
      fetLife: null,
      isLogin: false,
      name: "",
      memberType: null,
      hgBundleStatus: { status: false, isApiOk: false }, //happyGo綁定狀態
      isShowFcoin: false, // 是否顯示遠傳幣區塊
    };
  },
  created() {
    if (this.api.member.isLogin) {
      // 確認會員資料已經綁過fetId, 才出現遠傳幣
      this.api.member.getMember().then(data => {
        // UI判斷已登入，但是API取不到，則轉導登入
        if (data === null) window.location.href = this.api.member.loginUrl();

        if (data?.fetId) this.isShowFcoin = true;
      })
      this.checkFetLife();
      this.getMemberData();
      this.getHgStatus();
    } else {
      location.href = this.api.member.loginUrl();
    }
  },
  methods: {
    //查happGo綁定狀態
    async getHgStatus() {
      this.hgBundleStatus.status = await this.api.member.checkHappyGoFederate();
      this.hgBundleStatus.isApiOk = true;
    },
    stopBodyScroll(action, jumpCurrentY = true) {
      const body = document.body;
      if (!this.isStopScrolling) {
        body.style = "padding:0;margin:0;overflow:hidden;height:100%";
        this.isStopScrolling = !this.isStopScrolling;
      }
      if (action === "close") {
        body.style = "padding:0;margin:0;";
        if (jumpCurrentY) {
          setTimeout(() => {
            window.scrollTo(0, this.currentY);
          }, 0);
        }
        this.isStopScrolling = false;
      }
    },
    async getMemberData() {
      // 查購物金
      this.api.member
        .queryVoucherBalance()
        .then((data) => (this.voucher = data));
      // 查優惠劵
      this.api.campaign
        .getMyCampaignsCount()
        .then((data) => (this.couponAmount = data));
      // 查遠傳幣
      this.api.member.getFetCoins().then((data) => (this.fcoin = data));
      this.api.member.queryHappyGoPoint().then((data) => (this.hgPoint = data));

      this.memberInfo = await this.api.member.getMember();
      if (this.memberInfo) {
        this.name = this.memberInfo.name;
        this.memberType = this.memberInfo.memberType;
      }
    },
    goOrderPage(e) {
      e.preventDefault();
      sessionStorage.removeItem("visitorCellPhone");
      sessionStorage.removeItem("visitorOtp");
      location.href = "/member/myOrder";
    },
    checkFetLife() {
      const feecInfo = this.tools.getCookie("FEEC-B2C-INFO");
      this.fetLife = feecInfo?.data?.fetLife;
    },
    logout() {
      this.api.member.doLogout();
    }
  },
  components: { navigation },
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
.memberCenter {
  padding-bottom: 60px;
  .header {
    display: flex;
    font-size: 1.5rem;
    justify-content: center;
    border-bottom: 1px solid $swirl;
    padding: 12px;
    position: relative;
  }
  .center {
    font-size: 1.5rem;
    padding: 20px;
    .memberInfo {
      background: center / 100% no-repeat
        url("./images/bg_member_corporation_employee_card.png");
      padding: 15px;
      box-sizing: border-box;
      border-radius: 5px;
      color: $white;
      font-size: 1.3rem;
      width: 100%;
      min-height: 75px;
      .name {
        display: flex;
        align-items: center;
        font-size: 15px;
        p {
          font-size: 18px;
        }
        .fridayLogo {
          width: 30px;
          height: 30px;
          border-radius: 25px;
          background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQiIGhlaWdodD0iMzQiIHZpZXdCb3g9IjAgMCAzNCAzNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPg0KICAgICAgICA8cmVjdCBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHdpZHRoPSIzNCIgaGVpZ2h0PSIzNCIgcng9IjEwIi8+DQogICAgICAgIDxwYXRoIGQ9Ik0xNy4xNDEgMjMuMDIzYTcuNDU3IDcuNDU3IDAgMCAxLTIuNjU4LS40ODRjLTEuMzEtLjUxLTMuMDU1LTEuNjU3LTMuOTUyLTQuMjM1bC0uMDg2LS4yNDYgMTMuMjkxLTQuNjIuMDg2LjI0N2MuMTgzLjUzLjU1NSAyLjMzNC4wNjggNC4yOTItLjU3MSAyLjI3Ny0yLjA1MiAzLjg0NS00LjQwNCA0LjY2M2E3LjI0MyA3LjI0MyAwIDAgMS0yLjM0NS4zODNNMjcuNDYgMTIuMzJsLS42MTMtMS45NmMtLjI2LS44MzEtLjc1OC0xLjI1Mi0xLjQ4LTEuMjUyYTIuNjUgMi42NSAwIDAgMC0uODYuMTYzTDcuMzA0IDE1LjI0OWMtLjYwNi4yMTEtMS4wMDQuNTE2LTEuMTg0LjkwNi0uMTc3LjM3My0uMTU4Ljg0LjA1NCAxLjM5bC43MzYgMS45MTVjMS41MyA0LjAwMSA0LjE2NCA1Ljc1IDYuMTA1IDYuNTE0IDEuMzA4LjUxNCAyLjc3Mi43ODcgNC4yMjcuNzg3IDEuMjI0IDAgMi40MzgtLjE5NyAzLjUwNC0uNTY5IDUuNTkzLTEuOTQzIDguNTQtOC4wMzYgNi43MTQtMTMuODcyIiBmaWxsPSIjRjM0RjU5Ii8+DQogICAgPC9nPg0KPC9zdmc+DQo=)
            center/30px no-repeat;
          margin-right: 10px;
        }
        margin-bottom: 20px;
      }
      .memberType {
        text-align: right;
      }
    }
    .ticket {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid $swirl;
      padding: 25px 0px;
      .ticketBox {
        width: 25%;
        text-align: center;
        text-decoration: none;
        p {
          color: $black;
          &:last-of-type {
            color: $sliver;
            font-size: 1.3rem;
          }
        }
        a {
          color: $dodger-blue;
          text-decoration: none;
        }
      }
    }
    .icon {
      display: flex;
      padding: 25px 0 0 0;
      .iconBox {
        width: 25%;
        text-align: center;
        text-decoration: none;
        color: $tundora;
        p {
          font-size: 1.3rem;
        }
        i {
          width: 25px;
          height: 25px;
        }
        .order {
          background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbD0iIzNDM0MzQyIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTEyLjUgMy4zMzNjLjQyNyAwIC43OC4zMjIuODI4LjczNmwuMDA1LjA5OHYyLjVoMi4yMWMuMTU4IDAgLjMxMS4wNS40NC4xNDRsLjA3NS4wNjIgMi4wMDkgMS44NzVjLjE0NS4xMzUuMjM3LjMyMy4yNi41MjVsLjAwNi4xMDJWMTIuNWMwIC40MjctLjMwMS43OC0uNjkuODI4bC0uMDkuMDA1aC0xLjM0NWMuMTYuMzEyLjI1LjY2Ny4yNSAxLjA0MiAwIDEuMjY2LTEuMDI2IDIuMjkyLTIuMjkxIDIuMjkyLTEuMjY2IDAtMi4yOTItMS4wMjYtMi4yOTItMi4yOTIgMC0uMzc1LjA5LS43MjkuMjUtMS4wNDFoLTQuMjVjLjE2LjMxMi4yNS42NjYuMjUgMS4wNDEgMCAxLjI2Ni0xLjAyNiAyLjI5Mi0yLjI5MiAyLjI5Mi0xLjI2NSAwLTIuMjkxLTEuMDI2LTIuMjkxLTIuMjkyIDAtLjM3NS4wOS0uNzI5LjI1LTEuMDQxSDIuNWMtLjQyNyAwLS43OC0uMzIyLS44MjgtLjczN2wtLjAwNS0uMDk3VjQuMTY3YzAtLjQyOC4zMjEtLjc4LjczNi0uODI4bC4wOTctLjAwNmgxMHptLTYuNjY3IDEwYy0uNTc1IDAtMS4wNDEuNDY3LTEuMDQxIDEuMDQycy40NjYgMS4wNDIgMS4wNDEgMS4wNDJjLjU3NiAwIDEuMDQyLS40NjcgMS4wNDItMS4wNDJzLS40NjYtMS4wNDItMS4wNDItMS4wNDJ6bTguMzM0IDBjLS41NzYgMC0xLjA0Mi40NjctMS4wNDIgMS4wNDJzLjQ2NiAxLjA0MiAxLjA0MiAxLjA0MmMuNTc1IDAgMS4wNDEtLjQ2NyAxLjA0MS0xLjA0MnMtLjQ2Ni0xLjA0Mi0xLjA0MS0xLjA0MnptLTIuMDg0LTguNzVIMi45MTd2Ny41aDkuMTY2di03LjV6bTMuMjYgMy4zMzRoLTIuMDF2NC4xNjZoMy43NVY5LjU0bC0xLjc0LTEuNjIzeiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE0MCAtNTQyKSB0cmFuc2xhdGUoMTIwIDI1NCkgdHJhbnNsYXRlKDAgMjc4KSB0cmFuc2xhdGUoMjAgMTApIi8+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K)
            center/25px no-repeat;
        }
        .favorite {
          background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbD0iIzNDM0MzQyIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTAuMTA4IDUuMjA4TDEwIDUuMzc2bC0uMDEtLjAxNWMtLjg5My0xLjQ1Mi0yLjY0Ni0yLjMwOC00LjUwNy0xLjk0NC0xLjYxNy4zMTgtMi45MyAxLjU5My0zLjI5NCAzLjIwMmwtLjA0NC4yMjFjLS4xOSAxLjEwNy4wNjYgMi4xODUuNjg2IDMuMDg2bC4wNC4wNTUuMDA1LjAxMWMuMDI1LjA1LjA1Ni4wOTguMDk2LjE0M2w2LjAyMiA2LjkwNmMuNTMzLjYxMiAxLjQ3OS42MTIgMi4wMTIgMGw2LjAyMi02LjkwNi4wNTQtLjA3LjAyMi0uMDM2LjAyMy0uMDQ4LS4wODcuMTIzYy43NTgtLjk5NCAxLjA1NS0yLjIyOC43Ny0zLjQ4NS0uMzYzLTEuNjA5LTEuNjc2LTIuODg0LTMuMjkyLTMuMjAyLTEuNzk2LS4zNTEtMy40OS40MzItNC40MSAxLjc5em00LjE4NC0uNTVjMS4xNDcuMjI2IDIuMDggMS4xMzMgMi4zMzMgMi4yNWwuMDM0LjE3M2MuMTM0LjgwOC0uMDc2IDEuNTg1LS41NzQgMi4yMzlsLS4wNDIuMDYtNS45NCA2LjgxNC0uMDM2LjAyN2MtLjA1NC4wMjgtLjEzLjAxOC0uMTctLjAyN0wzLjk1NiA5LjM4bC0uMDQtLjA2MWMtLjUzNS0uNy0uNzM3LTEuNTQzLS41NDEtMi40MTMuMjUyLTEuMTE2IDEuMTg2LTIuMDIzIDIuMzM0LTIuMjQ4IDEuOTQtLjM4IDMuNjgyIDEuMDQgMy42ODIgMi44OTggMCAuODQyIDEuMjE4Ljg0MiAxLjIxOCAwIDAtMS44NTggMS43NDItMy4yNzggMy42ODMtMi44OTh6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTQwIC01ODIpIHRyYW5zbGF0ZSgxMjAgMjU0KSB0cmFuc2xhdGUoMCAyNzgpIHRyYW5zbGF0ZSgwIDQwKSB0cmFuc2xhdGUoMjAgMTApIi8+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=)
            center/25px no-repeat;
        }
        .electronicTicket {
          background: url(./images/icons/ticket-folder.svg) center/30px
            no-repeat;
        }
      }
    }
    .menu {
      border-bottom: 1px solid $swirl;
      padding: 20px 0;
      &:last-of-type {
        border-bottom: unset;
      }
      .title {
        color: $sliver;
        margin-bottom: 10px;
        font-size: 1.3rem;
      }
      ul {
        list-style-type: none;
        li {
          padding: 10px 0;
          a {
            text-decoration: none;
            color: $tundora;
          }
        }
      }
      &.contactUs {
        border-bottom: unset;
        ul {
          li {
            a {
              display: flex;
              align-items: center;
              i {
                margin-left: 0;
              }
            }
          }
        }
      }
    }
    .copyright {
      width: 90%;
      font-size: 1.2rem;
      color: $sliver;
    }
  }
}
</style>
