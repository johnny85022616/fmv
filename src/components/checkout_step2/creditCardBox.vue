<template>
  <div class="creditCardBox">
    <div class="box">
      <div class="creditInfo">
        <p class="bankName">{{ creditCardInfo.bankName}}</p>
        <div>
          <i :class="`creditCardType${creditCardInfo.creditCardType}`"></i>
          <p>**** {{creditCardInfo.lastFourDigits}}</p>
          <p>{{expireMonth}}/{{expireYear}}</p>
          <p>(預設)</p>
        </div>
      </div>
      <div class="checkInput">
        <input type="text" maxlength="3" placeholder="末三碼" :value="cavv" @change="(e)=>handleCavvChange(e)">
      </div>
    </div>
    <p v-if="isBankLinkShow" class="notice"><i class="notice_gray"></i>信用卡分期金額除不盡餘數於第一期收取，查看<span @click="openCenterDialog">(適用銀行)</span></p>
    <popupDialog v-if="isPopupOpen" @closeCenterDialog="closeCenterDialog" :isSimple="true">
      <div class="bankList">
        {{bankList}}
      </div>
    </popupDialog>
  </div>
</template>

<script>
import popupDialog from "../common/popupDialog.vue";
export default {
  name: "creditCardBox",
  data() {
    return {
      isPopupOpen: false,
    };
  },
  props: {
    creditCardInfo: {
      type: Object,
    },
    nowPayType: {
      type: String,
    },
    banks: {
      type: Array,
    },
    cavv: {
      type: String,
    },
  },
  methods: {
    openCenterDialog() {
      this.isPopupOpen = true;
    },
    closeCenterDialog() {
      this.isPopupOpen = false;
    },
    //cavv同步到payTypeBox
    handleCavvChange(e) {
      this.$emit("setCavv", e.target.value);
    },
  },
  created() {},
  computed: {
    expireYear() {
      return this.creditCardInfo.expiration.substr(2, 2);
    },
    expireMonth() {
      return this.creditCardInfo.expiration.substr(4);
    },
    isBankLinkShow() {
      if (/(PAYTYPE_CARD_1|PAYTYPE_CARDC_1)/.test(this.nowPayType)) {
        return false;
      }
      return true;
    },
    bankList() {
      return this.banks.join("、");
    },
  },
  components: { popupDialog },
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";
.creditCardBox {
  font-size: 14px;
  .box {
    padding: 15px;
    background-color: $background;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .creditInfo {
      width: 70%;
      .bankName {
        margin-bottom: 5px;
      }
      > div {
        display: flex;
        i {
          width: 39px;
          height: 24px;
          margin-right: 5px;
        }
        p {
          color: $sliver;
          margin-right: 8px;
        }

        .creditCardType1 {
          background: url(../../images/icons/visa.png) center/39px 24px
            no-repeat;
        }

        .creditCardType2 {
          background: url(../../images/icons/mastercard.png) center/39px 24px
            no-repeat;
        }

        .creditCardType4 {
          background: url(../../images/icons/jcb.png) center/39px 24px no-repeat;
        }
      }
    }
    .checkInput {
      width: 25%;
      input {
        width: 100%;
        border: 1px solid $sliver;
        border-radius: 3px;
        background-color: $background;
        padding: 10px;
        font-size: 14px;
        min-width: 0;
        box-sizing: border-box;
        text-align: center;
      }
    }
  }
  .notice {
    color: $sliver;
    margin: 10px 0;
    i {
      margin-right: 5px;
    }
    span {
      color: $blue;
    }
  }
  .bankList {
    margin-bottom: 50px;
  }
}
</style>
