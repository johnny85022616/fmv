<template>
  <div :class="['shoppingcart-wrap', {'plus': shoppingCartPayload.cartTypeList && shoppingCartPayload.cartTypeList.length > 1}]">

    <div class="details">
      <div v-if="shoppingCartItems && shoppingCartItems.DOOR_TO_DOOR">
        <h3>宅配：</h3>
        <span v-html="doorMessage"></span>
      </div>
      <div v-if="shoppingCartItems && shoppingCartItems.DOOR_TO_STORE">
        <h3>超商/門市取貨：</h3>
        <span v-html="storeMessage"></span>
      </div>
      <div v-if="shoppingCartItems && shoppingCartItems.EXPRESS">
        <h3>快速到貨：</h3>
        <span v-html="expressMessage"></span>
      </div>

      <a @click="showCartDetail()">已選購({{cartCount}})</a>
    </div>

    <div class="spec-footer d-flex">
      <button @click="goCartPage()" class="addCartBtn" value="">結帳</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "shopppingcart",
  props: {
    shoppingCartPayload: {
      type: Object,
      default: () => null,
    },
  },
  computed: {
    shoppingCartItems() {
      return this.shoppingCartPayload.shoppingCartItems
        ? this.shoppingCartPayload.shoppingCartItems
        : {};
    },
    cartCount() {
      let count = 0;
      Object.keys(this.shoppingCartItems).forEach((cartKey) => {
        count += this.shoppingCartItems[cartKey].reduce((p, c) => {
          return [0, 5].indexOf(c.ptype) > -1 ? (p += c.qty) : p;
        }, 0);
      });
      return count;
    },
    doorMessage() {
      if (
        this.shoppingCartPayload.eventResult &&
        this.shoppingCartPayload.eventResult.DOOR_TO_DOOR
      ) {
        return this.checkCampaign(
          this.shoppingCartPayload.eventResult.DOOR_TO_DOOR
        );
      } else {
        return "&nbsp;";
      }
    },
    storeMessage() {
      if (
        this.shoppingCartPayload.eventResult &&
        this.shoppingCartPayload.eventResult.DOOR_TO_STORE
      ) {
        return this.checkCampaign(
          this.shoppingCartPayload.eventResult.DOOR_TO_STORE
        );
      } else {
        return "&nbsp;";
      }
    },
    expressMessage() {
      if (
        this.shoppingCartPayload.eventResult &&
        this.shoppingCartPayload.eventResult.EXPRESS
      ) {
        return this.checkCampaign(this.shoppingCartPayload.eventResult.EXPRESS);
      } else {
        return "&nbsp;";
      }
    },
  },
  methods: {
    showCartDetail() {
      this.$emit("showCart");
    },
    checkCampaign(eventRule) {
      const { priceAmount, count, fcoinAmount, needFee, offerDiscount } =
        eventRule;
      let message = "";

      // 判斷達門檻字樣
      const sellTypeTxt = needFee ? "免運" : "優惠";

      // 判斷是否達成門檻
      const isDiscountTxt = offerDiscount
        ? "已達" + sellTypeTxt
        : "未達" + sellTypeTxt;
      message = `已選 <font>${count}</font> 件，${isDiscountTxt}`;

      // 判斷金額顯示
      if (fcoinAmount > 0) {
        message += `，<font><i class="fcoin"></i>$${fcoinAmount}</font>`;
      } else if (priceAmount > 0) {
        message += `，<font>$${this.tools.priceFormat(priceAmount)}</font>`;
      }

      return message;
    },
    goCartPage() {
      const typeMap = {
        'DOOR_TO_DOOR': 1,
        'DOOR_TO_STORE': 2,
        'EXPRESS': 3,
      }
      const cartPage = this.tools.isMobile() ? '/shoppingcart' : '/ec2/shoppingcart'
      const singleCartPage = this.tools.isMobile() ? '/mobileweb/checkout/step1?cartType=' : '/ec2/shoppingcart?cartType='
      if (this.shoppingCartPayload.cartTypeList.length === 2) {
        window.location.href = cartPage;
      } else {
        window.location.href =
          singleCartPage + typeMap[this.shoppingCartPayload.cartTypeList[0]];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.shoppingcart-wrap {
  z-index: 5;
  position: fixed;
  bottom: 0;
  width: 100vw;
  min-height: 120px;
  background-color: #fff;

  &.plus {
    min-height: 170px;
  }

  * {
    box-sizing: border-box;
  }

  .details {
    position: relative;
    padding: 10px;
    font-size: 14px;
    border-top: 1px solid #efefef;

    div {
      &:first-child {
        margin-bottom: 5px;
      }
    }

    h3 {
      color: #558fff;
    }

    .price {
      color: #f5281e;
    }

    a {
      display: inline-block;
      position: absolute;
      top: 10px;
      right: 10px;
      width: 75px;
      border: 1px solid #3c3c3c;
      border-radius: 15px;
      font-size: 12px;
      line-height: 25px;
      text-align: center;
      background-color: #ffffff;
    }
  }

  .spec-footer {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    align-items: center;
    width: 100%;
    padding: 8px;
    border-top: 1px solid #efefef;

    button {
      flex: 1 1 100%;
      padding: 8px 5px;
      border: none;
      border-radius: 10px;
      color: #ffffff;
      font-size: 16px;
      text-align: center;
      background-color: #f34f59;
    }
  }
}
</style>

<style lang="scss">
.shoppingcart-wrap {
  i.fcoin {
    position: relative;
    top: 5px;
  }

  font {
    color: #f34f59;
  }
}
</style>
