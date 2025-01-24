<template>
  <div class="cart">
    <div v-if="isFridaySite" class="cart-logo">
      <a href="/" title="friDay購物" :class="['logo', { fetnet: api.web.isFetnetSource() }]"></a>
    </div>
    <div v-else class="cart-logo bsite" :style="{ backgroundColor: `${siteData.headerColor ? siteData.headerColor : '#ddd5cc'}` }">
      <a :href="`/${siteData.urlSuffix}`" class="logo"><img :src="siteData.logoMobile" alt=""></a>
      <span></span>
    </div>
    <template v-if="isEmptyCart">
      <div class="cart-empty">
        您還沒有選購任何商品！ <a :href="homepageUrl">快去逛逛吧！</a>
      </div>
    </template>
    <template v-else>
      <!-- 宅配 -->
      <div v-if="homeFilter.length" class="cart-home">
        <div>
          <div v-for="item of homeFilter" :key="item.itemRandomId">
            <cartItem :item="item" :inUsedCoupon="inUsedCoupon" cartType="home" @setCartStatus="getCartStatus" @setInUsedCoupon="getInUsedCoupon" />
          </div>
        </div>

        <div class="cart-checkbox">
          <div>
            <label>
              <i :class="['checkbox', { checked: selectedAllStatus['home'] }]" @click="chooseAllItem('home')"></i>全部
            </label>
          </div>
          <discountCode @initCart="initCart" />
        </div>
        <div class="cart-discounts">
          <div>
            <p class="cart-discounts__product-amount">
              商品總金額：<span><b>{{ tools.priceFormat(amountData.home.skuAmount - amountData.home.shipAmount)}}</b></span>
            </p>
            <p v-if="amountData.home.shipAmount" class="cart-discounts__total-amount">
              運費：<span><b>{{ amountData.home.shipAmount }}</b></span>
            </p>
            <p v-if="amountData.home.discountAmount" class="cart-discounts__discount-amount">
              AI運算最佳折扣
              <a @click="setHomeDiscountsShow">
                詳
              </a>，商品共折扣：<span class="price minus">{{
        tools.priceFormat(amountData.home.discountAmount)
      }}</span>
            </p>
            <!-- 折扣PopUp -->
            <div v-if="isHomeDiscountsShow" class="homeDiscountPopup" v-html="homeDiscountsWording" />
            <p class="cart-discounts__total-amount">
              總金額：<span><b>{{ tools.priceFormat(amountData.home.skuAmount - amountData.home.discountAmount)
                  }}</b></span>
            </p>
          </div>
        </div>
        <div class="cart-btns home">
          <div></div>
          <div v-if="storeFilter.length" @click="goCheckout(1)">宅配結帳》</div>
          <div v-else @click="goCheckout(1)">結帳》</div>
        </div>
      </div>
      <!-- 超取 -->
      <div v-if="storeFilter.length" class="cart-home">
        <div>
          <div v-for="item of storeFilter" :key="item.itemRandomId">
            <cartItem :item="item" :inUsedCoupon="inUsedCoupon" cartType="store" @setCartStatus="getCartStatus" @setInUsedCoupon="getInUsedCoupon" />
          </div>
        </div>

        <div class="cart-checkbox">
          <div>
            <label>
              <i :class="['checkbox', { checked: selectedAllStatus['store'] }]" @click="chooseAllItem('store')"></i>全部
            </label>
          </div>
          <discountCode @initCart="initCart" />
        </div>
        <div class="cart-discounts">
          <div>
            <p class="cart-discounts__product-amount">
              商品總金額：<span><b>{{ tools.priceFormat(amountData.store.skuAmount -  amountData.store.shipAmount)}}</b></span>
            </p>
            <p v-if="amountData.store.shipAmount" class="cart-discounts__total-amount">
              運費：<span><b>{{ amountData.store.shipAmount }}</b></span>
            </p>
            <p v-if="amountData.store.discountAmount" class="cart-discounts__discount-amount">
              AI運算最佳折扣
              <a @click="setStoreDiscountsShow">
                詳
              </a>，商品共折抵：<span class="price minus">{{
        tools.priceFormat(amountData.store.discountAmount)
      }}</span>
            </p>
            <!-- 折扣PopUp -->
            <div v-if="isStoreDiscountsShow" class="homeDiscountPopup" v-html="storeDiscountsWording" />
            <p class="cart-discounts__total-amount">
              總金額：<span><b>{{ tools.priceFormat(amountData.store.skuAmount - amountData.store.discountAmount)
                  }}</b></span>
            </p>
          </div>
        </div>
        <div class="cart-btns store">
          <div></div>
          <div @click="goCheckout(2)">超取結帳》</div>
        </div>
      </div>

      <!-- history items -->
      <div>
        <template>
          <div v-for="item of historyFilter" :key="item.itemRandomId" class="cart-history-items">
            <cartItem v-if="item.isCanMoveUp && !item.isSelected" :item="item" :inUsedCoupon="inUsedCoupon" cartType="home" @setCartStatus="getCartStatus" @setInUsedCoupon="getInUsedCoupon" />
          </div>
        </template>
      </div>

      <div v-if="isCartApiLoaded" class="cart-keep-shop">
        <a :href="homepageUrl">選購更多商品》</a>
      </div>
    </template>

    <Footer v-if="isCartApiLoaded" :isDark="false" />
  </div>
