<template>
<div class="container">
  <div class="contentArea">
    <div class="title">選購明細</div>
    <div class="content">
      <div
        class="closeBtn"
        @click="close"
      ><i class="close"></i></div>
      <div v-if="shipOptions.length > 1" class="options_box">
        <ul>
          <li v-for="(item, index) of shipOptions" :key="index" :class="[{
            'active': nowShipOption === item
          }]" @click="setShipOption(item)">
            {{shipOptionsDisplay[item]}}
          </li>
        </ul>
      </div>
      <div class="info_box" :style="getScrollHeight">
        <ul v-if="products.length > 0">
          <li v-for="(item, index) of products" :key="index">
            <div>
              <div>
                <img :src="item.imgpath" />
                <span v-if="item.gType == '1' && item.ptype === 5" class="label-red">
                  <i class="label-red"></i>紅標
                </span>
                <span v-else-if="item.gType == '2' && item.ptype === 5" class="label-green">
                  <i class="label-green"></i>綠標
                </span>
              </div>
              <div>
                <span class="name">{{item.name}}</span>
                <span class="price" v-html="getPriceDisplay(item)"></span>
                <span class="specname">{{item.specname}}</span>
                <span class="quantity">x {{item.qty}}</span>
                <span @click="deleteItem(item)" class="delete"><i class="delete"></i></span>
              </div>
            </div>
          </li>
        </ul>
        <p v-else class="no-product">目前無選購商品</p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'cartdetail',
  data() {
    return {
      nowShipOption: 'DOOR_TO_DOOR',
      shipOptions: [],
      shipOptionsDisplay: {
        'DOOR_TO_DOOR': '宅配',
        'DOOR_TO_STORE': '超商/門市取貨'
      }
    }
  },
  props: {
    shoppingCartPayload: {
      type: Object,
      default: () => {}
    }
  },
  created () {
    this.shipOptions = this.shoppingCartPayload.cartTypeList
    this.nowShipOption = this.shoppingCartPayload.cartTypeList[0]
  },
  methods: {
    deleteItem(obj) {
      this.$emit('deleteCartItem', obj)
    },
    getPriceDisplay(obj) {
      let output = `$${obj.price}`
      
      if (obj.payformRadio === 'LIFE_PARTIAL_POINT' && obj.lifePartialPoint > 0 && obj.lifePartialPrice > 0) {
        output = `<i class="fcoin"></i>${obj.lifePartialPoint} + ${obj.lifePartialPrice}`
      }
      if (obj.payformRadio === 'LIFE_EXCHANGE_POINT' && obj.lifeExchangePoint > 0) {
        output = `<i class="fcoin"></i>${obj.lifeExchangePoint}`
      }

      return output
    },
    setShipOption(v) {
      this.nowShipOption = v
    },
    close() {
      this.$emit("closeShowCartDetail");
    },
  },
  computed: {
    shoppingCartItems() {
      return this.shoppingCartPayload.shoppingCartItems ? this.shoppingCartPayload.shoppingCartItems : {}
    },
    products() {
      let p = []
      if (this.shoppingCartItems[this.nowShipOption]) {
         p =this.shoppingCartItems[this.nowShipOption].filter(v => [0, 5].indexOf(v.ptype) > -1)
      }
      return p
    },
    getScrollHeight() {
      const o = {}
      const gap = this.shipOptions.length > 1 ? 42 : 0
      o['max-height'] = (window.innerHeight - 47 - gap) + "px";
      o['overflow'] = 'auto';
      return o
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../../style/color';

.container {
  * {
    box-sizing: border-box;
  }

  .contentArea {
    z-index: 103;
    position: fixed;
    bottom: 0;
    width: 100vw;
    height: 100%;
    background-color: $white;
    box-shadow: 0 0 25px rgba(0, 0, 0, .4);
    transition: all 0.5s;

    .title {
      padding: 12px 8px;
      border-bottom: solid 1px $alto;
      color: $web_main;
      font-weight: bold;
      font-size: 16px;
      text-align: center;
    }

    .content {
      .closeBtn {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 20px;
        height: 20px;
      }

      .options_box {
        ul {
          display: flex;
          justify-content: center;
          align-items: center;
          li {
            flex: 1 1 50%;
            list-style-type: none;
            color: $web_main;
            font-size: 1.4rem;
            line-height: 40px;
            text-align: center;
            border-bottom: 1px solid $alto;
            &.active {
              border-bottom: 2px solid $red;
              color: $red;
            }
          }
        }
      }

      .info_box {
        font-size: 1.4rem;
        font-weight: normal;
        .no-product {
          text-align: center;
          font-size: 1.7rem;
          color: $web_minor;
          padding-top: 50px;
        }
        ul {
          padding: 0 10px;
          li {
            padding: 8px 12px;
            border-bottom: 1px solid $web_border;
            >div {
              display: flex;
              >div {
                &:first-child {
                  flex: 1 1 25%;
                  span {
                    display: flex;
                    align-items: center;
                    &.label-red {
                      color: $red;
                    }
                    &.label-green {
                      color: $special;
                    }
                    i {
                      margin-right: 5px;
                    }
                  }
                }
                &:last-child {
                  position: relative;
                  flex: 1 1 75%;
                  padding-left: 5px;
                }
              }
            }
            img {
              width: 82px;
              height: 82px;
              border: 1px solid $web_bg_hover;
            }
            span.name {
              display: inline-block;
              width: 90%;
              overflow:hidden;
              text-overflow: ellipsis;
              word-break: break-all;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
            span.price {
              display: inline-block;
              width: 100%;
              color: $red;
              font-weight: 500;
              font-size: 1.6rem;
            }
            span.specname {
              display: inline-block;
              width: 90%;
              padding-top: 10px;
              height: 20px;
            }
            span.delete {
              position: absolute;
              top: 3px;
              right: 0px;
            }
            span.quantity {
              position: absolute;
              bottom: 0px;
              right: 0px;
            }
          }
        }
      }
    }
  }
}
</style>
