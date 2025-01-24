<template>
  <div class="memberStep3">
    <div class="fix">
      <div class="header">
        <h1>宅配購物車</h1>
        <a class="backBtn" @click="back">
          <i class="back_arrow"></i>
        </a>
      </div>
    </div>
    <div class="memberMsgBox">
      <template v-if="status !== 0">
        <div class="memberMsgBox__img">
          <i class="icon-done"></i>
        </div>
        <!-- 未付款 -->
        <template v-if="dealType === 'MATM'">
          <div class="memberMsgBox__sucessMsg">
            <p>請前往付款</p>
          </div>
          <div class="memberMsgBox__atmPay">
            <p>請於 {{ atmData.atmExpire }} 前轉帳</p>
            <ul>
              <li><span>轉帳銀行代碼 : </span><span>{{ atmData.bankCode }} {{ atmData.bankName }}</span></li>
              <li>
                <span>銀行帳號 : </span><span>{{ atmData.atmAccNum }}</span><i class="icon-copy" @click="copyFunction(atmData.atmAccNum)"></i>
              </li>
              <li><span>轉帳金額 : </span><span>${{ atmData.amount }}</span></li>
            </ul>
          </div>
        </template>
        <template v-else-if="status === 2">
          <div class="memberMsgBox__sucessMsg">
            <p>請前往付款</p>
            <p>系統將自動轉到{{ thirdPartyType }}</p>
          </div>
          <div class="memberMsgBox__spin"></div>
        </template>
        <!-- 已付款 -->
        <template v-else-if="status === 1">
          <div class="memberMsgBox__sucessMsg">
            <p>訂購成功！</p>
            <p class="memberMsgBox__redMsg">已經收到您的訂購</p>
            <p>之後可到我的帳戶中查詢訂單</p>
          </div>
        </template>
        <template v-if="status !== 2">
          <div v-if="isFridaySite" class="memberMsgBox__card">
            <a href="https://go.shopping.friday.tw/event/202307/20230701-promotecard/index.html" target="_blank"><img src="https://event.shopping.friday.tw/event/CP/common/mobile_icon/A1.png" alt="" /></a>
            <a href="https://go.shopping.friday.tw/event/202307/20230701-promotecard/index.html" target="_blank">點我馬上申辦</a>
          </div>
          <p class="memberMsgBox__redNotice">
            提醒您：本公司不會主動打電話告知您任何有關付款修改的問題，若接到可疑電話請拒絕回應。
          </p>
          <p class="memberMsgBox__grayNotice">
            本系統已收到您的下訂訊息，不代表交易完成，待確認交易條件(如商品存貨量、商品售價等)無誤將依下訂內容出貨，待收到商品出貨通知交易才算完成。
          </p>
        </template>
      </template>
      <!-- 錯誤 -->
      <template v-else-if="status === 0">
        <div class="memberMsgBox__img">
          <i class="icon-error"></i>
        </div>
        <div class="memberMsgBox__errorMsg">
          <template v-if="errorMsg">
            <p>很抱歉！{{errorMsg}}</p>
            <p>請您重新訂購，謝謝！</p>
          </template>
        </div>
        <p class="memberMsgBox__redNotice">
          提醒您：本公司不會主動打電話告知您任何有關付款修改的問題，若接到可疑電話請拒絕回應。
        </p>
      </template>
      <div class="submitBtn" v-if="status !== 2">
        <a href="#" @click.prevent="goHome"><span>回首頁</span></a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "errorStep3",
  data() {
    return {
      isFridaySite: true, // 是否為friDay 主站 OR B網
      urlSuffixPrefix: "", // 廠商網址
      isThirdPartyType: true,
      thirdPartyType: "",
      dealType: "",
      status: 0, // 0:付款失敗 1:付款成功 2:其他支付方式
      errorType: 1,
      atmData: {
        // ATM 付款資訊
        atmAccNum: "",
        bankCode: "",
        bankName: "",
        atmExpire: "",
        amount: "",
      },
      errorMsg: "",
    };
  },
  components: {},
  methods: {
    goHome() {
      location.href = this.isFridaySite ? "/" : this.urlSuffixPrefix;
    },
    copyFunction(account) {
      const textToCopy = account;
      // 创建一个临时 textarea 元素
      const textarea = document.createElement("textarea");
      textarea.value = textToCopy;
      // 将 textarea 添加到文档中
      document.body.appendChild(textarea);
      // 选中 textarea 中的文本
      textarea.select();
      // 将文本复制到剪贴板
      document.execCommand("copy");
      // 删除临时 textarea 元素
      document.body.removeChild(textarea);
      alert("文本已复制到剪贴板");
    },
    back(e) {
      e.preventDefault();
      history.back();
    },
    goHomePage() {
      location.href = "/";
    },
    goOrderPage() {
      location.href = "";
    },
  },
  created() {
    if (this.siteData) {
      this.isFridaySite = false;
      this.urlSuffixPrefix = "/" + this.siteData.urlSuffix;
    }

    const shopURL = new URLSearchParams(location.search); // 抓取網頁目前 URL
    const shopParams = shopURL.get("payStatus"); // 取得付款狀態

    if (shopParams === "0") {
      // 付款失敗
      this.status = 0;
      const errorMsg = shopURL.get("msg"); // 取得付款狀態
      this.errorMsg = errorMsg;
    } else if (shopParams === "1") {
      // 付款成功
      this.status = 1;

      // 清空此次購物車內容
      this.api.cart.cleanCart();
    } else if (shopParams === "2") {
      // 第三方付款方式
      const thirdPayInfo = sessionStorage.getItem("checkoutThirdPayInfo");
      if (thirdPayInfo) {
        this.dealType = "";
        this.isThirdPartyType = true;
        this.status = 2;
        this.thirdPartyType = JSON.parse(thirdPayInfo).payName;
        setTimeout(function () {
          location.href = JSON.parse(thirdPayInfo).redirectUrl;
        }, 5000);
      } else {
        window.location.href =
          location.pathname + "?payStatus=0&dealId=" + shopURL.get("dealId");
      }
    } else {
      // ATM 付款
      this.dealType = "MATM";
      this.isThirdPartyType = false;
      const atmInfo = sessionStorage.getItem("checkoutATMInfo");
      this.atmData = JSON.parse(atmInfo);
      this.status = 3;
      sessionStorage.removeItem("checkoutATMInfo"); // 清除 ATM 付款資料

      // 清空此次購物車內容
      this.api.cart.cleanCart();
    }
  },
};
</script>

