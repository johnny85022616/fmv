<template>
  <div class="modifyConsigneeDialog">
    <fullscreendialog :isFullscreen="true" :backgroundColor="'#f4f4f4'" @closeDialog="closeDialog">
      <template v-slot:header>選擇收貨人</template>
      <template v-slot:body>
        <ul class="consigneeSection">
          <li v-if="isSameAsOrderPeopleShow" class="consigneeItem">
            <div class="title">
              <i :class="['icon-radio', {active: choseType==='sameAsOrderPeople'}]" @click="setModifyType('sameAsOrderPeople')"></i>
              <p>同訂購人</p>
            </div>
            <div v-if="choseType==='sameAsOrderPeople' && orderPeople" class="info">
              <p>{{orderPeople.name}} {{orderPeople.phone}}</p>
              <p>{{orderPeople.email}}</p>
              <p>{{orderPeople.address}}</p>
            </div>
          </li>
          <li class="consigneeItem">
            <div class="title">
              <i :class="['icon-radio', {active: choseType==='sameAsConsognee'}]" @click="setModifyType('sameAsConsognee')"></i>
              <p>同預設收貨人</p>
            </div>
            <div v-if="choseType==='sameAsConsognee' && defaultConsignee" class="info">
              <p>{{defaultConsignee.name}} {{defaultConsignee.phone}}</p>
              <p>{{defaultConsignee.address}}</p>
            </div>
          </li>
          <li class="consigneeItem createConsognee">
            <div class="title">
              <i :class="['icon-radio', {active: choseType==='createConsognee' }]" @click="setModifyType('createConsognee')"></i>
              <p>新增收貨人</p>
            </div>
            <div v-if="choseType==='createConsognee'" class="info">
              <div class="consigneeForm border_top">
                <div class="consigneeForm__preset">
                  <p>設為常用收貨人</p>
                  <i v-if="isDefault" class="consigneeForm__preset-on" @click="defaultSwitch"></i>
                  <i v-else class="consigneeForm__preset-off" @click="defaultSwitch"></i>
                </div>
                <div :class="['consigneeForm__input' , {error: nameAlert.length > 0}]">
                  <p>✽姓名</p>
                  <input type="text" v-model="name" placeholder="請輸入姓名">
                  <i v-if="name.length > 0" @click="name = ''"></i>
                  <span>{{nameAlert}}</span>
                </div>
                <div :class="['consigneeForm__input', {error: phoneAlert.length > 0}]">
                  <p>✽手機號碼</p>
                  <input type="number" v-model="phone" @input="changePhone" placeholder="請輸入手機號碼">
                  <i v-if="phone.length > 0" @click="phone = ''"></i>
                  <span>{{phoneAlert}}</span>
                </div>
                <div :class="['consigneeForm__address', {error: addressAlert.length > 0}]">
                  <p>✽地址</p>
                  <div>
                    <select name="city" v-model="city">
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
            </div>
          </li>
          <li class="consigneeItem">
            <div class="title">
              <i :class="['icon-radio', {active: choseType==='fromConsigneeList'}]" @click="()=>{setModifyType('fromConsigneeList'); openConsigneeListPopup()}"></i>
              <p>從通訊錄選擇</p>
            </div>
            <div v-if="choseType==='fromConsigneeList' && fromConsigneeListData" class="info">
              <p>{{fromConsigneeListData.name}} {{fromConsigneeListData.phone}}</p>
              <p>{{fromConsigneeListData.addr}}</p>
            </div>
          </li>
        </ul>
        <div class="submitBtn">
          <span @click="confirmClick">確認</span>
        </div>
      </template>
    </fullscreendialog>
    <div v-if="isConsigneeListPopupOpen" class="consigneeListPopup">
      <div class="listBox">
        <div class="header">
          <p>常用收貨人</p>
          <i class="close" @click="closeConsigneeListPopup"></i>
        </div>
        <ul class="consigneeList">
          <li class="consigneeListItem border_bottom" v-for="(item , idx) in consigneeBook" :key="idx">
            <i :class="['icon-radio',{active: item.isChose}]" @click="setFromConsigneeData(idx)"></i>
            <div class="itemInfo">
              <p class="name">{{item.name}}</p>
              <p>{{item.phone}}</p>
              <p>{{item.addr}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import fullscreendialog from "../common/fullscreenDialog.vue"; // 全畫面蓋版提示框

export default {
  name: "modifyConsigneeDialog",
  data() {
    return {
      //新增收貨人start
      isDefault: true,
      regionArr: [],
      orderPeople: null, //訂購人資料
      defaultConsignee: null, //預設收貨人
      consigneeBook: null, //收貨人通訊錄
      title: "",
      name: "", //名字
      phone: "", //手機
      city: "1", //城市
      region: "", //地區
      road: "", //街道
      nameAlert: "", //名字錯誤訊息
      phoneAlert: "", //手機錯誤訊息
      addressAlert: "", //地址錯誤訊息
      choseType: "createConsognee", //現在所選的
      //新增收貨人end
      isConsigneeListPopupOpen: false, //收貨人通訊錄
      fromConsigneeListData: null, //收貨人通訊錄中選擇的收貨人資料
      isSameAsOrderPeopleShow: false, //是否出現訂購人選項
      choseData: null, //最後選擇的data
    };
  },
  props: {
    //預設收貨人
    oldData: {
      type: Object,
    },
    //收貨人通訊錄
    consigneeList: {
      type: Array,
    },
  },
  methods: {
    //取得訂購人資料
    async getOrderPeople() {
      const orderPeople = await this.api.member.getMember();
      const data = {};
      if (orderPeople) {
        const { name, phones, email, address, id } = orderPeople;
        //姓名、手機、地址都要有資料才出現同訂購人選項
        if (name && phones && address) {
          data.name = name || "";
          if (phones && phones.length > 0) {
            data.phone = phones[0]?.number || "";
          }
          data.email = email || "";
          if (address) {
            const { city_name, county_name, text, city, county } = address;
            data.address = `${city_name}${county_name}${text}`;
            data.city = city;
            data.region = county;
            data.road = text;
            data.memberId = id;
          }
          this.orderPeople = data;
          this.isSameAsOrderPeopleShow = true;
        } else {
          this.choseType = "sameAsConsognee"; //預設為同預設收貨人
        }
      }
    },
    //取得預設收貨人
    getConsigneeDefaultData() {
      let consignee = {};
      const { name, phones, address, id } = this.oldData;
      consignee.name = name || "";
      consignee.id = id;
      consignee.phone = phones || "";
      if (address) {
        const { city_name, county_name, city, county, text } = address;
        consignee.address = `${city_name}${county_name}${text}`;
        consignee.city = city;
        consignee.region = county;
        consignee.road = text;
      }
      this.defaultConsignee = consignee;
    },
    //取得收貨人通訊錄
    getConsigneeList() {
      this.consigneeBook = this.consigneeList.map((ele) => {
        const data = {};
        const { name, phones, address, id } = ele;
        data.name = name;
        data.phone = phones || "";
        if (address) {
          const { city_name, county_name, city, county, text } = address;
          data.addr = `${city_name}${county_name}${text}`;
          data.city = city;
          data.region = county;
          data.road = text;
          data.id = id;
        }
        return data;
      });
    },
    //關閉popup
    closeDialog() {
      this.$emit("closeConsigneeDialog");
    },
    setModifyType(type) {
      this.choseType = type;
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
    //將收貨人通訊錄的值回填到popup中中
    setFromConsigneeData(idx) {
      this.fromConsigneeListData = this.consigneeBook[idx];
      this.closeConsigneeListPopup();
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
    //確定按鈕
    confirmClick() {
      switch (this.choseType) {
        case "sameAsOrderPeople":
          this.choseData = this.orderPeople;
          this.choseData.consigneeWithMember = true;
          this.closeDialog();
          break;
        case "sameAsConsognee":
          this.choseData = this.defaultConsignee;
          this.closeDialog();
          break;
        case "createConsognee":
          var isSuccess = this.formCheck();
          if (isSuccess) {
            const { name, phone, city, region, road, isDefault } = this;
            const createConsogneeData = {
              name: name || "",
              phone: phone || "",
              city: city || "",
              region: region || "",
              road: road || "",
              isDefault: isDefault || false,
            };
            this.choseData = createConsogneeData;
            this.closeDialog();
          }
          break;
        case "fromConsigneeList":
          this.choseData = this.fromConsigneeListData;
          this.closeDialog();
      }
      if (this.choseData) {
        this.$emit("setModifyConsigneeData", this.choseData);
      }
    },
    openConsigneeListPopup() {
      this.isConsigneeListPopupOpen = true;
    },
    closeConsigneeListPopup() {
      this.isConsigneeListPopupOpen = false;
    },
  },
  async created() {
    // await this.getOrderPeople();
    this.city = 1;
    this.getConsigneeDefaultData();
    this.getConsigneeList();
  },
  watch: {
    //選擇縣市後取得區域資料並預選
    city() {
      const regionArr = this.api.member.getCounty(this.city);
      this.regionArr = regionArr;
      //設定預設區域(新增:預選第一個區域id ; 修改:預選choseData中的區域id)
      this.$nextTick(function () {
        if (this.regionArr.length > 0) {
          this.region = this.regionArr[0].id;
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

.modifyConsigneeDialog {
  .consigneeSection {
    margin-bottom: 100px;
    .consigneeItem {
      box-sizing: border-box;
      padding: 10px;
      margin: 15px 0;
      border-radius: 8px;
      background-color: $white;
      .title {
        display: flex;
        i {
          margin-right: 10px;
        }
      }
      .info {
        margin-top: 10px;
        color: $sliver;
      }
    }
  }
  input {
    font-size: 16px;
    padding: 10px 15px;
    margin-top: 5px;
    border: 1px solid $black-haze;
    color: $heavy-metal;
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
    padding-top: 20px;
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
        background: url(../../images/icons/check-switch-off.svg) center/40px
          22px no-repeat;
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
      > p {
        color: $heavy-metal;
      }
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
        &:disabled {
          color: $nobel;
        }
        option {
          color: $heavy-metal;
        }
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
  .border_top {
    border-top: 1px solid $alto;
  }
  .border_bottom {
    border-bottom: 1px solid $alto;
  }
  .consigneeListPopup {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: fixed;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    .listBox {
      overflow: auto;
      width: 82.6%;
      height: 500px;
      background: $white;
      color: $tundora;
      border-radius: 5px;
      text-align: left;
      box-sizing: border-box;
      .header {
        font-size: 15px;
        padding: 10px;
        font-weight: 600;
        text-align: center;
        position: relative;
        border-bottom: 1px solid $alto;
        .close {
          position: absolute;
          right: 20px;
          top: 13px;
          width: 15px;
          height: 15px;
          background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAIxJREFUeNpiZmBgyAdiCyA+yUAeaAFiCRAjAYj/Qw0kx5CfQOwHEyDHMAxDyDEMZkggLgXEGEbQEGIMI9oQfIaRbAg2w8g2BN2wP4QMYSJgkCLUEGYgliPXNY1Q74RQkmiRDSE70WIzhGTD8BlCtGGN0IANITOdkWwITsPIMQTDMEYkA9ZQkGjvAAQYAENbOsSQjAgjAAAAAElFTkSuQmCC)
            center/15px no-repeat;
        }
      }
      .consigneeList {
        padding: 10px;
        list-style-type: none;
        .consigneeListItem {
          padding: 15px 0;
          display: flex;
          &:last-of-type {
            border: none;
          }
          .itemInfo {
            margin-left: 10px;
            .name {
              font-size: 16px;
              color: $black;
            }
            p {
              color: $sliver;
              margin-bottom: 5px;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
