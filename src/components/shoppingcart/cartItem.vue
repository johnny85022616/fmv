<template>
  <div class="cart-item">
    <!-- // 外圍Checkbox
    <div class="funcs">
      <i :class="['checkbox', { checked: item.isSelected }]" @click="setCartSelect"></i>
    </div> -->
    <div v-for="(p, pIdx) of item.mainProducts" :key="pIdx" class="cart-product">
      <div :class="[{'product-isoldout': p.isSoldOut}]">
        <div class="funcs">
          <i v-if="!p.isSoldOut" :class="['checkbox', { checked: !p.isSoldOut && p.isSelected }]" @click="setProductSelect(pIdx)"></i>
          <font v-else>售完</font>
          <a :title="'刪除' + p.name" @click="deleteItem(p.name, p.itemId, pIdx)" class="delete_item">
            <img src="../../images/icons/delete.svg" />
          </a>
        </div>

        <div class="items">
          <div class="image">
            <img :src="p.images.replace('-uat2', '')" :alt="p.name" onerror="this.src='https://ec-w.shopping.friday.tw/public/images/images/xiuwu.png'" />
          </div>

          <div class="information">
            <div class="title">
              <div v-if="p.campaignLinkObj" class="event">
                {{ p.campaignLinkObj.name }}
                <a :href="'/campaign/' + p.campaignLinkObj.id" :title="p.campaignLinkObj.name">
                  看活動》
                </a>
              </div>
              <div class="name">
                <label for="pid">
                  <span v-if="p.cartType === 2" class="storeTag">{{isDoubleEleven?"超取免運":"超 取"}}</span>
                  <span v-if="p.channelId3 === 'fetmc_appbonus'" class="fetHeartTag">遠傳放大折</span>
                  <a :href="'/product/' + p.productId" :title="p.name">
                    <!-- {{ p.supplierId }} * {{ p.sellSetId }} * {{ p.shipmentPreserveId }} <br> -->
                    {{ p.name }}
                  </a>
                </label>
              </div>
            </div>

            <div class="info">
              <div>
                <p class="spec">規格：{{ p.specName }}</p>
                <div class="infoBottom">
                  <div class="qty">
                    <button @click="decrement(pIdx)">-</button>
                    <input v-model="p.quantity" type="number" readonly />
                    <button @click="increment(pIdx)">+</button>
                  </div>
                  <a v-if="p.supplierData" class="supplierName" :href="p.supplierData.url">{{p.supplierData.name}}</a>
                </div>
              </div>
              <div>
                <template v-if="p.priceObj.promoPrice">
                  <p class="price">
                    <!-- <font class="dis">{{ tools.priceFormat(p.priceObj.memberPrice) }}</font> -->
                    <font class="promo">{{ tools.priceFormat(p.priceObj.promoPrice) }}</font>
                  </p>
                </template>
                <template v-else>
                  <p class="price">
                    <font>{{ tools.priceFormat(p.priceObj.memberPrice) }}</font>
                  </p>
                </template>
              </div>
            </div>

            <div class="actions">
              <a :title="'刪除' + p.name" @click="deleteItem(p.name, p.itemId, pIdx)">
                <img src="../../images/icons/delete.svg" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <!-- 活動文案列表 -->
      <!-- <div v-if="p.campaignInfo" class="campaign">
        <span v-for="cam of p.campaignInfo" :key="cam.campaignId">
          <a :href="getCampaignUrl(cam.campaignId)">
            <font>{{ cam.campaignLabel }}</font> {{ cam.campaignName }}
          </a>
        </span>
      </div> -->

      <div v-if="p.comboProducts.length > 0" class="cart-combo">
        <p>本組合包含以下商品：</p>
        <p v-for="v of p.comboProducts" :key="v.productId" class="cart-combo__item">
          {{ v.name }} {{ v.specName }} x{{ v.quantity }}
        </p>
      </div>
      <template v-if="p.giftProducts.length > 0">
        <p v-for="v of p.giftProducts" :key="v.productId" class="giftBox">
          <span class="giftTag">贈品</span>
          <template v-if="v.name">{{ v.name }}</template>
          <template v-else>商品名稱</template>
        </p>
      </template>
      <template v-if="p.additionalProducts.length > 0">
        <div v-for="v of p.additionalProducts" :key="v.productId" class="addOnBox">
          <span class="addOnTag">加購</span>
          <p>
            <span>{{ v.name }}</span>
            <span>{{ v.specName }}</span>
            <span>x{{ v.quantity }}</span>
            <span class="price">
              <font>{{ tools.priceFormat(v.price) }}</font>
            </span>
          </p>
        </div>
      </template>

    </div>
    <div v-if="isShowFeeAmount" class="bfee_box">
      <div class="bfee_txt">
        <i class="cart"></i> {{ bfeeText }}
        <font @click.stop.prevent="goListPageForShipFee">湊免運》</font>
      </div>
      <div>
        <span class="highestShipFee" v-if="cartType === 'store'" @click="openStorePopup()">最高運費<i class="questionIcon"></i></span>
        <span v-else>運費：</span>
        <span>
          <font class="price">{{ shipFee }}</font>
        </span>
      </div>
    </div>
    <div v-if="isShowLookMore" class="bfee_box">
      <div class="bfee_txt">
        <font @click.stop.prevent="goLookMore">逛更多》</font>
      </div>
    </div>
    <popup v-if="isStorePopupOpen" @closePopup="closeStorePopup" :isShowHeader="false">
      <template v-slot:body>
        <div class="storeShipFee">
          <div class="title">
            <p>超商</p>
            <p>運費</p>
            <p>免運門檻</p>
          </div>
          <ul>
            <li v-for="(item,index) in popupShipData" :key="index">
              <p>{{item.name}}</p>
              <p>{{item.shipFee}}</p>
              <p>{{item.threshold}}</p>
            </li>
          </ul>
          <div class="btnBlock">
            <button @click="closeStorePopup">確定</button>
          </div>
        </div>
      </template>
    </popup>
    <popup v-if="isDeletePopupOpen" :isShowHeader="false">
      <template v-slot:body>
        <p class="cart__remove-confirm">請確認是否移除 {{deleteInfo.name}}?</p>
        <div class="btnBlock">
          <button class="cancelBtn" @click="closeDeletePopup">取消</button>
          <button @click="deleteComfirm">確定</button>
        </div>
      </template>
    </popup>
  </div>
