<template>
  <div class="cart-combo wrap">
    <label>組合商品</label>
    <div v-for="(item, index) of uiComboData" :key="index">
      <div :class="['cart-combo__item', {'soldout': item.isSoldOut}]">
        <div class="cart-combo__item-image">
          <img :src="item.image_url" :alt="item.name">
        </div>
        <div class="cart-combo__item-name">
          <span>{{item.name}}</span>
          <div class="cart-combo__item-spec">
            <span v-if="item.variants.length > 0" :class="['cart-combo__item-select', {'active': cartComboData[index].isSelected}]">
              <font v-if="cartComboData[index].isSelected" @click="openSpecUI(item, index)">{{cartComboData[index].uiSpecName||'單一規格'}}</font>
              <font v-else @click="openSpecUI(item, index)">請選擇商品規格</font>
            </span>
            <span v-else>
              <font>單一規格</font>
            </span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <autoscreendialog :zIndex="1000" v-if="showDialog" v-on:closeDialog="closeDialog">
      <template v-slot:header>
        <div class="cart-header">
          <img :src="specData.image_url" />
          <span class="text-break-1">{{specData.name}}</span>
        </div>
      </template>
      <template v-slot:body>
        <div class="cart-combo-body">
          <specbox :isCombo="true" :specInfo="specData.variants" :comboInfo="comboInfo" :cartComboData="cartComboData" :nowOpenComboUIIdx="nowOpenSpecIndex" :nowVarientsIndex="nowVarientsIndex" v-on:setSpecInfo="setSpecInfo" :pid="nowOpenPid" />
        </div>
      </template>
      <template v-slot:footer>
        <div ref="footer" class="cart-footer d-flex">
          <button class="confirmBtn" @click="closeDialog" value="">確定</button>
        </div>
      </template>

    </autoscreendialog>
  </div>
</template>

<script>
import autoscreendialog from "../common/autoscreenDialog.vue"; // 蓋版提示框
import specbox from "./specbox"; //規格一 規格二 選擇

export default {
  name: "buycombo",
  data() {
    return {
      showDialog: false, // 是否顯示規格視窗
      specData: {}, // 規格視窗資料
      nowOpenSpecIndex: 0, // 目前開啟哪個商品 Array idx
      cartComboData: [], // 儲存組合商品規格購物車資料
      uiComboData: [],
      nowOpenPid: null, // 目前開啟哪個商品PID
      nowVarientsIndex: 0, // 目前已選擇哪個規格1資料 Array idx
    };
  },
  components: {
    autoscreendialog,
    specbox,
  },
  props: {
    // 組合商品API資料
    comboInfo: {
      type: Object,
    },
  },
  created() {
    this.cartComboData = this.comboInfo.cartComboData;
    this.uiComboData = this.comboInfo.uiComboData;
    // this.variantsSelectedIdx = new Array(this.uiComboData.length).fill(0);
    // this.subLayerVariants = new Array(this.uiComboData.length).fill(null);
    this.sendCartComboData();
  },
  computed: {},
  methods: {
    //  開啟規格選擇框
    openSpecUI(obj, index) {
      this.nowOpenSpecIndex = index;
      this.specData = obj;
      this.showDialog = true;
      this.nowOpenPid = obj.pid;
    },
    //  關閉規格選擇框
    closeDialog() {
      this.showDialog = false;
    },
    // 規格選擇設定 綁定specBox.vue
    setSpecInfo(obj) {
      this.cartComboData[this.nowOpenSpecIndex] = Object.assign(
        this.cartComboData[this.nowOpenSpecIndex],
        {
          specId: obj.nowSelectedSpecId,
          specName: obj.nowSelectedSpecName,
          uiSpecName: obj.uiSpecName,
          isSelected: true,
        }
      );
      this.nowVarientsIndex = obj.nowVarientsIndex;
    },
    // 初始化組合商品資料
    sendCartComboData() {
      this.$emit("setCombo", this.cartComboData);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/color.scss";
@import "../../style/mixin.scss";

label {
  color: $web_minor;
  font-size: 1.4rem;
  line-height: 30px;
}

.cart-combo {
  &-body {
    padding: 0 15px 15px 15px;
  }
  &__item {
    display: flex;
    margin-bottom: 12px;

    &.soldout {
      border-radius: 10px;
      background-color: $background;

      img,
      span {
        opacity: 0.5;
      }
    }

    &-image {
      width: 100px;
      flex-basis: 100px;
      max-width: 100px;

      img {
        width: 100%;
        display: block;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
      }
    }

    &-name {
      width: 70%;
      max-width: 68%;
      padding: 10px 6px;
      font-size: 1.4rem;
      position: relative;

      > span {
        height: 40px;
        @include font-break(2);
      }
    }

    &-spec {
      position: absolute;
      bottom: 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      span {
        &:first-child {
          flex: 1 1 70%;
        }
        &:last-child {
          display: flex;
          flex: 1 1 30%;
          justify-content: flex-end;
          align-items: center;
          padding-right: 20px;
          text-align: right;
        }
      }

      font {
        display: block;
        width: 100%;
        color: $web_minor;
      }
    }

    &-select {
      position: relative;
      width: 100%;
      padding: 6px 10px;
      border: 0;
      border-radius: 8px;
      outline: none;
      color: $web_minor;
      background: $background
        url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0xMS42MzEgNC40Yy4yMzUgMCAuNDY1LjA2Ny42NTkuMTkuNTAyLjMyMi42NTMuOTQ2LjM2NiAxLjQzNmwtLjA2LjA5LTMuNjMyIDUuMDA1YTEuMTM2IDEuMTM2IDAgMCAxLS4zMDcuMjg4IDEuMjIxIDEuMjIxIDAgMCAxLTEuNTU2LS4yMDRsLS4wNjctLjA4NS0zLjYzMS01LjAwNGExLjA1MiAxLjA1MiAwIDAgMS0uMjAzLS42MThjMC0uNTcuNDYzLTEuMDQgMS4wNTYtMS4wOTNsLjExMi0uMDA1aDcuMjYzeiIgZmlsbD0iIzNDM0MzQyIgZmlsbC1ydWxlPSJub256ZXJvIi8+Cjwvc3ZnPgo=")
        center right 5px no-repeat;
      appearance: none;
      &.active {
        font {
          color: $web_main;
        }
      }
    }
  }
}
</style>
