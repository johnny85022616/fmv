
<template>
  <div class="myHg">
    <navigation :windowY="200" />
    <div class="header">
      <h1>啟用ＨAPPY GO卡累兌換點服務</h1>
    </div>
    <img src="./images/icons/happygo-logo.png" alt="" class="mainImg">
    <section class="myHgForm">
      <div :class="['myHgForm__input' , {error: identityNumAlert.length > 0}]">
        <p>身分證末4碼：</p>
        <input type="number" v-model="identityNum" @input="identityNum = setLength(identityNum,4)" placeholder="請輸入身分證末4碼" :disabled="step1Pass">
        <span>{{identityNumAlert}}</span>
      </div>
      <div :class="['myHgForm__input', {error: phoneAlert.length > 0}]">
        <p>手機號碼：</p>
        <input type="number" v-model="phone" @input="phone = setLength(phone,10)" placeholder="請輸入手機號碼" :disabled="step1Pass">
        <span>{{phoneAlert}}</span>
      </div>
      <div v-if="step1Pass" :class="['myHgForm__input', {error: otpAlert.length > 0}]">
        <p>驗證碼：</p>
        <input type="number" v-model="otp" placeholder="請輸入驗證碼">
        <span>{{otpAlert}}</span>
      </div>
      <div v-if="!step1Pass" class="submitBtn" @click="submiStep1"><span>繼續</span></div>
      <div v-else class="submitBtn" @click="submiStep2"><span>確定</span></div>
    </section>
    <section class="content">
      <p>HAPPY GO使用規則請參閱<a href="/intro/commonProblem">快樂購卡點數說明</a>，累兌點規範請依HAPPY GO官網說明為準。</p>
      <p class="m-top">如遇無法綁定或有HAPPY GO點數使用問題，您可直接於服務時間洽詢HAPPY GO客服中心。</p>
      <p>聯絡電話：02-7716-6888，服務時間：09:00~18:00(週一至週五)</p>
      <p><a href="https://www.happygocard.com.tw/official/textService.do">HAPPYGO線上通</a></p>
    </section>
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
export default {
  name: "myHg",
  data() {
    return {
      identityNum: "",
      identityNumAlert: "",
      phone: "",
      phoneAlert: "",
      otp: "",
      otpAlert: "",
      step1Pass: false,
      caseId: null,
    };
  },
  components: {
    navigation,
  },
  methods: {
    //設定長度
    setLength(str, len) {
      if (str.length > len) {
        return str.slice(0, len);
      }
      return str;
    },
    checkId(id) {
      if (id.length === 0) {
        return "身分證字號不可為空";
      }
      if (id.length < 4) {
        return "需為4碼";
      }
      return "";
    },
    //驗證身分證字號和手機
    checkIdAndPhone() {
      let pass = true;
      this.phoneAlert = "";
      this.identityNumAlert = "";
      let { checkMoblie } = this.tools;
      this.identityNumAlert = this.checkId(this.identityNum);
      this.phoneAlert = checkMoblie(this.phone);
      if (this.identityNumAlert || this.phoneAlert) pass = false;
      return pass;
    },
    //step1 驗證
    async submiStep1() {
      const checkPass = this.checkIdAndPhone();
      if (!checkPass) return;
      const d = await this.api.member.getFederateOTP(
        this.identityNum,
        this.phone
      );
      if (d && d.caseid) {
        this.caseId = d?.caseid;
        this.step1Pass = true;
      }
    },
    //驗證otp
    async submiStep2() {
      this.otpAlert = "";
      const postData = {
        caseId: this.caseId,
        idNoLast4: this.identityNum,
        mobileNo: this.phone,
        otpCode: this.otp,
      };
      const d = await this.api.member.checkHGFederateOTP(postData);
      if (!d) {
        this.otpAlert = "驗證錯誤";
        return;
      }
      location.href = "/memberCenter";
    },
  },
};
</script>

<style lang="scss">
@import "./style/reset.module.scss";
@import "./style/flex.module.scss";
@import "./style/rwd.module.scss";
@import "./style/icons.module.scss";
@import "./style/global.module.scss";
</style>

<style lang="scss" scoped>
@import "./style/_color.scss";
.myHg {
  margin-bottom: 80px;
  .header {
    margin: 0 auto;
    text-align: left;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    h1 {
      background: url(./images/icons/h-gcrad.png) no-repeat;
      background-size: 35px 35px;
      padding-left: 40px;
      color: #fe7501;
      font-size: 18px;
      line-height: 35px;
    }
  }
  .mainImg {
    margin-top: 20px;
    display: block;
    margin: 20px auto 0 auto;
  }
  .myHgForm {
    margin: 60px 15px 20px 15px;
    font-size: 1.4rem;
    &__input {
      margin-bottom: 20px;
    }
    .error {
      span {
        display: block;
        color: $red;
      }
      input {
        border: 1px solid $red;
      }
    }
  }
  input {
    font-size: 16px;
    padding: 10px 15px;
    margin-top: 5px;
    border: 1px solid $black-haze;
    color: $sliver;
    border-radius: 10px;
    width: 100%;
    box-sizing: border-box;
    background-color: $black-haze;
    &::placeholder {
      color: $sliver;
    }
  }
  select {
    width: 100%;
    font-size: 16px;
    padding: 10px 15px;
    margin-top: 5px;
    border: 1px solid $black-haze;
    color: $sliver;
    border-radius: 10px;
    box-sizing: border-box;
    background-color: $black-haze;
    &:disabled {
      color: $nobel;
    }
  }
  .submitBtn {
    width: 100%;
    height: 60px;
    line-height: 60px;
    background-color: $white;
    text-align: center;
    display: flex;
    justify-content: center;
    margin-top: 60px;
    span {
      display: inline-block;
      width: 90%;
      height: 40px;
      background-color: $red;
      color: $white;
      line-height: 40px;
      text-align: center;
      border-radius: 10px;
    }
  }
  .content {
    font-size: 1.3rem;
    margin: 0 15px;
    text-align: center;
    p {
      &:first-of-type {
        margin-bottom: 15px;
      }
    }
  }
}
</style>