</template>

<script>
import popup from "../../components/common/popup.vue";

export default {
  name: "cartItem",
  components: {
    popup,
  },
  data() {
    return {
      qty: 1, // 商品欲購買量
      bfeeText: "", // 運費說明
      supplierId: null, // 該供應商ID
      shipMin: 0, // 門檻
      shipFee: 0, // 運費
      campaignName: "", // 商品上的活動名稱
      campaignId: "", // 活動ID
      isGetShipFee: false, // 是否已取得運費
      isStorePopupOpen: false,
      popupShipData: [],
      shipFeeProductListUrl: "", //湊免運url
      isWHD: false, // 是否為寄倉商品
      isDeletePopupOpen: false,
      deleteInfo: null,
      supplierData: null,
      isDoubleEleven: false,
    };
  },
  props: {
    // 購物車類型
    cartType: {
      type: String,
      default: () => "home", // or store
    },
    // 商品資料
    item: {
      type: Object,
      default: () => null,
    },
    // 購物車資料第幾筆
    cartDataIndex: {
      type: Number,
      default: () => 0,
    },
    // 已使用的折價卷ID
    inUsedCoupon: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    this.isDoubleEleven = this.api.campaign.checkCampaignDay();
    let isItemSelected = false;
    this.item.mainProducts.forEach((p) => {
      const obj = this.api.cart.getFilterCampaignInfo(
        p.campaignInfo,
        this.item.cartType
      );
      p.campaignLinkObj = obj;
      if (!isItemSelected && p.isSelected) {
        isItemSelected = true;
      }
    });

    // 取得運費資料
    if (isItemSelected && !this.isGetShipFee) {
      this.getShipFee();
    }
    if (!this.siteData) {
      this.getSupplierData();
    }
  },
  watch: {
    isShowFeeAmount(isNeedShipFee) {
      this.item.shipFee = isNeedShipFee ? this.shipFee : 0;
      this.$emit("setCartStatus", "updateShipFee", this.item);
    },
    item: {
      deep: true,
      handler: function (n) {
        // 取得運費資料
        if (!this.isGetShipFee) {
          const isSomeSelected = n.mainProducts.some((v) => v.isSelected);
          if (isSomeSelected) this.getShipFee();
        }
      },
    },
  },
  methods: {
    //取得供應商資料
    async getSupplierData() {
      for (let key in this.item.mainProducts) {
        const res = await this.api.web.getSupplierData(this.item.mainProducts[key].supplierId);
        if (res && res.isUnderCounstruction === 'N') {
          this.$set(this.item.mainProducts, key, Object.assign(
            this.item.mainProducts[key],
            {
              supplierData: {
                name: res.siteName.substr(0, 4),
                url: `/shop/${res.urlSuffix}`,
              }
            }
          ))
        }
      }
    },
    //開啟刪除訂單popup
    openDeletePopup() {
      if (this.isDeletePopupOpen) return;
      this.isDeletePopupOpen = true;
    },
    //關閉刪除訂單popup
    closeDeletePopup() {
      this.isDeletePopupOpen = false;
    },
    //開啟超取運費popup
    openStorePopup() {
      this.isStorePopupOpen = true;
    },
    //關閉超取運費popup
    closeStorePopup() {
      this.isStorePopupOpen = false;
    },
    // 取得運費
    getShipFee() {
      let { sellSetId, shipmentPreserveId, shipFeeSupplierId, isWHD } =
        this.item.mainProducts.find((v) => v.shipFeeSupplierId);
      //寄倉
      if (isWHD) {
        this.isWHD = true;
      }
      this.api.cart.getShipFeeApi(shipFeeSupplierId).then((data) => {
        this.isGetShipFee = true;
        if (!data) return;

        this.supplierId = shipFeeSupplierId;
        const keyName = this.api.cart.getShipFeeObjectKey(
          sellSetId,
          shipmentPreserveId,
          this.cartType,
          1
        );
        if (keyName && data[keyName]) {
          const amountStr = data[keyName];
          if (/,/.test(amountStr)) {
            const ary = amountStr.split(",");
            if (ary && ary.length === 2 && ary[0] && ary[1]) {
              this.bfeeText = `滿$${this.tools.priceFormat(ary[0])}免運費`;
              this.shipMin = parseInt(ary[0]);
              this.shipFee = parseInt(ary[1]);
              this.composeShipFeeProductListUrl(
                shipmentPreserveId,
                shipFeeSupplierId,
                this.tools.priceFormat(ary[0]),
                this.tools.priceFormat(ary[1])
              );
            }
          }

          // 超取要另外看可能的最大運費。因購物車還沒選擇結帳用什麼7-11還是全家
          if (this.cartType === "store") {
            this.popupShipData = [];
            const arr = [
              { name: "711", key: `SVN_${shipmentPreserveId}` },
              { name: "全家", key: `FAM_${shipmentPreserveId}` },
            ];
            arr.forEach((ele) => {
              if (data[ele.key]) {
                this.popupShipData.push({
                  name: ele.name,
                  shipFee: data[ele.key].split(",")[1],
                  threshold: data[ele.key].split(",")[0],
                });
              }
            });
            this.shipFee = this.api.cart.getStoreFeeMaxAmount(
              data,
              shipmentPreserveId
            );
          }

          // 新增購物車運費設定檔
          Object.assign(this.item, {
            shipConfigs: data, // 供應商運費設定檔
            shipConfigKey: keyName, // 商品運費索引Key
          });
        }
      });
    },
    //組湊免運url
    composeShipFeeProductListUrl(
      shipmentPreserveId,
      supplierId,
      shipFeeRule,
      shipFee
    ) {
      const urlSuffix =
        this.siteData && this.siteData.urlSuffix
          ? `/${this.siteData.urlSuffix}`
          : "";
      // 寄倉位置不同
      if (this.isWHD) {
        this.shipFeeProductListUrl = urlSuffix + "/campaign/DO_240911170753521";
      } else {
        this.shipFeeProductListUrl = `${urlSuffix}/shipFeeProductList?shipmentPreserveId=${shipmentPreserveId}&supplierId=${supplierId}&cartType=${
          this.cartType
        }&rule=${shipFeeRule || 0},${shipFee || 0}`;
      }
    },
    // 前往湊運費商品集合頁
    goListPageForShipFee(evt) {
      evt.preventDefault();
      location.href = this.shipFeeProductListUrl;
    },
    //雙11看更多
    goLookMore() {
      let { shipmentPreserveId, shipFeeSupplierId } =
        this.item.mainProducts.find((v) => v.shipFeeSupplierId);
      this.composeShipFeeProductListUrl(shipmentPreserveId, shipFeeSupplierId);
      location.href = this.shipFeeProductListUrl;
    },
    // 核取方塊
    setCartSelect() {
      this.$emit("setCartStatus", "checkbox", this.item);
    },
    setProductSelect(idx) {
      this.item.mainProducts[idx].isSelected =
        !this.item.mainProducts[idx].isSelected;
      this.$emit("setCartStatus", "checkbox", this.item);
    },
    // 刪除商品ITEM
    deleteItem(name, id, productIdx) {
      this.openDeletePopup();
      this.deleteInfo = { name, id, productIdx };
    },
    //刪除商品popup確認
    deleteComfirm() {
      this.$emit("setCartStatus", "deleteCartItem", {
        itemRandomId: this.item.itemRandomId,
        itemId: this.deleteInfo.id,
        productIdx: this.deleteInfo.productIdx,
      });
      this.deleteInfo = null;
      this.closeDeletePopup();
    },
    // 數量增加
    increment(i) {
      if (
        this.item.mainProducts[i].quantity >=
        this.item.mainProducts[i].purchaseMaxQty
      ) {
        return;
      }
      this.item.mainProducts[i].quantity++;
      this.updateCartItem(this.item.mainProducts[i]);
      this.$emit("setCartStatus", "updateQuantity", this.item);
    },
    // 數量減少
    decrement(i) {
      if (
        this.item.mainProducts[i].quantity ===
        this.item.mainProducts[i].purchaseMinQty
      ) {
        return;
      }
      if (this.item.mainProducts[i].quantity > 1) {
        this.item.mainProducts[i].quantity--;
        this.updateCartItem(this.item.mainProducts[i]);
        this.$emit("setCartStatus", "updateQuantity", this.item);
      }
    },
    // 更新商品數量
    updateCartItem(obj) {
      this.api.cart.updateCart(obj.itemId, {
        quantity: obj.quantity,
        specId: obj.specId,
      });
    },
    // 設定已使用couponId
    // setInUsedCoupon(nVal, oVal) {
    //   this.$emit('setInUsedCoupon', nVal, oVal);
    // },
    // 更新折扣狀態
    getDiscountUpdate() {
      this.$emit("setCartStatus", "updateDiscount", this.item);
    },
    // 取得活動連結
    getCampaignUrl(campaignId) {
      const campaignUrl = "/campaign/" + campaignId;
      const urlSuffix = this.siteData ? "/" + this.siteData.urlSuffix : "";
      return urlSuffix + campaignUrl;
    },
  },
  computed: {
    isShowFeeAmount() {
      return this.getItemAmount < this.shipMin && this.getItemAmount > 0;
    },
    //條件為已選擇、已取得運費狀況且運費為0(為判斷過是否超過門檻的運費)、雙11
    isShowLookMore() {
      return (
        this.getItemAmount &&
        this.isGetShipFee &&
        this.item.shipFee === 0 &&
        this.isDoubleEleven &&
        this.cartType === "store"
      );
    },
    getItemAmount() {
      let payAmount = 0;
      this.item.mainProducts.forEach((c) => {
        if (c.isSelected) {
          payAmount += c.price * c.quantity;
          if (c.additionalProducts.length > 0) {
            c.additionalProducts.forEach((a) => {
              payAmount += a.price * a.quantity;
            });
          }
        }
      });
      return payAmount;
    },
  },
};
</script>

