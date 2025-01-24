<template>
  <div>
    <div v-if="layoutType === 'one'" class="oneProductList">
      <ul>
        <li v-for="(item, index) in itemList" :key="index" @click="(e) => tools.goProductPage(e, item.pid, item, hrefTarget, searchDataCount, (isAiData ? index : aiDataCount + index))">
          <div class="item-img">
            <img v-lazy="item.img" />
            <span v-if="item.soldout" class="squaremask">
              <font>補貨中</font>
            </span>
          </div>
          <div class="items-info">
            <p class="pname" v-html="item.name"></p>
            <div class="iconArea">
              <span class="storeIcon" v-if="isShowStoreIcon && item.isStore === 1">超</span>
              <span v-if="showCampaignQtyIcon && item.campaignQty" class="campaignIcon">折({{item.campaignQty}})</span>
            </div>
            <div class="price-box">
              <div>
                <font v-if="item.price!==null" class="price">{{ productPrice(item.price) }}</font>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-else :class="listClass">
      <template v-for="(item, index) in itemList">
        <div v-if="item.image_url && item.price" :class="itemClass" :key="index">
          <div class="items-wrap">
            <a href="" @click="(e) => tools.goProductPage(e, item.pid, item, hrefTarget, searchDataCount, (isAiData ? index : aiDataCount + index))" v-bind="trackingCode(item.name)">
              <div class="items-img">
                <img v-lazy="item.image_url" />
                <span v-if="item.soldout" class="squaremask">
                  <font>補貨中</font>
                </span>
              </div>
              <div class="items-txt">
                <span class="pname" v-html="item.name"></span>
                <span v-if="item.price!==null" class="price-box">
                  <template v-if="item.rewardPointInfo && item.rewardPointInfo.lifePartialPoint !== undefined">
                    <i class="fcoin"></i>
                    <font class="coin">{{ productPrice(item.rewardPointInfo.lifePartialPoint) }}</font> +
                    <font class="coin_price">{{ productPrice(item.rewardPointInfo.lifePartialPrice) }}</font>
                  </template>
                  <template v-else-if="item.rewardPointInfo && item.rewardPointInfo.lifeExchangePoint !== undefined">
                    <i class="fcoin"></i>
                    <font class="coin">{{ productPrice(item.rewardPointInfo.lifeExchangePoint) }}</font>
                  </template>
                  <template v-else>
                    <template v-if="isFromFetmcPromotion">
                      <i class="fcoin"></i>
                      <font class="coin">{{ productPrice(item.price) }}</font>
                    </template>
                    <span v-else class="price-box">
                      <font class="price">{{ productPrice(item.price) }}</font>
                      <font v-if="item.priceSuffix" class="priceSuffix">{{ item.priceSuffix }}</font>
                    </span>
                  </template>
                  <span v-if="showCampaignQtyIcon && item.campaignQty" class="campaignIcon">折({{item.campaignQty}})</span>
                </span>
              </div>
            </a>
            <div class="iconArea">
              <span class="storeIcon" v-if="isShowStoreIcon && item.isStore===1">超</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "aiProductItem",
  data() {
    return {
      pid: 0,
      cid: 0,
      mid: 0,
    };
  },
  props: {
    itemList: {
      type: Array,
      required: false,
    },
    layoutType: {
      type: String,
      default() {
        return "two";
      },
    },
    // 是否排2欄
    isTwoColumn: {
      type: Boolean,
      default: () => false,
    },
    // 搜尋關鍵字
    searchKeyword: {
      type: String,
      default: () => "",
    },
    // 是否為Ai來的資料
    isAiData: {
      type: Boolean,
      default: () => false,
    },
    // ai資料總筆數
    aiDataCount: {
      type: Number,
      default: () => 0,
    },
    // bw宇匯資料總筆數
    bwDataCount: {
      type: Number,
      default: () => 0,
    },
    // Event name on GA
    gaCategoryTitle: {
      type: String,
    },
    noWrap: {
      type: Boolean,
      default: () => false,
    },
    hrefTarget: {
      type: String,
      default: () => "_self",
    },
    isFromFetmcPromotion: {
      type: Boolean,
      default: () => false,
    },
    isShowSoldout: {
      type: Boolean,
      default: false,
    },
    isShowStoreIcon: {
      type: Boolean,
      default: false,
    },
    showCampaignQtyIcon: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.imgWidth = (window.innerWidth - 20) / 2;
  },
  methods: {
    trackingCode(productName) {
      const keyword = this.searchKeyword ? "##" + this.searchKeyword : "";
      let label = "點擊商品##" + productName + keyword;
      return this.gaCategoryTitle
        ? {
            "data-ga-category": this.gaCategoryTitle,
            "data-ga-label": label,
          }
        : null;
    },
    priceFormat(x) {
      return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : x;
    },
    productPrice(price) {
      return this.priceFormat(price);
    },
  },
  computed: {
    // ai Data + bw Data
    searchDataCount() {
      return this.aiDataCount + this.bwDataCount;
    },
    listClass() {
      return {
        "product-list": true,
        "two-column": this.isTwoColumn,
        square: true,
        noWrap: this.noWrap,
      };
    },
    itemClass() {
      return {
        item: true,
        "full-info": this.fullInfoStyle,
        square: true,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/color";

.product-list {
  &.noWrap {
    width: 100%;
    overflow: auto;
    display: flex;
    flex-wrap: nowrap;
    .item {
      width: 108.33px;
      flex-shrink: 0;
    }
  }
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 31.5%);
  gap: 23px 10px;

  &.two-column {
    grid-template-columns: repeat(2, 48.5%);
  }

  .item {
    .items-wrap {
      vertical-align: top;
      text-align: right;

      &.soldout {
        .items-txt,
        img {
          opacity: 0.5;
        }
      }

      a {
        display: block;
        text-decoration: none;
      }

      img {
        width: 100%;
        height: 100%;
      }

      .pname {
        color: #3c3c3c;
        font-size: 1.3rem;
        line-height: 1.5;
        box-sizing: border-box;
        overflow: hidden;
        text-align: left;
        word-break: break-all;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        text-overflow: ellipsis;
        margin-top: 0.5rem;
        min-height: 39px;
      }
      .price-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 1.4rem;
        .coin {
          color: $pomegranate;
          font-size: 1.8rem;
          margin-right: 2px;
        }
        .coin_price {
          color: $pomegranate;
          font-size: 1.8rem;
          margin-left: 2px;
          &::before {
            content: "$";
            font-size: 1.4rem;
            color: $red;
          }
        }
        .price-box {
          position: relative;
          flex: 0 1 60%;
        }
        .price {
          color: $pomegranate;
          font-size: 2rem;
          &::before {
            content: "$";
            font-size: 1.4rem;
            color: $red;
          }
        }
        .priceSuffix {
          position: absolute;
          bottom: -10px;
          left: 8px;
          color: $special;
          font-size: 1rem;
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
    }

    .items-img {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      width: 100%;
      height: 0;
      padding-bottom: 100%;
      border: 1px solid $silver1;
      border-radius: 10px;
      overflow: hidden;
      position: relative;
      img {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .squaremask {
        display: flex;
        opacity: 0.95;
        position: absolute;
        right: 0;
        left: 0;
        bottom: 0;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 20px;
        color: $white;
        text-align: center;
        background-color: $sliver;

        font {
          width: 50%;
          display: inline-block;
          font-size: 1.2rem;
        }
      }
    }
  }
}
.oneProductList {
  ul {
    list-style-type: none;
    li {
      display: flex;
      margin-bottom: 25px;
      justify-content: space-between;
      border-bottom: 1px solid $alto;
      padding-bottom: 15px;
      .item-img {
        position: relative;
        width: 25%;
        height: 0;
        padding-bottom: 25%;
        img {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
          aspect-ratio: 1/1;
        }
      }
      .items-info {
        width: 70%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .pname {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          text-overflow: ellipsis;
          font-size: 1.4rem;
        }
        .price-box {
          display: flex;
          justify-content: space-between;
          .price {
            color: $pomegranate;
            font-size: 2rem;
            &::before {
              content: "$";
              font-size: 1.4rem;
              color: $red;
            }
          }
        }
      }
    }
  }
}
.iconArea {
  text-align: left;
  margin-top: 5px;
  .storeIcon {
    background-color: $olivine;
    box-sizing: border-box;
    color: $white;
    border-radius: 5px;
    padding: 0 3px;
    margin: 5px 5px 0 0;
    font-size: 1.2rem;
  }
}
.campaignIcon {
  background-color: $red;
  box-sizing: border-box;
  color: $white;
  border-radius: 5px;
  padding: 0 3px;
  font-size: 1.2rem;
}
.campaignIcon {
  background-color: $red;
}

@media screen and (max-width: 319px) {
  .item {
    &.full-info {
      .pname {
        font-size: 0.8rem;
        height: 1rem;
      }
      .items-wrap {
        .price-box {
          .price {
            font-size: 1rem;
            &::before {
              font-size: 0.8rem;
            }
          }
        }
      }

      a {
        .squaremask {
          height: 25px;
          font {
            font-size: 0.8rem;
          }
        }
      }
    }
  }
}
</style>