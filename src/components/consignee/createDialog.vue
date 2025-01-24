<template>
  <div class="consigneeDialog">
    <fullscreendialog :isFullscreen="true" @closeDialog="closeDialog">
      <template v-slot:header>{{title}}</template>
      <template v-slot:body>
        <div class="consigneeForm">
          <div class="consigneeForm__preset">
            <p>設為常用收貨人</p>
            <i v-if="isDefault" class="consigneeForm__preset-on" @click="defaultSwitch"></i>
            <i v-else class="consigneeForm__preset-off" @click="defaultSwitch"></i>
          </div>
          <div :class="['consigneeForm__input' , {error: nameAlert.length > 0}]">
            <p>*姓名</p>
            <input type="text" v-model="name" placeholder="請輸入姓名">
            <i v-if="name.length > 0" @click="name = ''"></i>
            <span>{{nameAlert}}</span>
          </div>
          <div :class="['consigneeForm__input', {error: phoneAlert.length > 0}]">
            <p>*手機號碼</p>
            <input type="number" v-model="phone" @input="changePhone" placeholder="請輸入手機號碼">
            <i v-if="phone.length > 0" @click="phone = ''"></i>
            <span>{{phoneAlert}}</span>
          </div>
          <div :class="['consigneeForm__address', {error: addressAlert.length > 0}]">
            <p>*地址</p>
            <div>
              <select name="city" v-model="city" @change="isUserChange = true">
                <option value="">請選擇縣市</option>
                <option :value="1">台北市</option>
                <option :value="6">宜蘭縣</option>
                <option :value="7">桃園市</option>
                <option :value="8">新竹縣</option>
                <option :value="9">苗栗縣</option>
                <option :value="11">彰化縣</option>
                <option :value="12">南投縣</option>
                <option :value="13">雲林縣</option>
                <option :value="14">嘉義縣</option>
                <option :value="17">屏東縣</option>
                <option :value="18">臺東縣</option>
                <option :value="19">花蓮縣</option>
                <option :value="21">基隆市</option>
                <option :value="22">新竹市</option>
                <option :value="24">嘉義市</option>
                <option :value="2">高雄市</option>
                <option :value="5">新北市</option>
                <option :value="23">臺中市</option>
                <option :value="25">臺南市</option>
              </select>
              <select name="region" v-model="region" ref="region">
                <option v-for="(item , index) in regionArr" :key="index" :value="item.id">{{item.name}}</option>
              </select>
            </div>
            <input type="text" v-model="road" placeholder="請輸入地址">
            <i v-if="road.length > 0" @click="road = ''"></i>
            <span>{{addressAlert}}</span>
          </div>
          <p class="consigneeForm__noticeContent">按下確認即表示同意將本次收貨人資料紀錄於「收貨人管理｣中，節省下次結帳時間。</p>
        </div>
        <div class="consigneeForm__submitBtn">
          <span @click="confirmClick">確認</span>
        </div>
      </template>
    </fullscreendialog>
  </div>
</template>

