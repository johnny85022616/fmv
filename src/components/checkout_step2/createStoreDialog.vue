<template>
  <div class="createStoreDialog">
    <fullscreendialog :isFullscreen="true" @closeDialog="closeCreateStoreDialog">
      <template v-slot:header>新增門市</template>
      <template v-slot:body>
        <div class="createStore">
          <div class="createStoreForm">
            <div class="createStoreForm__preset">
              <p>設為常用收貨人</p>
              <i v-if="isDefault" class="createStoreForm__preset-on" @click="defaultSwitch"></i>
              <i v-else class="createStoreForm__preset-off" @click="defaultSwitch"></i>
            </div>
            <div :class="['createStoreForm__input' , {error: nameAlert.length > 0}]">
              <div class="nameLabel">
                <p>收貨人</p>
                <!-- <div class="createStoreForm__sameAsMember" @click="sameAsMemberCheckboxSwitch">
                  <div :class="['checkbox', {active: isSameAsMemberData}]"></div>
                  <p>同會員資料</p>
                </div> -->
              </div>
              <input type="text" v-model="name" placeholder="請輸入姓名">
              <i v-if="name.length > 0" class="remove_InputVal" @click="name = ''"></i>
              <span>{{nameAlert}}</span>
            </div>
            <div :class="['createStoreForm__input', {error: phoneAlert.length > 0}]">
              <p>手機號碼</p>
              <input type="number" v-model="phone" @input="changePhone" placeholder="請輸入手機號碼">
              <i v-if="phone.length > 0" class="remove_InputVal" @click="phone = ''"></i>
              <span>{{phoneAlert}}</span>
            </div>
            <div :class="['createStoreForm__input',{error: emailAlert.length > 0}]">
              <div>
                <p>E-MAIL</p>
                <div class="input_block">
                  <input type="text" v-model="email" placeholder="填寫會寄送訂單相關通知信">
                  <span>{{emailAlert}}</span>
                </div>
              </div>
            </div>
            <div :class="['createStoreForm__input store']">
              <p>取貨門市</p>
              <div v-if="store">
                <div class="storeResult">
                  <div class="storeName">
                    <i :class="`store_type_${store.storeType}`"></i>
                    <p>{{parseStoreTypeToName(store.storeType)}} {{store.storeName}}</p>
                  </div>
                  <div>{{store.storeAddress}}</div>
                </div>
              </div>
              <ul v-else>
                <li @click="choseStore(1)">
                  <div>
                    <i class="store_type_1"></i>
                    <p>請選擇7-11門市</p>
                  </div>
                  <i class="next_arrow"></i>
                </li>
                <li @click="choseStore(2)">
                  <div>
                    <i class="store_type_2"></i>
                    <p>請選擇全家門市</p>
                  </div>
                  <i class="next_arrow"></i>
                </li>
              </ul>
            </div>
            <!-- <div class="createStoreForm__agree" @click="agreeSaveCheckboxSwitch">
              <div :class="['checkbox', {active: isAgreeSave}]"></div>
              <p>我同意將本次門市紀錄於「取貨門市管理｣中，節省下次結帳時間。</p>
            </div> -->
          </div>
        </div>
        <div class="submitBtn">
          <span @click="confirmClick">確認</span>
        </div>
      </template>
    </fullscreendialog>
    <input type="hidden" id="storeObject" value="">
  </div>
</template>

<script>
import fullscreendialog from "../common/fullscreenDialog.vue"; // 全畫面蓋版提示框

