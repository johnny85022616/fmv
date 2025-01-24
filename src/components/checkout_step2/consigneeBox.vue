<template>
  <div class="consigneeBox">
    <div v-if="true" class="consignee_head">
      <h3 data-v-7fe3c774="" class="title">收貨人資訊</h3>
      <span @click="openConsigneeDialog" v-if="isModifyCosigneeBtnShow">選擇收貨人</span>
    </div>
    <h3 v-else class="title">收貨人資訊</h3>
    <div class="form">
      <div class="consigneeForm">
        <div :class="['consigneeForm__input' , {error: nameAlert.length > 0}]">
          <div>
            <p>✽收貨人姓名</p>
            <div class="input_block">
              <input type="text" name="name" v-model="name" placeholder="請輸入姓名" :disabled="inputDisabled" autocomplete="name">
              <span>{{nameAlert}}</span>
            </div>
          </div>
        </div>
        <div :class="['consigneeForm__input',{error: phoneAlert.length > 0}]">
          <div>
            <p>✽手機號碼</p>
            <div class="input_block">
              <input type="phone" name="phone" v-model="phone" placeholder="請輸入手機號碼" :disabled="inputDisabled" autocomplete="tel">
              <span>{{phoneAlert}}</span>
            </div>
          </div>
        </div>
        <div :class="['consigneeForm__address',{error: addressAlert.length > 0}]">
          <div class="top">
            <p>✽地址</p>
            <div>
              <select name="county" v-model="city" @change="isUserChange = true" :disabled="inputDisabled" autocomplete="address-level1">
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
              <select name="district" v-model="region" ref="region" :disabled="inputDisabled" autocomplete="address-level2">
                <option v-for="(item , index) in regionArr" :key="index" :value="item.id">{{item.name}}</option>
              </select>
            </div>
          </div>
          <div class="bottom">
            <p></p>
            <div>
              <input type="text" name="street-address" v-model="road" placeholder="請輸入地址" :disabled="inputDisabled">
              <i v-if="road.length > 0" @click="road = ''"></i>
              <span>{{addressAlert}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modifyConsigneeDialog v-if="isModifyConsigneeDialogShow && oldData" @closeConsigneeDialog="closeConsigneeDialog" :oldData="oldData" :consigneeList="consigneeList" @setModifyConsigneeData="setModifyConsigneeData" />
  </div>
</template>

<script>
import modifyConsigneeDialog from "./modifyConsigneeDialog.vue";
export default {
  name: "consigneeBox",
  data() {
    return {
      regionArr: [],
      name: "", //名字
      nameAlert: "", //名字錯誤訊息
      phone: "", //手機
      phoneAlert: "", //手機錯誤訊息
      email: "",
      emailAlert: "",
      city: "", //城市
      region: "", //地區
      road: "", //街道
      consigneeId: "", //收貨人Id
      consigneeWithMember: false, //是否為同訂購人
      memberId: "", //訂購人id
      addressAlert: "", //地址錯誤訊息
      inputDisabled: false, //input 是否無法填值
      isUserChange: false, //判斷city是否為使用者自己選擇(true:使用者自己選擇縣市 false:修改dialog預設帶入使用者原本的縣市)
      oldData: null, //收貨人預設資料
      choseData: null, //從選擇收貨人中選出的值
      consigneeList: null, //收貨人列表
      isModifyConsigneeDialogShow: false,
      isModifyCosigneeBtnShow: false,
      submitData: null,
    };
  },
  props: {
    memberData: {
      type: Object,
    },
  },
  methods: {
    //開啟
    openConsigneeDialog() {
      this.isModifyConsigneeDialogShow = true;
    },
    //關閉商品明細dialog
    closeConsigneeDialog() {
      this.isModifyConsigneeDialogShow = false;
    },
    //取得收貨人資料
    async getConsigneeData() {
      let consigneeList = await this.api.member.getConsignee();
      let consigneeData;
      //做格式轉換
      consigneeList = consigneeList?.map((ele) => {
        return this.parseOldData(ele);
      });
      this.consigneeList = consigneeList;
      consigneeData = consigneeList?.filter((ele) => ele.isDefault);

      //有預設收貨人資料
      if (consigneeData && consigneeData.length > 0) {
        consigneeData = consigneeData[0];
        this.oldData = consigneeData;
        this.isModifyCosigneeBtnShow = true;
        this.inputDisabled = true;
      } else {
        //無預設收貨人資料(取訂購人)
        if (!this.memberData) return;
        this.oldData = this.parseMemberData(this.memberData);
      }
    },
    //oldData 格式轉換
    parseOldData(originData) {
      const { name, mobile, id, addr, isDefault } = originData || {};
      return {
        id: id,
        name: name,
        phones: mobile,
        isDefault: isDefault,
        address: {
          city: addr?.city || "",
          county: addr?.county || "",
          text: addr?.addr || "",
          city_name: addr?.cityName || "",
          county_name: addr?.countyName || "",
          zip: addr?.zip || "",
        },
      };
    },
    parseMemberData(memberData) {
      const { name, mobile, addr } = memberData || {};
      return {
        name: name || "",
        phones: mobile || "",
        address: {
          city: addr?.cityId || "",
          county: addr?.countyId || "",
          text: addr?.partialAddress || "",
          city_name: addr?.cityName || "",
          county_name: addr?.countyName || "",
          zip: addr?.zipCode || "",
        },
      };
    },
    //收貨人資料格式處理(預設收貨人)
    setConsigneeData() {
      const data = this.oldData || {};
      const { name, phones, address, id } = data;
      this.name = name || "";
      this.phone = phones || "";
      this.city = address.city;
      this.region = address.county;
      this.road = address.text;
      this.consigneeId = id;
    },
    //收貨人popup修改後填值
    setModifyConsigneeData(choseData) {
      this.choseData = choseData;
      if (choseData) {
        const {
          name,
          phone,
          city,
          region,
          road,
          id,
          consigneeWithMember,
          memberId,
        } = choseData;
        this.name = name;
        this.phone = phone;
        this.city = city;
        this.region = region;
        this.road = road;
        this.consigneeId = id;
        this.consigneeWithMember = consigneeWithMember || false;
        this.memberId = memberId || "";
      }
    },
    parseSubmitData() {
      const {
        name,
        phone,
        city,
        region,
        road,
        consigneeId,
        consigneeWithMember,
        memberId,
      } = this;
      let consigneeZip;
      const cityArr = this.api.member.getCity();
      const regionArr = this.api.member.getCounty(this.city);
      const cityName = cityArr.filter((ele) => ele.id === city)?.[0].name;
      const regionName = regionArr.filter((ele) => ele.id === region)?.[0].name;
      if (regionArr) {
        consigneeZip = regionArr.filter((ele) => ele.id === region)?.[0].zip;
      }
      this.submitData = {
        consigneeName: name,
        consigneeMobile: phone,
        consigneeCity: city,
        consigneeRegion: region,
        consigneeRoad: cityName + regionName + road,
        consigneeId: consigneeId || "",
        consigneeZip,
        consigneeWithMember,
        memberId,
      };
    },
    submit() {
      let isCheckSuccess = true;
      isCheckSuccess = this.formCheck();
      if (isCheckSuccess) {
        this.parseSubmitData();
        return this.submitData;
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
    async initConsigneeBox() {
      await this.getConsigneeData();
      if (this.oldData) {
        this.setConsigneeData();
      }
    },
  },
  async created() {
    this.initConsigneeBox();
  },
  components: { modifyConsigneeDialog },
  watch: {
    //選擇縣市後取得區域資料並預選
    city() {
      const regionArr = this.api.member.getCounty(this.city);
      this.regionArr = regionArr;
      //設定預設區域(預設:預選第一個區域id，但須由使用者直接點擊觸發 ; 修改:預選choseData中的區域id)
      this.$nextTick(function () {
        if (this.regionArr.length > 0) {
          if (this.isUserChange) {
            this.region = this.regionArr[0].id;
            this.isUserChange = false;
          }
        }
      });
    },
    phone(val) {
      //使用者可以輸入的狀況才做防呆
      if (!this.oldData || (this.oldData && !this.isModifyCosigneeBtnShow)) {
        val = val.replace(/[^\d]/g, "");
        if (val.length > 10) {
          val = val.substr(0, 10);
        }
        this.phone = val;
      }
    },
    memberData: {
      handler() {
        this.initConsigneeBox();
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";
.consigneeBox {
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
.consignee_head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    margin-right: 25px;
    font-size: 13px;
    font-weight: 600;
    color: $special;
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

.consigneeForm {
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
        width: 28%;
      }
      .input_block {
        width: 72%;
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
  &__address {
    margin-bottom: 20px;
    select {
      width: 100%;
      font-size: 16px;
      padding: 10px 15px;
      margin-top: 5px;
      border: 1px solid $black-haze;
      color: $black;
      border-radius: 10px;
      box-sizing: border-box;
      background-color: $black-haze;
      &:disabled {
        color: $nobel;
      }
    }
    .top {
      display: flex;
      align-items: center;
      p {
        width: 28%;
      }
      > div {
        width: 72%;
        display: flex;
        justify-content: space-between;
        select {
          &:first-of-type {
            margin-right: 20px;
          }
        }
      }
    }
    .bottom {
      display: flex;
      align-items: center;
      p {
        width: 28%;
      }
      div {
        width: 72%;
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
}
</style>
