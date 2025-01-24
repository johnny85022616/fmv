<template>
  <div class="voucherDialog">
    <fullscreenDialog :isFullscreen="true" @closeDialog="closeVoucherDialog">
      <template v-slot:header>firDay購物金明細</template>
      <template v-slot:body>
        <div class="voucherArea">
          <p class="own">您的friDay購物金是： {{voucher}}</p>
          <p class="label">請輸入要折抵多少friDay購物金</p>
          <input type="tel" v-model="voucherVal" @blur="handleBlur">
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
  name: "voucherDialog",
  data() {
    return {
      voucherVal: 0,
      dialogSum: 0, //只給dialog計算用
    };
  },
  props: {
    //購物金餘額
    voucher: {
      type: Number,
    },
    calcSum: {
      type: Number,
    },
    preVoucherDiscount: {
      type: Number,
    },
  },
  methods: {
    //設定只在dialog內計算的sum(為calcSum加上上次同dialog扣除值)
    setDialogSum() {
      this.dialogSum = this.calcSum;
      let preVoucherDiscount = this.preVoucherDiscount;
      preVoucherDiscount = preVoucherDiscount !== null ? preVoucherDiscount : 0;
      this.dialogSum = this.dialogSum + preVoucherDiscount;
    },
    //關閉選擇門市popup
    closeVoucherDialog() {
      this.$emit("closeVoucherDialog");
    },
    //避免刪除inputValue再拿去計算會出現NaN
    handleBlur() {
      if (this.voucherVal === "") this.voucherVal = 0;
    },
    //檢查輸入值
    checkInputVal() {
      let success = true;
      //檢查是否超過餘額
      this.voucherVal = parseInt(this.voucherVal);
      if (this.voucherVal > this.voucher) {
        this.voucherVal = this.voucher;
        success = false;
      }
      //檢查是否超過實付金額
      if (this.voucherVal > this.dialogSum) {
        this.voucherVal = 0;
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
        this.$emit("setVoucherVal", this.voucherVal);
        this.closeVoucherDialog();
      }
    },
  },
  async created() {
    this.setDialogSum();
  },
  watch: {
    voucherVal(val) {
      val = val.toString();
      this.voucherVal = val.replace(/[^\d]/g, "");
    },
  },
  components: { fullscreenDialog },
};
</script>

<style lang="scss" scoped>
@import "../../../style/_color.scss";

.voucherDialog {
  .voucherArea {
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
}
</style>
