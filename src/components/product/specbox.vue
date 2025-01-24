<template>
  <div class="cart-spec-box wrap">
    <div v-if="specInfo && (specInfo.length >= 1 || (specInfo.subVariants && specInfo.subVariants.length > 0))" class="wrap">
      <label>{{ specTitle }}</label>
      <div class="cart-spec-box__items">
        <a @click="changeFirstSpec(index)" v-for="(item, index) of specInfo" :key="index" :class="['cart-spec-box__item', {active: nowSpecIndex === index, disable: item.isSoldOut}]" :title="item.name">
          <font v-if="item.name">{{ item.name }}</font>
          <font v-else>單一規格</font>
        </a>
      </div>
    </div>

    <div v-if="nowGroupInfo.length > 0" class="wrap">
      <label>{{ specTitle2 }}</label>
      <div class="cart-spec-box__items">
        <a @click="changeChooseSpec(item.id, index)" v-for="(item, index) of nowGroupInfo" :key="index" :class="['cart-spec-box__item', {active: nowSpecId === item.id, disable: item.isSoldOut}]" :title="item.name">
          {{ item.name }}
        </a>
      </div>
    </div>

    <div v-if="!isCombo" class="cart-spec-qty">
      <div>
        <label>數量</label>
        <div class="cart-spec-qty-choose">
          <i @click="minus()" :class="['minus', {'active': isMinusActive}]"></i>
          <div class="count">
            <input type="number" @blur="setCartBuyQuantity" @input="inputCartBuyQuantity" v-model="cartBuyQuantity" maxlength="2" />
          </div>
          <i @click="plus()" :class="['plus', {'active': isPlusActive}]"></i>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "specbox",
  data() {
    return {
      nowGroupIndex: 0,
      nowGroupInfo: [], // 目前的規格2陣列
      nowSpecId: null, // 當前選擇的規格ID
      nowFirstSpecName: '', // 目前選擇的規格1名稱
      nowSecondSpecName: '', // 目前選擇的規格2名稱
      nowSpecName: '', // 目前選擇的規格名稱 組合商品下拉會顯示
      nowSpecMappingName: "", // 用來Mapping規格2已選擇的項目
      nowSpecQty: 0,
      nowSpecIndex: 0,
      cartBuyQuantity: 1,
      isOneLayerSpec: true, // 是否為單規格
    };
  },
  components: {},
  props: {
    // 是否為組合商品
    isCombo: {
      type: Boolean,
      default: () => false,
    },
    // 組合商品資料
    comboInfo: {
      type: Object,
      default: () => null,
    },
    // 規格資料
    specInfo: {
      type: Array,
    },
    // 來自組合商品buycombo資料 用來判斷可買量
    cartComboData: {
      type: Array,
      default: () => null,
    },
    // 目前開啟的組合商品規格 index
    nowOpenComboUIIdx: {
      type: Number,
      default: () => 0
    },
    // 目前已選擇哪個規格1資料 Array idx
    nowVarientsIndex: {
      type: Number,
      default: () => 0
    },
    pid: {
      required: true,
    },
  },
  created() {
    // 若來自組合商品buycombo已選取的購物車資料, 判斷是否已經選取過
    const oriComboData = this.cartComboData[this.nowOpenComboUIIdx]
    
    // 組合商品已選取過
    if (oriComboData && oriComboData.isSelected) {
      this.nowSpecId = oriComboData.specId; // 設定上次ID
      this.nowSpecName = oriComboData.specName; // 設定上次規格名稱
      this.nowSecondSpecName = oriComboData.specName;
      this.nowSpecQty = oriComboData.qty; // 設定上次購買量
      this.cartBuyQuantity = oriComboData.purchase_min_qty; // 設定上次最低量
      this.nowSpecIndex = this.nowVarientsIndex; // 設定上次已選擇的規格1 Array idx

      // 設定規格1名稱 外層會用到
      this.nowFirstSpecName = this.specInfo[this.nowSpecIndex].name;
      
      // 依照上次選擇的規格1 Array idx, 找出畫面需要的規格2資料
      const lastTimeSpec = this.specInfo[this.nowVarientsIndex];
      if (lastTimeSpec.subVariants) {
        this.isOneLayerSpec = false;
        this.nowGroupInfo = lastTimeSpec.subVariants;
      } else {
        this.nowGroupIndex = lastTimeSpec;
      }

    } else {
      const specInfo = this.specInfo;
      // 定義預設規格
      if (specInfo && specInfo.length > 0) {
        // 取得預設的規格資料，判斷是否為SOLD OUT
        specInfo.some((v, i) => {
          if (!v.subVariants) {
            this.isOneLayerSpec = true;

            if (!v.isSoldOut) {
              this.nowSpecId = v.id;
              this.nowSpecName = v.name
              this.nowFirstSpecName =v.name;
              this.nowSpecQty = v.qty;
              this.cartBuyQuantity = v.purchaseMinQty;
              this.nowSpecIndex = i;
              return true;
            }
          } else {
            this.isOneLayerSpec = false;
            // 設定規格1名稱 外層會用到
            this.nowFirstSpecName = this.specInfo[this.nowSpecIndex].name;
            
            const subSpecExisted = v.subVariants.some((val, idx) => {
              if (!val.isSoldOut) {
                this.nowSpecId = val.id;
                this.nowSpecName = val.name
                this.nowSpecMappingName = val.name;
                this.nowSecondSpecName = val.name;
                this.nowSpecQty = val.qty;
                this.cartBuyQuantity = val.purchaseMinQty;
                this.nowSpecIndex = i;
                this.nowGroupIndex = idx;
                this.nowGroupInfo = v.subVariants;
                return true;
              }
            });

            return subSpecExisted;
          }
        });
      }
      this.sendSpecInfo();
    }
  },
  computed: {
    specTitle() {
      return this.specInfo && this.specInfo[0].groupTitle
        ? this.specInfo[0].groupTitle
        : "規格一";
    },
    specTitle2() {
      return this.specInfo && this.specInfo[0].subVariants
        ? this.specInfo[0].subVariants[0].groupTitle
        : "規格二";
    },
    isMinusActive() {
      const dataObj = this.isOneLayerSpec
        ? this.specInfo[this.nowSpecIndex]
        : this.nowGroupInfo[this.nowGroupIndex];
      return this.cartBuyQuantity !== dataObj.purchaseMinQty;
    },
    isPlusActive() {
      // 組合商品以選擇的商品規格條件為主
      if (this.isCombo) {
        const cpQty = this.comboInfo.saveComboPurchaseQty;
        return cpQty > this.cartBuyQuantity;
      } else {
        const dataObj = this.isOneLayerSpec
          ? this.specInfo[this.nowSpecIndex]
          : this.nowGroupInfo[this.nowGroupIndex];
        return dataObj.purchase_qty > this.cartBuyQuantity;
      }
    },
  },
  methods: {
    sendSpecInfo() {
      this.$emit("setSpecInfo", {
        nowSelectedSpecId: this.nowSpecId,
        nowSelectedSpecName: this.isOneLayerSpec ? this.nowFirstSpecName : this.nowFirstSpecName + ' ' + this.nowSecondSpecName,
        uiSpecName: this.isOneLayerSpec ? this.nowFirstSpecName : this.nowFirstSpecName + ' ' + this.nowSecondSpecName,
        qty: this.nowSpecQty,
        cartBuyQuantity: this.cartBuyQuantity,
        nowVarientsIndex: this.nowSpecIndex
      });
    },
    /* 切換規格一有情境為二
     *  單規格 - 取規格一資料為主
     *  雙規格 - 以規格一連動規格二切換
     */
    changeFirstSpec(idx) {
      // 已售完
      if (this.specInfo[idx].isSoldOut) {
        return;
      }

      // 設定規格一在Array第幾個
      this.nowSpecIndex = parseInt(idx);

      // 單規格
      if (this.isOneLayerSpec) {
        this.cartBuyQuantity = this.specInfo[idx].purchaseMinQty;
        this.nowSpecId = this.specInfo[idx].id;
        this.nowSpecName = this.specInfo[idx].name;
        this.nowFirstSpecName = this.specInfo[idx].name;
        this.nowSpecQty = this.specInfo[idx].qty;
        this.$emit("changeSpecInfo", {
          specId: this.specInfo[idx].id,
          isSoldOut: this.specInfo[idx].isSoldOut,
        });
        this.sendSpecInfo();
        return;
      }

      // 設定規格1名稱 外層會用到
      this.nowFirstSpecName = this.specInfo[this.nowSpecIndex].name;

      // 雙規格 找出其他已經選好的規格2是哪一個， 當切換規格1時，可以預選到前面的規格2
      let lstObj = this.specInfo[this.nowSpecIndex].subVariants.filter(
        (v, i) => {
          if (v.name === this.nowSpecMappingName) {
            return Object.assign(v, { index: i });
          } else {
            return null;
          }
        }
      );
      
      // 若是有前一個規格2的資料，則預選到前一個
      if (lstObj && lstObj.length > 0) {
        lstObj = lstObj[0];
        this.nowGroupIndex = lstObj.index;
        this.cartBuyQuantity = lstObj.purchaseMinQty;
        this.nowSpecId = lstObj.id;
        this.nowSpecName = lstObj.name;
        this.nowSecondSpecName = lstObj.name;
        this.nowSpecQty = lstObj.qty;
        this.nowGroupInfo = Object.assign(this.specInfo[this.nowSpecIndex].subVariants, {
              group1: this.specInfo[this.nowSpecIndex].name
            });
        this.$emit("changeSpecInfo", {
          specId: lstObj.id,
          isSoldOut: lstObj.isSoldOut,
        });
        this.sendSpecInfo();
      } else {
        // 沒有前一個規格2的資料，則預選到第一個有貨的
        this.specInfo[this.nowSpecIndex].subVariants.some((v, i) => {
          if (!v.isSoldOut) {

            this.nowGroupIndex = i;
            this.cartBuyQuantity = v.purchaseMinQty;
            this.nowSpecId = v.id;
            this.nowSpecName = v.name;
            this.nowSecondSpecName = v.name;
            this.nowSpecQty = v.qty;
            this.nowGroupInfo = Object.assign(this.specInfo[this.nowSpecIndex].subVariants, {
              group1: this.specInfo[this.nowSpecIndex].name
            });
            this.sendSpecInfo();
            return true;
          }
        });
      }
    },
    // 選擇目前規格
    changeChooseSpec(id, idx) {
      const { purchaseMinQty, name, qty, isSoldOut } =
        this.nowGroupInfo[idx];

      if (isSoldOut) return ;

      this.nowGroupIndex = idx;
      this.cartBuyQuantity = purchaseMinQty;
      this.nowSpecId = id;
      this.nowSpecMappingName = name;
      this.nowSecondSpecName = name;
      this.nowSpecQty = qty;
      this.$emit("changeSpecInfo", { specId: id, isSoldOut });
      this.sendSpecInfo();
    },
    setCartBuyQuantity(obj) {
      if (obj.target.value === "") {
        this.cartBuyQuantity = 1;
      }
    },
    inputCartBuyQuantity(obj) {
      if (obj.target.value === "") {
        return;
      }
      this.checkCartBuyQuantity(parseInt(obj.target.value))
    },
    checkCartBuyQuantity(inputNumber) {
      const dataObj = this.isOneLayerSpec
        ? this.specInfo[this.nowSpecIndex]
        : this.nowGroupInfo[this.nowGroupIndex];
      const minQty = dataObj.purchaseMinQty;
      const maxQty = dataObj.qty;
      if (inputNumber === 0) {
        this.cartBuyQuantity = 1;
      } else if (inputNumber < minQty) {
        this.cartBuyQuantity = minQty;
        alert("最少購買量為" + minQty);
      } else if (inputNumber > maxQty) {
        if (/^(6|7|8|9)/i.test(inputNumber)) {
          this.cartBuyQuantity = maxQty;
        } else {
          this.cartBuyQuantity = inputNumber.toString().slice(0, -1);
        }
        alert("最多購買量為" + maxQty);
      } else {
        this.cartBuyQuantity = inputNumber;
        this.sendSpecInfo();
      }
    },
    minus() {
      // 當前畫面數量
      let nowQty = parseInt(this.cartBuyQuantity, 10);

      // 判斷1階規格還是2階，取得規格物件
      const dataObj = this.isOneLayerSpec
        ? this.specInfo[this.nowSpecIndex]
        : this.nowGroupInfo[this.nowGroupIndex];

      // 設定最小購買量
      const purchase_min_qty = dataObj.purchaseMinQty
        ? dataObj.purchaseMinQty
        : 1;

      // 計算畫面及可買量
      this.cartBuyQuantity = nowQty === purchase_min_qty
        ? purchase_min_qty
        : (nowQty -= purchase_min_qty);
      this.sendSpecInfo();
    },
    plus() {
      // 最大數量 不能超過
      let purchase_qty = 0;
      // 最小購買量
      let purchase_min_qty = 0;
      // 當前畫面數量
      let nowQty = parseInt(this.cartBuyQuantity, 10);

      // 判斷是否組合商品
      if (this.isCombo) {
        purchase_qty = this.comboInfo.saveComboPurchaseQty;
        purchase_min_qty = 1;
      } else {
        // 判斷1階規格還是2階，取得規格物件
        const dataObj = this.isOneLayerSpec
          ? this.specInfo[this.nowSpecIndex]
          : this.nowGroupInfo[this.nowGroupIndex];
        
        // 設定最小購買量
        purchase_min_qty = dataObj.purchaseMinQty
          ? dataObj.purchaseMinQty
          : 1;

        // 設定最大購買量
        purchase_qty = this.api.product.getVariantsQtyMax(dataObj);
      }

      // 計算畫面及可買量
      this.cartBuyQuantity = nowQty < purchase_qty ? (nowQty += purchase_min_qty) : purchase_qty;
      this.sendSpecInfo();
    },
  },
};
</script>