<script>
import fullscreendialog from "../common/fullscreenDialog.vue"; // 全畫面蓋版提示框
import address from "../../utils/address.js";
export default {
  name: "createDialog",
  data() {
    return {
      isDefault: true,
      regionArr: [],
      title: "",
      name: "", //名字
      phone: "", //手機
      city: "", //城市
      region: "", //地區
      road: "", //街道
      nameAlert: "", //名字錯誤訊息
      phoneAlert: "", //手機錯誤訊息
      addressAlert: "", //地址錯誤訊息
      isUserChange: false, //判斷city是否為使用者自己選擇(true:使用者自己選擇縣市 false:修改dialog預設帶入使用者原本的縣市)
    };
  },
  props: {
    choseData: {
      type: Object,
    },
  },
  methods: {
    //設定title文字
    setTitle() {
      let title = "新增收貨人";
      if (this.choseData) {
        title = "收貨人資訊";
      }
      this.title = title;
    },

    //若為修改dialog，則填入資料
    setFormData() {
      this.name = this.choseData.name;
      let phone = this.choseData.phones.filter((ele) => ele.type === "MOBILE");
      if (phone.length > 0) {
        this.phone = phone[0].number;
      }
      this.city = this.choseData.address.city;
      this.road = this.choseData.address.text;
    },
    //關閉popup
    closeDialog() {
      this.$emit("closeCreateDialog");
    },
    //常用收貨人switch狀態變更
    defaultSwitch() {
      this.isDefault = !this.isDefault;
    },
    //電話號碼只可輸入10位數
    changePhone() {
      if (this.phone.length > 10) {
        this.phone = this.phone.slice(0, 10);
      }
    },
    //確定按鈕
    confirmClick() {
      const isCheckSuccess = this.formCheck();
      if (isCheckSuccess) {
        this.doConsignee();
      }
    },
    //防呆檢查
    formCheck() {
      let { checkName, checkMoblie, checkAddress } = this.tools;
      this.nameAlert = checkName(this.name);
      this.phoneAlert = checkMoblie(this.phone);
      this.addressAlert = checkAddress(this.city, this.region, this.road);
      if (
        this.nameAlert.length > 0 ||
        this.phoneAlert.length > 0 ||
        this.addressAlert.length > 0
      ) {
        return false;
      }
      return true;
    },

    //新增/修改收貨人api
    async doConsignee() {
      // let regionArr = JSON.parse(JSON.stringify(this.regionArr));
      // let regionObj = regionArr.filter((ele) => {
      //   return (ele.id = this.region);
      // });
      // let { zip } = regionObj[0];

      let postData = {
        data: {
          addr: this.road.replace(/\s*/g, ""),
          city: this.city,
          county: this.region,
          isDefault: this.isDefault ? "Y" : "N",
          mobile: this.phone,
          name: this.name,
        },
      };
      const pass = await this.api.member.createConsignee(postData);
      if (pass) {
        this.closeDialog();
        this.$emit("getConsignee");
      }

      // const api = `api/consignee`;
      // let method = "POST";
      // if (this.choseData) {
      //   //若為修改變為put方法
      //   method = "PUT";
      //   postData.data.id = this.choseData.id;
      // }

      // if (ticket) {
      //   this.axios({
      //     method: method,
      //     url: api,
      //     data: postData,
      //     headers: {
      //       authorization: "Bearer" + ticket,
      //     }
      //   }).then((res) => {
      //     const {data} = res;
      //     if (data.status === 1){
      //       this.closeDialog();
      //       this.$emit('getConsignee')
      //     }
      //   })
      // }
    },
  },
  created() {
    this.setTitle();
    //修改注入choseData資料
    if (this.choseData) {
      this.setFormData();
    }
  },
  watch: {
    //選擇縣市後取得區域資料並預選
    city() {
      const regionData = JSON.parse(
        JSON.stringify(address.data.data[0].address)
      );
      const cityFullData = regionData.filter((ele) => {
        return parseInt(this.city) === ele.id;
      });
      let counties = [];
      if (cityFullData.length > 0) {
        counties = cityFullData[0].counties;
      }
      this.regionArr = counties;
      //設定預設區域(新增:預選第一個區域id ; 修改:預選choseData中的區域id)
      this.$nextTick(function () {
        if (this.regionArr.length > 0) {
          if (this.isUserChange) {
            this.region = this.regionArr[0].id;
          } else {
            this.region = this.choseData.address.county;
          }
        }
      });
    },
  },
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
.consigneeForm {
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
    select {
      width: 100%;
      font-size: 16px;
      padding: 10px 15px;
      margin-top: 5px;
      border: 1px solid $black-haze;
      border-radius: 10px;
      box-sizing: border-box;
      background-color: $black-haze;
    }
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
  &__input,
  &__address {
    position: relative;
    i {
      width: 18px;
      height: 18px;
      background: url(../../images/icons/check-circle-cross.svg) center/18px
        18px no-repeat;
      position: absolute;
    }
  }
}
</style>
