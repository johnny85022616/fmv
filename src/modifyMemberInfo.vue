<template>
  <div class="modifyMemberInfo">
    <navigation :windowY="200"></navigation>
    <div class="modifyMemberInfo__head">
      <i @click="backPage" class="modifyMemberInfo__head-back"></i>
      <p class="modifyMemberInfo__head-title">查看會員資料</p>
    </div>
    <div v-if="isApiOk" class="modifyMemberForm">
      <!-- <div class="modifyMemberForm__photo">
        <img v-if="photoUrl" :src="photoUrl" alt="">
        <img v-else src="./images/icons/profile_edit.png" alt="">
      </div> -->
      <div :class="['modifyMemberForm__input' , {error: nameAlert.length > 0}]">
        <p>姓名：</p>
        <input type="text" v-model="name" placeholder="請輸入姓名" :disabled="memberData && memberData.name">
        <i v-if="name.length > 0" @click="name = ''"></i>
        <span>{{nameAlert}}</span>
      </div>
      <div class="modifyMemberForm__input">
        <p>性別：</p>
        <select name="gender" v-model="gender">
          <option value="1">男</option>
          <option value="0">女</option>
        </select>
      </div>
      <div :class="['modifyMemberForm__input', {error: emailAlert.length > 0}]">
        <p>E-mail：</p>
        <input type="text" v-model="email" placeholder="請輸入E-mail">
        <span>{{emailAlert}}</span>
      </div>
      <div :class="['modifyMemberForm__input', {error: phoneAlert.length > 0}]">
        <p>手機號碼：</p>
        <input type="text" v-model="phone" @input="changePhone" placeholder="請輸入手機號碼">
        <span>{{phoneAlert}}</span>
      </div>
      <div :class="['modifyMemberForm__address', {error: addressAlert.length > 0}]">
        <p>地址：</p>
        <div>
          <select name="city" v-model="city" @click="getCity" @change="isUserChange = true">
            <option value="">請選擇縣市</option>
            <option v-for="(city,idx) in cityArr" :key="idx" :value="city.id">{{city.name}}</option>
          </select>
          <select name="region" v-model="region" ref="region">
            <option v-for="(item , index) in regionArr" :key="index" :value="item.id">{{item.name}}</option>
          </select>
        </div>
        <input type="text" v-model="road" placeholder="請輸入地址">
        <span>{{addressAlert}}</span>
      </div>
      <agreeBox ref="agreeBox" :memberData="memberData"></agreeBox>
      <div class="submitBtn">
        <span @click="submit">確定</span>
      </div>
    </div>
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import agreeBox from "./components/modifyMemberInfo/agreeBox.vue";

