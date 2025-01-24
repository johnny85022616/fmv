<template>
  <div v-show="isShowPaymentBlock" class="payTypeBox">
    <div class="titleContainer">
      <h3 class="title">付款方式</h3>
      <span class="coffeeIcon" v-if="isHaveCoffeeItem">喝咖啡，選以下付款更快速</span>
    </div>
    <ul class="paytpype_list border_bottom">
      <template v-if="calcSum !== 0">
        <li v-if="isPayTypeElementShow('PAYTYPE_LINE_PAY')">
          <div class="paytype">
            <i @click="changePayTypeRadio('PAYTYPE_LINE_PAY')" :class="['icon-radio',{active: nowPayType === 'PAYTYPE_LINE_PAY'}]"></i>
            <img src="../../images/payment_line.svg" alt="line pay" />
          </div>
          <!-- <div v-if="isLineCreditBlockShow" class="lineCredit">
            <div>
              <i :class="['icon-radio']"></i>
              <p>****4901</p>
            </div>
            <div>
              <i :class="['icon-radio']"></i>
              <p>更換LINE Pay信用卡</p>
            </div>
          </div> -->
        </li>
        <li v-if="isPayTypeElementShow('PAYTYPE_JKO_PAY')">
          <div class="paytype">
            <i @click="changePayTypeRadio('PAYTYPE_JKO_PAY')" :class="['icon-radio', {active: nowPayType === 'PAYTYPE_JKO_PAY'}]"></i>
            <img src="../../images/payment_JKO.svg" alt="街口支付" />
          </div>
        </li>
        <li v-if="isPayTypeElementShow('PAYTYPE_UUPAY_PAY')">
          <div class="paytype">
            <i @click="changePayTypeRadio('PAYTYPE_UUPAY_PAY')" :class="['icon-radio', {active: nowPayType === 'PAYTYPE_UUPAY_PAY'}]"></i>
            <img src="../../images/payment_EasyWallet.svg" alt="悠遊付" />
          </div>
        </li>
        <li v-if="isPayTypeElementShow('PAYTYPE_PLUS_PAY')">
          <div class="paytype">
            <i @click="changePayTypeRadio('PAYTYPE_PLUS_PAY')" :class="['icon-radio', {active: nowPayType === 'PAYTYPE_PLUS_PAY'}]"></i>
            <img src="../../images/payment_allWin.svg" alt="全盈+" />
          </div>
        </li>
        <li v-if="isPayTypeElementShow('PAYTYPE_HG_PAY')">
          <div class="paytype">
            <i @click="changePayTypeRadio('PAYTYPE_HG_PAY')" :class="['icon-radio', {active: nowPayType === 'PAYTYPE_HG_PAY'}]"></i>
            <img src="../../images/payment_HGP.svg" alt="happygo pay" />
          </div>
        </li>
        <li v-if="isPayTypeElementShow('PAYTYPE_STOR_1')">
          <div class="paytype">
            <i @click="changePayTypeRadio('PAYTYPE_STOR_1')" :class="['icon-radio',{active: nowPayType === 'PAYTYPE_STOR_1'}]"></i>
            <p>超商取貨付款(僅限7-11、全家)</p>
          </div>
        </li>
        <li v-if="isPayTypeElementShow('PAYTYPE_CARD_1')">
          <div class="paytype">
            <i @click="changePayTypeRadio('PAYTYPE_CARD_1')" :class="['icon-radio',{active: nowPayType === 'PAYTYPE_CARD_1'}]"></i>
            <p>信用卡</p>
          </div>
          <creditCardBox v-if="creditCardInfo && nowPayType === 'PAYTYPE_CARD_1'" :creditCardInfo="creditCardInfo" :nowPayType="nowPayType" :cavv="cavv" @setCavv="setCavv" />
        </li>
        <li v-if="isPermitCreditCard && !isInstallmentOpen">
          <div class="paytype">
            <i class="icon-radio" @click="openInstallmentBlock"></i>
            <p>分期付款</p>
          </div>
        </li>
        <template v-else v-for="item in installmentArr">
          <li v-if="isPayTypeElementShow(item.payType)" :key="item.paytype">
            <div class="paytype">
              <i @click="changePayTypeRadio(item.payType , item)" :class="['icon-radio',{active: nowPayType === item.payType}]"></i>
              <p>信用卡 {{item.period}}期
                <span v-if="item.finalInterestRate === 0">0利率</span>
                <span v-else>{{item.finalInterestRate}}%</span>
                <span class="red">${{item.eachPeriodCash}}/期</span>
              </p>
            </div>
            <creditCardBox v-if="creditCardInfo && nowPayType === item.payType" :creditCardInfo="creditCardInfo" :nowPayType="nowPayType" :banks="item.banks" :cavv="cavv" @setCavv="setCavv" />
          </li>
        </template>
        <li v-if="isPayTypeElementShow('PAYTYPE_CARDC_1')">
          <div class="paytype">
            <i @click="changePayTypeRadio('PAYTYPE_CARDC_1')" :class="['icon-radio',{active: nowPayType === 'PAYTYPE_CARDC_1'}]"></i>
            <p>信用卡紅利折抵<span @click="openCenterDialog" class="red">(適用銀行)</span></p>
          </div>
          <creditCardBox v-if="creditCardInfo && nowPayType === 'PAYTYPE_CARDC_1'" :creditCardInfo="creditCardInfo" :nowPayType="nowPayType" :cavv="cavv" @setCavv="setCavv" />
        </li>
        <li v-if="isPayTypeElementShow('PAYTYPE_MATM_1')">
          <div class="paytype">
            <i @click="changePayTypeRadio('PAYTYPE_MATM_1')" :class="['icon-radio',{active: nowPayType === 'PAYTYPE_MATM_1'}]"></i>
            <p>ATM轉帳</p>
          </div>
        </li>
        <li>
          <createCreditCardBox v-if="isCreditType && !creditCardInfo" ref="createCreditCardBox" />
        </li>
      </template>
      <template v-else>
        <div class="paytype">
          <i :class="['icon-radio', {active: nowPayType === 'pay_type_pay_done_0'}]"></i>
          <p>全額折抵</p>
        </div>
      </template>
      <p class="red notice">付款完成後，會再次確認商品數量，如商品已先售完，將會取消訂單並退款。</p>
    </ul>
    <popupDialog v-if="isPopupOpen" @closeCenterDialog="closeCenterDialog" :isSimple="true">
      <div class="bankList">
        {{allpointsdeductibles}}
      </div>
    </popupDialog>
  </div>
