<template>
  <div>
    <div class="product-component-container">
      <div v-if="data.promotionLabels && data.promotionLabels.length > 0" class="product-promotion">
        <span v-for="(v, i) of data.promotionLabels" :key="i">{{ v }}</span>
      </div>

      <div class="product-name">
        <h1>{{ data.name }}</h1>
        <h2>{{ data.seoH2 }}</h2>
      </div>
      <!-- <div v-if="checkPaymentWay('CASH')" class="product-payment"> -->
      <div class="product-payment">
        <div class="infoLink">
          <div class="product-payment__sku">
            <label>商品代碼</label>
            <span>{{ data.pid }} <i class="copy" @click="copyNumber(data.pid)"></i></span>
          </div>
          <div v-if="isBsiteBrand" class="product-payment__brand">
            <a v-if="bsiteData" :href="brandUrl">看<strong>{{ bsiteData.siteName }}</strong>的所有商品 →</a>
          </div>
        </div>
        <span>
          <div>
            <template v-if="data.payMethodList[0] === 'CASH' && data.price.promoPrice">
              <div class="infoPrice hasPromo">
                <div>
                  <span class="product-payment__list-price">網路價</span>
                  <span class="product-payment__list-price linethrough">${{
                    this.tools.priceFormat(data.price.memberPrice)
                  }}</span>
                  <span class="product-payment__currency ml10">$</span>
                  <span class="product-payment__red-price">{{
                    this.tools.priceFormat(data.price.promoPrice)
                  }}</span>
                </div>
                <div v-if="data.price.bestDiscountO">
                  <span>(最優再折$<font class="product-payment__more-discount-price">{{ tools.priceFormat(data.price.bestDiscountO) }}</font>)</span>
                </div>
                
              </div>
            </template>
            <template v-else-if="data.payMethodList[0] === 'LIFE_EXCHANGE_POINT'">
              <div class="infoPrice">
                <div>
                  <span class="product-payment__list-price">市價</span>
                  <span class="product-payment__list-price linethrough">${{
                    this.tools.priceFormat(data.price.marketPrice)
                  }}</span>
                </div>
                <div>
                  <span class="product-payment__fcoin">
                    <i class="fcoin"></i>
                    <font class="fcoin">{{ tools.priceFormat(data.rewardPointInfo.lifeExchangePoint) }}</font>
                  </span>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="infoPrice">
                <div v-if="!data.price.bestDiscountO">
                  <span v-if="data.price.marketPrice" class="product-payment__list-price">市價</span>
                  <span v-if="data.price.marketPrice" class="product-payment__list-price linethrough">${{
                    this.tools.priceFormat(data.price.marketPrice)
                  }}</span>
                </div>
                <div>
                  <span>
                    <span class="product-payment__net-content">網路價</span>
                    <span v-if="data.price.memberPrice !== null" class="product-payment__currency">$</span>
                    <span v-if="data.price.memberPrice !== null" class="product-payment__red-price">{{
                      this.tools.priceFormat(data.price.memberPrice)
                    }}</span>
                    <span v-else class="noPrice">暫無價格</span>
                  </span>
                </div>
                <div>
                  <span v-if="data.price.bestDiscountO">(最優再折$<font class="product-payment__more-discount-price">{{ tools.priceFormat(data.price.bestDiscountO) }}</font>)</span>
                </div>
              </div>
            </template>
          </div>
          <i v-if="data.flags && data.flags.includes('折扣後')" class="discount"></i>
          <i v-if="data.flags && data.flags.includes('期間限定')" class="periodlimit"></i>
        </span>
        <div class="flex">
          <span class="storeIcon" v-if="isStoreIconShow">{{isDoubleEleven?"超取免運":"超商取貨"}}</span>
          <span v-if="friendRecommandation || isShowSpeed()" class="product-payment__tags">
            <span v-if="friendRecommandation">友商推薦商品</span>
            <span>
              <i v-if="isShowSpeed()" class="speed"></i>
            </span>
          </span>
        </div>
      </div>
      <!-- <div class="product-discount" v-else-if="
          checkPaymentWay('LIFE_PARTIAL_POINT') ||
          checkPaymentWay('LIFE_EXCHANGE_POINT')
        ">
        <div class="product-discount__details fcoin">
          <ul>
            <li v-if="checkPaymentWay('LIFE_PARTIAL_POINT')">
              <i class="fcoin"></i>
              <span class="lifePartialPoint">{{
                this.tools.priceFormat(data.rewardPointInfo.lifePartialPoint)
              }}</span>
              <span class="plus">+</span>
              <span class="currency">$</span>
              <span class="lifePartialPrice">{{
                this.tools.priceFormat(data.rewardPointInfo.lifePartialPrice)
              }}</span>
            </li>
            <li v-else-if="checkPaymentWay('LIFE_EXCHANGE_POINT')">
              <i class="fcoin"></i>
              <span class="lifePartialPoint">{{
                this.tools.priceFormat(data.rewardPointInfo.lifeExchangePoint)
              }}</span>
            </li>
          </ul>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "basicinfo",
  data() {
    return {
      showDialog: false,
      coupon: [],
      couponTips: [],
      flipCardDiscount: 0,
      isFlipCardShow: false,
      isFlipShowPercentage: false,
      isFlipPercentageShowMoney: false,
      isFlipPercentageMoney: 0,
      bsiteData: null,
      isBsiteBrand: false,
      vipRebateRate: null,
      isDoubleEleven: false,
    };
  },
  components: {},
  props: {
    data: {
      type: Object,
    },
    tags: {
      type: Array,
    },
    friendRecommandation: {
      type: Boolean,
    },
    isSimpleProductCnt: {
      type: Boolean,
    },
  },
  created() {
    this.isDoubleEleven = this.api.campaign.checkCampaignDay();
    // 謎價機制 ( 避免B SITE getcart api 可能會延遲回應是否登入成功，isLogin會判斷錯誤)
    setTimeout(() => {
      this.getFlipCardDiscount();
      this.isShowLookBrand();
    }, 1000);
  },
  methods: {
    copyNumber(content) {
      navigator.clipboard.writeText(content).then(() => {
        alert(`已複製${content}至剪貼簿`);
      });
    },
    isShowSpeed() {
      return this.tags && this.tags.some((v) => v.name === "速");
    },
    checkPaymentWay(type) {
      return (
        this.data &&
        this.data.payMethodList &&
        this.data.payMethodList.some((v) => v === type)
      );
    },
    getFlipCardDiscount() {
      const { pid } = this.data;

      const st = JSON.parse(window.sessionStorage.getItem("cache_" + pid));
      if (st && st.discount && /onsale/i.test(document.referrer)) {
        this.isFlipCardShow = true;
        this.flipCardDiscount = this.tools.priceFormat(st.discount);
      }

      if (this.siteData) {
        this.isFlipShowPercentage = true;
        let { isLogin, isEligible, discountFlag, discountName } = this.siteData;

        // 控制B型下能否顯示XX折
        if (discountFlag === "Y") {
          this.isFlipCardShow = true;
          if (discountName) this.flipCardDiscount = `${discountName}折`;

          // 控制是否登入才能夠看到折扣金額
          if (isEligible === "Y") {
            if (isLogin === 1) {
              this.isCanGetDiscount = true;
              this.getDiscountApi();
            }
          } else {
            this.isCanGetDiscount = true;
          }
        }
      }
    },
    getDiscountApi() {
      fetch(this.configs.frontApiPath() + "bWeb/product/discount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          param: {
            siteId: this.siteData.siteId,
            productIdList: [this.data.pid],
            version: "v2",
          },
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.resultCode === 0 && res.resultData.length > 0) {
            this.isFlipCardShow = true;
            this.isFlipShowPercentage = true;
            this.isFlipPercentageMoney =
              "$" + this.tools.priceFormat(res.resultData[0].discount);
          }
        });
    },
    showFlipPercentage() {
      if (this.isCanGetDiscount) {
        this.isFlipPercentageShowMoney = true;
      } else {
        alert("請先登入會員才可以看到專屬折扣哦！");
        const isB2 = this.siteData.siteType === "B2" ? "em=1&" : "";
        window.location.href = `/login?${isB2}sc=${
          this.siteData.urlSuffix
        }&redirectUrl=${encodeURIComponent(location.href)}`;
      }
    },
    async getBSiteData(supplierId) {
      let bd = await this.tools.getBwebApiData(
        "GET",
        `/config?supplierId=${supplierId}`
      );
      if (bd) {
        return bd;
      }
    },
    async isShowLookBrand() {
      if (!this.siteData) {
        let bsiteData = await this.getBSiteData(this.data.supplierId);
        if (bsiteData && bsiteData.length > 0) {
          bsiteData = bsiteData[0];
          if (
            bsiteData &&
            bsiteData.isUnderCounstruction === "N" &&
            ["B1", "b1"].includes(bsiteData.siteType) &&
            bsiteData.supplierId &&
            bsiteData.skuCount > 10
          ) {
            this.bsiteData = bsiteData;
            this.isBsiteBrand = true;
          }
        }
      }
    },
  },
  computed: {
    isStoreIconShow() {
      return this.data.tags.some((v) => v === "STORE_DELIVER");
    },
    brandUrl() {
      return `/brandPromotion?urlSuffix=${this.bsiteData.urlSuffix}`;
    },
  },
};
</script>

