<template>
  <fullscreenDialog v-if="showDialog" @closeDialog="closeDialog" :useClose="true">
    <template v-slot:header>
      <span>新增門市</span>
    </template>
    <template v-slot:body>
      <div class="createStore">
        <div class="createStore__preset">
          <p class="createStore__preset-content">設為預設門市</p>
          <i :class="switchObj" @click="switchClick"></i>
        </div>
        <div :class="['createStore__input' , {'error': error.nameErrorMsg}]">
          <label>收貨人</label>
          <div class='inputArea'>
            <input class="inputArea__nameInput" v-model="input.name" type="text" placeholder="請輸入收貨人姓名">
          </div>
          <p class="errorMsg">{{error.nameErrorMsg}}</p>
        </div>
        <div :class="['createStore__input' , {'error': error.phoneErrorMsg}]">
          <label>手機號碼</label>
          <div class='inputArea'>
            <input class="inputArea__phoneInput" v-model="input.phoneNum" type="text" placeholder="請輸入收貨人手機號碼" maxlength="10">
          </div>
          <p class="errorMsg">{{error.phoneErrorMsg}}</p>
        </div>
        <div :class="['createStore__input' , {'error': error.emailErrorMsg}]">
          <label>Email</label>
          <div class='inputArea'>
            <input class="inputArea__phoneInput" v-model="input.email" type="text" placeholder="請輸入收貨人Email">
          </div>
          <p class="errorMsg">{{error.emailErrorMsg}}</p>
        </div>
        <div v-if="!selectStore" class="createStore__input">
          <label>取貨門市</label>
          <div class="store" @click="choseStore(1)">
            <i class="store_type_1"></i>
            <span>請選擇7-11門市</span>
            <i class="arrow"></i>
          </div>
          <div class="store" @click="choseStore(2)">
            <i class="store_type_2"></i>
            <span>請選擇全家門市</span>
            <i class="arrow"></i>
          </div>
        </div>
        <div v-else class="createStore__result">
          <label>取貨門市</label>
          <div class="storeInfo">
            <i class='delChoseBtn' @click="selectStore=null"></i>
            <div>
              <i :class="`storeImg store_type_${selectStore.storeType}`"></i>
              <font>{{selectStore.storeTypeName}}{{selectStore.storeName}}</font>
            </div>
            <font>{{selectStore.storeAddress}}</font>
          </div>
        </div>
        <p class="createStore__message">按下確認即表示同意將本次信用卡資料紀錄於「取貨門市管理」中，節省下次結帳時間。</p>
        <div class="createStore__confirmBtn">
          <span @click="confirmBtnClick">確認</span>
        </div>
      </div>
      <input type="hidden" id="storeObject" value="">
    </template>
  </fullscreenDialog>
</template>