</template>
<script>
import popupDialog from "../common/popupDialog.vue";
import createCreditCardBox from "./createCreditCardBox.vue";
import creditCardBox from "./creditCardBox.vue";
export default {
  name: "payTypeBox",
  data() {
    return {
      isPopupOpen: false,
      payTypes: null,
      installmentArr: null, //分期資料
      isInstallmentOpen: false, //分期區塊展開
      interest: null, //分期利息
      nowPayType: null, //目前付款方式
      creditCardInfo: null, //使用者預設信用卡資料
      createCreditCardData: null, //新增信用卡資料
      cavv: "", //末三碼
      allpointsdeductibles: null,
      itemIds: null,
      submitData: null, //付款方式sumbitData
      cartList: null,
      isHaveCoffeeItem: false,
      isShowPaymentBlock: true, // 是否顯示付款區塊
    };
  },
  props: {
    calcSum: {
      type: Number,
    },
    cart: {
      type: Object,
    },
  },
  components: { popupDialog, creditCardBox, createCreditCardBox },
  methods: {
    //普通付款資訊
    async getCommonPayTypes() {
      const postData = {
        cartType: this.cart.cartTypeKey,
        itemIds: this.itemIds,
        mediaType: "MOBILE",
        price: this.calcSum,
        useDiscount: false,
      };
      const commonPayTypes = await this.api.cart.getCommonPayTypes(postData);
      if (commonPayTypes) {
        this.parseCommonPayTypes(commonPayTypes);
      }
    },
    //是否有咖啡品項
    checkHaveCoffeeItem() {
      const coffeeItemIds = ["7863465", "7863457", "7863324"];
      this.isHaveCoffeeItem = this.cart.items.some((v) =>
        v.pids.some((x) => coffeeItemIds.includes(x.toString()))
      );
    },
    //取得分期付款資料
    async getInstallments() {
      const postData = {
        cartType: this.cart.cartTypeKey,
        itemIds: this.itemIds,
        mediaType: "MOBILE",
        price: this.calcSum,
        useDiscount: false,
      };

      const installmentArr = await this.api.cart.getinstallmentArr(postData);
      if (!installmentArr) return false;

      this.installmentArr = installmentArr;
      const [firstInstallment] = installmentArr;
      
      this.changePayTypeRadio(firstInstallment.payType, firstInstallment);
      this.parseInstallmentArr(installmentArr);

      return true;
    },
    //TODO line 綁定信用卡資訊
    getLineInfo() {},
    async getCreditCard() {
      const creditCardList = await this.api.creditCard.getCreditCard();

      if (creditCardList?.length) {
        const defaultCreditCard = creditCardList.find((ele) => ele.isDefault === "Y");
        if (defaultCreditCard) {
          this.creditCardInfo = defaultCreditCard;
        }
      }
    },
    //信用卡紅利折抵適用銀行
    async getAllpointsdeductibles() {
      const allpointsdeductibles =
        await this.api.creditCard.getAllpointsdeductibles();
      this.allpointsdeductibles = allpointsdeductibles.join("、");
    },
    parseCommonPayTypes(commonPayTypes) {
      this.payTypes = commonPayTypes.map((ele) => {
        return { payType: ele };
      });
    },
    parseInstallmentArr(installmentArr) {
      const newArr = installmentArr.map((ele) => ({ ...ele }));
      this.payTypes = this.payTypes ? [...this.payTypes, ...newArr] : newArr;
    },
    //預設付款方式
    setDefaultPayType() {
      this.nowPayType = (this.calcSum === 0) 
        ? "pay_type_pay_done_0" 
        : this.payTypes?.[0]?.payType || this.nowPayType;
    },
    //set末三碼
    setCavv(cavv) {
      this.cavv = cavv;
    },
    //打開分期區塊(取得分期api)
    async openInstallmentBlock() {
      const hasInstallments = await this.getInstallments();
      if (hasInstallments) {
        this.isInstallmentOpen = true;
      } else {
        alert("暫無分期付款方式");
      }
    },
    openCenterDialog() {
      this.isPopupOpen = true;
    },
    closeCenterDialog() {
      this.isPopupOpen = false;
    },
    //是否顯示該付款方式
    isPayTypeElementShow(payTypeName) {
      if (this.payTypes) {
        return this.payTypes.some((ele) => ele.payType === payTypeName);
      }
      return false;
    },
    //若有分期則將分期資訊當第二參數傳入
    changePayTypeRadio(payTypeName, installmentInfo) {
      this.nowPayType = payTypeName;
      if (this.isInstallmentType) {
        this.interest = installmentInfo.finalInterestRate;
        return;
      }
      this.interest = null;
    },
    //取得新增信用卡的資料
    getCreateCreditCardData() {},
    getItemIds() {
      let ids = [];
      this.cartList.forEach((ele) => {
        ids = ids.concat(ele.itemIds);
      });
      this.itemIds = ids;
    },
    parseSubmitData() {
      let submitData = {};
      const { nowPayType, creditCardInfo, cavv } = this;
      submitData.payType = nowPayType;
      //信用卡相關且有預設信用卡
      if (this.isCreditType && creditCardInfo) {
        const { expressCheckoutId } = creditCardInfo;
        submitData.cavv = cavv;
        submitData.cardId = expressCheckoutId;
      }
      //信用卡相關但無預設信用卡
      else if (this.isCreditType && this.createCreditCardData) {
        submitData = { ...submitData, ...this.createCreditCardData };
      }
      //TODO為分期付款增加信用卡分期利息
      if (this.isInstallmentType) {
        submitData.interest = this.interest || 0;
      }
      this.submitData = submitData;
    },
    async submit() {
      //是信用卡相關付款方式但之前沒註冊過信用卡才去檢查新增信用卡form
      if (this.isCreditType && !this.creditCardInfo) {
        this.createCreditCardData =
          await this.$refs.createCreditCardBox.submit();
        if (this.createCreditCardData) {
          this.parseSubmitData();
          return this.submitData;
        }
      }
      //是信用卡相關付款方式且已註冊過信用卡
      else if (this.isCreditType) {
        const { checkCavv } = this.tools;
        const cavvAlert = checkCavv(this.cavv);
        if (cavvAlert === "") {
          this.parseSubmitData();
          return this.submitData;
        } else {
          alert(cavvAlert);
        }
      }
      //非信用卡相關付款方式
      else {
        this.parseSubmitData();
        return this.submitData;
      }
    },
  },
  async created() {
    if (this.cart) {
      this.cartList = this.cart.items;
    }
    this.checkHaveCoffeeItem();
    this.getItemIds();
    await this.getCommonPayTypes();
    await this.getCreditCard();
    await this.getAllpointsdeductibles();
    this.setDefaultPayType();

    // 限定全額付款及付費金額為0，就不用再出現付款方式區塊
    if (this.cart?.coinOnly && this.calcSum === 0) {
      this.isShowPaymentBlock = false;
    }
  },
  computed: {
    isLineCreditBlockShow() {
      return this.nowPayType === "PAYTYPE_LINE_PAY";
    },
    //是否payType包含信用卡
    isPermitCreditCard() {
      return this.payTypes?.length && this.payTypes.some(v => /^PAYTYPE_CARD/i.test(v.payType));
    },
    //是否為信用卡相關
    isCreditType() {
      return /^PAYTYPE_CARD/i.test(this.nowPayType);
    },
    //是否為分期
    isInstallmentType() {
      return /^PAYTYPE_CARD_(3|6|12|18|24|30)/i.test(this.nowPayType);
    },
  },
  watch: {
    async calcSum() {
      await this.getCommonPayTypes();
      await this.getInstallments();
      this.setDefaultPayType();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";
.payTypeBox {
  background-color: $white;
  .titleContainer {
    display: flex;
    align-items: center;
    .title {
      display: flex;
      position: relative;
      align-items: center;
      margin: 0 20px;
      padding: 10px 0;
      color: #353635;
      font-weight: bold;
      font-size: 14px;
      letter-spacing: 0.2px;
      &::before {
        content: "";
        display: inline-block;
        width: 3px;
        height: 20px;
        background-color: #f34f59;
        position: absolute;
        left: -20px;
        top: 10px;
      }
    }
    .coffeeIcon {
      padding: 3px 10px;
      background-color: gold;
      border-top-left-radius: 15px;
      border-bottom-right-radius: 15px;
      margin-left: 3px;
      font-weight: 800;
      font-size: 1.3rem;
    }
  }
  .paytpype_list {
    margin: 0 20px;
    list-style-type: none;
    .paytype {
      height: 40px;
      display: flex;
      align-items: center;
      .icon-radio {
        margin-right: 8px;
      }
      p {
        font-size: 14px;
        span {
          &:last-of-type {
            color: $red;
            margin-left: 10px;
          }
        }
      }
      .paytypeIcon {
        &.line {
          width: 80px;
          height: 20px;
        }
      }
    }
    .lineCredit {
      background-color: $background;
      padding: 15px;
      font-size: 14px;
      color: #353635;
      > div {
        padding: 10px;
        background-color: $white;
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        border-radius: 10px;
        &:last-of-type {
          margin-bottom: 0px;
        }
        i {
          margin-right: 8px;
        }
      }
    }
  }

  .red {
    color: $red;
  }
  .notice {
    margin: 10px 0;
    font-size: 1.3rem;
  }
  .border_bottom {
    border-bottom: 1px solid $alto;
  }
  .submitBtn {
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    padding: 10px 15px;
    padding-top: 10px;
    border-top: 1px solid #e0e0e0;
    span {
      display: inline-block;
      width: 100%;
      color: #fff;
      background-color: $red;
      border: 1px solid $red;
      border-radius: 10px;
      padding: 10px 0;
      font-size: 16px;
      text-align: center;
    }
  }
}
</style>
