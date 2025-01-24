<template>
  <div class="orderBox">
    <div class="discountList">
      <h3 class="title border_bottom">訂購資訊</h3>
      <purchaseListDialog v-if="isPurchaseListDialogShow" @closePurchaseListDialog="closePurchaseListDialog" :cartList="cartList" />
      <div class="purchaseList border_bottom">
        <p>商品明細</p>
        <div class="lookMore">
          <i class="next_arrow" @click="openPurchaseListDialog"></i>
        </div>
      </div>
      <div class="total_area">
        <div class="totalPrice gray_bold" v-if="cart.productAmount>0">
          <p>總計</p>
          <p>${{tools.priceFormat(cart.productAmount)}}</p>
        </div>
        <div class="eventDiscount gray_bold" v-if="cart.promoDiscountAmount>0">
          <p @click="openEventDiscountPopup">AI運算最佳折扣 (<span class="eventDiscountDetailBtn">詳</span>) 商品共折扣</p>
          <p>-${{tools.priceFormat(cart.promoDiscountAmount)}}</p>
        </div>
        <div class="couponDiscount gray_bold" v-if="cart.couponAmount>0">
          <p>折價券折抵</p>
          <p>$-{{tools.priceFormat(cart.couponAmount)}}</p>
        </div>
        <div class="couponDiscount gray_bold" v-if="cart.discountCodeAmount>0">
          <p>折扣碼折抵</p>
          <p>$-{{tools.priceFormat(cart.discountCodeAmount)}}</p>
        </div>
        <div class="couponDiscount gray_bold" v-if="cart.aiAmount>0">
          <p>對品折價券</p>
          <p>$-{{tools.priceFormat(cart.aiAmount)}}</p>
        </div>
        <div class="shippingFee gray_bold" v-if="cart.shipFeeTotalAmount>0">
          <p>運費</p>
          <p>${{tools.priceFormat(cart.shipFeeTotalAmount)}}</p>
        </div>
      </div>
    </div>
    <div class="totalCount">
      <p>總金額：${{tools.priceFormat(totalCount)}}</p>
    </div>
    <div class="discountInput">
      <p>現金折抵選項</p>
      <ul>
        <li v-if="voucher>0">
          <div class="voucher">
            <div class="left">
              <p class="discountName">使用friDay購物金折抵</p>
              <p class="ownPoint">現有{{voucher}}friDay購物金</p>
            </div>
            <div class="right">
              <p v-if="voucherDiscountVal" class="value">- ${{voucherDiscountVal}}</p>
              <i v-if="!isLockVoucherInput" class="next_arrow" @click="openVoucherDialog"></i>
            </div>
            <vouchertDialog v-if="isVouchertDialogOpen" @closeVoucherDialog="closeVoucherDialog" @setVoucherVal="setVoucherVal" :voucher="voucher" :calcSum="calcSumNoShip" :preVoucherDiscount="voucherDiscountVal" />
          </div>
        </li>
        <li v-if="fcoin>0">
          <div class="fcoin">
            <div class="left">
              <p class="discountName">使用遠傳幣折抵</p>
              <div class="promotion"></div>
              <p class="ownPoint">現有{{fcoin}}遠傳幣 <span class="promoIcon" v-if="promotionData && promotionData.hasActive">限定活動</span></p>
            </div>
            <div class="right">
              <p v-if="fcoinDiscountVal" class="value">- ${{fcoinDiscountVal}}</p>
              <i v-if="!isLockFcoinInput" class="next_arrow" @click="openFcoinDialog"></i>
            </div>
            <fcoinDialog v-if="isFcoinDialogOpen" @closeFcoinDialog="closeFcoinDialog" @setFcoinData="setFcoinData" :fcoin="fcoin" :calcSum="calcSumNoShip" :promotionData="promotionData" :preFcoinDiscount="fcoinDiscountVal" />
          </div>
        </li>
        <li v-if="hgPoint">
          <div class="voucher">
            <div class="left">
              <p class="discountName">使用HAPPYGO點數折抵</p>
              <p class="ownPoint">現有{{hgPoint}}點</p>
            </div>
            <div class="right">
              <p v-if="happyGoDiscountVal" class="value">- ${{happyGoDiscountVal}}</p>
              <i v-if="!isLockHappygoInput" class="next_arrow" @click="openHgDialog"></i>
            </div>
            <hgDialog v-if="isHappygoDialogOpen" @closeHgDialog="closeHgDialog" @setHgDiscountVal="setHgDiscountVal" :hg="hgPoint" :hgRule="hgRule" :calcSum="calcSumNoShip" :preHgPointDiscount="happyGoDiscountVal" />
          </div>
        </li>
        
      </ul>
    </div>
    <div class="calcSum">
      <p>實付金額</p>
      <p>${{tools.priceFormat(calcSum)}}</p>
    </div>
    <popup v-if="isEventDiscountPopupOpen" @closePopup="closeEventDiscountPopup">
      <div class="eventContent">
        <p v-html="cart.cartDiscountData?.discountWording"></p>
      </div>
    </popup>
  </div>
