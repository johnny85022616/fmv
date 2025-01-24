<template>
  <div class="step2">
    <header class="header">
      <h1>購物車</h1>
      <a class="backBtn" @click="back">
        <i class="back_arrow"></i>
      </a>
    </header>
    <div class="topNotice">
      本服務由遠時數位科技提供(包含付款、發票、運送、售後服務)
    </div>
    <main>
      <div class="orderArea">
        <orderBox ref="orderBox" :cart="cart" @setCalcSum="setCalcSum" />
      </div>
      <template v-if="isBottomOpen && calcSum!== null">
        <div class="gap"></div>
        <div class="paytypeArea">
          <payTypeBox ref="payTypeBox" :calcSum="calcSum" :cart="cart" />
        </div>
        <div class="orderPeopleArea">
          <orderPeopleBox ref="orderPeopleBox" :isSomeIntangible="isSomeIntangible" :memberData="memberData" />
        </div>
        <template v-if="!isAllIntangible">
          <div v-if="cartType === 'store'" class="storeArea">
            <storeBox ref="storeBox" @getShipFeeForOrders="getShipFeeForOrders" />
          </div>
          <div v-else class="consigneeArea">
            <consigneeBox ref="consigneeBox" :memberData="memberData" />
          </div>
        </template>
        <div class="invoiceArea">
          <invoiceBox ref="invoiceBox" :cart="cart" />
        </div>
      </template>
      <bottomNotice></bottomNotice>
      <div v-if="isBottomOpen" class="agreeArea">
        <agreeBox ref="agreeBox" />
      </div>
      <div v-if="!isBottomOpen" class="submitBtn continueBtn btn" @click="openBottom">
        <span>
          下一步
        </span>
      </div>
      <div v-if="isBottomOpen&&isCheckoutApiLoading" class="loadingBtn btn">
        <span>
          <i></i>
        </span>
      </div>
      <div v-if="isBottomOpen&&!isCheckoutApiLoading" class="submitBtn btn" @click="formSubmit">
        <span>
          確認送出
        </span>
      </div>
    </main>
  </div>
</template>