<style lang="sass" scoped>
@import '../../style/color.scss'
.flex
  display: flex
  align-items: center
.product-component-container
  .storeIcon
    background-color: $olivine
    height: 20px
    box-sizing: border-box
    color: $white
    border-radius: 5px
    padding: 0 5px
    margin: 5px 5px 0 0
  .product-promotion
    font-size: 1.4rem
    color: $clementine
    span
      display: block
  .product-name
    h1
      font-size: 1.6rem
      color: $web_main
    h2
      display: none
.product-payment
  margin-top: 5px
  display: flex
  flex-direction: column
  &__sku
    flex: 0 1 80%
    display: inline !important
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
    color: $sliver
    i
      position: unset !important
    label
      margin-right: 2px
  &__brand
    margin-bottom: 3px
  
  .infoPrice
    display: flex
    align-items: baseline
    justify-content: flex-start
    >div
      display: flex
      align-items: baseline
      margin-right: 10px

  .infoLink
    margin-right: 0px
    display: flex
    align-items: center
    justify-content: space-between
    margin-bottom: 20px
    a
      color: $blue-ribbon
  .noPrice
    color: $red
    font-size: 1.8rem
    margin-left: 10px
  // span
  //   >div
  //     div
  //       &:first-of-type
  //         margin-right: 8px
  //       div
  //         display: flex
  //         align-items: center
  //         >span
  //           &:nth-of-type(2n)
  //             padding: 0 2px
  //           &:nth-of-type(2)
  //             margin-right: 15px
  + .product-discount
    border-top: 1px solid $web_border
  >span
    &:first-child
      flex-shrink: 0
      // i
      //   position: relative
      //   top: -10px
      //   left: 5px
  &__tags
    margin-top: 5px
    display: flex
    justify-content: space-between
    >span
      height: 20px
      color: $SilverChalice
      margin-right: 3px

  &__price
    font-size: 1.4rem
    color: $gray

  &__fcoin
    font-size: 2.8rem
    color: $fcoin
    i.fcoin
      position: relative
      top: 4px
      left: unset

  &__promo-content
    font-size: 1.6rem
    margin-right: 2px
    color: $black

  &__net-content
    font-size: 1.4rem
    margin-right: 2px
    color: $black

  &__red-price
    font-size: 2.8rem
    color: $pomegranate

  &__more-discount-price
    font-size: 1.5rem
    color: $pomegranate

  &__list-price
    display: block
    color: $sliver
    min-width: 40px
    font-size: 1.6rem

  &__currency
    color: $pomegranate
    font-size: 1.3rem
  &__fold-card
    position: relative
    top: 8px
    display: flex
    align-items: center
  &__fold-flipContent
    position: relative
    font-size: 1.5rem
  &__fold-discount
    &-on
      position: relative
      top: 0px
      left: 5px
      display: flex
      width: 110px
      height: 45px
      filter: drop-shadow(-5px 5px 10px rgba(0,0,0,.2))
      &::after
        content: ''
        position: absolute
        right: 0
        bottom: 0
        border: 7.5px white solid
        border-bottom-color: transparent
        border-left-color: transparent
        box-shadow: 3.75px -3.75px 3.75px rgba(0, 0, 0, 0.15)
        transform: rotate(-90deg)
        z-index: 2
      span
        background: url('../../images/icons/discount_on_background.svg') center/110px no-repeat
        z-index: 0
        position: absolute
        top: 0
        left: 0
        width: 110px
        height: 45px
        clip-path: polygon(0 0, 100% 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 100%, 0 0)

      p
        display: flex
        justify-content: space-around
        padding: 0 16px
        box-sizing: border-box
        z-index: 1
        position: absolute
        top: 0
        left: 0
        width: 110px
        line-height: 45px
        font-size: 1.7rem
        color: $clementine
        text-align: center
        .price
          font-size: 2rem

  i
    background-repeat: no-repeat !important
    background-size: contain !important
    background-position: center !important
    margin-right: 3px
    &.discount
      width: 45px
      height: 19px
      background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDUiIGhlaWdodD0iMTkiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxwYXRoIGQ9Ik04LjM1IDYgLjI5NyAxOC41MzhBLjMuMyAwIDAgMCAuNTQ5IDE5SDE3VjZIOC4zNXoiIGZpbGw9IiNGRkUyRTEiLz4KICAgICAgICA8cGF0aCBkPSJNOCAwaDMyYTUgNSAwIDAgMSA1IDV2OWE1IDUgMCAwIDEtNSA1SDNWNWE1IDUgMCAwIDEgNS01eiIgZmlsbD0iI0ZGRTJFMSIvPgogICAgICAgIDx0ZXh0IGZvbnQtZmFtaWx5PSJQaW5nRmFuZ1RDLVJlZ3VsYXIsIFBpbmdGYW5nIFRDIiBmb250LXNpemU9IjEyIiBmaWxsPSIjRjM0RjU5Ij4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRzcGFuIHg9IjYiIHk9IjE0Ij7mipjmiaPlvow8L3RzcGFuPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGV4dD4KICAgIDwvZz4KPC9zdmc+Cg==')

    &.periodlimit
      width: 57px
      height: 19px
      background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTciIGhlaWdodD0iMTkiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxwYXRoIGQ9Ik04LjM1IDYgLjI5NyAxOC41MzhBLjMuMyAwIDAgMCAuNTQ5IDE5SDE3VjZIOC4zNXoiIGZpbGw9IiNGRkUyRTEiLz4KICAgICAgICA8cGF0aCBkPSJNOCAwaDQ0YTUgNSAwIDAgMSA1IDV2OWE1IDUgMCAwIDEtNSA1SDNWNWE1IDUgMCAwIDEgNS01eiIgZmlsbD0iI0ZGRTJFMSIvPgogICAgICAgIDx0ZXh0IGZvbnQtZmFtaWx5PSJQaW5nRmFuZ1RDLVJlZ3VsYXIsIFBpbmdGYW5nIFRDIiBmb250LXNpemU9IjEyIiBmaWxsPSIjRjM0RjU5Ij4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRzcGFuIHg9IjYiIHk9IjE0Ij7mnJ/plpPpmZDlrpo8L3RzcGFuPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGV4dD4KICAgIDwvZz4KPC9zdmc+Cg==')

    &.fastdelivery
      width: 57px
      height: 20px
      background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyNS40LjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i5ZyW5bGkXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNTggMTgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDU4IDE4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDojMDA4NEZGO30NCgkuc3Qxe2VuYWJsZS1iYWNrZ3JvdW5kOm5ldyAgICA7fQ0KCS5zdDJ7ZmlsbDojRkZGRkZGO30NCgkuc3Qze2ZvbnQtZmFtaWx5OidBZG9iZU1pbmdTdGQtTGlnaHQtQjVwYy1IJzt9DQoJLnN0NHtmb250LXNpemU6MTNweDt9DQoJLnN0NXtmb250LWZhbWlseTonQXJpYWxNVCc7fQ0KPC9zdHlsZT4NCjxnPg0KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yLDFoNTRjMS4xLDAsMiwwLjksMiwydjEzYzAsMS4xLTAuOSwyLTIsMkgyYy0xLjEsMC0yLTAuOS0yLTJWM0MwLDEuOSwwLjksMSwyLDF6Ii8+DQoJPHRleHQgdHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgMSAzIDE0KSIgY2xhc3M9InN0MSI+PHRzcGFuIHg9IjAiIHk9IjAiIGNsYXNzPSJzdDIgc3QzIHN0NCI+5oCl6YCfPC90c3Bhbj48dHNwYW4geD0iMjYiIHk9IjAiIGNsYXNzPSJzdDIgc3Q1IHN0NCI+MjRIPC90c3Bhbj48L3RleHQ+DQo8L2c+DQo8L3N2Zz4NCg==')

    &.speed
      width: 20px
      height: 20px
      background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBkPSJNMTUgMGE1IDUgMCAwIDEgNSA1djEwYTUgNSAwIDAgMS01IDVINWE1IDUgMCAwIDEtNS01VjVhNSA1IDAgMCAxIDUtNWgxMHpNNy4wMTggNy4wNjJIMy43ODR2LjkyNGgyLjEyOGMtLjQ3Ni43ODQtMS4wNzggMS41NjgtMS43NzggMi4zNjZ2Ljc3aDIuMWMtLjE5Ni45MS0uNDc2IDEuNzIyLS44MTIgMi40NS0uNTc0LjE1NC0xLjE3Ni44NjgtMS44MiAyLjE0MmwuNzQyLjY1OGMuNTg4LTEuMjMyIDEuMDUtMS44NDggMS4zNTgtMS44NDhhLjUxLjUxIDAgMCAxIC4zNS4xNGMuNDc2LjQ3NiAxLjAyMi44NCAxLjYxIDEuMDY0LjUwNC4yMSAxLjI0Ni4zMjIgMi4yMTIuMzUuNzIuMDI0IDEuNTEyLjAzOCAyLjM5NC4wNDFsMy45Mi4wMDEuMjI0LS45NjZjLTEuNTY4LjA1Ni0yLjg0Mi4wODQtMy44MjIuMDg0LS45OTQgMC0xLjg3Ni0uMDE0LTIuNjQ2LS4wMTQtLjgxMi0uMDI4LTEuNDU2LS4xMjYtMS45MDQtLjI5NC0uNDc2LS4yMS0uOTI0LS41MTgtMS4zNzItLjkyNGExLjMxNiAxLjMxNiAwIDAgMC0uMzM2LS4yNTJjLjMzNi0uNzU2LjYxNi0xLjY5NC44NC0yLjgxNHYtLjY3Mkg1LjMyNEExOS4yNzEgMTkuMjcxIDAgMCAwIDcuMDE4IDcuODZ2LS43OTh6bTUuNDQ2LTMuNDg2aC0uOTM4VjQuNzFoLTMuNTd2LjkyNGgzLjU3djEuMTlIOC40NzR2My41N2gyLjM5NGMtLjY1OCAxLjA3OC0xLjc1IDIuMDE2LTMuMjkgMi44bC42My43OThjMS40OTgtLjg4MiAyLjYwNC0xLjk0NiAzLjMxOC0zLjE5MnYzLjg3OGguOTM4di0zLjcyNGMxLjI0NiAxLjAzNiAyLjI0IDIuMDMgMi45ODIgMi45NjhsLjY4Ni0uNjg2Yy0uODEyLS45MzgtMS44MDYtMS44OS0yLjk4Mi0yLjg0MmgyLjM2NnYtMy41N2gtMy4wNTJ2LTEuMTloMy41MjhWNC43MWgtMy41MjhWMy41NzZ6bTIuMTI4IDQuMTN2MS43OTJoLTIuMTI4VjcuNzA2aDIuMTI4em0tMy4wNjYgMHYxLjc5Mkg5LjQxMlY3LjcwNmgyLjExNHptLTYuNjUtNC4wMTgtLjY1OC42NDRjLjg5Ni43MTQgMS42MSAxLjM4NiAyLjE0MiAyLjAzbC42NTgtLjY1OGExNi42OTUgMTYuNjk1IDAgMCAwLTIuMTQyLTIuMDE2eiIgZmlsbD0iI0YzNEY1OSIgZmlsbC1ydWxlPSJldmVub2RkIi8+Cjwvc3ZnPgo=') no-repeat

.product-discount
  padding-top: 5px

  div
    &:first-of-type
      display: flex
      >span
        &:nth-of-type(2n)
          padding: 0 2px

  &__list-price
    display: block
    color: $sliver
    font-size: 1.2rem
    display: flex
    align-items: flex-end

  &__title
    width: 20%
    color: $web_minor
    &.fcoin
      width: 25%

  &__details
    width: 80%
    font-size: 1.6rem
    color: $web_main
    margin-top: 1px
    i
      margin-right: 3px
      margin-bottom: -3px
    &.fcoin
      width: 75%

    span
      color: $red

    ul
      position: relative
      top: -5px
      li
        list-style-type: none
        .lifePartialPoint
          font-size: 2.2rem
          color: $fcoin
        .plus
          margin: 0 3px
          font-size: 1.4rem
          color: $mine-shaft
        .currency
          font-size: 1.4rem
          color: $pomegranate
        .lifePartialPrice
          font-size: 2.2rem
          color: $red
.linethrough
  text-decoration: line-through
</style>
