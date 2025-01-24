<template>
  <div class="purchaseListDialog">
    <fullscreendialog :isFullscreen="true" @closeDialog="closeDialog">
      <template v-slot:header>訂購商品明細</template>
      <template v-slot:body>
        <ul class="orderList" v-if="cartList">
          <li class="order" v-for="(order,idx) in cartList" :key="idx">
            <ul v-if="order.mainProducts" class="productList">
              <li v-for="mainPrd in order.mainProducts" :key="mainPrd.itemId">
                <div class="productInfo">
                  <img :src="mainPrd.images">
                  <div class="info">
                    <div>
                      <p class="name">{{mainPrd.name}}</p>
                      <div class="flex">
                        <p class="price">${{mainPrd.price}}</p>
                        <p class="promoFont gray" v-if="mainPrd.priceObj.promoPrice">(折扣後)</p>
                      </div>
                    </div>
                    <div class="spec">
                      <p>{{mainPrd.specName || ''}}</p>
                      <p>x{{mainPrd.quantity}}</p>
                    </div>
                  </div>
                </div>
                <!-- 加購品 -->
                <div class="additionalProducts" v-if="mainPrd.additionalProducts && mainPrd.additionalProducts.length>0">
                  <p class="title">加購以下商品：</p>
                  <div v-for="addPrd in mainPrd.additionalProducts" :key="addPrd.itemId">
                    <div class="productInfo">
                      <img :src="addPrd.images">
                      <div class="info">
                        <div>
                          <p class="name">{{addPrd.name}}</p>
                          <p class="name">${{addPrd.price}}</p>
                        </div>
                        <div class="spec">
                          <p>{{addPrd.specName || ''}}</p>
                          <p>x{{addPrd.quantity}}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 組合商品 -->
                <div class="extraPrd" v-if="mainPrd.comboProducts && mainPrd.comboProducts.length>0">
                  <p class="title">本組合包含以下商品：</p>
                  <div v-for="comboPrd in mainPrd.comboProducts" :key="comboPrd.itemId">
                    <div class="productInfo">
                      <img :src="comboPrd.images">
                      <div class="info">
                        <div>
                          <p class="name">{{comboPrd.name}}</p>
                        </div>
                        <div class="spec">
                          <p>{{comboPrd.specName || ''}}</p>
                          <p>x{{comboPrd.quantity}}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 贈品 -->
                <div class="extraPrd" v-if="mainPrd.giftProducts && mainPrd.giftProducts.length>0">
                  <p class="title">包含以下贈品：</p>
                  <div v-for="giftPrd in mainPrd.giftProducts" :key="giftPrd.itemId">
                    <div class="productInfo">
                      <img :src="giftPrd.images">
                      <div class="info">
                        <div>
                          <p class="name">{{giftPrd.name}}</p>
                        </div>
                        <div class="spec">
                          <p>{{giftPrd.specName || ''}}</p>
                          <p>x{{giftPrd.quantity}}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
        <div class="submitBtn">
          <span @click="closeDialog">確認</span>
        </div>
      </template>
    </fullscreendialog>
  </div>
</template>

<script>
import fullscreendialog from "../common/fullscreenDialog.vue"; // 全畫面蓋版提示框

export default {
  name: "purchaseListDialog",
  data() {
    return {};
  },
  methods: {
    //關閉popup
    closeDialog() {
      this.$emit("closePurchaseListDialog");
    },
    getMainPrdDiscount(dicountObj) {
      const arr = Object.values(dicountObj).filter((ele) => {
        return ele > 0;
      });
      if (arr && arr.length > 0) {
        return arr[0];
      }
      return 0;
    },
  },
  props: {
    cartList: {
      type: Array,
    },
  },
  created() {},
  components: {
    fullscreendialog,
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";
@import "../../style/tailwind.module.scss";

.purchaseListDialog {
  .orderList {
    padding: 10px 20px;
    list-style-type: none;
    margin-bottom: 60px;
    .order {
      margin-bottom: 40px;
    }
    .productList {
      list-style-type: none;
      li {
        .productInfo {
          display: flex;
          padding: 10px 0;

          img {
            width: 90px;
            height: 90px;
            min-width: 90px;
            min-height: 90px;
            border: solid 1px #fafafa;
            box-sizing: border-box;
          }

          .info {
            margin-left: 10px;
            display: flex;
            flex-grow: 1;
            flex-direction: column;
            justify-content: space-between;
            p {
              line-height: 18px;
              margin-bottom: 7px;
              font-weight: 400;
            }

            .price {
              font-size: 18px;
            }
            .promoFont {
              margin-left: 3px;
              font-size: 1.3rem;
            }

            .spec {
              display: flex;
              justify-content: space-between;
              p {
                margin-bottom: 0;
              }
            }
          }
        }

        .extraPrd,
        .additionalProducts {
          color: $sliver;
          font-size: 14px;
          margin-bottom: 10px;
        }
      }
    }
  }

  .tagArea {
    margin: 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .content {
      display: flex;
      align-items: center;

      .icon {
        padding: 5px;
        border-radius: 5px;
        font-weight: bold;
        margin-right: 5px;
      }
    }

    &.coupon {
      color: red;

      .icon {
        border: 1px solid $red;
      }
    }
    &.shipFee {
      color: $special;

      .icon {
        border: 1px solid $special;
      }
    }

    &.freebie {
      color: $special;

      .icon {
        border: 1px solid $special;
      }

      p {
        &:nth-of-type(2) {
          color: $black;
        }
      }

      .quantity {
        color: $black;
      }
    }
  }

  .submitBtn {
    width: 100%;
    height: 60px;
    line-height: 60px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: $white;
    text-align: center;
    border-top: 1px solid #e0e0e0;

    span {
      display: inline-block;
      width: 92%;
      height: 40px;
      background-color: $red;
      color: $white;
      line-height: 40px;
      text-align: center;
      border-radius: 10px;
    }
  }
  .gray {
    color: $sliver;
  }
}
</style>
