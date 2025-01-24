<template>
  <div class="happyGo">
    <fullscreendialog v-if="showDialog" :isFullscreen="true" @closeDialog="closeDialog">
      <template v-slot:header>綁定HappyGo點數</template>
      <template v-slot:body>
        <div class="content">
          <img class="happyGoLogo" src="https://m.shopping.friday.tw/static/images/happygo-logo.png" alt="">
          <div class="form">
            <p>身分證末4碼</p>
            <input v-model="idnumber" @click="idNumberClick" @blur="idNumberBlur" :class="['ip' , {rb: errorMsg.idnumber && !isIdNumberInputFocus}]" type="text" maxlength="4" placeholder="請輸入身分證後四碼" :disabled="step===2">
            <p>手機號碼</p>
            <input v-model="phoneNum" @click="phoneClick" @blur="phoneBlur" :class="['ip' , {rb: errorMsg.phone && !isPhoneInputFocus}]" type="phone" maxlength="10" placeholder="請輸入手機號碼10碼" :disabled="step===2">
            <template v-if="step===2">
              <p>手機驗證碼</p>
              <input v-model="otp" @click="otpClick" @blur="otpBlur" :class="['ip' , {rb: errorMsg.otp && !isOtpInputFocus}]" type="phone" maxlength="4">
              <p class="timeNotice">請於30分鐘內輸入完畢，逾期失效。</p>
            </template>
            <span v-if="step===1" class="confirm" @click="step1Check">確定</span>
            <span v-else class="confirm" @click="step2Check">確定</span>
          </div>
          <div class="notice">
            <p>HAPPY GO使用規則請參閱<a :href="happyGoExplain">快樂購卡點數說明</a>，累兌點規範請依HAPPY GO官網說明為準。</p>
            <p class="m-top">如遇無法綁定或有HAPPY GO點數使用問題，您可直接於服務時間洽詢HAPPY GO客服中心。</p>
            <p>聯絡電話：02-7716-6888，服務時間：09:00~18:00(週一至週五)</p>
          </div>
        </div>
      </template>
    </fullscreendialog>
  </div>
</template>

