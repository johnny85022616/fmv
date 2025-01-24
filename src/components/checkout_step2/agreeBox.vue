<template>
  <div class="agreeBox">
    <div class="agree_checkbox">
      <div>
        <i :class="['checkbox' , {active: isFridayMemberAgree}]" @click="isFridayMemberAgreeSwitch"></i>
        <p>我已閱讀並同意</p>
      </div>
      <p class="dialogBtn" @click="openAgreeDialog">《<span>購物約定條款</span>》</p>
    </div>
    <fullscreenDialog v-if="isAgreeDialogOpen" :isFullscreen="true" @closeDialog="closeAgreeDialog">
      <template v-slot:header>購物約定條款</template>
      <template v-slot:body>
        <ecAgreement />
        <div class="submitBtn">
          <span @click="closeAgreeDialog">確認</span>
        </div>
      </template>
    </fullscreenDialog>
  </div>
</template>

<script>
import fullscreenDialog from "../common/fullscreenDialog.vue";
import ecAgreement from "../website/ec_agreement.vue";
export default {
  name: "agreeBox",
  data() {
    return {
      isFridayMemberAgree: true,
      isAgreeDialogOpen: false,
    };
  },
  props: {
    formSubmit: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    isFridayMemberAgreeSwitch() {
      this.isFridayMemberAgree = !this.isFridayMemberAgree;
    },
    openAgreeDialog() {
      if (this.siteData) {
        window.open(`/${this.siteData.urlSuffix}/website/appointment`);
      } else {
        this.isAgreeDialogOpen = true;
      }
    },
    closeAgreeDialog() {
      this.isAgreeDialogOpen = false;
    },
    submit() {
      if (this.isFridayMemberAgree) {
        return true;
      }
      return false;
    },
  },
  created() {},
  components: { fullscreenDialog, ecAgreement },
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";
.agreeBox {
  padding: 20px 20px;
  background-color: $white;
  .agree_checkbox {
    > div {
      display: flex;
      justify-content: center;
    }
    .checkbox {
      margin-right: 8px;
    }
    p {
      font-size: 1.4rem;
      color: $tundora;
    }
    .dialogBtn {
      margin-left: 20px;
      display: flex;
      justify-content: center;
      span {
        color: $blue;
      }
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
  text-align: center;
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
</style>