<style lang="scss">
</style>

<style lang="scss" scoped>
@import "../../style/_color.scss";
.memberStep3 {
  .fix {
    transform: translate3d(0, 0, 0);
    position: sticky;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    background-color: $white;
    color: $tundora;
    .header {
      padding: 10px;
      font-size: 18px;
      border-bottom: 1px solid $sliver;
      text-align: center;
      display: block;
      position: relative;
      .backBtn {
        position: absolute;
        top: 0;
        left: 0;
        text-decoration: none;
      }
    }
  }
  .memberMsgBox {
    margin-top: 50px;
    padding: 0 31px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 80vh;
    margin-bottom: 110px;
    color: #4c4c4c;
    &__sucessMsg {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 30px;
      font-size: 20px;
      color: #353635;
      font-size: 20px;
    }
    &__errorMsg {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 30px;
      font-size: 18px;
      color: #353635;
    }
    &__card {
      margin-top: 40px;
      text-align: center;
      width: 100%;
      a {
        margin-top: 5px;
        text-decoration: none;
        font-size: 16px;
        img {
          width: 100%;
        }
      }
    }
    &__redNotice {
      color: $red;
      font-size: 14px;
      margin-top: 40px;
      text-align: center;
    }
    &__redMsg {
      color: $red;
      margin-top: 40px;
      text-align: center;
    }
    &__grayNotice {
      color: $sliver;
      font-size: 16px;
      margin-top: 15px;
      text-align: center;
      margin-bottom: 50px;
    }
    &__spin {
      width: 36px;
      height: 36px;
      background: url("../../images/icons/Spinner-1s-36px.gif") center/36px
        no-repeat;
      margin-top: 40px;
    }
    &__atmPay {
      margin-top: 20px;
      background-color: #f2f3c8;
      color: #3c3c3c;
      padding: 14px 27px;
      font-size: 14px;
      border-radius: 10px;
      ul {
        list-style-type: none;
      }
    }
    .icon-copy {
      margin-left: 5px;
    }
    .submitBtn {
      background-color: $white;
    }
    .header,
    .submitBtn {
      display: inline-block;
      text-align: center;
      box-sizing: border-box;
      width: 100%;
      margin: 0;
      padding: 10px 10px;
      padding-top: 10px;
      border-top: 1px solid #e0e0e0;
      position: fixed;
      bottom: 0;
      left: 0;
      a {
        span {
          display: inline-block;
          width: 100%;
          border: 1px solid $red;
          border-radius: 10px;
          padding: 10px 0;
          font-size: 16px;
          text-align: center;
          color: $white;
          background-color: $red;
        }
      }
    }
  }
}
</style>