<script>
import orderBox from "./components/checkout_step2/orderBox.vue";
import payTypeBox from "./components/checkout_step2/payTypeBox.vue";
import orderPeopleBox from "./components/checkout_step2/orderPeopleBox.vue";
import consigneeBox from "./components/checkout_step2/consigneeBox.vue";
import storeBox from "./components/checkout_step2/storeBox.vue";
import invoiceBox from "./components/checkout_step2/invoiceBox.vue";
import agreeBox from "./components/checkout_step2/agreeBox.vue";
import bottomNotice from "./components/checkout_step2/bottomNotice.vue";
export default {
  name: "step2",
  data() {
    return {
      isShowRedTop: true,
      windowY: 0,
      isStopScrolling: false,
      cart: null, //step1購物車資料
      calcSum: null, //實付金額
      isBottomOpen: false, //下方區域是否展開
      cartType: "",
      isAgreeBoxPass: false, //勾選區塊boolean
      orderData: null, //訂單資料
      payTypeData: null, //付款方式資料
      invoiceData: null, //發票資料
      storeData: null, //門市資料
      orderPeopleData: null, //訂購人資料
      consigneeData: null, //收貨人資料
      submitData: null, //結帳最終資料
      isCheckoutApiLoading: false, //送出api是否完成
      isAllIntangible: false, // 是否只購買虛擬商品
      isSomeIntangible: false, // 是否同時購買虛擬商品及非虛擬商品
      memberData: null, //會員資料
    };
  },
  components: {
    orderBox,
    payTypeBox,
    orderPeopleBox,
    consigneeBox,
    storeBox,
    invoiceBox,
    agreeBox,
    bottomNotice,
  },
  methods: {
    //取得訂購人資料
    async getMemberData() {
      this.memberData = await this.api.member.getMember();
    },
    // 檢查購買商品是不是只有虛擬商品
    checkIsAllIntangible() {
      this.isAllIntangible = this.cart.items.every((v) => {
        return v.mainProducts.every((c) => {
          return c.isIntangible === "1";
        });
      });
    },
    //檢查是否同時購買虛擬商品及非虛擬商品
    checkIsSomeIntangible() {
      this.isSomeIntangible = this.cart.items.some((v) => {
        return v.mainProducts.some((c) => {
          return c.isIntangible === "1";
        });
      });
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
    back(e) {
      e.preventDefault();
      history.back();
    },
    //取得購物車資訊
    getCartList() {
      //驗證是否有購物車資料，沒有回step1
      const cart = JSON.parse(
        window.sessionStorage.getItem("tempCheckoutItems")
      );
      if (!cart) {
        location.href = "/shoppingcart";
      } else {
        this.cart = {
          ...cart,
          shipFeeTotalAmount: 0,
          shipFeeArrayForCheckoutPayload: [],
        };
        this.cartType = cart.cartType;
      }
    },
    /**
     * 運費計算 （一併組合 結帳需要的矩陣
     * 宅配情境不會帶 storeType = undefined
     * storeType 1=SVN, 2=FAM
     * @param {Number} storeType
     */
    async getShipFeeForOrders(storeType) {
      const shipFeeTotalAmount = this.api.checkout.reCalcShipFeeAmount(
        this.cart.items,
        storeType
      );
      const shipFeeArrayForCheckoutPayload =
        this.api.checkout.getShipFeeCheckoutPayload(this.cart.items, storeType);
      this.cart = {
        ...this.cart,
        shipFeeTotalAmount,
        shipFeeArrayForCheckoutPayload,
      };
    },
    //將store中的收貨人姓名和電話填寫到consigneeData中
    setStoreConsignee(storeData) {
      const { consigneeName, phoneNumber } = storeData;
      return { consigneeName: consigneeName, consigneeMobile: phoneNumber };
    },
    //從orderBox設定總金額
    setCalcSum(sum) {
      this.calcSum = sum;
    },
    //打開下方結帳區塊
    openBottom() {
      this.isBottomOpen = true;
    },
    async formSubmit() {
      if (this.isCheckoutApiLoading) return;
      this.submitData = null;
      this.isAgreeBoxPass = this.$refs.agreeBox?.submit();
      if (!this.isAgreeBoxPass) {
        alert("請勾選同意條款");
        return false;
      }
      this.orderData = this.$refs.orderBox?.submit();
      this.payTypeData = await this.$refs.payTypeBox?.submit();
      this.orderPeopleData = this.$refs.orderPeopleBox?.submit();
      if (!this.isAllIntangible) {
        if (this.cartType === "home") {
          this.consigneeData = this.$refs.consigneeBox?.submit();
        } else {
          this.storeData = this.$refs.storeBox?.submit();
          this.consigneeData = this.setStoreConsignee(this.storeData);
        }
      }
      this.invoiceData = await this.$refs.invoiceBox?.submit();

      if (!this.orderData) {
        this.api.ui.alert.getFadeAlert("請填寫折抵選項!");
        return;
      }
      if (!this.payTypeData) {
        this.api.ui.alert.getFadeAlert("請選擇付款資訊!");
        return;
      }
      if (!this.invoiceData) {
        this.api.ui.alert.getFadeAlert("請選擇發票資訊!");
        return;
      }
      if (
        !this.isAllIntangible &&
        (this.cartType === "home" ? !this.consigneeData : !this.storeData)
      ) {
        this.api.ui.alert.getFadeAlert("請填寫收件人資訊!");
        return;
      }
      //判斷是否有填寫訂購人資料(首購填錯 && 有會員資料但有購買虛擬商品時有填錯email觸發alert)
      if (
        (!this.memberData && !this.orderPeopleData) ||
        (this.memberData && this.isSomeIntangible && !this.orderPeopleData)
      ) {
        this.api.ui.alert.getFadeAlert("請填寫訂購人資訊!");
        return;
      }
      this.submitData = {
        ...this.invoiceData,
        ...this.consigneeData,
        ...this.storeData,
        ...this.payTypeData,
        ...this.orderData,
        ...this.orderPeopleData,
        shipFeeAmount: this.cart.shipFeeTotalAmount,
        shipFeeArrayForCheckoutPayload:
          this.cart.shipFeeArrayForCheckoutPayload,
      };
      this.isCheckoutApiLoading = true;
      await this.api.checkout.beginCheckout(this.submitData, this.cart);
      this.isCheckoutApiLoading = false;
    },
  },
  async created() {
    if (!this.api.member.isLogin) {
      window.location.href = this.api.member.loginUrl();
      return;
    }
    // this.api.checkout.checkoutTimeout();
    window.addEventListener(
      "scroll",
      () => {
        const wy = window.scrollY;
        this.windowY = wy;
        this.currentY = wy !== 70 && wy !== 0 ? wy : this.currentY;
        this.isShowRedTop = wy > 0 ? false : true;
      },
      {
        passive: true,
      }
    );
    this.getCartList();

    await this.getShipFeeForOrders();

    this.checkIsSomeIntangible();
    this.getMemberData();
    if (!this.isSomeIntangible) return;
    this.checkIsAllIntangible();
  },
  computed: {
    shoppingCartName() {
      const cartTypeToNameObj = {
        home: "宅配",
        store: "門市取貨",
      };
      return cartTypeToNameObj[this.cartType];
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
</style>

<style lang="scss" scoped>
@import "./style/_color.scss";
.step2 {
  color: #4c4c4c;
  background-color: $background;
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
  .topNotice {
    background-color: $background;
    padding: 5px 15px;
    font-size: 14px;
  }
  .red {
    color: $red;
  }
  .border_bottom {
    border-bottom: 1px solid $alto;
  }
  .btn {
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    padding: 10px 15px;
    padding-top: 10px;
    border-top: 1px solid #e0e0e0;
    background-color: $white;
    span {
      display: inline-block;
      width: 100%;
      border-radius: 10px;
      padding: 10px 0;
      font-size: 16px;
      text-align: center;
      min-height: 44px;
      box-sizing: border-box;
    }
  }
  .continueBtn {
    position: fixed;
    bottom: 0;
  }
  .submitBtn,
  .continueBtn {
    span {
      color: #fff;
      background-color: $red;
      border: 1px solid $red;
    }
  }
  .loadingBtn {
    span {
      background-color: $alto;
      padding: 0;
      i {
        width: 35px;
        height: 35px;
        background: url("./images/icons/checkout_animation.gif") center/35px
          no-repeat;
      }
    }
  }

  .gap {
    margin-bottom: 10px;
  }

  .header {
    background-color: $white;
  }
}
</style>
