<template>
  <div class="product-box">
    <div :style="productWrapStyle">

      <div v-if="promotionType === 5" class="product-box__red-green-zone">
        <p v-html="promotionTitle"></p>
        <ul>
          <li @click="swapTab(1)" :class="[{'active':nowSelectedGroupType===1},{'choose':redZoneCount>0},{'achieve':redZoneAchieve}]">
            紅標已選
            <span>
              <font class="font">{{redZoneCount}}</font>
            </span>
          </li>
          <li @click="swapTab(2)" :class="[{'active':nowSelectedGroupType===2},{'choose':greenZoneCount>0}, {'achieve':greenZoneAchieve},{'green-line':nowSelectedGroupType===2}]">
            綠標已選
            <span>
              <font class="font">{{greenZoneCount}}</font>
            </span>
          </li>
        </ul>
      </div>
      <div v-else-if="promotionType === 4" class="product-box__red-green-zone">
        <p v-html="promotionTitle"></p>
        <ul>
          <li :class="[{'active':nowSelectedGroupType===1},{'choose':redZoneCount>0},{'achieve':redZoneAchieve}]">
            紅標已選
            <span>
              <font class="font">{{redZoneCount}}</font>
            </span>
          </li>
        </ul>
      </div>

      <controls :promotionGroupType="nowSelectedGroupType" v-on:controlsParams="controlsParams" />
      <div class="product-box__productList">
        <productItem v-if="products.length" :gaCategoryTitle="'小網促銷活動頁'" :fullInfoStyle="false" :isMenuPage="true" :showCart="true" :isSingleAddToCart="isSingleAddToCart" :itemList="products" :cartItems="shoppingCartItems" :promotionId="promotionId" v-on:bindGetShoppingCartHistory="getShoppingCartHistory" />
      </div>
    </div>

    <shoppingcart v-if="Object.keys(shoppingCartPayload).length > 0" :shoppingCartPayload="shoppingCartPayload" v-on:showCart="setShowCartDetail" />

    <cartdetail v-if="showCartDetail" :shoppingCartPayload="shoppingCartPayload" v-on:closeShowCartDetail="setCloseShowCartDetail" v-on:deleteCartItem="deleteCartItem" />
  </div>
</template>

<script>
import controls from "../category/controls.vue"; // 商品排序
import productItem from "../common/productItem"; // 商品
import shoppingcart from "../category/shoppingcart.vue"; // 促銷購物車內容
import cartdetail from "../category/cartdetail.vue"; // 購物車商品內容

