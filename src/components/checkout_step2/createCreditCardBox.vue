<template>
  <div class="creditCreditCardBox">
    <div class="creditCardForm">
      <div :class="['creditCardForm__input' , {error: nameAlert.length > 0}]">
        <p>持卡人姓名</p>
        <input type="text" v-model="name" placeholder="請輸入姓名">
        <span>{{nameAlert}}</span>
      </div>
      <div :class="['creditCardForm__input creditNumBlock',{error: creditNumAlert.length > 0}]">
        <p>信用卡號碼</p>
        <div>
          <input type="number" ref="1" v-model="creditNum[1]" placeholder="XXXX" @keyup="(e)=>formatCreditNum(e,1)">
          <input type="number" ref="2" v-model="creditNum[2]" placeholder="XXXX" @keyup="(e)=>formatCreditNum(e,2)">
          <input type="number" ref="3" v-model="creditNum[3]" placeholder="XXXX" @keyup="(e)=>formatCreditNum(e,3)">
          <input type="number" ref="4" v-model="creditNum[4]" placeholder="XXXX" @keyup="(e)=>formatCreditNum(e,4)">
        </div>
        <span>{{creditNumAlert}}</span>
      </div>
      <div :class="['creditCardForm__input','expire',{error: expireAlert.length > 0}]">
        <p>有效期限</p>
        <div>
          <input type="number" v-model="expire.month" @input="formatExpire('month')" placeholder="MM">
          <p class="timeDash">/</p>
          <input type="number" v-model="expire.year" @input="formatExpire('year')" placeholder="YY" ref="yearInput">
        </div>
        <span>{{expireAlert}}</span>
      </div>
      <div :class="['creditCardForm__input','cavv',{error: cavvAlert.length > 0}]">
        <p>安全碼</p>
        <div>
          <input type="text" maxlength="3" placeholder="末三碼" v-model="cavv">
        </div>
        <span>{{cavvAlert}}</span>
      </div>
      <p class="creditCardForm__noticeContent">按下確認即表示同意將本次收貨人資料紀錄於「信用卡管理｣中，節省下次結帳時間。</p>
    </div>
    <div class="creditCardForm__preset">
      <div :class="['checkbox', {active: isDefault}]" @click="defaultSwitch"></div>
      <p>設為預設信用卡</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "creditCreditCardBox",
  data() {
    return {
      isDefault: true,
      regionArr: [],
      title: "",
      name: "", //名字
      nameAlert: "", //名字錯誤訊息
      creditNum: {
        1: "",
        2: "",
        3: "",
        4: "",
        full: "",
      }, //信用卡號碼
      creditNumAlert: "", //新用卡號碼錯誤
      expire: {
        year: "",
        month: "",
      },
      expireAlert: "",
      cavv: "",
      cavvAlert: "",
    };
  },
  props: {
    formSubmit: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    //switch狀態變更
    defaultSwitch() {
      this.isDefault = !this.isDefault;
    },
    //防呆檢查
    formCheck() {
      this.creditNum.full =
        this.creditNum[1] +
        this.creditNum[2] +
        this.creditNum[3] +
        this.creditNum[4];
      const creditNum = this.creditNum.full.replace(/\s/g, "");
      let { checkName, checkCreditCardInfo, checkCreditExpire, checkCavv } =
        this.tools;
      this.nameAlert = checkName(this.name);
      this.creditNumAlert = checkCreditCardInfo(creditNum);
      this.expireAlert = checkCreditExpire(this.expire.year, this.expire.month);
      this.cavvAlert = checkCavv(this.cavv);
      if (
        this.nameAlert.length > 0 ||
        this.creditNumAlert.length > 0 ||
        this.expireAlert.length > 0 ||
        this.cavvAlert.length > 0
      ) {
        return false;
      }
      return true;
    },
    formatCreditNum(e, index) {
      if (this.creditNum[index].length > 4) {
        this.creditNum[index] = this.creditNum[index].slice(0, 4);
      }
      if (this.creditNum[index].length === 4) {
        this.$refs[index + 1]?.focus();
      }
    },
    formatExpire(type) {
      if (type === "month") {
        this.expire.month = this.expire.month.slice(0, 2);
        if (this.expire.month.length === 2) {
          this.$refs.yearInput.focus();
        }
        return;
      }
      this.expire.year = this.expire.year.slice(0, 2);
    },
    //新增信用卡
    async sendNewCredit() {
      const creditNum = this.creditNum.full.replace(/[\s]/g, "");
      const expiration = `20${this.expire.year}${this.expire.month}`;
      const insertInfo = {
        isDefault: this.isDefault ? "Y" : "N",
        name: this.name,
        number: creditNum,
        expiration: expiration,
        temp: false,
      };
      await this.api.creditCard.addCreditCard(insertInfo);
      return {
        cardNum: creditNum,
        cardOwner: this.name,
        expDate: expiration,
        cavv: this.cavv,
      };
    },
    async submit() {
      const isCheckSuccess = this.formCheck();
      if (isCheckSuccess) {
        return await this.sendNewCredit();
      }
    },
  },
  created() {},
  components: {},
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";
input {
  font-size: 16px;
  padding: 10px 15px;
  margin-top: 5px;
  border: 1px solid $black-haze;
  color: $black;
  border-radius: 10px;
  width: 100%;
  box-sizing: border-box;
  background-color: $black-haze;
  &::placeholder {
    color: $sliver;
  }
}
.creditCardForm {
  margin: 10px 0 20px 0;
  font-size: 14px;
  &__preset {
    margin-bottom: 20px;
    display: flex;
    .checkbox {
      margin-right: 8px;
    }
    p {
      font-size: 1.4rem;
      font-weight: bold;
      color: $heavy-metal;
    }
  }
  .creditNumBlock {
    > div {
      display: flex;
      justify-content: space-between;
      input {
        width: 24%;
      }
    }
  }
  &__input {
    margin-bottom: 30px;
    > p {
      color: $heavy-metal;
    }
    span {
      display: none;
    }
    i {
      top: 35px;
      right: 10px;
    }
    &.expire,
    &.cavv {
      > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        input {
          width: 45%;
          text-align: center;
        }
      }
      .timeDash {
        font-size: 2rem;
      }
    }
  }
  .error {
    span {
      display: block;
      color: $red;
    }
    input,
    select {
      border: 1px solid $red;
    }
  }
}
</style>
