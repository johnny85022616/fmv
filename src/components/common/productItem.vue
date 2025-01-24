<template>
<div>
  <div :class="listClass">
    <div
      :class="itemClass"
      v-for="(item, index) in itemList"
      :key="index">
      <div v-if="item.price > 0" class="items-wrap">
        <a href="" @click="tools.goProductPage($event, item.pid, item, targetHandle)" :class="[{
        'search-border': item.fullInfoStyle
      }, {'ga-event': item.fullInfoStyle}]" v-bind="trackingCode(item.name)">
          <div class="items-img">
            <img v-if="item.restricted" src="/static/images/18+.svg">
            <img v-else v-lazy="item.img">
            <span v-if="item.soldout" class="squaremask">
              <font>補貨中</font>
            </span>
            <span v-if="cartItems.indexOf(item.pid) > -1" class="circlemask">
              <font>已加入購物車</font>
            </span>
          </div>
          <div class="items-txt">
            <span class="promotion">{{ item.promotion }}</span>
            <span class="pname" v-html="item.name"></span>
            <template v-if="item.payMethodList">
              <template v-if="item.payMethodList[0] === 'CASH'">
                <span v-if="typeof item.promo_price === 'number'" class="price-box">
                  <font class="price-before">{{ item.pricePrefix }}</font>
                  <div class="promo-price">
                    <span class="promo-price__content">折扣後</span>
                    <font>{{productPrice(item.promo_price)}}</font>
                  </div>
                  <font class="price-after">{{ item.priceSuffix }}</font>
                </span>
                <span v-else class="price-box">
                  <font class="price-before">{{ item.pricePrefix }}</font>
                  <font class="price">{{ productPrice(item.price) }}</font>
                  <font class="price-after">{{ item.priceSuffix }}</font>
                </span>
              </template>
              <template v-else>
                <span v-if="item.payMethodList[0] === 'LIFE_PARTIAL_POINT'" class="price-box fcoin">
                  <i class="fcoin"></i>
                  <font class="price coin">{{ priceFormat(item.rewardPointInfo.lifePartialPoint) }}</font>
                  <font class="plus">+</font>
                  <font class="price">{{ priceFormat(item.rewardPointInfo.lifePartialPrice) }}</font>
                </span>
                <span v-else class="price-box fcoin">
                  <i class="fcoin"></i>
                  <font class="price coin">{{ priceFormat(item.rewardPointInfo.lifeExchangePoint) }}</font>
                </span>
              </template>
            </template>

            <span v-if="item.fullInfoStyle" :class="['tags']">
              <font
                v-for="(item, index) of item.tags"
                :key="index"
                :style="{
                'color': item.textColor,
                'border': '1px solid ' + item.borderColor,
                'background-color': item.backgroundColor
              }">{{item.name}}</font>
            </span>
            <span v-if="item.fullInfoStyle && !isSingleAddToCart" class="bottom button-cart">
              <span v-if="showCart && !item.soldout" class="cart_a" @click="goCart($event, item.pid, item.cid)">
                選購
              </span>
            </span>
            <span v-if="item.discount && (typeof item.discount !== 'boolean')" class="discount">
              {{item.discount}}
              <font>折</font>
            </span>
          </div>
        </a>
      </div>
    </div>
    <div
      v-if="lookMore"
      class="product-list__look-more">
      <div>
        <a :href="lookMore.url">
          <i></i>
          <font>{{lookMore.title}}</font>
          <font>看更多</font>
        </a>
      </div>
    </div>

  </div>

  <buyitem
    v-if="showCartDialog"
    :pid="pid"
    :cid="cid"
    :mid="mallId"
    :promotionId="promotionId"
    :isProdPage="!fullInfoStyle"
    :isSingleAddToCart="isSingleAddToCart"
    v-on:closeBuyItem="closeBuyItem"
    v-on:bindGetShoppingCartHistory="getShoppingCartHistory"
    v-on:closeBuyItemCnt="closeBuyItemCnt" />
