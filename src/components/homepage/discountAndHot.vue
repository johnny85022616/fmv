<template>
  <div class="homepage-promotion">
    <div class="homepage-promotion-timer">
      <div class="homepage-promotion-timer__head">
        <div>
          <i></i>
          熱銷商品推薦，10點更新
        </div>
        <div>
          <div class="homepage-promotion-hot__lookmore">
            <a href="/campaign/DO_241004094023093">看更多<i></i></a>
          </div>
        </div>
      </div>
      <div class="homepage-promotion-timer__product-items">
        <a v-for="(item, index) of prodData" :key="index" href="" @click="e => tools.goProductPage(e, item.productId)">
          <img v-lazy="item.image_url" :alt="item.name">
          <span class="homepage-promotion-timer__price">
            <font class="real_price">{{ tools.priceFormat(item.price) }}</font>
            <span class="campaignIcon">
              <font v-if="item.campaignQty > 0">折({{ item.campaignQty }})</font>
            </span>
          </span>
          <span class="homepage-promotion-timer__name">
            {{ item.name }}
          </span>
        </a>
      </div>
    </div>

    
  </div>
</template>

<script>
export default {
  name: "discountAndHot",
  data() {
    return {
      prodData: [],
      promotionId: "B23001813",
    };
  },
  async created() {
    this.prodData = await this.getData();
  },
  methods: {
    async getData() { // DO_241004094023093
      const campaignInfo = await this.api.campaign.getCampaignDetail(['DO_241004094023093']);
      if (!campaignInfo || !campaignInfo[0]) return [];
      if (!campaignInfo[0].campaignRange.v[9]) return [];

      const pids = campaignInfo[0].campaignRange.v[9].split(',').splice(0, 6);
      const products = await this.api.product.getProducts(pids);
      return pids.map(v => products[v]);
      
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/color.scss";
@import "../../style/mixin.scss";

.homepage-promotion {
  width: 100%;
  line-height: normal !important;
  margin-top: 12px;
  /* 每日限時搶購 */
  &-timer {
    width: 100%;
    padding: 44px 0 12px 0;
    box-sizing: border-box;
    background-color: $background;
    border-radius: 10px;
    position: relative;
    &__head {
      font-weight: 500;
      height: 46px;
      color: $dune;
      background-color: $white;
      border: 2px solid $silver1;
      border-radius: 5px;
      margin: -58px 15px 10px 15px;
      padding-left: 12px;
      box-sizing: border-box;
      > div {
        &:first-of-type {
          height: 100%;
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          font-size: 1.6rem;
          margin-right: 12px;
          i {
            margin-right: 5px;
            display: inline-block;
            width: 21px;
            height: 21px;
            background-repeat: no-repeat;
            background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMSAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik04LjMyNC4zMTUgNC4wNjQgMTAuOThhLjUuNSAwIDAgMCAuNDY1LjY4NmgyLjc2M2EuNS41IDAgMCAxIC40OC42NGwtMS43MjcgNS44NjdhLjUuNSAwIDAgMCAuODI4LjVsOS43NjUtOS40ODNhLjUuNSAwIDAgMC0uMzQ4LS44NThoLTMuODc2YS41LjUgMCAwIDEtLjQ0Ni0uNzI2TDE1LjQ0LjcyNUEuNS41IDAgMCAwIDE0Ljk5NCAwSDguNzg4YS41LjUgMCAwIDAtLjQ2NC4zMTV6IiBmaWxsPSIjMDZjIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+Cg==");
          }
        }
        &:last-of-type {
          height: 100%;
          display: flex;
          align-items: center;
          color: $web_main;
          font-weight: normal;
          float: right;
          font {
            display: inline-block;
            width: 22px;
            line-height: 18px;
            padding: 2px;
            box-sizing: border-box;
            margin: 0 2px;
            color: $white;
            background-color: $web_main;
            border-radius: 5px;
            font-size: 1.4rem;
            text-align: center;
          }
          > div {
            &:first-of-type {
              flex-grow: 1;
            }
            &:last-of-type {
              padding-left: 9.9px;
              box-sizing: border-box;
              border-radius: 18px;
              line-height: 22px;
              font-size: 1.4rem;
              text-align: center;
              margin-right: 7.1px;
              &.in {
                display: inline-block;
              }
              a {
                display: flex;
                align-items: center;
                color: #06c;
                text-decoration: none;
              }
              i {
                margin-left: 4px;
                margin-right: 7.1px;
                display: inline-block;
                width: 14px;
                height: 14px;
                background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxOCAxNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik04LjMxMyAwYzMuOTgyIDAgNy4yMSAzLjEzNCA3LjIxIDdzLTMuMjI4IDctNy4yMSA3Yy0zLjk4MSAwLTcuMjA5LTMuMTM0LTcuMjA5LTdzMy4yMjgtNyA3LjIxLTd6bS0uOTU1IDMuMjI4YS45OTYuOTk2IDAgMCAwLTEuMjc4LjI5Ni45MjYuOTI2IDAgMCAwLS4xNy41MzR2NS44ODRsLjAwNS4wOTFjLjA0Ny40OC40NjUuODU2Ljk3My44NTZhMSAxIDAgMCAwIC41NS0uMTY1bDQuNDU0LTIuOTQxLjA3NS0uMDU1YS45MjcuOTI3IDAgMCAwIC4xODItMS4yNi45NjIuOTYyIDAgMCAwLS4yNTctLjI1TDcuNDM4IDMuMjc3eiIgZmlsbD0iIzA2YyIgZmlsbC1ydWxlPSJldmVub2RkIi8+Cjwvc3ZnPgo=");
                background-repeat: no-repeat;
                background-size: 115%;
              }
            }
          }
        }
      }
    }
    &__product-items {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 0 15px;
      a {
        position: relative;
        width: 46%;
        min-height: 210px;
        margin: 0 5px 10px 5px;
        border-radius: 10px;
        text-decoration: none;
        background-color: $white;
        text-align: center;
      }
      img {
        width: 132px;
        height: auto;
        object-fit: cover;
      }
      .campaignIcon {
        background-color: #f34f59;
        box-sizing: border-box;
        color: #ffffff;
        border-radius: 5px;
        padding: 0 3px;
        font-size: 1.2rem;
      }
    }
    &__price {
      display: flex;
      position: relative;
      justify-content: space-between;
      align-items: baseline;
      padding: 0 8px;
      font {
        &.real_price {
          color: $red;
          font-size: 20px;
          &::before {
            content: "$";
            font-size: 14px;
          }
        }
      }
    }
    &__name {
      position: relative;
      padding: 0 8px;
      color: $web_main;
      font-size: 1.4rem;
      text-align: left;
      @include font-break(2);
    }
    &__lookmore {
      font-size: 1.4rem;
      display: block;
      width: 132px;
      text-align: center;
    }
  }
}
/* End 每日限時搶購 */
</style>