</template>

<script>
import purchaseListDialog from "./purchaseListDialog.vue";
import vouchertDialog from "./order/vouchertDialog.vue";
import fcoinDialog from "./order/fcoinDialog.vue";
import hgDialog from "./order/hgDialog.vue";
import popup from "../common/popup.vue";
export default {
  name: "orderBox",
  data() {
    return {
      isPurchaseListDialogShow: false,
      // 擁有
      voucher: 0,
      fcoin: 0,
      hgPoint: 0,
      // 輸入
      voucherDiscountVal: null,
      happyGoDiscountVal: null,
      fcoinDiscountVal: null, //遠傳幣經過倍率計算後折抵的金額
      fcoinData: null, //從fcoinDialog傳出的值(fcoin、fcoinBonus、折抵後換算的金額 )
      isVouchertDialogOpen: false,
      isHappygoDialogOpen: false,
      isFcoinDialogOpen: false,
      isLockFcoinInput: false, // 是否鎖定遠傳幣不能修改
      isLockVoucherInput: false, // 是否鎖定遠傳幣不能修改
      isLockHappygoInput: false, // 是否鎖定遠傳幣不能修改
      // 倍率
      promotionData: null, // 活動倍率資料
      hgRule: null,
      submitData: null,
      isEventDiscountPopupOpen: false,
      calcSumNoShip: null,
    };
  },
  props: {
    cart: { type: Object },
  },
  components: {
    purchaseListDialog,
    vouchertDialog,
    fcoinDialog,
    hgDialog,
    popup,
  },
  methods: {
    //開啟商品明細dialog
    openPurchaseListDialog() {
      this.isPurchaseListDialogShow = true;
    },
    //關閉商品明細dialog
    closePurchaseListDialog() {
      this.isPurchaseListDialogShow = false;
    },
    openVoucherDialog() {
      this.isVouchertDialogOpen = true;
    },
    closeVoucherDialog() {
      this.isVouchertDialogOpen = false;
    },
    openFcoinDialog() {
      this.isFcoinDialogOpen = true;
    },
    closeFcoinDialog() {
      this.isFcoinDialogOpen = false;
    },
    openHgDialog() {
      this.isHappygoDialogOpen = true;
    },
    closeHgDialog() {
      this.isHappygoDialogOpen = false;
    },
    openEventDiscountPopup() {
      this.isEventDiscountPopupOpen = true;
    },
    closeEventDiscountPopup() {
      this.isEventDiscountPopupOpen = false;
    },
    //購物金input回填
    setVoucherVal(val) {
      this.voucherDiscountVal = val;
    },
    setFcoinData(val) {
      this.fcoinData = val;
      this.fcoinDiscountVal = val.total;
    },
    setHgDiscountVal(val) {
      this.happyGoDiscountVal = val;
    },
    //購物金餘額
    async queryVoucherBalance() {
      this.voucher = await this.api.member.queryVoucherBalance() || this.voucher;
    },
    // 遠傳幣
    async queryFcoin() {
      this.fcoin = await this.api.member.getFetCoins() || this.fcoin;
    },
    // HappyGo點數
    async queryHGPoint() {
      this.hgPoint = await this.api.member.queryHappyGoPoint() || this.hgPoint;
    },
    async queryHGRule() {
      const rule = await this.api.member.queryHappyGoRule();
      this.hgRule = rule;
    },
    //遠傳必放大折活動判斷及倍率
    async getPromotionFcoin() {
      const promotionData = await this.api.promotion.getPromotionFcoin(
        this.calcSum,
        this.fcoin,
        this.cartList
      );
      this.promotionData = promotionData;
    },
    // 設定幣金折抵預填機制
    async setCoinAutoDiscount() {
      // 是否預填遠傳幣
      if (this.cart?.coinPreset) {
        // 如果遠傳幣足夠
        if (this.fcoin >= this.calcSum) {
          const fcoinData = await this.api.promotion.setFcoinAutoDiscount(this.cart, this.fcoin);
          this.setFcoinData(fcoinData);
        }
        // 如果購物金足夠及只能幣金付款
        else if (this.voucher >= this.calcSum && this.cart?.coinOnly) {
          this.setVoucherVal(this.calcSum)
        }
      }
      // 是否只能幣金付款
      if (this.cart?.coinOnly) {
        this.isLockFcoinInput = true;
        this.isLockVoucherInput = true;
        this.isLockHappygoInput = true;
      }
    },
    parseSubmitData() {
      const submitData = {};
      const {
        fcoinData,
        voucherDiscountVal,
        happyGoDiscountVal,
        hgRule,
        promotionData,
      } = this;
      //若有用購物金折抵
      submitData.voucher = voucherDiscountVal || 0;

      //若有用遠傳幣折抵
      submitData.fcoin = fcoinData?.coin || 0;
      if (fcoinData && promotionData && promotionData.hasActive) {
        submitData.fcoinBonus = fcoinData.gift;
      }

      //若有用happgo點數折抵
      submitData.happyGoDiscount = happyGoDiscountVal || 0;
      if (happyGoDiscountVal) {
        submitData.happyGoPoint =
          happyGoDiscountVal * (hgRule.points / hgRule.dollars);
      }
      this.submitData = submitData;
    },
    submit() {
      this.parseSubmitData();
      return this.submitData;
    },
  },
  async created() {
    await this.queryVoucherBalance();
    await this.queryFcoin();
    this.getPromotionFcoin();
    this.queryHGPoint();
    this.queryHGRule();
    this.setCoinAutoDiscount();
  },
  computed: {
    totalCount() {
      return (
        this.cart.productAmount +
        this.cart.shipFeeTotalAmount -
        this.cart.promoDiscountAmount -
        this.cart.aiAmount -
        this.cart.discountCodeAmount -
        this.cart.couponAmount
      );
    },
    cartList() {
      return this.cart.items;
    },
    calcSum() {
      const calcSum =
        this.cart.productAmount +
        this.cart.shipFeeTotalAmount -
        this.cart.promoDiscountAmount -
        this.cart.aiAmount -
        this.cart.discountCodeAmount -
        this.cart.couponAmount -
        this.voucherDiscountVal -
        this.fcoinDiscountVal -
        this.happyGoDiscountVal;
      this.$emit("setCalcSum", calcSum);
      return calcSum;
    },
  },
  watch: {
    calcSum: {
      handler(val) {
        this.calcSumNoShip = val - this.cart.shipFeeTotalAmount;
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";
.orderBox {
  color: #4c4c4c;
  background-color: $white;
  font-size: 14px;
  .discountList {
    .title {
      color: #353635;
      font-weight: bold;
      display: flex;
      position: relative;
      align-items: center;
      margin: 0 20px;
      padding: 10px 0;
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

    margin-bottom: 10px;
    .purchaseList {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      letter-spacing: 0.1px;
      padding: 10px 0;
      margin: 0 20px;
      .lookMore {
        display: flex;
        align-items: center;
      }
    }
    .total_area {
      font-size: 14px;
      letter-spacing: 0.1px;
      padding: 10px 0;
      margin: 0 20px;
      border-bottom: 1px solid $alto;
      > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: 600;
        &:last-of-type {
          margin-bottom: 0;
        }
      }
      .gray_bold {
        color: $sliver;
        margin-bottom: 10px;
      }
    }

    .red {
      color: $red;
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
    .flex-aign-center {
      display: flex;
      align-items: center;
    }
    .modifyBtn {
      margin-right: 5px;
    }
  }
  .totalCount {
    margin: 0px 20px 30px 20px;
    text-align: right;
    font-size: 1.5rem;
    font-weight: 600;
  }
  .discountInput {
    margin: 0 20px;
    border-bottom: 1px solid $alto;
    > p {
      color: $heavy-metal;
      font-weight: bold;
      margin-bottom: 8px;
    }
    ul {
      list-style-type: none;
      li {
        padding: 8px 0 8px 15px;
        > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .left {
            flex-grow: 1;
          }
          .right {
            display: flex;
            align-items: center;
            .value {
              margin-right: 5px;
              color: $fcoin;
              font-weight: bold;
              font-size: 16px;
            }
          }
          .ownPoint {
            color: $sliver;
            font-size: 12px;
          }
        }
      }
    }
  }
  .calcSum {
    padding: 20px 0;
    display: flex;
    justify-content: space-between;
    color: $red;
    margin: 0 20px;
    font-size: 16px;
    font-weight: bold;
  }
  .promoIcon {
    color: white;
    background-color: $special;
    padding: 2px 3px;
    font-size: 10px;
    box-sizing: border-box;
    border-radius: 5px;
  }
  .eventContent {
    ::v-deep {
      b {
        font-weight: bold;
      }
      font {
        &.price {
          color: $red;
          &::before {
            content: "$";
            margin-left: 3px;
          }
        }
      }
      .pinfo {
        margin-top: 10px;
      }
    }
  }
  .eventDiscountDetailBtn {
    cursor: pointer;
    text-decoration: underline;
    padding: 0 2px;
  }
}
</style>
