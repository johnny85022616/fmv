<template>
  <div>
    <fadeAlert v-if="isfadeAlertOpen" :message="'加入購物車失敗'" @closeFadeAlert="closeFadeAlert" />
    <autoscreendialog v-if="showDialog" :isHeadLine="false" v-on:closeDialog="closeDialog">
      <template v-slot:header>
        <div class="cart-header">
          <span class="text-break-1">{{ pInfo.name }}</span>
        </div>
      </template>
      <template v-slot:body>
        <div class="cart-box">
          <div class="cart-box-content">
            <div class="wrap">
              <ul>
                <li v-if="pInfo.payMethodList[0] === 'CASH' && typeof pInfo.price.promoPrice === 'number'" class="price">
                  <div>
                    <span class="price__list-price">網路價</span>
                    <span class="price__list-price linethrough">{{
                      tools.priceFormat(pInfo.price.memberPrice)
                    }}</span>
                    <span class="price__currency">$</span>
                    <span v-if="pInfo.price" class="price__red-price">{{
                      tools.priceFormat(pInfo.price.promoPrice)
                    }}</span>
                  </div>
                </li>
                <li v-else-if="pInfo.payMethodList[0] === 'CASH' && !pInfo.price.promoPrice" class="price">
                  <div>
                    <span v-if="pInfo.list_price" class="price__list-price">市價</span>
                    <span v-if="pInfo.list_price" class="price__list-price linethrough">{{
                      tools.priceFormat(pInfo.price.marketPrice)
                    }}</span>
                  </div>
                  <span class="price__net-content">網路價</span>
                  <span v-if="pInfo.price !== null" class="price__currency">$</span>
                  <span v-if="pInfo.price !== null" class="price__red-price">{{
                    tools.priceFormat(pInfo.price.memberPrice)
                  }}</span>
                  <span v-else class="noPrice">暫無價格</span>
                </li>
                <li v-else-if="pInfo.payMethodList[0] === 'LIFE_PARTIAL_POINT'" class="life">
                  <div>
                    <span class="list-price">市價</span>
                    <span class="list-price linethrough">{{
                      tools.priceFormat(pInfo.price.marketPrice)
                    }}</span>
                  </div>
                  <i class="fcoin"></i>
                  <font class="fcoin">{{ tools.priceFormat(pInfo.rewardPointInfo.lifePartialPoint) }}</font> + <font class="currency">$</font>
                  <font class="price">{{ tools.priceFormat(pInfo.rewardPointInfo.lifePartialPrice) }}</font>
                </li>
                <li v-else-if="pInfo.payMethodList[0] === 'LIFE_EXCHANGE_POINT'" class="life">
                  <div>
                    <span class="list-price">市價</span>
                    <span class="list-price linethrough">{{
                      tools.priceFormat(pInfo.price.marketPrice)
                    }}</span>
                  </div>
                  <i class="fcoin"></i>
                  <font class="fcoin">{{ tools.priceFormat(pInfo.rewardPointInfo.lifeExchangePoint) }}</font>
                </li>
              </ul>
            </div>

            <specbox :pid="pInfo.pid" :specInfo="pInfo.variants" :comboInfo="comboInfo" :cartComboData="cartCombo" v-on:setSpecInfo="setSpecInfo" @changeSpecInfo="changeSpecInfo" />

            <div class="wrap" v-if="!isCombo">
              <label>運送方式</label>
              <div class="items d-flex flex-wrap">
                <a @click="swapCartType(item.cartTypeId, item.deliveryType)" v-for="(item, index) of pInfo.deliveryInfos" :key="index" :class="['item', { 'active': item.deliveryType === nowSelectedCartType }]">
                  {{ item.deliveryName }}
                </a>
              </div>
            </div>

            <buycombo v-if="comboInfo" :comboInfo="comboInfo" @setCombo="getCombo" />

            <buyadditional v-if="pInfo.additional && pInfo.additional.length > 0" :items="pInfo.additional" v-on:sendAdditional="getAdditional" />
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div ref="footer" class="cart-footer d-flex">
          <button @click="goShop" class="addCartBtn" value="">確定</button>
        </div>
      </template>
    </autoscreendialog>
  </div>