<style lang="scss" scoped>
.cart-spec-box {
  max-width: 100%;
  width: 100%;
  flex-direction: column;
  height: 100%;

  label {
    color: #adadad;
    line-height: 50px;
  }
  &__items {
    display: flex;
    flex-wrap: wrap;
  }

  &__item {
    display: block;
    position: relative;
    margin-right: 10px;
    margin-bottom: 5px;
    padding: 5px 10px;
    border-radius: 8px;
    color: #3c3c3c;
    border: 1px solid #e0e0e0;
    font-size: 14px;
    word-break: break-all;
    word-wrap: break-word;

    &.disable {
      color: #e0e0e0;
      border: 1px dashed #e0e0e0;
    }

    &.active {
      color: #f34f59;
      border: 1px solid #f34f59;
      border-bottom-right-radius: 0;
      background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDEyIDEyIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGc+CiAgICAgICAgICAgIDxnPgogICAgICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICAgICAgICAgIDxnPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGZpbGw9IiNGMzRGNTkiIGQ9Ik0xMiAwdjEwYzAgMS4xMDUtLjg5NSAyLTIgMkgwTDEyIDB6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTYuMDAwMDAwLCAtNTQ4LjAwMDAwMCkgdHJhbnNsYXRlKDAuMDAwMDAwLCAyMC4wMDAwMDApIHRyYW5zbGF0ZSgyMC4wMDAwMDAsIDQ2NS4wMDAwMDApIHRyYW5zbGF0ZSgwLjAwMDAwMCwgNDUuMDAwMDAwKSB0cmFuc2xhdGUoMzYuMDAwMDAwLCAxOC4wMDAwMDApIi8+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0xMC4zODYgNi4wMDJjLS4xNTYuMDExLS4zLjA4Ny0uNDA0LjIxbC0yLjI0NSAyLjU4LTEuMjM1LTEuMTE3Yy0uMjQ0LS4yMzUtLjYyMi0uMjE3LS44NDUuMDQtLjIyMy4yNTgtLjIwNi42NTguMDM4Ljg5M2wuMDMuMDI3TDcuNCAxMC4xNWMuMjQ1LjIyMi42MTIuMi44My0uMDVsMi42MzUtMy4wMzJjLjIyOC0uMjUzLjIxOS0uNjUzLS4wMi0uODkzLS4xMjMtLjEyNC0uMjktLjE4Ny0uNDYtLjE3MyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTU2LjAwMDAwMCwgLTU0OC4wMDAwMDApIHRyYW5zbGF0ZSgwLjAwMDAwMCwgMjAuMDAwMDAwKSB0cmFuc2xhdGUoMjAuMDAwMDAwLCA0NjUuMDAwMDAwKSB0cmFuc2xhdGUoMC4wMDAwMDAsIDQ1LjAwMDAwMCkgdHJhbnNsYXRlKDM2LjAwMDAwMCwgMTguMDAwMDAwKSIvPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+Cg==")
        right bottom no-repeat;
    }
  }
}

.cart-spec-qty {
  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &-choose {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    font-size: 16px;

    &__hint {
      margin-right: 1rem !important;
      font-size: 1.2rem;
    }

    input {
      min-width: 20px;
      max-width: 40px;
      border: 0;
      outline: none;
      font-size: 1.6rem;
      text-align: center;
    }

    span {
      color: #aaaaaa;
      padding: 0 10px;
    }
  }
}
</style>