<style lang="scss">
@import "../../style/color.scss";
@import "../../style/mixin";

.product-isoldout {
  opacity: 0.75;
}

.cart-item {
  color: $dune;
  font-size: 1.5rem;
  padding: 5px 40px;
  box-sizing: border-box;
  border-bottom: 6px solid $background;

  &:not(:last-child) {
    border-bottom: 1px solid $gray;
  }

  .giftTag {
    @include customTag(#21a02b);
  }

  .fetcoinTag {
    @include customTag($fcoin);
  }

  .addOnTag {
    @include customTag(#0d6ab7);
  }

  .notice {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .addOnBox {
    display: flex;
    align-items: center;
    padding: 5px 0 0 20px;
    box-sizing: border-box;
    > span {
      width: 30px;
    }
    p {
      display: flex;
      align-items: center;
      width: 100%;
      span {
        &:first-child {
          flex: 0 1 60%;
          @include font-break(1);
        }
        &:nth-child(2) {
          flex: 0 1 10%;
        }
        &:nth-child(3) {
          flex: 0 1 10%;
        }
        &:nth-child(4) {
          flex: 0 1 10%;
        }
      }
    }
  }

  .nagtiveNoticeBox {
    padding: 5px 10px 0;
    height: 15px;

    > div {
      font-size: 1.6rem;

      span {
        font-size: 1.5rem;
        color: $red;
        width: fit-content;
        height: fit-content;
        white-space: nowrap;
        border: 1px solid $red;
        border-radius: 5px;
        padding: 0 2px;
        margin-right: 10px;
      }

      p:last-child {
        color: $web_main;
      }
    }
  }
}

.cart-product {
  padding: 15px 10px 10px;

  > div {
    &:first-child {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .funcs {
    flex: 1 1 60px;
    display: flex;
    justify-content: space-between;

    .delete_item {
      display: none;
    }
  }

  .items {
    flex: 1 1 100%;
    display: flex;
  }

  // 商品圖
  .image {
    flex: 1 1 100px;

    img {
      width: 80px;
    }
  }

  // 品名、規格
  .information {
    flex: 0 1 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .title {
    flex: 1 1 300px;

    .storeTag {
      @include customTag(#90b772);
    }

    .fetHeartTag {
      @include customTag(#d3060f);
    }

    .event {
      font-size: 1.4rem;
      color: $gray;
      margin-bottom: 5px;
      padding-left: 10px;
      a {
        text-decoration: none;
      }
    }

    .name {
      display: flex;
      align-items: center;
      width: 90%;

      label {
        max-width: 1000px;
        line-height: 1.5;
        font-size: 1.5rem;

        a {
          color: $web_main;
          @include font-break(2);

          &:hover {
            color: $science-blue;
          }
        }
      }

      font {
        font-size: 1.2rem;
        color: $gray;
      }
    }
  }

  // 規格、數量、價格
  .info {
    flex: 1 1 500px;
    display: flex;
    align-items: center;

    > div {
      flex: 1 1 50%;

      &:first-child {
        padding-left: 70px;
        box-sizing: border-box;
      }

      &:nth-child(2) {
        text-align: center;
      }

      p {
        margin-bottom: 5px;
      }
    }

    // 數量
    .qty {
      height: fit-content;
      display: flex;
      align-items: center;
      bottom: 0;

      p {
        margin-bottom: 5px;
      }

      input {
        width: 35px;
        font-size: 1.5rem;
        line-height: 28px;
        text-align: center;
      }

      button {
        justify-content: center;
        align-items: center;
        display: flex;
        font-size: 18px;
        line-height: 1;
        color: $black;
        text-align: center;
        background-color: $alabaster;
        width: 28px;
        aspect-ratio: 1/1;
        cursor: pointer;
      }
    }
  }

  // 刪除按鈕
  .actions {
    flex: 1 1 auto;
    text-align: center;
    cursor: pointer;
  }

  // 活動區塊
  .campaign {
    margin: 15px 0 0;
    padding: 10px 0;
    border-top: 1px solid $background;
    border-bottom: 1px solid $background;

    span {
      margin: 5px 0;
      display: block;
      width: 100%;
    }

    font {
      font-size: 1.3rem;
      color: $red;
      border: 1px solid $red;
      border-radius: 5px;
      padding: 2px 3px;
    }

    a {
      padding: 1px 0;
      color: $web_main;

      &:hover {
        color: $science-blue;
      }
    }
  }
}

// 價格
.price {
  color: $pomegranateapprox;
  font-size: 1.9rem;
  font-weight: bold;
  line-height: 1.5;

  font {
    &::before {
      content: "$";
    }

    &.dis {
      font-size: 1.4rem;
      color: $sliver;
      text-decoration: line-through;
      margin-right: 5px;
    }

    &.promo {
      &::before {
        content: "折扣後 $";
        font-size: 1.5rem;
      }
    }
  }

  &.minus::before {
    content: "－$";
  }

  &.plus::before {
    content: "＋$";
  }
}

.giftBox {
  padding: 10px 0 0 20px;
}

.cart-combo {
  padding: 10px 0 0 10px;
  p:first-child {
    color: $sliver;
  }

  &__item {
    margin: 10px 0 5px 15px;
  }
}

@media screen and (max-width: 1200px) {
  .cart-item {
    font-size: 1.4rem;
    padding: 5px 10px;

    .title {
      .name {
        i {
          min-width: 18px;
        }

        label {
          margin: 0 10px;

          .campaign {
            margin-top: 5px;
            font-size: 1.3rem;
          }
        }
      }
    }

    .info {
      .qty {
        input {
          font-size: 1.5rem;
        }

        button {
          width: 25px;
          height: 25px;
          font-size: 15px;
        }
      }
    }

    .nagtiveNoticeBox {
      div {
        flex-direction: column;
        gap: 5px;
      }
    }

    .cart-product {
      > div {
        &:first-child {
          display: unset;
        }
      }

      .image {
        flex: 0 1 10%;
      }

      .information {
        display: inline-block;
      }

      .title {
        flex: 0 0 40%;
      }

      .info {
        flex: 0 1 150px;
        .infoBottom {
          display: flex;
          align-items: center;
          .supplierName {
            margin-left: 15px;
            color: $sliver;
          }
        }

        > div:first-child {
          padding-left: 10px;
          flex: 0 1 70%;
        }

        > div {
          flex: 0 1 30%;

          p {
            margin-top: 5px;
          }
        }
      }

      .funcs {
        margin-bottom: 5px;

        .delete_item {
          display: block;
        }
      }

      .actions {
        display: none;
      }
    }

    #promoCode {
      font-size: 14px;
      padding: 2px 8px;
    }
  }
}

.bfee_box {
  display: flex;
  align-items: center;
  border-top: 1px solid $bridesmaid;
  background-color: rgba(#e0ffff, 0.2);
  > div {
    flex: 0 1 50%;
    &:last-child {
      box-sizing: border-box;
      text-align: right;
      padding-right: 30px;
    }
  }
}
.bfee_txt {
  display: flex;
  align-items: center;
  color: $web_main;
  padding: 5px 10px;

  font {
    cursor: pointer;
    color: $blue;
    margin-left: 10px;
  }
}
.storeShipFee {
  .title {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 5px;
    border-bottom: 1px solid $black;
    p {
      text-align: center;
    }
  }
  ul {
    list-style-type: none;
    li {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      padding: 5px;
      border-bottom: 1px solid $black;
      &:last-of-type {
        border-bottom: none;
      }
      p {
        text-align: center;
      }
    }
  }
}
.highestShipFee {
  display: inline-flex;
  align-items: center;
}
.questionIcon {
  width: 15px;
  height: 15px;
  background: url(../../images/icons/icon_questionMark.png) center/15px
    no-repeat;
  margin: 0 3px;
}
.btnBlock {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  button {
    padding: 5px 20px;
    background-color: $dodger-blue;
    color: $white;
    border-radius: 5px;
    &:first-of-type {
      margin-right: 10px;
    }
    &.cancelBtn {
      background-color: $sliver;
    }
  }
}

.cart__remove-confirm {
  font-size: 1.5rem;
}
</style>