<template>
  <div class="fcoinDialog">
    <fullscreenDialog :isFullscreen="true" @closeDialog="closefcoinDialog">
      <template v-slot:header>遠傳幣明細</template>
      <template v-slot:body>
        <div class="fcoinArea">
          <p class="own">您的遠傳幣是： {{fcoin}}</p>
          <div class="promotion" v-if="isPromotionShow">
            <p class="rateMax">遠傳幣<span class="red">{{ promotionData.fcoinEventMaxCoin }}</span>以內的1幣可折{{ promotionData.fcoinEventRate }}元</p>
            <p class="gray">(超過的部分，1幣可折1元)</p>
          </div>
          <p class="label">請輸入要折抵多少遠傳幣</p>
          <input type="tel" v-model="fcoinVal" @blur="handleBlur">
        </div>
        <div class="submitBtn">
          <span @click="confirmClick">確認</span>
        </div>
      </template>
    </fullscreendialog>
  </div>
</template>

<script>
import fullscreenDialog from "../../common/fullscreenDialog.vue";
export default {
  name: "fcoinDialog",
  data() {
    return {
      fcoinVal: 0,
      fcoinData: null, //要送到orderBox的data
      dialogSum: 0, //只給dialog計算用
    };
  },
  props: {
    fcoin: {
      type: Number,
    },
    calcSum: {
      type: Number,
    },
    promotionData: {
      type: Object,
    },
    preFcoinDiscount: {
      type: Number,
    },
  },
  methods: {
    //關閉選擇門市popup
    closefcoinDialog() {
      this.$emit("closeFcoinDialog");
    },
    //設定只在dialog內計算的sum(為calcSum加上上次同dialog扣除值)
    setDialogSum() {
      this.dialogSum = this.calcSum;
      let preFcoinDiscount = this.preFcoinDiscount;
      preFcoinDiscount = preFcoinDiscount !== null ? preFcoinDiscount : 0;
      this.dialogSum = this.dialogSum + preFcoinDiscount;
    },
    //避免刪除inputValue再拿去計算會出現NaN
    handleBlur() {
      if (this.fcoinVal === "") this.fcoinVal = 0;
    },
    //公式 計算遠傳幣換算折抵金額
    getFcoinExchangePrice() {
      return this.api.promotion.getFcoinExchangePrice(parseInt(this.fcoinVal));
    },
    //檢查輸入值
    checkInputVal() {
      let success = true;
      //檢查是否超過餘額
      if (this.fcoinVal > this.fcoin) {
        this.fcoinVal = this.fcoin;
        success = false;
      }
      //計算有倍率和無倍率fcoin換算金額
      const changeData = this.getFcoinExchangePrice();
      this.fcoinData = changeData;
      //檢查是否超過實付金額
      if (changeData.total > this.dialogSum) {
        this.fcoinVal = 0;
        success = false;
      }
      if (!success) {
        alert("點數折抵金額超出上限");
      }
      return success;
    },
    //確定按鈕
    confirmClick() {
      const success = this.checkInputVal();
      if (success) {
        this.$emit("setFcoinData", this.fcoinData);
        this.closefcoinDialog();
      }
    },
  },
  async created() {
    this.setDialogSum();
  },
  watch: {
    fcoinVal(val) {
      val = val.toString();
      this.fcoinVal = val.replace(/[^\d]/g, "");
    },
  },
  components: { fullscreenDialog },
  computed: {
    isPromotionShow() {
      return this.promotionData && this.promotionData.hasActive;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../style/_color.scss";

.fcoinDialog {
  .fcoinArea {
    text-align: center;
    margin: 40px 0;
    .own {
      margin-bottom: 30px;
    }
    .label {
      margin-bottom: 5px;
    }
    input {
      border: 1px solid #cbced9;
      border-radius: 3px;
      padding: 10px;
      box-sizing: border-box;
      background-color: #fcfcfc;
      text-align: center;
      width: 200px;
      height: 55px;
      font-size: 20px;
    }
    .promotion {
      margin-bottom: 30px;
      .rateMax {
        font-size: 16px;
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
    display: flex;
    align-items: center;
    justify-content: center;
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
  .red {
    color: $red;
  }
  .gray {
    color: $sliver;
  }
}
</style>
