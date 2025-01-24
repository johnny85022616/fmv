<template>
<div>
  <gotoTop></gotoTop>
  <navigation
    :isShowRedTop="isShowRedTop"
    :windowY="200"
    v-on:stopBodyScroll="stopBodyScroll" />
  <div class="shoppingCheat">
    <h3 class="shoppingCheat__itembar">防詐騙宣導</h3>
    <div class="shoppingCheat__info">
      <h2 class="shoppingCheat__info-subtitle">親愛的使用者您好：</h2>
      <p class="shoppingCheat__info-content">
        <span>近日接獲消費者告知有關詐騙集團以本公司網站名義，透過電話方式提出有關本公司網站相關個資以進行詐騙行為。此種詐騙情形通常是詐騙集團大量以攔截資訊、盜用帳號、拼貼等方式重建個人資料後，而進一步以話術取信消費者，以套取個人金融資訊為目標，本公司再次提醒您，本公司不會主動聯繫您要求提供個人金融資訊，亦不會要求您至ATM匯款或網路銀行匯款。如有接獲疑似詐騙電話，請立即通報165警政署反詐騙專線。針對此事件本公司也與專業資安防護公司合作，進行資安檢測及強化資訊安全加密保護，未來也會持續落實資訊安全與個人資料管理保護，保護消費者個資之安全。如有訂單問題或對個人權益有任何疑問，歡迎與我們聯繫。</span>

        <span class="shoppingCheat__info-hint">如接獲不明及可疑的電話或簡訊提出上述要求，請記住以下三大守則：</span>
        <ol>
          <li>不要透漏任何個人資訊，請立即掛斷。</li>
          <li>不要聽從對方指示到ATM提款機進行任何操作。</li>
          <li>迅速打本網站專線：02-77033955 或 警政署防詐騙專線：165 求證（服務時間：24小時）</li>
        </ol>

        <b>也請您注意以下事項：</b>
        <span class="shoppingCheat__info-hint">客服人員絕不會利用電話指導會員操作ATM</span>
        <span>由於詐騙集團大多是以篡改來電顯示號碼方式與您聯絡，例如來電時會顯示您所熟悉的客服中心專線號碼；或是詢問您較常使用的银行客服電話，而後的來電顯示就是您告知的银行客服電話號碼，以騙耿您的信任。我們的客服人員絕對不會以任何理由，要求您依照我們的指示，操作使用ATM或請您提供餘額查詢、交易序號、信用卡相關資料；我們也絕對不會變更已付款的訂單，更不會要求您再次進行操作ATM。</span>

        <span class="shoppingCheat__info-hint">千萬不要聽從指示到ATM做任何操作</span>
        <span>詐騙集團會以各種理由誘騙您去ATM做餘額查詢、提供交易時間、交易序號，主要是引誘您轉帳到特定帳號，並要確認您在提款機前有依照指示操作。事實上ATM只會將您帳戶中的錢轉出去，並無辦理匯入退款及解除約定帳戶之功能，請您務必小心不要上當；也千萬不要轉換到英文操作介面，以免受騙。</span>

        <span class="shoppingCheat__info-hint">請定期更換您的密碼,以確保安全</span>
        <span>密碼是保護帳戶資訊的重要關卡，建議您採取保護密碼四絕招：</span>
        <ol>
          <li>不設簡易密碼（例如生日）</li>
          <li>不要設與帳號相同的密碼</li>
          <li>不同網站帳戶請設定不同密碼</li>
          <li>不要在公用電腦輸入密碼</li>
        </ol>
        <span>另外，如果您的電腦遭到病毒肆虐，也能造成資料外洩，請勿點選來歷不明之程式、賀卡、電子郵件，或者突然被廣為送的網址連結，以免因夾带病毒（如木馬程式）而導致電腦資料被抓取；而使用免費無線區域網路上網時，其通信訊號也容易被攔載，請您使用免費無線網路時，盡量不要登入個人資料。即使是使用私人電腦，也要定期更新防毒軟體病毒碼；若有在網上登入個人資料，離開時請登出網頁。</span>

      </p>
    </div>
  </div>
</div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import gotoTop from "./components/common/gotoTop.vue";

export default {
  name: "shoppingCheat",
  data() {
    return {
      isBsite: false,
      isShowRedTop: true,
      windowY: 0,
      isStopScrolling: false,
    };
  },
  components: {
    navigation,
    gotoTop,
  },
  methods: {
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
  },
  created() {
    this.isBsite = this.tools.isBsite()

    window.addEventListener(
      "scroll",
      () => {
        const wy = window.scrollY;
        this.windowY = wy;
        this.currentY = wy !== 70 && wy !== 0 ? wy : this.currentY;
        this.isShowRedTop = wy > 0 ? false : true;
      }, {
        passive: true,
      }
    );
  },
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
  .shoppingCheat {
    margin-bottom: 60px;
    &__itembar {
      background: url(./images/icons/itembar-icon.jpeg) 8px 12px no-repeat,
        $alabaster url(./images/icons/itembar-bg.jpeg) left top repeat-x;
      border-radius: 0;
      padding: 8px 8px 8px 24px;
      font-size: 1.5rem;
      color: $tundora;
      font-weight: 600;
    }
  
    &__info {
      padding: 5%;

      b {
        display: block;
        margin-top: 20px;
      }
  
      &-content {
        color: $web_main;
        font-size: 1.4rem;
        margin-bottom: 20px;
      }
  
      &-subtitle {
        color: $web_main;
        font-size: 1.5rem;
        margin-bottom: 5px;
      }

      &-hint {
        margin-top: 15px;
        color: $red;
      }
  
      ul, ol {
        list-style: decimal;
        padding-left: 20px;
        margin-bottom: 5px;
        li {
          line-height: 1.5;
          >ul {
            list-style: upper-alpha;
          }
        }
      }
      span {
        display: block;
      }
    }
  }
  </style>