</div>
</template>

<script>
import buyitem from "../product/buyitem.vue"; // 麵包屑

export default {
  name: "productItem",
  data() {
    return {
      showCartDialog: false,
      pid: 0,
      cid: 0,
      list: []
    };
  },
  components: {
    buyitem,
  },
  props: {
    itemList: {
      type: Array,
      required: false,
    },
    // 是否顯示完整的商品資訊 （首頁較少
    fullInfoStyle: {
      type: Boolean,
      default: () => false,
    },
    // 搜尋關鍵字
    searchKeyword: {
      type: String,
      default: () => ''
    },
    // 商品格樣式 2 Columns OR 1 Row
    productItemListType: {
      type: Number,
      default: () => 0
    },
    // 是否顯示購物車功能
    showCart: {
      type: Boolean,
      default: () => false
    },
    // Event name on GA
    gaCategoryTitle: {
      type: String
    },
    // 加入購物車樣式 分 多選擇 或 直接加入
    isSingleAddToCart: {
      type: Boolean,
      default: () => false
    },
    // 目前已加入購物車的PID 商品格判斷是否壓【已加入購物車】
    cartItems: { // added product items
      type: Array,
      default: () => []
    },
    // 促銷目錄ID
    promotionId: {
      type: String,
      default: () => null
    },
    mallId: {
      type: Number,
      default: () => 1
    },
    lookMore: {
      type: Object,
      default: () => null
    }
  },
  created() {
    this.imgWidth = (window.innerWidth - 20) / 2;
  },
  methods: {
    trackingCode(productName) {
      const keyword = this.searchKeyword ? '##' + this.searchKeyword : ''
      let label = '點擊商品##' + productName + keyword
      return this.gaCategoryTitle ? {
        'data-ga-category': this.gaCategoryTitle,
        'data-ga-label': label
      } : null
    },
    priceFormat(x) {
      return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : x;
    },
    goCart($evt, pid, cid) {
      $evt.preventDefault();
      this.pid = pid
      this.cid = cid
      this.showCartDialog = true
      $evt.stopPropagation();
    },
    getShoppingCartHistory() {
      this.$emit('bindGetShoppingCartHistory')
    },
    closeBuyItem() {
      this.showCartDialog = false
    },
    isShowCoinOnly(rewardPointInfo) {
      if (rewardPointInfo && rewardPointInfo.lifePartialPoint && rewardPointInfo.lifePartialPrice) {
        return false
      }
      return true
    },
    productPrice(price) {
      return this.priceFormat(price)
    },
    closeBuyItemCnt() {
      this.showCartDialog = false
    }
  },
  computed: {
    targetHandle() {
      return this.fullInfoStyle ? '_blank' : '_blank'
    },
    listClass() {
      return {
        'product-list': true,
        'square': true
      }
    },
    itemClass() {
      return {
        'product-list__item': true,
        'full-info': this.fullInfoStyle,
        'square': true
      }
    }
  },
};
</script>

<style lang="scss" scoped>
@import '../../style/color';