<script>
import fullscreenDialog from "../common/fullscreenDialog.vue";
var observer;
export default {
  name: "createDialog",
  data() {
    return {
      switchObj: {
        //控制預設switch button
        "createStore__preset-switch": true,
        off: false,
      },
      input: {
        //使用者輸入資料
        name: "",
        phoneNum: "",
        email: "",
      },
      selectStore: null,
      error: {
        //input框的錯誤區塊
        nameErrorMsg: "",
        phoneErrorMsg: "",
        emailErrorMsg: "",
      },
      choseStoreType: null, //選擇的商店代號(1: 711 , 2: 全家)
    };
  },
  props: {
    showDialog: {
      type: Boolean,
      default: () => false,
    },
  },
  components: {
    fullscreenDialog,
  },
  methods: {
    closeDialog() {
      //關閉新增視窗
      this.$emit("closeDialog");
    },
    switchClick() {
      //設為預設門市switch切換
      this.switchObj.off = !this.switchObj.off;
    },
    //選擇後回傳
    choseStore(storeType) {
      this.choseStoreType = storeType;
      this.openMapDialog();
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
    //監聽map回傳物件的input值
    //TODO  新增超商接值
    setMutiation() {
      const increaseStoreInput = document.getElementById("storeObject");
      const observer = new MutationObserver(() => {
        const val = JSON.parse(increaseStoreInput.value);
        this.selectStore = val;
      });
      observer.observe(increaseStoreInput, { attributes: true });
    },
    //檢查新增欄位資料
    checkData() {
      // this.selectStore = {
      //   storeType: "2",
      //   storeId: "014827",
      //   storeName: "全家新竹元太店",
      //   storeAddress: "新竹市東區力行一路3號",
      // };
      this.error.nameErrorMsg = "";
      this.error.phoneErrorMsg = "";
      let check = true;
      let { checkName, checkMoblie } = this.tools;
      this.error.nameErrorMsg = checkName(this.input.name);
      this.error.phoneErrorMsg = checkMoblie(this.input.phoneNum);
      this.error.emailErrorMsg = this.checkEmail(this.input.email);
      if (
        this.error.nameErrorMsg ||
        this.error.phoneErrorMsg ||
        this.error.emailErrorMsg
      )
        check = false;
      if (!this.selectStore) {
        //門市
        this.api.ui.alert.getFadeAlert("請選擇取貨門市");
        check = false;
      } else if (this.selectStore && this.selectStore.storeStatus === 0) {
        //有選擇門市但門市已失效
        this.api.ui.alert.getFadeAlert("此門市已失效，請重新選擇。");
        check = false;
      }

      return check;
    },
    checkEmail(val) {
      if (val !== "") {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(val) ? "" : "請輸入正確信箱格式";
      }
      return "";
    },
    async insertMemberStore() {
      const postData = {
        email: this.input.email,
        isDefault: !this.switchObj.off ? "Y" : "N",
        mobile: this.input.phoneNum,
        name: this.input.name,
        storeAddress: this.selectStore.storeAddress,
        storeId: this.selectStore.storeId,
        storeName: this.selectStore.storeName,
        storeType: this.selectStore.storeType,
      };
      const isOk = await this.api.member.createStore(postData);
      if (isOk) {
        this.$emit("updateDataList"); //觸發父類別更新data
        this.closeDialog(); //關閉新增門市popup框
      }
    },
    //確認新增按鈕click
    confirmBtnClick() {
      const check = this.checkData(); //防呆檢查
      if (!check) {
        return false;
      }
      this.insertMemberStore();
    },
  },
  mounted() {
    this.setMutiation();
  },
  watch: {
    selectStore() {
      if (!observer) return;
      observer.disconnect(); //關閉observer釋放資源
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";

.createStore {
  margin: 0 10px;
  color: $tundora;
  padding-bottom: 100px;

  &__preset {
    margin: 10px 0;
    min-height: 35px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $tundora;

    &-content {
      font-weight: 500;
      color: $heavy-metal;
    }

    &-switch {
      width: 40px;
      height: 22px;
      background: url(../../images/icons/check-switch-on.svg) center/40px 22px
        no-repeat;

      &.off {
        background: url(../../images/icons/check-switch-off.svg) center/40px
          22px no-repeat;
      }
    }
  }

  &__input {
    margin-bottom: 20px;

    .store {
      height: 40px;
      font-size: 1.4rem;
      margin: 0px 0px 10px 0px;
      box-sizing: border-box;
      padding: 10px 5px 5px 15px;
      border-radius: 8px;
      border: solid 1px $alto;
      position: relative;
      display: flex;
      align-items: center;

      .arrow {
        width: 22px;
        height: 22px;
        background: url(../../images/icons/arrow-right.svg) center/22px
          no-repeat;
        position: absolute;
        right: 15px;
      }

      span {
        margin-left: 10px;
      }
    }

    label {
      display: inline-block;
      min-height: 45px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    input {
      width: 100%;
      height: 40px;
      background-color: $black-haze;
      border-radius: 10px;
      font-size: 16px;
      box-sizing: border-box;
      margin: 0;
      padding: 10px;
      border: 0;
      outline: none;
    }

    .errorMsg {
      display: none;
    }

    &.error {
      .errorMsg {
        display: block;
        font-size: 1.3rem;
        color: $red;
      }

      input {
        border: 1px solid $red;
      }
    }
  }

  &__result {
    label {
      display: inline-block;
      min-height: 45px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .storeInfo {
      width: 100%;
      font-size: 1.4rem;
      margin: 0 0 10px 0;
      box-sizing: border-box;
      padding: 10px 15px;
      border-radius: 8px;
      vertical-align: middle;
      position: relative;
      background-color: $background;
      color: $sliver;

      > div {
        display: flex;
        align-items: center;

        font {
          margin-left: 8px;
          color: $tundora;
        }

        margin-bottom: 8px;
      }

      .delChoseBtn {
        width: 16px;
        height: 16px;
        background: url(../../images/icons/circle-cross-gy.svg) center/16px
          no-repeat;
        position: absolute;
        right: 14px;
      }
    }
  }

  &__message {
    margin-bottom: 10px;
  }

  &__confirmBtn {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 10px 0 10px;
    border-top: 1px solid $alto;
    background-color: $white;
    display: flex;
    justify-content: center;

    span {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 95%;
      height: 40px;
      text-align: center;
      border-radius: 10px;
      background-color: $red;
      color: $white;
      font-size: 16px;
      cursor: pointer;
      border: 0;
      line-height: 16px;
    }
  }
}

.flex {
  display: flex;
  justify-content: space-between;

  input {
    width: 49%;
    text-align: center;
  }
}

::-webkit-input-placeholder {
  color: $sliver;
}
</style>