export default {
  name: "createStoreDialog",
  data() {
    return {
      isDefault: true, //預設門市
      isSameAsMemberData: false, //同會員資料
      isAgreeSave: true, //同意儲存
      oldMemberData: null,
      name: "", //名字
      nameAlert: "", //名字錯誤訊息
      phone: "", //手機
      phoneAlert: "", //手機錯誤訊息
      email: "", //email
      emailAlert: "", //email錯誤訊息
      store: null, //門市
      storeAlert: "", //門市錯誤訊息
      choseStoreType: null, //選擇的商店代號(1: 711 , 2: 全家)
    };
  },
  methods: {
    //取得會員資料
    async getMemberData() {
      // this.name = "張裕";
      // this.phone = "0955755647";
      // this.email = "nte.82002@gmail.com";
    },
    //會員資料填入input
    setOldMemberDataToInput() {
      const { name, phone, email } = this.oldMemberData;
      this.name = name;
      this.phone = phone;
      this.email = email;
    },
    //監聽map回傳物件的input值
    //TODO  新增超商接值
    setMutiation() {
      const increaseStoreInput = document.getElementById("storeObject");
      const observer = new MutationObserver(() => {
        const val = JSON.parse(increaseStoreInput.value);
        console.log("####", val);
        this.store = val;
      });
      observer.observe(increaseStoreInput, { attributes: true });
    },
    //常用收貨人switch狀態變更
    defaultSwitch() {
      this.isDefault = !this.isDefault;
    },
    //同會員資料checkbox變更
    sameAsMemberCheckboxSwitch() {
      this.isSameAsMemberData = !this.isSameAsMemberData;
      if (this.isSameAsMemberData) {
        this.setOldMemberDataToInput();
      }
    },
    //同意紀錄於取貨門市管理中checkbox變更
    agreeSaveCheckboxSwitch() {
      this.isAgreeSave = !this.isAgreeSave;
    },
    //電話號碼只可輸入10位數
    changePhone() {
      if (this.phone.length > 10) {
        this.phone = this.phone.slice(0, 10);
      }
    },
    //關閉popup
    closeCreateStoreDialog() {
      this.$emit("closeCreateStoreDialog");
    },
    parseStoreTypeToName(storeType) {
      const storeTypeToName = {
        1: "7-11",
        2: "全家",
        4: "全家",
      };
      return storeTypeToName[storeType];
    },
    //選擇後回傳
    choseStore(storeType) {
      this.choseStoreType = storeType;
      this.openMapDialog();
    },
    checkStore() {
      let storeAlert = "";
      if (!this.store) {
        alert("請選擇取貨門市");
        storeAlert = "請選擇取貨門市";
      }
      return storeAlert;
    },
    checkEmail(val) {
      if (val !== "") {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(val) ? "" : "請輸入正確信箱格式";
      }
      return "";
    },

    formCheck() {
      this.nameAlert = "";
      this.phoneAlert = "";
      this.emailAlert = "";
      this.storeAlert = "";
      let { checkName, checkMoblie } = this.tools;
      this.nameAlert = checkName(this.name);
      this.phoneAlert = checkMoblie(this.phone);
      //有填才驗證
      if (this.email && this.email.length > 0) {
        this.emailAlert = this.checkEmail(this.email);
      }
      this.storeAlert = this.checkStore();
      if (
        this.nameAlert.length > 0 ||
        this.phoneAlert.length > 0 ||
        this.emailAlert.length > 0 ||
        this.storeAlert.length > 0
      ) {
        return false;
      }
      return true;
    },
    //組成最後資料格式
    parseChoseData() {
      const { storeType, storeName, storeId, storeAddress, storeStatus } =
        this.store;
      const choseData = {
        storeType,
        storeName,
        storeId,
        storeStatus,
        storeAddress,
        name: this.name,
        mobile: this.phone,
        email: this.email,
        isDefault: this.isDefault ? "Y" : "N",
      };
      return choseData;
    },
    //存取新增門市
    async savaCreateStore(choseData) {
      return this.api.member.createStore(choseData);
    },
    //確定按鈕
    async confirmClick() {
      const isSuccess = this.formCheck();

      if (isSuccess) {
        //有勾選同意儲存
        const choseData = this.parseChoseData();
        const createDone = await this.savaCreateStore(choseData);
        if (createDone) {
          this.$emit("refreshStoreData");
          this.closeCreateStoreDialog();
        } else {
          this.store = null;
        }
      }
    },
    //開啟地圖popup
    openMapDialog() {
      const emapUrl =
        "/cvs/eMap?serviceType=1&storeType=" + this.choseStoreType;

      // 是否為心生活內崁，觸發開啟APP第2 UIVIEW
      if (this.tools.checkInSuperAppSessions()) {
        const script = document.createElement("script");
        script.src = "https://mm.fetnet.net/appNativeJS/js/webviewBridge.js";
        script.type = "text/javascript";
        script.onload = () => {
          window.webBridge("openWebView", this.configs.baseUrlPath() + emapUrl);
        };
        document.body.appendChild(script);
      } else {
        window.open(emapUrl);
      }
    },
  },
  async created() {
    await this.getMemberData();
  },
  mounted() {
    this.setMutiation();
  },
  components: {
    fullscreendialog,
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";

.createStoreDialog {
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
  .createStoreForm {
    margin: 10px 15px 80px 15px;
    &__sameAsMember,
    &__agree {
      display: flex;
      .checkbox {
        margin-right: 8px;
      }
      p {
        font-size: 1.4rem;
        font-weight: bold;
        color: $tundora;
      }
    }
    &__agree {
      margin-bottom: 30px;
      .checkbox {
        width: 10%;
      }
    }
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
      position: relative;
      margin-bottom: 20px;
      > p {
        color: $heavy-metal;
      }
      span {
        display: none;
      }
      &:not(.store) {
        i {
          position: absolute;
          top: 35px;
          right: 10px;
        }
      }
    }
    .nameLabel {
      display: flex;
      align-items: center;
      justify-content: space-between;
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
    .store {
      .storeResult {
        margin-top: 20px;
        background-color: $background;
        padding: 10px;
        color: $sliver;
        .storeName {
          display: flex;
          align-items: center;
          color: $tundora;
          margin-bottom: 5px;
          i {
            margin-right: 5px;
          }
        }
      }
      ul {
        margin-top: 20px;
        li {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid $alto;
          padding: 10px;
          border-radius: 10px;
          margin-bottom: 10px;
          > div {
            display: flex;
            align-items: center;
            i {
              margin-right: 5px;
            }
          }
        }
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
    display: flex;
    align-items: center;
    justify-content: center;
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
  .red {
    color: $red;
  }
}
</style>
