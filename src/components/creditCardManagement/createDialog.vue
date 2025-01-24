<template>
  <div class="creditCardDialog">
    <fullscreendialog :isFullscreen="true" @closeDialog="closeDialog">
      <template v-slot:header>新增信用卡</template>
      <template v-slot:body>
        <div class="creditCardForm">
          <div class="creditCardForm__preset">
            <p>設為預設信用卡</p>
            <i v-if="isDefault" class="creditCardForm__preset-on" @click="defaultSwitch"></i>
            <i v-else class="creditCardForm__preset-off" @click="defaultSwitch"></i>
          </div>
          <div :class="['creditCardForm__input' , {error: nameAlert.length > 0}]">
            <p>姓名</p>
            <input type="text" v-model="name" placeholder="請輸入姓名">
            <span>{{nameAlert}}</span>
          </div>
          <div :class="['creditCardForm__input',{error: creditNumAlert.length > 0}]">
            <p>信用卡號碼</p>
            <input type="phone" v-model="creditNum" placeholder="XXXX XXXX XXXX XXXX" @keyup="formatCreditNum">
            <span>{{creditNumAlert}}</span>
          </div>
          <div :class="['creditCardForm__input','expire',{error: expireAlert.length > 0}]">
            <p>有效期限</p>
            <div>
              <input type="number" v-model="expire.month" @input="formatExpire('month')" placeholder="MM">
              <input type="number" v-model="expire.year" @input="formatExpire('year')" placeholder="YY" ref="yearInput">
            </div>
            <span>{{expireAlert}}</span>
          </div>
          <p class="creditCardForm__noticeContent">按下確認即表示同意將本次收貨人資料紀錄於「信用卡管理｣中，節省下次結帳時間。</p>
        </div>
        <div class="creditCardForm__submitBtn">
          <span @click="confirmClick">確認</span>
        </div>
      </template>
    </fullscreendialog>
  </div>
</template>

<script>
import fullscreendialog from "../common/fullscreenDialog.vue"; // 全畫面蓋版提示框
export default {
  name: "createDialog",
  data() {
    return {
      isDefault: true,
      regionArr: [],
      title: "",
      name: "", //名字
      nameAlert: "", //名字錯誤訊息
      creditNum: "", //信用卡號碼
      creditNumAlert: "", //新用卡號碼錯誤
      expire: {
        year: "",
        month: "",
      },
      expireAlert: "",
    };
  },
  methods: {
    //關閉popup
    closeDialog() {
      this.$emit("closeCreateDialog");
    },
    //switch狀態變更
    defaultSwitch() {
      this.isDefault = !this.isDefault;
    },
    //確定按鈕
    confirmClick() {
      const isCheckSuccess = this.formCheck();
      if (isCheckSuccess) {
        this.createCredit();
      }
    },
    //防呆檢查
    formCheck() {
      let { checkName, checkCreditCardInfo, checkCreditExpire } = this.tools;
      this.nameAlert = checkName(this.name);
      this.creditNumAlert = checkCreditCardInfo(
        this.creditNum,
        this.expire.year,
        this.expire.month
      );
      this.expireAlert = checkCreditExpire(this.expire.year, this.expire.month);
      if (
        this.nameAlert.length > 0 ||
        this.creditNumAlert.length > 0 ||
        this.expireAlert.length > 0
      ) {
        return false;
      }
      return true;
    },
    formatCreditNum() {
      let creditNumArr = [];
      let creditNum = JSON.parse(JSON.stringify(this.creditNum));
      creditNum = this.creditNum.replace(/[\D]/g, "").slice(0, 16);
      creditNum.split("").forEach((ch, index) => {
        if (index !== 0 && index % 4 === 0) {
          creditNumArr.push(" ", ch);
        } else {
          creditNumArr.push(ch);
        }
      });
      this.creditNum = creditNumArr.join("");
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
    //新增/修改收貨人api
    createCredit() {
      const insertInfo = {
        isDefault: this.isDefault ? "Y" : "N",
        name: this.name,
        number: this.creditNum.replace(/[\s]/g, ""),
        expiration: `20${this.expire.year}${this.expire.month}`,
        temp: false,
      };
      console.log(insertInfo);
      this.$emit("insertCreditCard", insertInfo);
    },
  },
  created() {},
  components: {
    fullscreendialog,
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";
input {
  font-size: 16px;
  padding: 10px 15px;
  margin-top: 5px;
  border: 1px solid $black-haze;
  border-radius: 10px;
  width: 100%;
  box-sizing: border-box;
  background-color: $black-haze;
  &::placeholder {
    color: $sliver;
  }
}
.creditCardForm {
  margin: 10px 15px 80px 15px;
  &__preset {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    p {
      font-size: 1.4rem;
      font-weight: bold;
      color: $heavy-metal;
    }
    i {
      width: 40px;
      height: 22px;
    }
    &-on {
      background: url(../../images/icons/check-switch-on.svg) center/40px 22px
        no-repeat;
    }
    &-off {
      background: url(../../images/icons/check-switch-off.svg) center/40px 22px
        no-repeat;
    }
  }
  &__input {
    margin-bottom: 30px;
    > p {
      color: $heavy-metal;
      font-size: 14px;
    }
    span {
      display: none;
    }
    i {
      top: 35px;
      right: 10px;
    }
    &.expire {
      > div {
        display: flex;
        justify-content: space-between;
        input {
          width: 48%;
          text-align: center;
        }
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
  &__noticeContent {
    font-size: 1.4rem;
    color: $heavy-metal;
  }
  &__submitBtn {
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
}
</style>