</template>

<script>
import autoscreendialog from "../common/autoscreenDialog.vue"; // 蓋版提示框
import buycombo from "./buycombo"; // 組合商品區塊
import buyadditional from "./buyadditional"; // 加價購區塊
import specbox from "./specbox"; //規格一 規格二 選擇
import fadeAlert from "../../components/common/fadeAlert.vue";

export default {
  name: "buyitem",
  data() {
    return {
      isBsite: false, // 是否為B型網站
      cartData: [], // 收集購物車API資料
      info: {},
      showDialog: false, // 是否顯示購物車視窗
      nowSelectedCartId: 1, // 運送方式ID
      nowSelectedCartType: 'HOME', // 運送方式名稱
      nowSelectedSpecId: null, // 規格ID
      nowSelectedPaymentType: "CASH", // 付款方式
      cartBuyQuantity: 1, // 購買數量
      cartAdditional: [], // 加價購資料
      cartCombo: [], // 組合商品資料
      isAddToCartLoading: false,
      isFromTurnTurn: false,
      nowSpecInfo: {},
      isfadeAlertOpen: false,
      myFCoin: 0, // 我的遠傳幣數
      myVoucher: 0, // 我的購物金
    };
  },
  components: {
    autoscreendialog,
    buyadditional,
    buycombo,
    specbox,
    fadeAlert,
  },
  props: {
    pInfo: {
      type: Object,
      default: () => null,
      required: true,
    },
    // 父層預設的cartType
    parentSelectedCartId: {
      type: Number,
      default: () => 1
    },
    // 是否改接Form Post接到直接進購物車第2動
    directToCheckout: {
      type: Boolean,
      default: () => false,
    },
    // 是否改接Form Post且不彈跳選擇規格、物流、數量對話框
    directToCheckoutNoPopup: {
      type: Boolean,
      default: () => false,
    },
    // 促銷目錄ID
    promotionId: {
      type: String,
      default: () => null,
    },
    // 是否為組合商品頁執行購物車
    isCombo: {
      type: Boolean,
      default: () => false,
    },
    // 組合商品資料
    comboInfo: {
      type: Object,
      default: () => null,
    },
    // 贈品資料
    gifts: {
      type: Array,
      default: () => null,
    },
    // 是否點擊直接購買
    isBuyRedirect: {
      type: Boolean,
      default: () => false,
    },
  },
  created() {
    if (this.siteData) {
      this.isBsite = true;
    }
    if (/WT\.me_id=(turnturn_AI|\w+_AI)/i.test(location.search)) {
      this.isFromTurnTurn = true;
    }

    this.nowSelectedCartId = this.parentSelectedCartId;
    if (this.nowSelectedCartId === 2) {
      this.nowSelectedCartType = 'STORE';
    }

    this.setItemData();
  },
  computed: {
    payMethodList() {
      return this.pInfo.payMethodList.filter((v) =>
        ["PARTIAL_POINT", "EXCHANGE_POINT"].includes(v) ? null : true
      );
    },
  },
  methods: {
    closeFadeAlert() {
      this.isfadeAlertOpen = false;
    },
    //打app Api取得價格
    givePrice() {
      fetch(this.configs.frontApiPath() + "product/notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: this.pInfo.pid,
          type: "quotation",
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.resultCode === 0) {
            alert("已收到請求，將盡快補上價格！祝您購物愉快~");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    changeSpecInfo(nowSpecInfo) {
      this.nowSpecInfo = nowSpecInfo;
      this.$emit("changeSpecInfo", nowSpecInfo);
    },
    setItemData() {
      // 若為心生活來源 且是純幣 就以純幣為優先
      if (/WT\.mg_id=fetmc/i.test(location.search)) {
        if (this.pInfo.payMethodList.length > 0) {
          if (this.pInfo.payMethodList.includes("LIFE_EXCHANGE_POINT")) {
            this.pInfo.payMethodList = this.pInfo.payMethodList.slice(
              this.pInfo.payMethodList.length - 1
            );
          }
        }
      }

      if (this.pInfo.payMethodList.includes("CASH")) {
        this.pInfo.payMethodList = ["CASH"];
      }
      if (this.pInfo.payMethodList.includes("LIFE_PARTIAL_POINT")) {
        this.pInfo.payMethodList = ["LIFE_PARTIAL_POINT"];
      }
      if (this.pInfo.payMethodList.includes("LIFE_EXCHANGE_POINT")) {
        this.pInfo.payMethodList = ["LIFE_EXCHANGE_POINT"];
      }
      this.parseProductInfo();
    },
    checkPaymentWay(type) {
      return (
        this.pInfo &&
        this.pInfo.payMethodList &&
        this.pInfo.payMethodList.some((v) => v === type)
      );
    },

    parseProductInfo() {
      //設定初使預設付款方式
      if (this.pInfo.payMethodList.length > 0) {
        this.nowSelectedPaymentType = this.pInfo.payMethodList[0];
      }

      // 若不彈對話框直接執行進購物車
      if (this.directToCheckoutNoPopup) {
        this.setDefaultSpecInfo();
        this.goShop();
        return;
      }

      this.showDialog = true;
    },
    swapCartType(id, type) {
      this.nowSelectedCartId = id;
      this.nowSelectedCartType = type;
    },
    choosePaymentMehtod(txt) {
      this.nowSelectedPaymentType = txt;
    },
    closeDialog() {
      this.$emit("closeBuyItem");
      this.$emit("stopBodyScroll", "close");
    },
    setDefaultSpecInfo() {
      const specInfo = this.pInfo.variants;
      let targetSpecInfo = {};
      if (specInfo && specInfo.length > 0) {
        specInfo.some((v) => {
          if (!v.subVariants) {
            if (!v.isSoldOut) {
              targetSpecInfo = {
                nowSelectedSpecId: v.id,
                cartBuyQuantity: 1,
              };
              return true;
            }
          } else {
            v.subVariants.some((val) => {
              if (!val.isSoldOut) {
                targetSpecInfo = {
                  nowSelectedSpecId: val.id,
                  cartBuyQuantity: 1,
                };
                return true;
              }
            });
          }
        });
      }
      this.setSpecInfo(targetSpecInfo);
    },
    setSpecInfo(obj) {
      this.nowSelectedSpecId = obj.nowSelectedSpecId;
      this.cartBuyQuantity = obj.cartBuyQuantity;
    },
    async goShop() {
      if (this.isAddToCartLoading) return;
      // clean all
      this.cartData = [];
      const o = this.pInfo;
      this.cartData = this.composeCartData(o);
      //未登入
      if (!this.api.member.isLogin) {
        const storageData = {
          nowSelectedCartId: this.nowSelectedCartId,
          cartData: this.cartData,
        };
        // 暫存目前的商品
        sessionStorage.removeItem("buyItemData");
        this.api.ai.setCache("buyItemData", storageData, 300);
        // 轉登入畫面
        location.href = this.api.member.loginUrl();
        return;
      }

      // 全額折抵付款的商品，先檢查餘額是否足夠
      if (this.configs.isRestrictCoinCheckout(this.pInfo)) {
        await this.getFcoin();
        await this.getVoucher();

        // 計算這次買多少錢
        const payAmount = (this.pInfo.price.bestDiscountPrice * this.cartBuyQuantity);
        if (
          payAmount > this.myFCoin && payAmount > this.myVoucher
        ) {
          this.isAddToCartLoading = false;
          this.api.ui.alert.getFadeAlert('您的遠傳幣或購物金不足，請重新選擇其他商品');
          return false;
        }
      }

      await this.api.campaign.drawCampaignBeforeAddToCart(Object.values(this.pInfo.couponCategory));
      if (/print=1/i.test(location.search)) {
        console.log('加入購物車矩陣', JSON.stringify(this.cartData, 0, 2));
        return;
      }

      this.isAddToCartLoading = true;
      this.api.cart
        .addCart(this.nowSelectedCartId, this.cartData, o)
        .then((res) => {
          if (res.resultCode === 0) {
            sessionStorage.removeItem("buyItemData");

            // GA LOG 
            this.setGaECTracking(o);

            this.closeDialog();
            document.cookie = `CHANNEL_ID0=;expires=${new Date(
              0
            )};path=/;domain=.shopping.friday.tw`;

            // 刷新購物車數字
            this.$emit('flushCartBag');

            // 不轉購物車頁
            if (!this.isBuyRedirect) {
              this.api.ui.alert.getFadeAlert("加入購物車成功!");
              return;
            }

            const cartUrl = this.siteData ? `/${this.siteData.urlSuffix}/shoppingcart` : '/shoppingcart';

            // 如果遠傳心生活流程 加上未登入 購物車加入成功後即轉id token hint 再到購物車頁
            if (!this.api.member.isLogin) {
              if (/wt\.mg_id=/i.test(location.search)) {
                window.location.href = this.api.member.loginUrl();
                return;
              }
            }

            // 轉購物車頁流程
            if (!this.directToCheckout) {
              window.location.href = cartUrl;
              return;
            }

            // 直接轉結帳行為
            const extendsObj = {};
            // 轉結帳頁 直接帶入遠傳幣動作
            if (/mg_id=fetmc_appfcoin/i.test(location.search)) {
              extendsObj["coinPreset"] = true;
            }
            if (this.configs.isRestrictCoinCheckout(this.pInfo)) {
              extendsObj["coinPreset"] = true;
              extendsObj["coinOnly"] = true;
            }
            extendsObj["pid"] = o.pid;
            extendsObj["qty"] = +this.cartBuyQuantity;

            // 轉購物車頁
            this.api.cart.directGoCheckoutProcess(extendsObj);
          } else if (res.resultCode === 1009) {
            this.api.ui.alert.getFadeAlert(res.resultMsg);
            this.isAddToCartLoading = false;
          } else {
            this.isAddToCartLoading = false;
            this.isfadeAlertOpen = true;
          }
        });
    },
    // 查詢個人遠傳幣
    async getFcoin() {
      return await this.api.member.getFetCoins().then((data) => {
        this.myFCoin = data;
        return true;
      });
    },
    // 查詢個人購物金
    async getVoucher() {
      return await this.api.member.queryVoucherBalance().then((data) => {
        this.myVoucher = data;
        return true;
      });
    },
    composeCartData(o) {
      let channelId;
      // 追縱碼
      // 一般導購 LINE、SHOPBACK ...etc
      const cId = document.cookie.match(/CHANNEL_ID0=([^;]+)/i);
      if (cId && cId[1] && cId[1] !== "fetmc_appbonus") {
        channelId = cId[1];
      }
      // 心生活 放大折ONLY
      const urlParams = new URLSearchParams(location.search);
      if (
        urlParams.get("WT.mg_id") &&
        urlParams.get("WT.mg_id") === "fetmc_appbonus" &&
        /ec-w/i.test(document.referrer)
      ) {
        channelId = urlParams.get("WT.mg_id");
      }

      let apiPayload = {
        channelId3: channelId,
        giftList: [],
        increaseList: [],
        productId: o.pid,
        quantity: +this.cartBuyQuantity,
        specId: +this.nowSelectedSpecId,
        subProductList: [],
      };

      // 贈品
      if (this.gifts && this.gifts.length > 0) {
        this.gifts.forEach((g) => {
          const qty = g.qty > g.quota * this.cartBuyQuantity ? g.quota : g.qty;
          apiPayload.giftList.push(g.aid + ":" + qty);
        });
      }

      // 加價購
      if (this.cartAdditional && this.cartAdditional.length > 0) {
        this.cartAdditional = this.cartAdditional.filter(
          (item) => item.qty > 0
        );
        this.cartAdditional.forEach((g) => {
          apiPayload.increaseList.push(g.aid + ":" + g.qty + ":" + g.price);
        });
      }

      // 組合商品
      if (this.comboInfo) {
        if (!this.cartCombo || this.cartCombo.some((v) => !v.isSelected)) {
          alert("請選擇組合商品規格");
          return false;
        }
        const subProductList = [];
        this.cartCombo.forEach((g) => {
          subProductList.push(`${g.pid}:${g.specId}:${g.qty}:${g.comboId}`);
          apiPayload.subProductList = subProductList;
        });
      }

      return apiPayload;
    },
    getCombo(data) {
      this.cartCombo = data;
      this.$emit("setCartComboData", data);
    },
    getAdditional(data) {
      this.cartAdditional = data;
    },
    setGaECTracking(obj) {
      const price = obj.price && obj.price.promoPrice || obj.price.memberPrice;
      this.api.ga.addToCart({...obj, qty: this.cartData.quantity, price});
    },
    goNotification() {
      this.$emit("sendProductNotification", {
        pid: this.pInfo.pid,
        specId: this.nowSelectedSpecId,
      });
    },
  },
};
</script>

<style lang="scss">
@import "../../style/color";

.cart-header {
  padding: 10px 0 5px 15px;
  display: flex;
  align-items: center;

  img {
    width: 3.2rem;
    height: 3.2rem;
    border-radius: 5px;
    margin-right: 5px;
  }

  span {
    flex: 0 1 80%;
    font-size: 1.4rem;
    font-weight: bold;
    text-align: start;
    line-height: 2rem;
  }
}

.cart-footer {
  border-top: 1px solid $web_border;
  padding: 8px;
  align-items: center;

  button {
    flex: 1 1 100%;
    padding: 8px 5px;
    border: none;
    border-radius: 10px;
    color: $white;
    font-size: 16px;
    text-align: center;
    background-color: $white;
  }

  .buyBtn {
    color: $red;
    border: 1px solid $red;
    margin-right: 5px;
  }

  .addCartBtn {
    background-color: $red;
  }

  .soldoutBtn {
    background-color: $special;
  }

  .confirmBtn {
    background-color: $red;
  }

  .givePriceBtn {
    background-color: $dodger-blue;
  }

  .notyetBtn {
    background-color: $special;
  }
}
</style>

<style lang="scss" scoped>
@import "../../style/color";

.cart-box {
  * {
    box-sizing: border-box;
  }

  ul {
    li {
      list-style-type: none;
      margin-bottom: 10px;

      .fcoin {
        color: $fcoin;
      }

      font {
        vertical-align: middle;
        font-size: 1.6rem;

        &.price {
          color: $pomegranate;
          font-size: 1.6rem;
        }

        &.currency {
          color: $pomegranate;
          font-size: 1.4rem;
        }
      }

      i {
        vertical-align: middle;
        margin-right: 3px;
      }
    }

    .price {
      > div {
        display: flex;
        align-items: baseline;

        > span {
          &:nth-of-type(2n) {
            padding: 0 2px;
          }

          &:nth-of-type(2) {
            margin-right: 15px;
          }
        }
      }

      &__price {
        font-size: 1.4rem;
        color: $gray;
      }

      &__promo-content {
        font-size: 1.6rem;
        margin-right: 5px;
        color: $black;
      }

      &__net-content {
        font-size: 1.4rem;
        margin-right: 5px;
        color: $black;
      }

      &__red-price {
        font-size: 2rem;
        color: $pomegranate;
      }

      &__list-price {
        display: block;
        color: $sliver;
        font-size: 1.2rem;
        display: flex;
        align-items: flex-end;
      }

      &__currency {
        color: $pomegranate;
        font-size: 1.6rem;
      }
    }

    .noPrice {
      color: $red;
      font-size: 1.5rem;
      margin-left: 5px;
    }

    .life {
      > div {
        display: flex;

        > span {
          &:nth-of-type(2n) {
            padding: 0 2px;
          }

          &:nth-of-type(2) {
            margin-right: 15px;
          }
        }
      }

      .list-price {
        display: block;
        color: $sliver;
        font-size: 1.2rem;
        display: flex;
        align-items: flex-end;
      }
    }
  }

  .cart-box-content {
    width: 100%;
    overflow-y: scroll;

    label {
      color: $web_minor;
      line-height: 50px;
    }

    .wrap {
      padding: 0 15px 0px 15px;
    }

    .items {
      .item {
        display: block;
        position: relative;
        margin-right: 10px;
        margin-bottom: 5px;
        padding: 5px 10px;
        border-radius: 8px;
        color: $web_main;
        border: 1px solid $web_border;
        font-size: 14px;
        word-break: break-all;
        word-wrap: break-word;

        &.disable {
          color: $web_border;
          border: 1px solid $web_border;
        }

        &.active {
          color: $red;
          border: 1px solid $red;
          border-bottom-right-radius: 0;
          background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDEyIDEyIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGc+CiAgICAgICAgICAgIDxnPgogICAgICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICAgICAgICAgIDxnPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGZpbGw9IiNGMzRGNTkiIGQ9Ik0xMiAwdjEwYzAgMS4xMDUtLjg5NSAyLTIgMkgwTDEyIDB6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTYuMDAwMDAwLCAtNTQ4LjAwMDAwMCkgdHJhbnNsYXRlKDAuMDAwMDAwLCAyMC4wMDAwMDApIHRyYW5zbGF0ZSgyMC4wMDAwMDAsIDQ2NS4wMDAwMDApIHRyYW5zbGF0ZSgwLjAwMDAwMCwgNDUuMDAwMDAwKSB0cmFuc2xhdGUoMzYuMDAwMDAwLCAxOC4wMDAwMDApIi8+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0xMC4zODYgNi4wMDJjLS4xNTYuMDExLS4zLjA4Ny0uNDA0LjIxbC0yLjI0NSAyLjU4LTEuMjM1LTEuMTE3Yy0uMjQ0LS4yMzUtLjYyMi0uMjE3LS44NDUuMDQtLjIyMy4yNTgtLjIwNi42NTguMDM4Ljg5M2wuMDMuMDI3TDcuNCAxMC4xNWMuMjQ1LjIyMi42MTIuMi44My0uMDVsMi42MzUtMy4wMzJjLjIyOC0uMjUzLjIxOS0uNjUzLS4wMi0uODkzLS4xMjMtLjEyNC0uMjktLjE4Ny0uNDYtLjE3MyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTU2LjAwMDAwMCwgLTU0OC4wMDAwMDApIHRyYW5zbGF0ZSgwLjAwMDAwMCwgMjAuMDAwMDAwKSB0cmFuc2xhdGUoMjAuMDAwMDAwLCA0NjUuMDAwMDAwKSB0cmFuc2xhdGUoMC4wMDAwMDAsIDQ1LjAwMDAwMCkgdHJhbnNsYXRlKDM2LjAwMDAwMCwgMTguMDAwMDAwKSIvPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+Cg==")
            right bottom no-repeat;
        }
      }
    }
  }
}

.linethrough {
  text-decoration: line-through;
}
</style>