export default {
  name: "productBox",
  components: {
    controls,
    productItem,
    shoppingcart,
    cartdetail,
  },
  data() {
    return {
      nowSelectedGroupType: 0,
      products: [],
      productTotalPage: 0,
      prodParams: {
        sorting: "NEW_ARRIVAL",
        page: 1,
        rows: 6,
        promotionId: null,
        groupType: 0,
      },
      promotionId: null, // 活動ID
      promotionTitle: null, // 活動標題
      redZoneCount: 0,
      redZoneAchieve: false,
      greenZoneCount: 0,
      greenZoneAchieve: false,
      shoppingCartItems: [],
      shoppingCartPayload: {},
      showCartDetail: false,
      currentY: 0,
      windowY: 0,
      isAtBottom: false,
      dueToBottomGap: window.innerHeight / 2,
    };
  },
  props: {
    apiType: {
      type: String,
      default: () => "promotion",
    },
    isSingleAddToCart: {
      type: Boolean,
      default: () => false,
    },
    // 活動資訊
    promotionDetails: {
      type: Object,
      default: () => {},
    },
    // 活動頁面類型 1:購物車限制出貨 2:促銷打折 3:促銷折現金 4:紅  5:紅配綠
    promotionType: {
      type: Number,
      default: () => null,
    },
    // 商品類型 0-一般促銷;1-紅區;2-綠區
    promotionGroupType: {
      type: Number,
      default: () => 0,
    },
  },
  watch: {
    isAtBottom(newValue) {
      if (newValue && this.productTotalPage > 0) {
        if (this.prodParams.page <= this.productTotalPage) {
          this.getAPI();
        }
      }
    },
    promotionGroupType: {
      immediate: true,
      handler(val) {
        this.nowSelectedGroupType = val;
      },
    },
    promotionDetails: {
      immediate: true,
      handler(val) {
        this.promotionId = val.id;
        this.promotionTitle = val.title;
      },
    },
  },
  created() {
    // save all product api data
    window.productsPool = {};

    window.addEventListener(
      "scroll",
      () => {
        const wy = window.scrollY;
        this.windowY = wy;
        this.currentY = wy !== 70 && wy !== 0 ? wy : this.currentY;
        this.checkIsAtBottom();
      },
      {
        passive: true,
      }
    );

    this.getAPI();
    this.getShoppingCartHistory();
  },
  computed: {
    productWrapStyle() {
      const o = {
        "min-height": window.innerHeight * 0.7 + "px",
      };
      let marginBottom = 0;
      if (this.shoppingCartPayload && this.shoppingCartPayload.cartTypeList) {
        if (this.shoppingCartPayload.cartTypeList.length === 1)
          marginBottom = 115;
        if (this.shoppingCartPayload.cartTypeList.length === 2)
          marginBottom = 160;
        o["margin-bottom"] = marginBottom + "px";
      }
      return o;
    },
  },
  methods: {
    swapTab(index) {
      this.nowSelectedGroupType = index;
      this.colorZoneParams(index);
    },
    getAPI() {
      // 依不同畫面組合不同API
      switch (this.apiType) {
        case "promotion":
          this.prodParams.promotionId = this.promotionId;
          this.prodParams.groupType = this.nowSelectedGroupType;
          this.getPromotionProducts();
          break;
      }
    },
    colorZoneParams() {
      this.prodParams.page = 1;
      this.getAPI();
    },
    controlsParams(sortKey) {
      if (this.prodParams.sorting !== sortKey) {
        this.prodParams.sorting = sortKey;
        this.prodParams.page = 1;
        this.getAPI();
      }
    },
    getPromotionProducts() {
      fetch(
        `${this.configs.frontApiPath()}promotion/${
          this.promotionId
        }/product?${new URLSearchParams(this.prodParams).toString()}`
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.resultCode === 0) {
            if (res.resultData && res.resultData.results) {
              const productData = this.reformatProducts(res.resultData.results);
              this.products =
                this.prodParams.page === 1
                  ? productData
                  : this.products.concat(productData);
              this.productTotalPage = Math.ceil(
                res.resultData.size / this.prodParams.rows
              );
              this.prodParams.page++;
            }
          }
        });
      // this.axios
      //   .post('api/promotion/product', null, {
      //     params: this.prodParams
      //   })
      //   .then((res) => {
      //     const data = res.data;
      //     if (data.code === 1 && data.payload[0] && data.payload[0].items) {
      //       const productData = this.reformatProducts(data.payload[0].items)
      //       this.products = (this.prodParams.page === 1) ? productData : this.products.concat(productData)
      //       this.productTotalPage = Math.ceil(data.payload[0].size / this.prodParams.rows)
      //       this.prodParams.page++
      //     }
      //   })
    },
    // 重新排列商品值
    reformatProducts(data) {
      return data.map((v) => {
        const { pid, product_name, image_url, price } = v;
        const newData = {
          img: image_url,
          name: product_name,
          fullInfoStyle: false,
          priceSuffix: "",
          url: `/product?pid=${pid}`,
          payMethodList: ["CASH"],
          price,
        };

        return Object.assign(v, newData);
      });
    },
    // 取得購物車歷史紀錄
    getShoppingCartHistory() {
      const api = `api/shoppingcartHistory`;

      this.axios
        .get(api, {
          params: {
            promotionId: this.promotionId,
          },
        })
        .then((res) => {
          let data = res.data;

          if (data.code === 1 && data.payload.length > 0) {
            this.shoppingCartItems = [];

            const cartItems =
              data.payload[0] && data.payload[0]["shoppingCartItems"]
                ? data.payload[0]["shoppingCartItems"]
                : {};
            // set shopping cart added items for proudctItems Component.
            Object.keys(cartItems).forEach((objKey) => {
              cartItems[objKey].forEach((v) => {
                this.shoppingCartItems.push(v.pid);
                if (parseInt(v.gType) === 1) {
                  this.redZoneCount++;
                }
                if (parseInt(v.gType) === 2) {
                  this.greenZoneCount++;
                }
              });
            });

            // 判斷紅綠區是否達到選購數量
            if (this.redZoneCount >= this.promotionDetails.redGroup) {
              this.redZoneAchieve = true;
            }
            if (this.greenZoneCount >= this.promotionDetails.greenGroup) {
              this.greenZoneAchieve = true;
            }

            this.shoppingCartPayload = data.payload[0];
          } else {
            this.shoppingCartPayload = [];
            this.shoppingCartItems = [];
          }
        });
    },
    setShowCartDetail() {
      this.showCartDetail = true;
      this.stopBodyScroll();
    },
    setCloseShowCartDetail() {
      this.showCartDetail = false;
      this.stopBodyScroll("close");
    },
    stopBodyScroll(action, jumpCurrentY = true) {
      const body = document.body;
      if (!this.isStopScrolling) {
        body.style = "padding:0;margin:0;overflow:hidden;height:100%";
        this.isStopScrolling = !this.isStopScrolling;
      }
      if (action === "close") {
        body.style = "padding:0;margin:0;";
        if (jumpCurrentY) {
          setTimeout(() => {
            window.scrollTo(0, this.currentY);
          }, 0);
        }
        this.isStopScrolling = false;
      }
    },
    deleteCartItem(obj) {
      if (confirm("請確認是否要刪除?")) {
        this.axios
          .delete("shoppingcartHistory", {
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify([obj]),
          })
          .then((res) => {
            const data = res.data.response;
            if (data.status == "OK") {
              this.getShoppingCartHistory();
            }
          });
      }
    },
    checkIsAtBottom() {
      const wy = window.scrollY;
      if (
        window.innerHeight + wy + this.dueToBottomGap >=
        document.body.scrollHeight
      ) {
        this.isAtBottom = true;
      } else {
        this.isAtBottom = false;
      }
    },
  },
};
</script>