.product-list {
  width: 100%;
  display: grid;
  flex-wrap: wrap;
  grid-template-columns: repeat(2, 1fr);

  &.list {
    grid-template-columns: auto;
  }

  * {
    box-sizing: border-box;
  }

  &__look-more {
    margin-left: calc(15px/2);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    a {
      display: block;
      color: $red;
      text-decoration: none;
      text-align: center;
    }
    i {
      display: inline-block;
      width: 32px;
      height: 32px;
      background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzMiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMyAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0xNi4yODYgMGM4LjgzNiAwIDE2IDcuMTYzIDE2IDE2cy03LjE2NCAxNi0xNiAxNmMtOC44MzcgMC0xNi03LjE2My0xNi0xNnM3LjE2My0xNiAxNi0xNnptMCAxLjA2N0M4LjAzOCAxLjA2NyAxLjM1MiA3Ljc1MyAxLjM1MiAxNnM2LjY4NiAxNC45MzMgMTQuOTM0IDE0LjkzM2M4LjI0NyAwIDE0LjkzMy02LjY4NiAxNC45MzMtMTQuOTMzUzI0LjUzMyAxLjA2NyAxNi4yODYgMS4wNjd6bS0xLjY1IDguMjI3LjEzOS4wODUgNy42ODggNS4yMzJhMS42OCAxLjY4IDAgMCAxIC4xMyAyLjY4M2wtLjEzLjA5OC03LjY4OSA1LjIzYTEuNjkgMS42OSAwIDAgMS0yLjYyOS0xLjIzbC0uMDA3LS4xNjFWMTAuNzdhMS42OSAxLjY5IDAgMCAxIDIuNDk4LTEuNDc1eiIgZmlsbD0iI0YzNEY1OSIgZmlsbC1ydWxlPSJub256ZXJvIi8+Cjwvc3ZnPgo=') center center / 32px 32px no-repeat ;

    }
    font {
      display: block;
    }
  }

  &__item {
    margin-bottom: 10px;
    &:nth-child(odd) {
      margin-right: calc(15px/2);
    }
    &:nth-child(2n) {
      margin-left: calc(15px/2);
    }

    >div {
      vertical-align: top;
      text-align: left;
      background-color: #ffffff;
      border-radius: 10px;

      &.soldout {
        .items-txt, img {
          opacity: 0.5;
        }
      }

      a {
        display: block;
        text-decoration: none;
        min-height: 235px;
      }

      .items-txt {
        position: relative;
        padding: 5px 0;
        .promotion{
          color:#f46c00;
          font-size: 1.2rem;
          min-height: 36px;
          display: block;
          padding: 0 10px;
        }
      }

      img {
        width: 100%;
        height: 100%;
      }

      .pname {
        color: #3c3c3c;
        font-size: 1.4rem;
        height: 4rem;
        line-height: 2rem;
        margin-bottom: 0.2rem;
        padding: 0 10px;
        box-sizing: border-box;
        overflow: hidden;
        text-align: left;
        word-break: break-all;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        text-overflow: ellipsis;
      }

      .discount {
        display: flex;
        position: absolute;
        bottom: 8px;
        right: -5px;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 22px;
        padding: 0;
        border-radius: 9px 0 9px 0;
        color: $white;
        font-weight: 500;
        font-size: 16px;
        background-color: $red;
        font {
          color: $white;
          font-size: 12px;
          line-height: 12px;
        }
      }

      .price-box {
        padding: 0 10px;

        .price-before,
        .price-after {
          color: $special;
          font-size: 1.2rem;
        }
        .price-after {
          margin-left: 5px;
        }

        .price {
          color: $pomegranate;
          font-size: 2rem;
          &::before {
            content: '$';
            font-size: 1.4rem;
            color: $red;
          }

          &.coin {
            color: $fcoin;
            &::before{
              content: ''
            }
          }
        }
        .promo-price{
          display: inline;
          &__content{
            font-size: 1.3rem;
            color: $black;
            margin-right: 3px;
          }
          font{
            font-size: 2rem;
            color: $pomegranate;
            &::before{
              content: '$';
              font-size: 1.4rem;
              color: $pomegranate;   
              margin-right: 1px;           
            }
          }
        }

        .plus {
          color: $black;
          font-size: 1.8rem;
          margin: 0 2px;
        }

        .fcoin {
          color: $fcoin;
        }

        &.fcoin {
          i {
            position: relative;
            top: 3px;
          }
        }
      }

      .cart {
        position: absolute;
        top: 0;
        right: 10px;
        width: 30px;
        line-height: 30px;
        text-align: center;

        i {
          vertical-align: middle;
          display: inline-block;
          width: 20px;
          height: 20px;
          background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKKADAAQAAAABAAAAKAAAAAB65masAAAD70lEQVRYCe1XTUhUURS+782kZpkjLYwcRaOEDMQoZ5IMhEwYcRMmQdSunUW4aBNFQrRw1SYoWrZJMoiigkA3ZsyPRSVogfkz6EiB4f84/sy7fef5nvN8zhvnjrqbC3fuPeeen++de8+5dxhLt3QE0hFIGAHJarW6ujpvZWWlRWHKQZKRmTyL4ZPf7/9gpbMbfEuALpfrDmf8odmpJEmv6j31l1tbWxXz2m7QNiujRUVF8wpXzmKdPiIMYDLGPehlQ7+HgqFQ6Dvmu94sI2j2XFtbmzszNzPAODsMsO8D/kCDWWY3aIpKUq2zs3MGgl4S5pwfTUppB4SSBki+JCYNaz6LATLp6G8Hp11EmUt8BFtMLdPtdk9UuirXKBEjJlkcl2XYbev19T4xLamkEEAYG0Zmq4oYD8UzKMrDTtDOtEBvBwAqMYCw+hlG+0UBbZDn7CrobPTBDXwDIRRBlJ7gaHCU6h+d3a5ef+99gy2haU1Nzf6F8MJ1UkIEv1opCyVJR0fHMgyFNGNHrIwmww+Hwychp/vfGYCa47VM5mxbAHGeT+kfIsvyF31uHvUvMPOtaYmpALEt2wKIO14FCKB/vV6vviub/KYMkLK4qqpq7yaLyTNOa6KW20vr4gAZG9ExKIpSos9FRkoQVKtS0kmUILQuDFCS128TxmWe0jYnmyCpAYzGALIoKyMjog3nzm3QSbjFKd2nLrdrkB4McDSFs/gc45LB4VbTbK5wKtAO7O8v1NLjiRSECrVuSJbku1EebQfIPPBu0XWVSsMr/d5WepYP1kSK4+Pj/c4C5w9ErgT9ALqCvppkX4LcN5tsa8bfh9eJ/KTXdiICKSUJOcZ78AzecRU4R8HCwsIu7Z5OiInq3+Li4nkI5aP7sMV9CRWwKAwQTuwLiwvtKLSNunGcqb6szKyG7u7uMZ1nHvFB5cj4N0ioYn0NNfVxwBe4qdPxRuFCjQjcNoIjo3BaHolEnsVzoK1LAPfCCE7lK/yGq8p1xUqP+MIA8Vf0Iikiaj9RbkqxB+1EY7xQV1e3T52bftzn3McATi3qiNoj6J2AyKQqpjDVnkllnRQGiLuT/htT1OZzc3MnMP2n0TLu5rh11Ra1ZZKM2hT2JycnJ4QPjBCNyGasLcT/FQYIMx81U5XTM9PT8NBMNBz6tb+m2nJscDqdA6DU8wlAbbNzs5P4QCdJIMl0ezEFw0wYoMPheAAwPrIBJ2sRk9gEt3P1+W6wvT5FhkftNvs1MKaJadB76/F4nq4LxpkIZzHZaGpqso2NjV2Cowr00YyMjJc9PT1TcexvYOH9WLDKVxtxTPJxZr0Bb+DdBoE0kY5AOgLiEfgPIPpTYYvqmUgAAAAASUVORK5CYII=') no-repeat center/20px
        }
      }
 
      .cart_a {
        display: inline-block;
        width: 100%;
        height: 30px;
        border: 1px solid $web_main;
        border-radius: 10px;
        font-size: 1.4rem;
        line-height: 30px;
        text-align: center;
      }
    }

    .items-img {
      display: flex;
      align-items: center;
      justify-content: center;
      --widthA: calc((100vw - 55px) / 2);
      height: var(--widthA);
      border-radius: 10px 10px 0 0;
      background-color: $noimg;
      overflow: hidden;
      position: relative;
    }

    .bottom {
      margin-top: 10px;
      color: $web_main;

      &.button-cart {
        display: inline-block;
        width: 100%;
        padding: 0 15px;
        box-sizing: border-box;
      }
    }

    &.list {
      min-height: auto;
      position: relative;

      >div {
        padding: 0;

        a {
          display: flex;
          min-height: 160px;
        }
      }

      .items-img {
        flex: 1 1 45%;
        justify-content: flex-start;
        border-radius: 10px 0 0 10px;

        .circlemask {
          margin: auto 10%;
        }
      }

      .items-txt {
        flex: 1 1 55%;
      }

      .bottom {
        &.button-cart {
          padding-left: 10px;
        }

        .cart {
          display: inline-block;
        }

        .cart_a {
          width: 130px;
        }
      }

      a {
        .promotion {
          height: auto;
        }

        .price-box {
          bottom: -25px;
        }
      }
    }

    a {
      .squaremask {
        display: flex;
        opacity: 0.75;
        position: absolute;
        right: 0;
        left: 0;
        bottom:0;
        justify-content: center;
        align-items: center;
        width:100%;
        height: 30px;
        color: $white;
        text-align: center;
        background-color: $black;

        font {
          width: 50%;
          display: inline-block;
          font-size:1.4rem;
        }
      }
    }

    &.full-info {
      position: relative;

      a {
        min-height: 320px;

        .circlemask {
          display: flex;
          opacity: 0.6;
          position: absolute;
          top: 40px;
          right: 0;
          left: 0;
          justify-content: center;
          align-items: center;
          width: 80px;
          height: 80px;
          margin: auto 25%;
          border-radius: 50px;
          color: #ffffff;
          text-align: center;
          background-color: #000000;

          font {
            width: 50%;
            display: inline-block;
            font-size: 1.3rem;
          }
        }

        .items-txt {
          padding: 5px 0;
        }

        .tags {
          display: block;
          width: 100%;
          height: 28px;
          padding: 5px 10px;
          overflow: hidden;
          font-size: 1.2rem;
          line-height: 22px;

          &.withCart {
            width: 85%;
          }

          font {
            margin-right: 4px;
            padding: 0 2px;
            border: 1px solid $red;
            border-radius: 6px;
            color: #ffffff;
            background-color: $red;
          }
        }

        .promotion {
          display: -webkit-box;
          box-sizing: border-box;
          height: 20px;
          padding: 0 10px;
          overflow: hidden;
          color: $clementine;
          font-size: 1.2rem;
          text-align: left;
          text-overflow: ellipsis;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
      }
    }
  }
}

@media screen and (max-width: 320px) {
  .product-list__item {
    &.full-info {
      a {
        min-height: 140px;
      }
    }
    &.list {
      >div {
        a {
          min-height: 150px
        }
      }
    }
  }
}

.wrap {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;

  * {
    box-sizing: border-box;
  }

  .items {
    &.search {
      min-height: 310px;
      position: relative;
      padding: 7px 7.5px 20px 20px;

      a {
        .circlemask {
          display: flex;
          opacity: 0.6;
          position: absolute;
          top: 40px;
          right: 0;
          left: 0;
          justify-content: center;
          align-items: center;
          width: 80px;
          height: 80px;
          margin: auto 25%;
          border-radius: 50px;
          color: #ffffff;
          text-align: center;
          background-color: #000000;

          font {
            width: 50%;
            display: inline-block;
          }
        }

        .tags {
          display: block;
          width: 100%;
          height: 27px;
          padding: 5px 10px;
          overflow: hidden;
          font-size: 1.2rem;
          line-height: 22px;

          &.withCart {
            width: 80%;
          }

          font {
            padding: 0 2px;
            margin-right: 4px;
            border-radius: 6px;
          }
        }

        .promotion {
          display: -webkit-box;
          box-sizing: border-box;
          height: 20px;
          padding: 0 10px;
          overflow: hidden;
          color: $clementine;
          font-size: 1.2rem;
          text-align: left;
          text-overflow: ellipsis;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
      }
    }

    .bottom {
      position: relative;

      &.carta {
        display: flex;
        justify-content: center;
        padding: 5px 0 0;
      }

      .tags {
        display: block;
        width: 100%;
        height: 27px;
        padding: 5px 10px;
        overflow: hidden;
        font-size: 1.2rem;
        line-height: 22px;

        &.withCart {
          width: 80%;
        }

        font {
          padding: 0 2px;
          margin-right: 4px;
          border-radius: 6px;
        }
      }
    }
  }

  .items {
    &.one {
      flex: 0 0 100%;
      min-height: auto;
      position: relative;
      padding: 0 10px 10px 10px;

      .items-txt {
        .tags {
          margin-bottom: 3px;
        }
      }

      a {
        .price-box {
          position: relative;
          bottom: 0;
        }
      }
    }

    &.list {
      flex: 0 0 100%;
      min-height: auto;
      position: relative;
      padding: 0 10px 10px 10px;
      display: inline-grid;

      .items-txt {
        display: block;
        position: absolute;
        top: 10px;
        left: 145px;
        width: 60%;
        height: 60%;

        .pname {
          padding-right: 15px;
        }
      }

      .bottom {
        display: block;
        position: absolute;
        bottom: 20px;
        left: 145px;
        width: 60%;
      }

      .items-wrap {
        padding: 0;

        img {
          border-radius: 10px 0 0 10px;
          display: block;
          --widthA: calc(38%);
          width: var(--widthA);
          --heighA: calc(100vw - 105px);
          --heighB: calc(var(--heighA)/2);
          height: var(--heighB);
        }
      }

      a {
        .promotion {
          height: auto;
          color: $clementine;
        }

        .price-box {
          bottom: -25px;
        }

        .circlemask {
          top: 30px;
          left: -15%;
        }
      }
    }
  }

  .items {
    flex: 0 0 50%;
    display: flex;
    padding: 7px 7.5px 20px 20px;
    box-sizing: border-box;

    .items-wrap {
      position: relative;
      width: 100%;
      vertical-align: top;
      text-align: left;
      padding: 0 0 10px 0;
      background-color: #ffffff;
      border-radius: 10px;
      a {
        text-decoration: none;
      }

      img {
        border-radius: 10px 10px 0 0;
        --widthA: calc(100%);
        width: var(--widthA);
        --heighA: calc(100vw - 56px);
        --heighB: calc(var(--heighA)/2);
        height: var(--heighB);
      }

      .pname {
        color: #3c3c3c;
        font-size: 1.4rem;
        height: 4rem;
        line-height: 2rem;
        padding: 0 10px;
        box-sizing: border-box;
        overflow: hidden;
        text-align: left;
        word-break: break-all;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        text-overflow: ellipsis;
      }

      .price-box {
        padding: 0 10px;

        .price-before,
        .price-after {
          color: #f34f59;
          font-size: 1.4rem;
        }

        .price {
          color: #f34f59;
          font-size: 1.8rem;

          &.coin {
            color: #ffaf00;
          }
        }

        .plus {
          color: #000000;
          font-size: 1.8rem;
          margin: 0 2px;
        }

        .fcoin {
          color: #ffaf00;
        }

        &.fcoin {
          i {
            position: relative;
            top: 3px;
          }
        }
      }

      .cart {
        position: absolute;
        top: 0;
        right: 10px;
        width: 30px;
        line-height: 30px;
        text-align: center;

        i {
          vertical-align: middle;
          display: inline-block;
          width: 20px;
          height: 20px;
          background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKKADAAQAAAABAAAAKAAAAAB65masAAAD70lEQVRYCe1XTUhUURS+782kZpkjLYwcRaOEDMQoZ5IMhEwYcRMmQdSunUW4aBNFQrRw1SYoWrZJMoiigkA3ZsyPRSVogfkz6EiB4f84/sy7fef5nvN8zhvnjrqbC3fuPeeen++de8+5dxhLt3QE0hFIGAHJarW6ujpvZWWlRWHKQZKRmTyL4ZPf7/9gpbMbfEuALpfrDmf8odmpJEmv6j31l1tbWxXz2m7QNiujRUVF8wpXzmKdPiIMYDLGPehlQ7+HgqFQ6Dvmu94sI2j2XFtbmzszNzPAODsMsO8D/kCDWWY3aIpKUq2zs3MGgl4S5pwfTUppB4SSBki+JCYNaz6LATLp6G8Hp11EmUt8BFtMLdPtdk9UuirXKBEjJlkcl2XYbev19T4xLamkEEAYG0Zmq4oYD8UzKMrDTtDOtEBvBwAqMYCw+hlG+0UBbZDn7CrobPTBDXwDIRRBlJ7gaHCU6h+d3a5ef+99gy2haU1Nzf6F8MJ1UkIEv1opCyVJR0fHMgyFNGNHrIwmww+Hwychp/vfGYCa47VM5mxbAHGeT+kfIsvyF31uHvUvMPOtaYmpALEt2wKIO14FCKB/vV6vviub/KYMkLK4qqpq7yaLyTNOa6KW20vr4gAZG9ExKIpSos9FRkoQVKtS0kmUILQuDFCS128TxmWe0jYnmyCpAYzGALIoKyMjog3nzm3QSbjFKd2nLrdrkB4McDSFs/gc45LB4VbTbK5wKtAO7O8v1NLjiRSECrVuSJbku1EebQfIPPBu0XWVSsMr/d5WepYP1kSK4+Pj/c4C5w9ErgT9ALqCvppkX4LcN5tsa8bfh9eJ/KTXdiICKSUJOcZ78AzecRU4R8HCwsIu7Z5OiInq3+Li4nkI5aP7sMV9CRWwKAwQTuwLiwvtKLSNunGcqb6szKyG7u7uMZ1nHvFB5cj4N0ioYn0NNfVxwBe4qdPxRuFCjQjcNoIjo3BaHolEnsVzoK1LAPfCCE7lK/yGq8p1xUqP+MIA8Vf0Iikiaj9RbkqxB+1EY7xQV1e3T52bftzn3McATi3qiNoj6J2AyKQqpjDVnkllnRQGiLuT/htT1OZzc3MnMP2n0TLu5rh11Ra1ZZKM2hT2JycnJ4QPjBCNyGasLcT/FQYIMx81U5XTM9PT8NBMNBz6tb+m2nJscDqdA6DU8wlAbbNzs5P4QCdJIMl0ezEFw0wYoMPheAAwPrIBJ2sRk9gEt3P1+W6wvT5FhkftNvs1MKaJadB76/F4nq4LxpkIZzHZaGpqso2NjV2Cowr00YyMjJc9PT1TcexvYOH9WLDKVxtxTPJxZr0Bb+DdBoE0kY5AOgLiEfgPIPpTYYvqmUgAAAAASUVORK5CYII=') no-repeat center/20px
        }
      }

      .cart_a {
        display: inline-block;
        width: 130px;
        height: 30px;
        border: 1px solid #3c3c3c;
        border-radius: 10px;
        font-size: 1.4rem;
        line-height: 30px;
        text-align: center;
      }
    }
  }

  .items.square:nth-child(even) {
    padding: 7px 20px 20px 7px;
  }
}

@media screen and (max-width: 320px) {
  .wrap {
    .items {
      &.search {
        min-height: auto;
      }

      &.list {
        min-height: auto;

        .items-wrap .cart {
          bottom: 33px;
        }

        .items-txt {
          top: 10px;
          left: 125px;
        }

        .bottom {
          bottom: 15px;
          left: 125px;
        }
      }
    }
  }
}

@media screen and (min-width: 412px) {
  .wrap {
    .items {
      &.list {
        .items-txt {
          top: 10px;
          left: 160px;
        }

        .bottom {
          bottom: 20px;
          left: 160px;
        }
      }
    }
  }
}
</style>
