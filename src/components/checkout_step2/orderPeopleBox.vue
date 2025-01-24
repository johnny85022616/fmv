<template>
  <div class="orderPeopleBox">
    <h3 class="title">訂購人資訊</h3>
    <div class="form">
      <div class="orderPeopleForm">
        <div :class="['orderPeopleForm__input' , {error: nameAlert.length > 0}]">
          <div>
            <p>✽姓名</p>
            <div class="input_block">
              <input type="text" name="name" v-model="name" placeholder="請輸入姓名" :disabled="inputNameAndPhoneDisabled" autocomplete="name">
              <span>{{nameAlert}}</span>
            </div>
          </div>
        </div>
        <div :class="['orderPeopleForm__input',{error: phoneAlert.length > 0}]">
          <div>
            <p>✽手機號碼</p>
            <div class="input_block">
              <input type="phone" name="phone" v-model="phone" placeholder="請輸入手機號碼" :disabled="inputNameAndPhoneDisabled" autocomplete="tel">
              <span>{{phoneAlert}}</span>
            </div>
          </div>
        </div>
        <div :class="['orderPeopleForm__input',{error: emailAlert.length > 0}]">
          <div>
            <p>E-MAIL</p>
            <div class="input_block">
              <input type="text" name="email" v-model="email" placeholder="填寫會寄送訂單相關通知信" :disabled="inputEmailDisable" autocomplete="email">
              <span>{{emailAlert}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "orderPeopleBox",
  data() {
    return {
      name: "", //名字
      nameAlert: "", //名字錯誤訊息
      phone: "", //手機
      phoneAlert: "", //手機錯誤訊息
      email: "", //email
      emailAlert: "", //email錯誤訊息
      oldData: null, //訂購人預設資料
      inputNameAndPhoneDisabled: false, //姓名及手機input是否無法填值
      inputEmailDisable: false, //email input是否無法填值
      submitData: null,
    };
  },
  props: {
    memberData: {
      type: Object,
    },
    formSubmit: {
      type: Boolean,
      default: false,
    },
    // 是否同時購買虛擬商品及非虛擬商品
    isSomeIntangible: {
      type: Boolean,
      default: false,
    },
    //
  },
  methods: {
    getOrderPeople() {
      const orderPeople = this.memberData;
      if (
        orderPeople &&
        orderPeople.name &&
        orderPeople.email &&
        orderPeople.mobile
      ) {
        this.name = orderPeople.name || "";
        this.phone = orderPeople.mobile || "";
        this.email = orderPeople.email || "";
        this.oldData = orderPeople;
        this.inputNameAndPhoneDisabled = true;
        //如果有oldData且沒有購買任何虛擬商品
        if (!this.isSomeIntangible) {
          this.inputEmailDisable = true;
        } else {
          this.email = "";
        }
      }
    },
    //防呆檢查
    formCheck() {
      let { checkName, checkMoblie } = this.tools;
      const nameAlert = checkName(this.name);
      const phoneAlert = checkMoblie(this.phone);
      const emailAlert = this.checkEmail(this.email);
      const checkEmailInput = emailAlert.length > 0;
      const checkAllInput =
        nameAlert.length > 0 || phoneAlert.length > 0 || emailAlert.length > 0;
      let check;
      if (!this.oldData) {
        check = checkAllInput;
        this.nameAlert = nameAlert;
        this.phoneAlert = phoneAlert;
        this.emailAlert = emailAlert;
      } else {
        check = checkEmailInput;
        this.emailAlert = emailAlert;
      }
      if (check) {
        return false;
      }
      return true;
    },
    checkEmail(val) {
      let msg = "";
      if (val !== "") {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        msg = regex.test(val) ? "" : "請輸入正確信箱格式";
      }
      return msg;
    },
    parseSubmitData() {
      let submitData = {};
      //首購
      if (!this.oldData) {
        submitData.billingInfo = {
          name: this.name,
          mobile: this.phone,
          email: this.email,
        };
      }
      if (this.isSomeIntangible) {
        submitData.ordererEmail = this.email;
      }
      this.submitData = submitData;
    },

    submit() {
      this.submitData = null;
      let isCheckSuccess = true;
      //沒有預設資料的情況下才做檢查或是有虛擬商品在內
      if (!this.oldData || (this.oldData && this.isSomeIntangible)) {
        isCheckSuccess = this.formCheck();
        if (isCheckSuccess) {
          this.parseSubmitData();
        }
      }
      return this.submitData;
    },
  },
  created() {
    this.getOrderPeople();
  },
  watch: {
    phone(val) {
      //使用者可以輸入的狀況才做防呆
      if (!this.oldData) {
        val = val.replace(/[^\d]/g, "");
        if (val.length > 10) {
          val = val.substr(0, 10);
        }
        this.phone = val;
      }
    },
    memberData: {
      handler() {
        this.getOrderPeople();
      },
      immediate: true,
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";
.orderPeopleBox {
  background-color: $white;
  .form {
    margin: 0 20px;
  }
}
.title {
  display: flex;
  position: relative;
  align-items: center;
  margin: 0 20px;
  padding: 10px 0;
  color: #353635;
  font-weight: bold;
  font-size: 14px;
  letter-spacing: 0.2px;
  &::before {
    content: "";
    display: inline-block;
    width: 3px;
    height: 20px;
    background-color: #f34f59;
    position: absolute;
    left: -20px;
    top: 10px;
  }
}
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
.orderPeopleForm {
  font-size: 14px;
  border-bottom: 1px solid $alto;
  &__input {
    margin-bottom: 15px;
    > div {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      p {
        color: $heavy-metal;
        width: 25%;
      }
      .input_block {
        width: 75%;
      }
    }
    span {
      display: none;
    }
    i {
      top: 35px;
      right: 10px;
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