export default {
  name: "modifyMemberInfo",
  data() {
    return {
      // photoUrl: null,
      cityArr: null, //縣市
      regionArr: [], //區域
      name: "", //名字
      gender: "1", //性別
      phone: "", //手機
      email: "", //email
      city: "", //城市
      region: "", //地區
      road: "", //街道
      zip: "", //區碼
      nameAlert: "", //名字錯誤訊息
      phoneAlert: "", //手機錯誤訊息
      emailAlert: "", //email錯誤
      addressAlert: "", //地址錯誤訊息
      isUserChange: false, //判斷city是否為使用者自己選擇(true:使用者自己選擇縣市 false:修改dialog預設帶入使用者原本的縣市)
      memberData: null, //會員資料
      isApiOk: false, //是否已打過取得會員資料api
      agreeBoxData: null, //同意條款選擇data
    };
  },
  components: { navigation, agreeBox },
  created() {
    this.processMemberData();
  },
  methods: {
    backPage() {
      history.back();
    },
    // 取得會員資料
    async processMemberData() {
      await this.getCity();
      const memberData = await this.api.member.getMember();
      // const memberData = null;
      this.isApiOk = true;
      if (memberData) {
        this.memberData = memberData;
        this.setMemberData();
      }
    },
    //設定預設會員資料
    async setMemberData() {
      const { name, gender, email, mobile, addr } = this.memberData;
      this.name = name || "";
      this.gender = gender === 0 ? 0 : 1;
      this.email = email || "";
      this.phone = mobile || "";
      this.city = addr?.cityId || "";
      this.region = addr?.countyId || "";
      this.road = this.road = addr.partialAddress || "";
    },
    //電話號碼只可輸入10位數
    changePhone() {
      if (this.phone.length > 10) {
        this.phone = this.phone.slice(0, 10);
      }
    },
    //取得縣市
    async getCity() {
      this.cityArr = await this.api.member.getCity();
    },
    //檢查表單
    checkForm() {
      let pass = true;
      this.nameAlert = "";
      this.phoneAlert = "";
      this.nameAlert = "";
      this.nameAlert = "";
      let { checkName, checkMoblie, checkAddress } = this.tools;
      this.nameAlert = checkName(this.name);
      this.phoneAlert = checkMoblie(this.phone);
      this.emailAlert = this.checkEmail(this.email);
      this.addressAlert = checkAddress(this.city, this.region, this.road);
      if (
        this.nameAlert ||
        this.phoneAlert ||
        this.emailAlert ||
        this.addressAlert
      )
        pass = false;
      return pass;
    },
    //組成完整地址串
    composeFullAddress() {
      const cityName =
        this.cityArr.filter((v) => v.id === this.city)?.[0].name || "";
      const regionObj =
        this.regionArr.filter((v) => v.id === this.region)?.[0] || {};
      const regionName = regionObj.name || "";
      this.zip = regionObj.zip || "";
      return cityName + regionName + this.road;
    },
    //組成要送到api payload
    parseSubmitData() {
      const fullAddress = this.composeFullAddress();
      const payload = {
        address: fullAddress || "",
        email: this.email || "",
        gender: this.gender || "",
        memberId: this.memberData?.memberId || "",
        mobile: this.phone || "",
        name: this.name || "",
        sendEdm: this.agreeBoxData?.sendEDM ? 1 : 0,
        sendSms: this.agreeBoxData?.sendSMS ? 1 : 0,
        zip: this.zip,
      };
      return payload;
    },
    async submit() {
      const agreeBoxData = this.$refs.agreeBox.submit();
      this.agreeBoxData = agreeBoxData;
      if (!agreeBoxData.pass) return;
      const formPass = this.checkForm();
      if (!formPass) return;
      const payload = this.parseSubmitData();
      const pass = await this.api.member.updateMember(payload);
      if (!pass) return;
      this.processMemberData();
    },
    //是否為之前設定過的會員資料
    checkIsMemeberData(str) {
      if (!str) return false;
      return str.includes("*");
    },
    checkEmail(val) {
      let msg = "";
      if (val !== "") {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        msg = regex.test(val) ? "" : "請輸入正確信箱格式";
      }
      return msg;
    },
  },
  watch: {
    //選擇縣市後取得區域資料並預選
    city(city) {
      const regionArr = this.api.member.getCounty(city);
      this.regionArr = regionArr;
      //設定預設區域(新增:預選第一個區域id ; 修改:預選choseData中的區域id)
      this.$nextTick(function () {
        if (this.regionArr.length > 0) {
          if (this.isUserChange) {
            this.region = this.regionArr[0].id;
          }
        }
      });
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
@import "./style/color";
@import "./style/tailwind.module.scss";

.modifyMemberInfo {
  margin-bottom: 60px;
  &__head {
    width: 100%;
    line-height: 50px;
    text-align: center;
    border-bottom: 1px solid $alto;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    &-back {
      width: 44px;
      height: 44px;
      background: url(./images/icons/icon-nav-back.svg) center/44px no-repeat;
      position: absolute;
      left: 10px;
    }

    &-title {
      font-size: 18px;
      font-weight: 500;
      color: $mine-shaft;
    }
  }
  .modifyMemberForm {
    margin: 10px 15px 80px 15px;
    font-size: 1.4rem;
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
    select {
      width: 100%;
      font-size: 16px;
      padding: 10px 15px;
      margin-top: 5px;
      border: 1px solid $black-haze;
      border-radius: 10px;
      box-sizing: border-box;
      background-color: $black-haze;
      &:disabled {
        color: $nobel;
      }
    }
    // &__photo {
    //   display: flex;
    //   justify-content: center;
    //   padding: 30px 0 50px 0;
    //   img {
    //     width: 120px;
    //     height: 120px;
    //     border-radius: 50%;
    //   }
    // }
    &__input {
      margin-bottom: 20px;
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
    }
    &__address {
      margin-bottom: 20px;
      > div {
        display: flex;
        justify-content: space-between;
        select {
          &:first-of-type {
            margin-right: 20px;
          }
        }
      }
      i {
        top: 82px;
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
    .submitBtn {
      width: 100%;
      height: 60px;
      line-height: 60px;
      background-color: $white;
      text-align: center;
      display: flex;
      justify-content: center;
      margin-top: 30px;
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
  }
}
</style>