</template>
<script>
import cartItem from "./components/shoppingcart/cartItem.vue";
import discountCode from "./components/shoppingcart/discountCode.vue";

export default {
  name: "shoppingcart",
  data() {
    return {
      isFridaySite: true, // 是否為friDay 主站 OR B網
      isEmptyCart: false, // 是否購物車沒有資料
      isCartApiLoaded: false, // 是否購物車API已取
      today: new Date().toLocaleDateString(), // 今天日期
      cartItems: [], // 購物車商品資料
      amountData: {
        home: {
          skuAmount: 0, // 商品價格合計
          discountAmount: 0, // 折扣合計
          discountObj: {}, // 集合折扣物件
          shipAmount: 0, //運費總計
        },
        store: {
          skuAmount: 0, // 商品價格合計
          discountAmount: 0, // 折扣合計
          discountObj: {}, // 集合折扣物件
          shipAmount: 0, //運費總計
        },
      },
      isHomeDiscountsShow: false, // 是否顯示宅配折扣POPUP
      isStoreDiscountsShow: false, // 是否顯示超取折扣POPUP
      personalPeriodCoupon: {}, // 個人對品折價劵資料
      selectedAllStatus: {
        home: false, // 是否選擇全部宅配商品
        store: false, // 是否選擇全部超取商品
      },
      inUsedCoupon: [], // 收集已選折價卷ID，作為不同cartItem組件排除重複選擇
      pidNamePool: [], // PID 對應品名
      campaignInfoPool: {}, // 活動集合
      myCampaignIds: [], // 個人已領取的活動
    };
  },
  components: {
    cartItem,
    discountCode,
  },
  async created() {
    if (!this.api.member.isLogin) {
      window.location.href = this.api.member.loginUrl();
      return;
    }

    if (this.siteData) this.isFridaySite = false;

    // 取購物車資料
    this.initCart();
  },
  methods: {
    async initCart() {
      this.myCampaignIds = await this.api.campaign.getMyCampaigns();

      // 取購物車資料
      const cartData = await this.api.cart.getCart(null, this.myCampaignIds);
      if (!cartData) {
        this.isEmptyCart = true;
        return;
      }
      const { dbCartData, campaignInfoPool, pidNamePool } = cartData;

      this.campaignInfoPool = campaignInfoPool;
      this.pidNamePool = pidNamePool;

      // 購物車商品資料
      this.cartItems = this.formatCartData(dbCartData);

      this.isCartApiLoaded = true;
      this.calcTotalAmount();

      // GA4
      this.api.ga.viewCart(this.cartItems);
    },
    formatCartData(data) {
      const newData = data.map((v, i) => {
        // const isToday = this.today === new Date(v.createDate).toLocaleDateString();
        // v["isTodayAdded"] = isToday; // 是否為當天加入的商品
        // v["isCanMoveUp"] = !isToday; // 非當天資料 是否可以移動至當天結帳
        // v["isSelected"] = isToday; // 是否選取準備結帳

        // 過濾需全額付款的商品，不陳列在購物車中
        v.mainProducts = v.mainProducts.filter(c => !c.isFullRedeem);

        v.mainProducts.forEach((g) => {
          const isToday =
            this.today === new Date(g.createDate).toLocaleDateString();
          // 設定商品是否被選取 (若是今天則勾選) , 或 第一品項
          g["isSelected"] = isToday && !g.isSoldOut || i === 0 && !g.isSoldOut;

          // 該商品在AI_HS Cookie資料中，可用對品折價劵
          if (this.personalPeriodCoupon[g.productId]) {
            g["periodCouponAmount"] = this.personalPeriodCoupon[g.productId];
          }
        });
        return v;
      }).filter(a => a.mainProducts.length > 0);

      // 過去單一個商品的情境則加入就預勾
      if (newData.length === 1) newData[0].isSelected = true;

      return newData;
    },
    // 設定商品核取
    getCartStatus(action, data) {
      const dataIdx = this.cartItems.findIndex(
        (v) => v.itemRandomId === data.itemRandomId
      );

      switch (action) {
        case "checkbox":
          data["isSelected"] = !data["isSelected"];
          this.$set(this.cartItems, dataIdx, data);
          // 重新計算金額
          this.calcTotalAmount();
          break;
        case "updateShipFee":
          this.$set(this.cartItems, dataIdx, data);
          // 重新計算金額
          this.calcTotalAmount();
          break;
        case "updateQuantity":
          // 重新計算金額
          this.calcTotalAmount();
          break;
        case "deleteCartItem":
          this.deleteCartItem(dataIdx, data);
          break;
      }
    },
    // 設定已使用的折價卷ID
    getInUsedCoupon(addId, removeId) {
      // 若有舊ID 則先刪除
      if (this.inUsedCoupon.includes(removeId))
        this.inUsedCoupon.splice(this.inUsedCoupon.indexOf(removeId), 1);
      // 新折價卷ID不為0則儲存
      if (addId !== 0) this.inUsedCoupon.push(addId);
    },
    // 刪除購物車商品
    async deleteCartItem(dataIdx, itemObj) {
      const res = await this.api.cart.delCart(itemObj.itemId);
      if (res) {
        this.cartItems[dataIdx].mainProducts.splice(itemObj.productIdx, 1);
        if (this.cartItems[dataIdx].mainProducts.length === 0) {
          this.$delete(this.cartItems, dataIdx);
        }
        this.calcTotalAmount();
        window.sessionStorage.removeItem("cart_bag_count");
      } else {
        alert("刪除購物車異常，請稍候再操作");
      }
    },
    // 全選商品
    chooseAllItem(cartType) {
      const cartKey = cartType === "home" ? 1 : 2;
      this.selectedAllStatus[cartType] = !this.selectedAllStatus[cartType];
      this.cartItems.forEach((v) => {
        if (v.cartType === cartKey) {
          v.mainProducts.forEach(
            (c) => (c.isSelected = this.selectedAllStatus[cartType])
          );
        }
      });
      this.calcTotalAmount();
    },
    // 計算商品、折扣、運費顯示金額
    async calcTotalAmount() {
      let homeAmount = 0,
        homeDiscount = 0,
        storeAmount = 0,
        storeDiscount = 0,
        homeShipAmount = 0,
        storeShipAmount = 0;

      // 宅配
      this.cartItems.forEach((v) => {
        let itemSelected = false;

        v.mainProducts.forEach((g) => {
          if (g.isSelected) {
            itemSelected = true;
            let amount = 0,
              discount = 0;

            const { memberPrice, promoPrice } = g.priceObj;
            const price = promoPrice || memberPrice;
            amount += price * g.quantity;

            // 加總 加購品
            g.additionalProducts.forEach((x) => {
              if (x.price) amount += x.price * x.quantity;
            });
            // 加總折扣
            Object.values(g.discounts).forEach((d) => {
              discount += d;
            });

            if (v.cartType !== 2) {
              homeAmount += amount;
              homeDiscount += discount;
            } else {
              storeAmount += amount;
              storeDiscount += discount;
            }
          }
        });

        // 運費
        if (itemSelected) {
          if (v.cartType === 1) {
            homeAmount += v.shipFee;
            homeShipAmount += v.shipFee;
          } else {
            storeShipAmount += v.shipFee;
            storeAmount += v.shipFee;
          }
        }
      });
      this.amountData.home.skuAmount = homeAmount;
      this.amountData.home.shipAmount = homeShipAmount;
      this.amountData.store.skuAmount = storeAmount;
      this.amountData.store.shipAmount = storeShipAmount;
      // 判斷價格是否大於0，決定是否要取條件折扣運算
      if (homeAmount > 0) {
        const apiDiscount = await this.api.cart.getBestProductDiscount(
          this.cartItems,
          1,
          this.myCampaignIds
        );
        if (apiDiscount) {
          homeDiscount += apiDiscount.totalDiscount;
          this.amountData.home.discountObj = apiDiscount;
        } else {
          this.amountData.home.discountObj = {};
        }
      }
      if (storeAmount > 0) {
        const apiDiscount = await this.api.cart.getBestProductDiscount(
          this.cartItems,
          2,
          this.myCampaignIds
        );
        if (apiDiscount) {
          storeDiscount += apiDiscount.totalDiscount;
          this.amountData.store.discountObj = apiDiscount;
        } else {
          this.amountData.store.discountObj = {};
        }
      }

      this.amountData.home.discountAmount = homeDiscount;
      this.amountData.store.discountAmount = storeDiscount;

      this.isHomeDiscountsShow = false;
      this.isStoreDiscountsShow = false;
    },
    // 前往結帳
    async goCheckout(cartType) {
      const cartItems = this.cartItems.filter((v) => v.cartType === cartType);
      if (
        cartItems.every((v) => {
          return v.mainProducts.every((g) => !g.isSelected);
        })
      ) {
        alert("請先選擇商品進行結帳");
        return;
      }

      // 儲存結帳需要的資料
      const cartName = cartType === 1 ? "home" : "store";
      const cartDiscountData = this.amountData[cartName].discountObj;
      if (cartType === 1) {
        cartDiscountData.discountWording = this.homeDiscountsWording;
      } else {
        cartDiscountData.discountWording = this.storeDiscountsWording;
      }

      // 檢查商品庫存
      const isPass = await this.api.cart.checkReadyBuyCartStock(
        this.cartItems,
        cartType
      );
      if (!isPass) return;

      this.api.cart.cartForSessionStorage(
        this.cartItems,
        cartDiscountData,
        cartType
      );

      // GA4
      this.api.ga.beginCheckout();

      // 轉結帳頁
      window.location.href = this.isFridaySite
        ? "/checkout"
        : "/" + this.siteData.urlSuffix + "/checkout";
    },
    setHomeDiscountsShow() {
      this.isHomeDiscountsShow = !this.isHomeDiscountsShow;
    },
    setStoreDiscountsShow() {
      this.isStoreDiscountsShow = !this.isStoreDiscountsShow;
    },
    // 解析折扣文案
    parseDiscountWording(campaigns) {
      return campaigns
        ? campaigns.reduce((p, c) => {
            let matchName = "";
            c.pids.forEach((p) => {
              matchName += this.pidNamePool[p].name + "<br>";
            });
            return (p += `<p><b>${
              this.campaignInfoPool[c.campaignId].campaignName
            }</b><font class="price minus">${
              c.discount
            }</font></p><p class="pinfo">符合商品如下：<br>${matchName}</p>`);
          }, "")
        : "";
    },
  },
  watch: {},
  computed: {
    homeFilter() {
      return this.cartItems.filter(
        (v) => [1, 3].includes(v.cartType)
        // 區分是否有勾選或今天加入的
        // (v) => [1, 3].includes(v.cartType) && (v.isTodayAdded || v.isSelected)
      );
    },
    homeDiscountsWording() {
      const { discountObj } = this.amountData.home;
      if (!discountObj) return "";
      const { campaigns } = discountObj;
      return this.parseDiscountWording(campaigns);
    },
    storeDiscountsWording() {
      const { discountObj } = this.amountData.store;
      if (!discountObj) return "";
      const { campaigns } = discountObj;
      return this.parseDiscountWording(campaigns);
    },
    storeFilter() {
      return this.cartItems.filter(
        (v) => v.cartType === 2
        // 區分是否有勾選或今天加入的
        // (v) => v.cartType === 2 && (v.isTodayAdded || v.isSelected)
      );
    },
    historyFilter() {
      return [];
      // 只回傳不是今天加入的
      // return this.cartItems.filter((v) => !v.isTodayAdded);
    },
    homepageUrl() {
      return this.isFridaySite ? "/" : "/" + this.siteData.urlSuffix;
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
@import "./style/color.scss";
@import "./style/mixin";

*:focus {
  outline: none;
}

input,
button {
  border: unset;
}

html {
  font-size: 10px;

  body {
    max-width: 1200px;
    margin: 0 auto !important;

    a {
      color: $elf-green;
    }

    [class$="Tag"] {
      line-height: 16px;
    }

    [class$="Box"].mtb10 {
      display: flex;
    }
  }
}

.cart {
  padding-top: 0;

  &-empty {
    width: 100%;
    text-align: center;
    font-size: 1.7rem;
    margin-top: 100px;
  }

  &-keep-shop {
    text-align: center;
    font-size: 1.5rem;
    margin: 30px 0 100px;
    a {
      text-decoration: none;
    }
  }

  &-history-items {
    opacity: 0.6;
  }

  &-home,
  &-store {
    margin-bottom: 20px;
  }

  &-logo {
    border-bottom: 1px solid $gray;
    padding: 17px;
    box-sizing: border-box;

    .logo {
      width: 240px;
      height: 42px;
      background-image: url(./images/friday.svg);
      background-repeat: no-repeat;
      background-position-x: -65px;
      display: inline-block;

      &.fetnet {
        width: 240px;
        background-position: center;
      }
    }

    span {
      font-size: 2rem;
    }
    &.bsite {
      .logo {
        background-image: none;
        img {
          width: 100px;
        }
        i {
          display: inline-block;
          width: 100%;
        }
      }
    }
  }

  &-amount,
  &-btns {
    color: $dune;
    font-size: 1.5rem;
    padding: 5px 40px;
    box-sizing: border-box;
  }

  &-amount {
    padding: 10px 40px;
    margin-top: 5px;

    p,
    div {
      display: flex;
      justify-content: space-between;
    }

    p {
      margin: 10px 0;
    }

    div {
      border-top: 1px solid $sliver;
      padding: 10px 0;

      .price {
        font-size: 1.8rem;

        &::before {
          font-size: 1.6rem;
        }
      }
    }
  }

  &-btns {
    width: 100%;
    background-color: $white;
    border-bottom: 2px solid $sliver;
    padding: 0;
    display: flex;

    > div {
      display: flex;

      &:first-child {
        width: 70%;
        padding: 5px 20px;
        box-sizing: border-box;
        align-items: center;
        justify-content: space-between;

        label {
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          gap: 5px;

          i {
            width: 18px;
            height: 18px;
            margin: 0;
          }
        }

        p {
          text-align: end;

          &:first-child {
            color: $pomegranateapprox;
            font-size: 1.4rem;
          }

          &:last-child {
            span {
              font-size: 1.8rem;
              margin-left: 5px;

              b::before {
                content: "$";
                font-size: 1.4rem;
                margin-right: 2px;
              }
            }
          }
        }
      }

      &:last-child {
        color: $white;
        background-color: $red;
        font-size: 1.5rem;
        width: 30%;
        height: 35px;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
    }
  }
  &-btns {
    width: 100%;
    &.store {
      > div {
        &:last-child {
          background-color: #90b772;
        }
      }
    }
  }

  &-checkbox {
    padding: 10px;
    position: relative;
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    > div {
      label {
        display: flex;
        i {
          margin-right: 3px;
        }
      }
    }
  }

  &-discounts {
    > div {
      width: 100%;
      font-size: 1.5rem;
      box-sizing: border-box;
      padding: 10px;

      > p {
        text-align: end;
      }
    }

    &__product-amount {
      span {
        margin-left: 5px;

        b {
          color: $pomegranateapprox;
        }

        b::before {
          content: "$";
          margin-right: 2px;
        }
      }
    }

    &__discount-amount {
      a {
        cursor: pointer;
        text-decoration: underline;
        position: relative;
      }
    }

    &__total-amount {
      font-size: 1.5rem;

      span {
        font-size: 1.7rem;

        b::before {
          content: "$";
        }
      }
    }
  }
}

.homeDiscountPopup {
  padding: 5px 10px;
  border-radius: 10px;
  margin: 5px 0;
  box-shadow: rgba(99, 99, 99, 0.4) 0px 2px 8px 0px;
  p {
    align-items: flex-start;
    display: flex;
    justify-content: space-between;
    padding: 2px 0;
    text-align: left;

    font {
      flex: 1 1 30%;
      text-align: right;
    }

    &.pinfo {
      font-size: 1.3rem;
    }
  }
}

.price {
  color: $pomegranateapprox;
  font-size: 1.6rem;
  font-weight: bold;

  &.minus::before {
    content: "－$";
  }

  &.plus::before {
    content: "＋$";
  }
}
</style>