<script>
import fullscreendialog from "../common/fullscreenDialog.vue"; // 全畫面蓋版提示框
export default {
  name: "happyGo",
  data() {
    return {
      errorMsg: { idnumber: "", phone: "", otp: "" },
      idnumber: "",
      phoneNum: "",
      otp: "",
      caseid: null,
      isIdNumberInputFocus: false,
      isPhoneInputFocus: false,
      isOtpInputFocus: false,
      step: 1,
    };
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  created() {},
  methods: {
    //關閉hg彈跳視窗
    closeDialog() {
      this.$emit("setHappyGoTag", false);
    },
    //檢查手機欄位
    checkMobile() {
      let tel = this.deleteSpace(this.phoneNum);
      if (!tel || (tel && tel.length <= 0)) {
        this.errorMsg.phone += ",手機欄位不可為空";
      }
      var mobilePhoneFormat = /09\d{8}$/;
      if (mobilePhoneFormat.test(tel) == false) {
        this.errorMsg.phone += ",手機格式錯誤";
      }
      if (this.errorMsg.phone != "") {
        this.phoneNum = "";
      }
    },

    //檢查身分證欄位
    checkIdNumber() {
      const id = this.deleteSpace(this.idnumber);
      if (!id || (id && id.length < 4)) {
        this.errorMsg.idnumber += ",身分證欄位不足4碼";
      }
      if (!/\d{4}/.test(id)) {
        this.errorMsg.idnumber += ",身分證格式錯誤";
      }
      if (this.errorMsg.idnumber != "") {
        this.idnumber = "";
      }
    },
    //檢查簡訊OTP欄位
    checkOtp() {
      var otp = this.deleteSpace(this.otp);
      if (!otp || otp.length < 1) {
        this.errorMsg.otp += ",驗證碼不可為空值";
      }
      if (!/\d{4}/.test(otp)) {
        this.errorMsg.otp += ",驗證碼格式錯誤";
      }
      if (this.errorMsg.otp != "") {
        this.otp = "";
      }
    },
    //刪除空白
    deleteSpace(str) {
      if (str && typeof str === "string") {
        str.replace(/\s/g, "");
      }
      return str;
    },
    //step1檢核+取得otp
    async step1Check() {
      this.cleanErrorMsg();
      this.checkMobile();
      this.checkIdNumber();
      if (this.errorMsg.idnumber || this.errorMsg.phone) {
        alert(`資料錯誤${this.errorMsg.phone}${this.errorMsg.idnumber}`);
        return false;
      }
      await this.getOtpCode();
      if (this.caseid) {
        this.step = 2;
      }
    },
    //step2檢核+happyGo綁定
    async step2Check() {
      this.cleanErrorMsg();
      this.checkOtp();
      if (this.errorMsg.otp) {
        alert(`資料錯誤${this.errorMsg.otp}`);
        return false;
      }
      await this.hgBinding();
    },
    idNumberClick() {
      this.isIdNumberInputFocus = true;
      this.isPhoneInputFocus = false;
    },
    phoneClick() {
      this.isPhoneInputFocus = true;
      this.isIdNumberInputFocus = false;
    },
    otpClick() {
      this.isOtpInputFocus = true;
    },
    idNumberBlur() {
      this.isIdNumberInputFocus = false;
    },
    phoneBlur() {
      this.isPhoneInputFocus = false;
    },
    otpBlur() {
      this.isOtpInputFocus = false;
    },
    //清除所有錯誤訊息
    cleanErrorMsg() {
      this.errorMsg.idnumber = "";
      this.errorMsg.phone = "";
      this.errorMsg.otp = "";
    },
    //清除所有input值
    cleanAllInputVal() {
      this.idnumber = "";
      this.phoneNum = "";
      this.otp = "";
    },
    //若任一隻api發生錯誤，導回step1
    backStart() {
      this.cleanErrorMsg();
      this.cleanAllInputVal();
      this.step = 1;
    },
    //取得otp
    async getOtpCode() {
      await fetch(
        `${this.configs.ysdtDomain()}/${
          this.siteData.urlSuffix
        }/FetchCoupon/hg_federate/${this.phoneNum}/${this.idnumber}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res && res.data && res.data.length !== 0) {
            this.caseid = res.data.caseid;
          } else {
            alert("取得驗證碼發生錯誤," + res.msg);
            this.backStart();
          }
        })
        .catch((err) => {
          alert("取得驗證碼發生錯誤");
          this.backStart();
          console.error(err);
        });
    },
    //happyGo綁定
    async hgBinding() {
      await fetch(
        `${this.configs.ysdtDomain()}/${
          this.siteData.urlSuffix
        }/FetchCoupon/hg_checkotp/${this.phoneNum}/${this.idnumber}/${
          this.caseid
        }/${this.otp}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res && res.data && res.data.remainPoint) {
            this.$emit("hgStatusUpdate", res.data.remainPoint);
            this.closeDialog();
          } else {
            alert("綁定失敗");
            this.backStart();
          }
        })
        .catch((err) => {
          console.error(err);
          alert("綁定失敗");
          this.backStart();
        });
    },
  },
  computed: {
    happyGoExplain() {
      return this.siteData
        ? `/${this.siteData.urlSuffix}/website/happygo`
        : "/ec2/card_intro";
    },
  },
  components: { fullscreendialog },
};
</script>

<style lang="scss" scoped>
@import "../../style/color";
.happyGo {
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 30px;
    .happyGoLogo {
      margin-top: 20px;
    }
    .form {
      margin-top: 20px;
      width: 95%;
      p {
        margin: 20px 0 10px 0;
        font-size: 1.5rem;
      }
      .ip {
        width: 100%;
        padding: 10px;
        border: 1px solid $alto;
        color: $mine-shaft;
        box-sizing: border-box;
        &.rb {
          border: 3px solid $red;
          background: #ffffea;
        }
      }
      .timeNotice {
        margin-top: 10px;
        color: $red;
        font-size: 1.3rem;
      }
      .confirm {
        display: inline-block;
        width: 100%;
        padding: 10px 0;
        margin-top: 35px;
        text-align: center;
        background: $clementine;
        font-size: 16px;
        color: $white;
        border: 0;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        letter-spacing: 0.2em;
        outline: 0;
      }
    }
    .notice {
      margin-top: 50px;
      p {
        &:first-of-type {
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>
