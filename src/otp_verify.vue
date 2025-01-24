<template>
  <div>
    <navigation :isShowRedTop="isShowRedTop" :windowY="200" v-on:stopBodyScroll="stopBodyScroll" />
    <div class="otp-verify">
      <div v-if="!hiddenNavigation" class="otp-verify__title">
        <i class="angle-left" @click="backPrevUrl"></i>
        <h1>查訂單</h1>
      </div>
      <div class="otp-verify__gap"></div>
      <div v-if="!isVerifyOtp" class="otp-verify__form">
        <div>
          <label for="">訂購人手機號碼</label>
          <input type="tel" value="09" maxlength="10" :class="['otp-verify__form-cell', {'has-error': cellPhoneNumberError}]" @keyup="changeCellPhone">
          <span class="otp-verify__form-error" ref="cellPhoneInput">請輸入正確手機號碼</span>
        </div>
        <div class="otp-verify__form-btns">
          <button class="otp-verify__form-send" @click="submitPhone">發送驗證碼簡訊</button>
        </div>
      </div>
      <div v-else class="otp-verify__form">
        <div>
          <label for="">訂購人手機號碼</label>
          <input type="tel" readonly="true" maxlength="10" class="otp-verify__form-cell default" :value="cellphone">
          <span class="otp-verify__form-error">請輸入正確手機號碼</span>
        </div>
        <div>
          <label for="">驗證碼</label>
          <div :class="['otp-verify__form-otp', {'has-error': otpVerifyFail}]">
            <input type="tel" maxlength="4" ref="otpInput" v-model="otpNumbers" @change="handleCodeFromAuto($event)" auto-complete="one-time-code">
          </div>
          <span class="otp-verify__form-error">驗證碼錯誤，請重新輸入。</span>
        </div>
        <div class="otp-verify__form-btns">
          <button class="otp-verify__form-send" @click="sendOtp">確認送出</button>
          <button class="otp-verify__form-resend" @click="sendPhone(true)">重新發送驗證碼簡訊</button>
        </div>
        <div class="otp-verify__form-resend-confirm">
          驗證碼簡訊將於 1 分鐘內發送至您的手機，若未收到簡訊，請點擊重新發送驗證碼簡訊按鈕，重新發送簡訊。
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列

export default {
  name: "invoiceManagement",
  components: {
    navigation,
  },
  data() {
    return {
      hiddenNavigation: false,
      isVerifyOtp: false,
      cellphone: "",
      otpNumbers: "",
      cellPhoneNumberError: false,
      otpVerifyFail: false,
      isShowRedTop: true,
    };
  },
  created() {
    window.addEventListener(
      "scroll",
      () => {
        const wy = window.scrollY;
        this.windowY = wy;
        this.currentY = wy !== 70 && wy !== 0 ? wy : this.currentY;
        this.isShowRedTop = wy > 0 ? false : true;
      },
      {
        passive: true,
      }
    );
    // 來自APP UIWEBVIEW及特定導購碼
    if (this.configs.hiddenCommonHeader.test(location.search)) {
      if (/device=app/i.test(location.search)) {
        this.hiddenNavigation = true;

        //若device為app則在cookie 加入 FEEC-B2C-DEVICE=APP(for app查訂單隱藏天)
        document.cookie = `FEEC-B2C-DEVICE=APP; max-age=${
          60 * 60
        }; path=/; secure;`;
      }
    }
  },
  mounted() {},
  methods: {
    stopBodyScroll(action, jumpCurrentY = true) {
      const body = document.body;
      if (!this.isStopScrolling) {
        body.style = "padding:0;margin:0;overflow:hidden;height:100%";
        this.isStopScrolling = !this.isStopScrolling;
      }
      if (action === "close") {
        body.style = "padding:0;margin:0;";
        if (jumpCurrentY) {
          setTimeout(() => {
            window.scrollTo(0, this.currentY);
          }, 0);
        }
        this.isStopScrolling = false;
      }
    },
    redirectLogin() {
      window.location.href = `//${
        window.location.host
      }/mobileweb/login?requestURL=${encodeURIComponent(
        "//" +
          window.location.host +
          "/mobileweb/member/ListMyOrderMenu?module=list"
      )}`;
    },
    submitPhone() {
      this.checkCellPhone();
      if (!this.cellPhoneNumberError) {
        this.sendPhone();
      }
    },
    sendPhone(isResend = false) {
      this.axios.get(`api/visitor/deal/sms/${this.cellphone}`).then((res) => {
        const data = res.data;

        if (data.code === 1 && data.payload && data.payload[0].otpCode) {
          this.isVerifyOtp = true;

          if (isResend) {
            this.resetOtp();
          }

          setTimeout(() => {
            this.$refs["otpInput"].focus();
          }, 1000);
        } else {
          this.isVerifyOtp = false;
          alert("系統發生錯誤請稍候再試");
        }
      });
    },
    handleCodeFromAuto(evt) {
      if (evt.target.value.length === 4) {
        document.querySelector(".otp-verify__form-send").style.opacity = "0.5";
        this.otpNumbers = evt.target.value;
        this.sendOtp();
      }
    },
    sendOtp() {
      const otp = this.otpNumbers;

      if (otp.length < 4) {
        alert("請輸入正確驗證碼");
        return false;
      }

      this.axios
        .get(`api/visitor/deal/verify/${this.cellphone}/${otp}`)
        .then((res) => {
          const data = res.data;

          if (
            data.code === 1 &&
            data.payload &&
            data.payload[0].check === "pass"
          ) {
            if (window.flutter_inappwebview !== undefined) {
              window.flutter_inappwebview.callHandler(
                "saveCheckedMobileNo",
                this.cellphone
              );
            }
            window.sessionStorage.setItem("visitorCellPhone", this.cellphone);
            window.sessionStorage.setItem("visitorOtp", otp);
            window.location.href =
              "/mobileweb/member/ListMyOrderMenu?module=list&otp=pass";
          } else {
            this.resetOtp();
            alert("請輸入正確驗證碼");
          }
        });
    },
    resetOtp() {
      this.otpNumbers = "";
    },
    changeCellPhone(evt) {
      this.cellphone = evt.target.value;
    },
    checkCellPhone() {
      if (!/^09/i.test(this.cellphone) || !/^\d{10}$/i.test(this.cellphone)) {
        this.cellPhoneNumberError = true;
      } else {
        this.cellPhoneNumberError = false;
      }
    },
    backPrevUrl() {
      if (this.isVerifyOtp) {
        this.isVerifyOtp = false;
      } else {
        window.history.go(-1);
      }
    },
  },
};
</script>