<style lang="sass" scoped>
@import "../../style/color.scss"
@import "../../style/mixin.scss"

.product-box
  margin: 0
  padding: 0
  background-color: $background
  &__red-green-zone
    position: sticky
    top: 0
    z-index: 1
    padding-top: 20px
    background-color: $background
    font-size: 1.4rem
    p
      margin-bottom: 10px
      text-align: center
      span
        color: $red
    ul
      display: flex
      justify-content: space-between
    li
      display: flex
      align-items: center
      justify-content: center
      flex: 1 1 50%
      height: 45px
      color: $special
      text-align: center
      &.active
        border-top-left-radius: 10px
        border-top-right-radius: 10px
        border-bottom: 3px solid $red
        background-color: $white
        color: $web_main
        @include shadow
        &.green-line
          border-bottom: 3px solid $special
      &.choose
        .font
          background-color: $red
          color: $white
      &.achieve
        span
          width: 50px
          height: 22px
          background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8cGF0aCBkPSJNOSAwYTkgOSAwIDEgMSAwIDE4QTkgOSAwIDAgMSA5IDB6bTAgMS41NzlBNy40MjEgNy40MjEgMCAxIDAgOSAxNi40MiA3LjQyMSA3LjQyMSAwIDAgMCA5IDEuNTh6bTMuNjU1IDQuNTE2YS45MzQuOTM0IDAgMCAxIC43MzguMjc4Yy4zODUuMzg3LjM5OSAxLjAzLjAzMiAxLjQzNkw5LjE5IDEyLjY4M2EuOTI3LjkyNyAwIDAgMS0xLjMzNS4wODJMNS4xNiAxMC4zMjhhMS4wNTUgMS4wNTUgMCAwIDEtLjEwOS0xLjQ3OC45MjguOTI4IDAgMCAxIDEuMzYtLjA2NGwxLjk4NSAxLjc5NiAzLjYxLTQuMTVhLjk0NS45NDUgMCAwIDEgLjY1LS4zMzd6IiBmaWxsPSIjNTU4RkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz4KPC9zdmc+Cg==') center/18px 18px no-repeat
          background-position: 27px 2px
          text-align: left
      .font
        display: inline-block
        width: 18px
        height: 18px
        margin: 0 5px
        background-color: $alto
        border-radius: 50%
        font-size: 1.2rem
        text-align: center
  &__productList
    padding: 0 20px
</style>
