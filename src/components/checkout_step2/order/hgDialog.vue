<template>
  <div class="hgDialog">
    <fullscreenDialog :isFullscreen="true" @closeDialog="closeHgDialog">
      <template v-slot:header>快樂購卡點數明細</template>
      <template v-slot:body>
        <div v-if="hgRule" class="hgArea">
          <p class="own">您目前有點數<span class="red">{{hg}}</span>點</p>
          <p class="max">(最多可折抵{{hgMax}}元)</p>
          <p class="label">這次想使用快樂購卡點數折抵多少元呢？</p>
          <p class="unit">(點數折抵金額須以10元為單位)</p>
          <input type="tel" v-model="hgVal" @blur="handleBlur">
          <p class="redNotice red">目前快樂購卡點數{{hgRule.points}}點折{{hgRule.dollars}}元
          </p>
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
  name: "hgDialog",
  data() {
    return {
      hgVal: 0,
      hgMax: null,
      dialogSum: 0,
    };
  },
  props: {
    //購物金餘額
    hg: {
      type: Number,
    },
    calcSum: {
      type: Number,
    },
    preHgPointDiscount: {
      type: Number,
    },
    hgRule: {
      type: Object,
    },
  },
  methods: {
    //關閉選擇門市popup
    closeHgDialog() {
      this.$emit("closeHgDialog");
    },
    //避免刪除inputValue再拿去計算會出現NaN
    handleBlur() {
      if (this.hgVal === "") this.hgVal = 0;
    },
    //設定只在dialog內計算的sum(為calcSum加上上次同dialog扣除值)
    setDialogSum() {
      this.dialogSum = this.calcSum;
      let preHgPointDiscount = this.preHgPointDiscount;
      preHgPointDiscount = preHgPointDiscount !== null ? preHgPointDiscount : 0;
      this.dialogSum = this.dialogSum + preHgPointDiscount;
    },
    getHgMax() {
      this.hgMax = this.api.member.getHgMax(this.dialogSum);
    },
    //檢查輸入值
    checkInputVal() {
      let success = true;
      this.hgVal = parseInt(this.hgVal);
      //檢查是否超過餘額
      if (this.hgVal > this.hgMax) {
        this.hgVal = this.hgMax;
        success = false;
      }
      if (this.hgVal > this.dialogSum) {
        this.hgVal = 0;
        success = false;
      }
      if (!(this.hgVal % 10) !== 0) {
        this.hgVal = Math.floor(this.hgVal / 10) * 10;
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
        this.$emit("setHgDiscountVal", this.hgVal);
        this.closeHgDialog();
      }
    },
  },
  async created() {
    this.setDialogSum();
    this.getHgMax();
  },
  watch: {
    hgVal(val) {
      val = val.toString();
      this.hgVal = val.replace(/[^\d]/g, "");
    },
  },
  components: { fullscreenDialog },
};
</script>

<style lang="scss" scoped>
@import "../../../style/_color.scss";

.hgDialog {
  .hgArea {
    text-align: center;
    margin: 40px 0;
    .own {
      font-size: 16px;
    }
    .max {
      margin-bottom: 30px;
    }
    .unit {
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
      margin-bottom: 15px;
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