<style lang="scss">
@import "./style/reset.module.scss";
@import "./style/flex.module.scss";
@import "./style/rwd.module.scss";
@import "./style/icons.module.scss";
</style>

<style lang="scss" scoped>
@import "style/color.scss";

.otp-verify {
  &__title {
    position: relative;
    line-height: 5rem;
    text-align: center;
    i {
      top: 13px;
    }

    h1 {
      color: $web_main;
      font-size: 1.8rem;
    }
  }

  &__gap {
    display: block;
    height: 1rem;
    background-color: $background;
  }

  &__form {
    padding: 5px 15px 0 15px;
    font-size: 1.4rem;

    &-error {
      margin-top: 5px;
      color: $red;
      font-size: 1.1rem;
      display: none;
    }

    &-redirect {
      margin-top: 20px;
      text-align: center;
      a {
        color: $blue-ribbon;
        text-decoration: none;
      }
    }

    label {
      margin-top: 10px;
      width: 100%;
      display: block;
      margin-bottom: 5px;
    }

    &-btns {
      margin-top: 30px;
    }

    &-send {
      width: 100%;
      border: 0;
      border-radius: 10px;
      color: $white;
      font-size: 1.6rem;
      line-height: 4rem;
      background-color: $red;
    }

    &-resend {
      margin-top: 10px;
      width: 100%;
      border: 1px solid $red;
      border-radius: 10px;
      color: $red;
      font-size: 1.6rem;
      line-height: 4rem;
      background-color: $white;
    }

    &-cell {
      width: 100%;
      padding: 0 15px;
      border: 0;
      border-radius: 10px;
      color: $web_main;
      font-size: 1.6rem;
      line-height: 3rem;
      background-color: $web_inputbox;
      -webkit-appearance: none;
      box-sizing: border-box;
      letter-spacing: 0.1rem;

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
      }

      &:focus {
        outline: none;
      }

      &.default {
        background-color: $white;
        border: 1px solid $web_border;
      }

      &.has-error {
        border: 1px solid $red;

        & + span {
          display: block;
        }
      }
    }

    &-resend-confirm {
      margin-top: 20px;
      color: $web_minor;
    }

    &-otp {
      width: 100%;
      input {
        display: inline-block;
        width: 100%;
        border: 0;
        border-bottom: 1px solid $web_border;
        color: $web_main;
        font-size: 2.2rem;
        line-height: 36px;
        text-align: center;
        letter-spacing: 2rem;
        -webkit-appearance: none;
        &:focus {
          outline: none;
        }
        &::-webkit-inner-spin-button,
        &::-webkit-outer-spin-button {
          -webkit-appearance: none;
        }
      }

      &.has-error {
        & + span {
          display: block;
        }
      }
    }
  }
}
</style>
