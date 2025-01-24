<template>
  <div class="agreeBox">
    <div class="agree_checkbox">
      <div>
        <i :class="['checkbox' , {active: isFridayMemberAgree}]" @click="isFridayMemberAgreeSwitch"></i>
        <p>我已閱讀並同意friDay購物會員 </p>
      </div>
      <p class="dialogBtn">《<span @click="openAgreeDialog(1)">服務條款</span>》及《<span @click="openAgreeDialog(2)">隱私權政策</span>》</p>
    </div>
    <div class="agree_checkbox">
      <div>
        <i :class="['checkbox' , {active: isSendEdmAgree}]" @click="isSendEdmAgreeSwitch"></i>
        <p>我願意收到friDay購物優惠訊息電子報 </p>
      </div>
    </div>
    <div class="agree_checkbox">
      <div>
        <i :class="['checkbox' , {active: isSendSmsAgree}]" @click="isSendSmsAgreeSwitch"></i>
        <p>我願意收到friDay購物各項簡訊及電話通知</p>
      </div>
    </div>
    <fullscreenDialog v-if="isAgreeDialogOpen" :isFullscreen="true" @closeDialog="closeAgreeDialog">
      <template v-if="dialogType === 1" v-slot:header>購物約定條款</template>
      <template v-else v-slot:header>隱私權政策</template>
      <template v-slot:body>
        <ecTerms v-if="dialogType === 1" />
        <ecPrivacy v-else></ecPrivacy>
        <div class="submitBtn">
          <span @click="closeAgreeDialog">確認</span>
        </div>
      </template>
    </fullscreenDialog>
  </div>
</template>

<script>
import fullscreenDialog from "../common/fullscreenDialog.vue";
import ecTerms from "../website/ec_terms.vue";
import ecPrivacy from "../website/ec_privacy.vue";
export default {
  name: "agreeBox",
  data() {
    return {
      isFridayMemberAgree: true, //同意friDay購物會員
      isSendEdmAgree: true, //願意收到friDay購物優惠訊息電子報
      isSendSmsAgree: true, //意收到friDay購物各項簡訊及電話通知
      isAgreeDialogOpen: false,
      dialogType: null,
    };
  },
  props: {
    formSubmit: {
      type: Boolean,
      default: false,
    },
    memberData: {
      type: Object,
    },
  },
  methods: {
    //設定之前的資料
    setOldData() {
      if (this.memberData) {
        const { sendEdm, sendSms } = this.memberData;
        this.isSendEdmAgree = sendEdm;
        this.isSendSmsAgree = sendSms;
      }
    },
    isFridayMemberAgreeSwitch() {
      this.isFridayMemberAgree = !this.isFridayMemberAgree;
    },
    isSendEdmAgreeSwitch() {
      this.isSendEdmAgree = !this.isSendEdmAgree;
    },
    isSendSmsAgreeSwitch() {
      this.isSendSmsAgree = !this.isSendSmsAgree;
    },
    openAgreeDialog(dialogType) {
      this.dialogType = dialogType;
      this.isAgreeDialogOpen = true;
    },
    closeAgreeDialog() {
      this.isAgreeDialogOpen = false;
    },
    //檢查是否全打勾
    submit() {
      let pass = true;
      if (!this.isFridayMemberAgree) {
        pass = false;
        this.api.ui.alert.getFadeAlert("尚未同意服務條款及隱私權政策");
      }

      return {
        pass,
        sendEDM: this.isSendEdmAgree,
        sendSMS: this.isSendSmsAgree,
      };
    },
  },
  created() {
    this.setOldData();
  },
  watch: {
    memberData() {
      this.setOldData;
    },
  },
  components: { fullscreenDialog, ecTerms, ecPrivacy },
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";
.agreeBox {
  padding: 20px 0;
  background-color: $white;
  .agree_checkbox {
    margin-bottom: 10px;
    > div {
      display: flex;
      justify-content: flex-start;
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
