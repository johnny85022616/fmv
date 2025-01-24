<template>
  <div class="invoice-content">
    <div class="invioce-item " v-for="(item, i) of invoiceItems" :key="i">
      <div class="d-flex" v-if="item.typeNum != 5">

        <div class="invoice-box">
          <div class="invoice-type">
            <h3 :type="item" :index="i">{{ item.typeName }} </h3>
          </div>
          <div class="invoice-info" v-if="i != invoiceItems.length - 1">
            <p class="color-grey-txt" v-html="item.typeInfo"></p>
          </div>
        </div>
      </div>
      <span class="btn-wrapper" v-if="item.typeNum != 1 && item.typeNum != 5" :type="item.typeName" :itemIndex="i" @click.stop="fullscreendialogShow(item.typeName, item.typeNum, i)"><i class="arrow-right"></i></span>

    </div>

    <div v-if="showDialog && fullscreendialogOn != '電子發票設定及歸戶'">
      <fullscreendialog :isFullscreen="true" :closeDialog="closeDialog" :useClose="false" v-on:closeDialog="closeDialog">

        <template v-slot:header>
          <span v-if="fullscreendialogOn == '個人電子發票'">個人電子發票</span>
          <span v-else-if="fullscreendialogOn == '發票捐贈'">發票捐贈</span>
          <span v-else-if="fullscreendialogOn == '公司電子發票'">公司電子發票</span>
        </template>
        <template v-slot:body>
          <div v-if="fullscreendialogOn == '個人電子發票'" class="member-cloud-invoice-box">
            <div class="color-grey-txt mt20">
              <div class="form-area">
                <p>如欲使用手機條碼載具，請於輸入框輸入驗證</p>
                <div class="input_wrapper" @click="toSelmemberInvoice('手機條碼載具')">
                  <i :class="['icon-radio', { 'active': memberInvoiceObj.memberInvoiceSel == '手機條碼載具' }]"></i>
                  <input type="text" placeholder="請輸入手機條碼" v-model="memberInvoiceObj.vehicle" maxlength="8" @keyup="upperCase">
                  <span class="error-msg">手機條碼載具碼有誤，請重新輸入。</span>
                </div>
                <p class="color-grey-txt mt20">・friDay購物已採用電子發票，開立後可至【訂單查詢】點選「發票資訊」，即可查詢發票圖像。</p>
                <p class="color-grey-txt mt20">・電子發票會在開獎次日自動兌獎，如中獎會於次月5號以紙本寄送【掛號信】至會員地址(使用手機載具將由財政部自動兌獎)。</p>
                <p class="color-grey-txt mt20">・依統一發票使用辦法規定：統一發票一經開立，不得任意更改或改開公司發票。(<a href="https://www.einvoice.nat.gov.tw/">財政部電子發票流程說明</a>)</p>
              </div>

            </div>
          </div>
          <div v-else-if="fullscreendialogOn == '公司電子發票'" class="company-invoice-box">
            <div class="control-box">
              <div class="form-area">
                <div class="input_wrapper">
                  <label>統一編號</label>
                  <input type="text" inputmode="numeric" placeholder="請輸入統一編號" v-model="companyPrintObj.vatNumber" maxlength="8">
                  <span class="error-msg">輸入格式錯誤，請重新輸入。</span>
                </div>
                <div class="input_wrapper">
                  <label>公司名稱</label>
                  <input type="text" placeholder="請輸入公司名稱" v-model="companyPrintObj.name">
                  <span class="error-msg">必填欄位。</span>
                </div>
                <p class="color-grey-txt mt20">・如您需紙本發票，請至【訂單查詢】點選「發票資訊」直接下載列印PDF。</p>
                <p class="color-grey-txt mt20">・依統一發票使用辦法規定：統一發票一經開立，不得任意更改或改開公司發票。(<a href="https://www.einvoice.nat.gov.tw/">財政部電子發票流程說明</a>)</p>
              </div>
            </div>

          </div>
          <div v-else-if="fullscreendialogOn == '發票捐贈'" class="invoice-donate-box">
            <div class="control-box">
              <div class="form-area">
                <div class="radio-box" v-for="(item, i) in foundations.foundations" :key="i" @click="donateFn(i)">
                  <i :class="['icon-radio', { 'active': foundations.donateTo == i }]"></i>
                  <label>{{ item.name }}</label>
                </div>
                <span class="error-msg">請選擇捐贈單位。</span>
                <p class="color-grey-txt mt20">按下確認即表示同意將本次發票紀錄於「發票管理｣中，節省下次結帳時間。</p>
              </div>
            </div>
          </div>
          <div class="submit-area">
            <button :class="['reset-btn', { 'disabled': memberInvoiceObj.memberInvoiceSel == '會員載具' && fullscreendialogOn == '個人電子發票' || invoiceItems[fullscreendialogIndex].typeInfo === '尚未設定' }]" @click="popupBox" :disabled="(memberInvoiceObj.memberInvoiceSel == '會員載具' && fullscreendialogOn == '個人電子發票') || invoiceItems[fullscreendialogIndex].typeInfo === '尚未設定'">重置</button>
            <button class="submit-btn" @click="sendInvoiceSetting(fullscreendialogOn)">確認</button>
          </div>
        </template>
      </fullscreendialog>
    </div>
    <popupDialog v-if="isDeletePopupShow" @closeCenterDialog="closeCenterDialog" :callback="() => resetInvoiceSetting(fullscreendialogOn)">是否將該筆發票資訊清除？</popupDialog>
  </div>
</template>

<script>
import fullscreendialog from "../common/fullscreenDialog.vue"; // 全畫面蓋版提示框
import popupDialog from "../common/popupDialog.vue";
export default {
  name: "inviocelist",
  components: {
    fullscreendialog,
    popupDialog,
  },
  data() {
    return {
      invoiceItems: [
        {
          typeName: "個人電子發票",
          typeInfo: null,
          vehicle: null,
          typeNum: 4,
        },
        {
          typeName: "發票捐贈",
          typeInfo: "伊甸基金會",
          typeNum: 1,
        },
        {
          typeName: "公司電子發票",
          typeInfo: "尚未設定",
          typeNum: 7,
        },
        {
          typeName: "個人電子發票",
          typeInfo: "手機條碼載具 尚未設定",
          typeNum: 5,
        },
      ],
      switchIsOn: true,
      isMemberData: false,
      memberInfo: {}, //會員資料
      invoiceData: {},
      showDialog: false,
      isDefault: 0,
      isDefaultType: 4, //會員載具
      // isChecked: '',
      fullscreendialogOn: null,
      fullscreendialogIndex: null,
      memberInvoiceObj: {
        items: ["會員載具", "手機條碼載具"],
        memberInvoiceSel: null,
        vehicle: null,
        switch: true,
      },
      companyPrintObj: {
        name: null,
        vatNumber: null,
      },
      foundations: {
        foundations: [
          {
            name: "伊甸基金會",
            id: "25885",
          },
        ],
        donateTo: 0,
      },
      isDeletePopupShow: false,
    };
  },
  props: {
    windowY: {
      type: Number,
      default: 0,
    },
    isDownloadAppOpened: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.getData();
    this.api.member.getMember().then((res) => {
      this.memberInfo = res ? res : {};
    });
  },
  watch: {
    "memberInvoiceObj.memberInvoiceSel": {
      deep: true,
      handler() {
        if (
          this.memberInvoiceObj.memberInvoiceSel == "會員載具" &&
          this.isDefaultType == 4
        ) {
          this.memberInvoiceObj.switch = false;
        } else if (
          this.memberInvoiceObj.memberInvoiceSel == "手機條碼載具" &&
          this.isDefaultType == 5
        ) {
          this.memberInvoiceObj.switch = false;
        } else {
          this.memberInvoiceObj.switch = true;
        }
      },
    },
  },
  methods: {
    //關閉刪除popup
    closeCenterDialog() {
      this.isDeletePopupShow = false;
    },
    openCenterDialog() {
      this.isDeletePopupShow = true;
    },
    upperCase() {
      this.memberInvoiceObj.vehicle =
        this.memberInvoiceObj.vehicle.toUpperCase();
    },
    popupBox() {
      if (this.api.member.isLogin) {
        this.openCenterDialog();
      } else {
        window.location.href = this.api.member.loginUrl();
      }
    },
    //重置設定
    resetInvoiceSetting(v) {
      if (!this.api.member.isLogin) {
        window.location.href = this.api.member.loginUrl();
        return;
      }

      const vm = this;
      const typeAry = vm.invoiceItems.filter((i) => i.typeName == v);

      let type = typeAry[0].type;
      if (
        type == 4 &&
        Object.prototype.hasOwnProperty.call(this.invoiceData, 5)
      ) {
        type = 5;
      }
      // const ticket = this.api.member.faToken;

      // if (ticket) {
      this.api.invoice.deleteInvoice(type).then((res) => {
        if (res) {
          this.closeDialog();
        } else {
          this.memberInvoiceObj.memberInvoiceSel = "會員載具";
          this.memberInvoiceObj.switch = false;
          this.closeDialog();
        }
        // else if (res.data.code == 90401) { // 未登入情況
        //   window.location.href = this.api.member.loginUrl();
        // }
      });
      // }

      return true;
    },
    sendInvoiceSetting(v) {
      //送出變更
      const vm = this;

      let payload = {};
      let toSetting = true;
      let nameChk = true;
      let roadChk = true;

      switch (v) {
        case "個人電子發票":
          if (vm.memberInvoiceObj.memberInvoiceSel == "手機條碼載具") {
            payload = {
              invType: "5",
              isDefault: "Y",
              vehicle: vm.memberInvoiceObj.vehicle,
            };
          } else {
            payload = {
              invType: "4",
              isDefault: "Y",
            };
          }
          if (
            document.querySelector(
              ".member-cloud-invoice-box .input_wrapper input"
            ).value == ""
          ) {
            if (vm.memberInvoiceObj.memberInvoiceSel == "手機條碼載具") {
              document
                .querySelector(".member-cloud-invoice-box .input_wrapper")
                .classList.add("error");
              toSetting = false;
            }
          } else {
            document
              .querySelector(".member-cloud-invoice-box .input_wrapper")
              .classList.remove("error");
          }

          break;
        case "發票捐贈":
          payload = {
            invType: "1",
            isDefault: "N",
            id: "25885",
            name: "伊甸基金會",
          };
          break;
        case "公司電子發票":
          payload = {
            invType: "7",
            isDefault: "N",
            companyName: vm.companyPrintObj.name,
            vatNumber: vm.companyPrintObj.vatNumber, // 04595257
          };
          var inputAll = document.querySelectorAll(
            ".company-invoice-box .input_wrapper input"
          );
          inputAll.forEach((v) => {
            if (v.value == "") {
              v.parentElement.classList.add("error");
              toSetting = false;
            } else {
              v.parentElement.classList.remove("error");
            }
          });
          break;
        default:
          break;
      }

      if (this.api.member.isLogin && toSetting && roadChk && nameChk) {
        if (
          v == "個人電子發票" &&
          this.memberInvoiceObj.memberInvoiceSel == "手機條碼載具"
        ) {
          const barcode = this.memberInvoiceObj.vehicle; // /HYXVV3S
          if (
            (barcode && barcode.length !== 8) ||
            (barcode && !/^\//i.test(barcode))
          ) {
            document
              .querySelector(".member-cloud-invoice-box .input_wrapper")
              .classList.add("error");
            return;
          }
        }

        this.api.invoice.updateInvoice(payload).then((res) => {
          if (res) {
            this.closeDialog();
          }
        });
      }
    },
    toSelmemberInvoice(e) {
      this.memberInvoiceObj.memberInvoiceSel = e;
    },
    donateFn(i) {
      this.foundations.donateTo = i;
    },
    closeDialog() {
      this.showDialog = false;
      this.fullscreendialogOn = "";
      this.fullscreendialogIndex = null;
      this.$emit("stopBodyScroll", "close");
      this.getData();
    },
    fullscreendialogShow(typeName, typeNum, Index) {
      this.$emit("stopBodyScroll");

      const vm = this;

      vm.fullscreendialogOn = typeName;
      vm.fullscreendialogIndex = Index;
      vm.showDialog = true;

      if (Object.prototype.hasOwnProperty.call(vm.invoiceData, typeNum)) {
        this.switchIsOn = typeNum === this.isDefaultType ? true : false;

        switch (typeNum) {
          case 1:
            // foundations: ['伊甸基金會', '財團法人肝病防治學術基金會', '心路基金會'],
            var foundation = vm.invoiceData[typeNum].name;
            var foundationSelIndex = vm.foundations.foundations.findIndex(
              function (v) {
                return v.name == foundation;
              }
            );
            vm.foundations.donateTo = foundationSelIndex;
            break;
          case 4:
            if (
              vm.memberInvoiceObj.memberInvoiceSel == "會員載具" &&
              vm.isDefaultType == 4
            ) {
              vm.memberInvoiceObj.switch = false;
            } else if (
              vm.memberInvoiceObj.memberInvoiceSel == "手機條碼載具" &&
              vm.isDefaultType == 5
            ) {
              vm.memberInvoiceObj.switch = false;
            } else {
              vm.memberInvoiceObj.switch = true;
            }
            // vm.isDefaultType == 5 ? vm.memberInvoiceSel = '手機條碼載具' : vm.memberInvoiceSel = '會員載具'

            break;

          case 7:
            vm.companyPrintObj.name = vm.invoiceData[typeNum].companyName;
            vm.companyPrintObj.vatNumber = vm.invoiceData[typeNum].vatNumber;
            break;
        }
      } else {
        this.switchIsOn = true;
      }
    },
    getData() {
      this.api.invoice.getInvoice().then((invoiceInfos) => {
        let newObj = {};
        let defaultVehicle = null;
        invoiceInfos.forEach((e) => {
          newObj[e.type] = e;
          if (e.vehicle) defaultVehicle = e.vehicle;
        });
        this.invoiceData = newObj;
        // 1: 發票捐贈, 2: 個人紙本發票, 3: 公司用郵寄, 4: 會員載具(個人電子發票), 5: 手機條碼載具(個人電子發票), 7: 公司用線上列印
        this.invoiceItems.forEach((e, i) => {
          if (
            Object.prototype.hasOwnProperty.call(this.invoiceData, e.typeNum)
          ) {
            //假設該方式已經有設定過
            e = Object.assign(e, this.invoiceData[e.typeNum]); //變為api中typeNum相等的資料
            if (e.typeNum == 4) {
              //若為會員載具(個人電子發票)
              this.isDefault = 0;
              this.isDefaultType = 4;
              this.invoiceItems[0].typeInfo = ``; //灰字
              this.memberInvoiceObj.memberInvoiceSel = "會員載具";
            } else if (e.typeNum == 5) {
              //手機條碼載具(個人電子發票)
              if (e.isDefault) {
                this.isDefault = 0;
                this.isDefaultType = 5;
                this.invoiceItems[0].typeInfo = `手機條碼載具`;
                if (defaultVehicle) {
                  this.invoiceItems[0].typeInfo += ` ${defaultVehicle}`;
                }
                this.memberInvoiceObj.memberInvoiceSel = "手機條碼載具";
              }
              this.invoiceItems[0].vehicle = e.vehicle; // /HYXVV1r
              this.memberInvoiceObj.vehicle = e.vehicle;
            } else {
              if (e.isDefault) {
                this.isDefault = i;
                this.isDefaultType = e.typeNum;
              }
            }

            switch (e.typeNum) {
              case 7:
                e.typeInfo = `<span>${this.invoiceData[e.typeNum].vatNumber} ${
                  this.invoiceData[e.typeNum].companyName
                }</span>`;
                break;
            }
          } else {
            //若該方式還未做設定
            e.typeInfo = "尚未設定";

            switch (e.typeName) {
              case "個人電子發票":
                this.invoiceItems[0].vehicle = "";
                // this.invoiceItems[5].vehicle = ''
                this.memberInvoiceObj.vehicle = "";
                this.invoiceItems[0].typeInfo = "";
                break;
              case "發票捐贈":
                this.foundations.donateTo = 0;
                this.invoiceItems[1].typeInfo = "伊甸基金會";
                break;
              case "公司電子發票":
                this.companyPrintObj.name = "";
                this.companyPrintObj.vatNumber = ""; // 04595257
                break;
            }
          }
        });
      });
    },
  },
};
</script>

<style lang="scss">
$borderRadius10: 10px;
$colorGrey: #adadad;
$colorRed: #f34f59;

hr {
  background-color: #e0e0e0;
  height: 1px;
  border: none;
  margin: 20px 0;
}

.color-grey-txt {
  color: $colorGrey;
  line-height: 1.79;

  a {
    color: #338bf8;
  }
}

.color-red-txt {
  color: $colorRed;
}

.overlay-block {
  z-index: 99999;
}

.message-fixed.middle.center {
  z-index: 999999;
}

#invoice-wrap {
  .invoice-content {
    .invioce-item {
      position: relative;

      .d-flex {
        background-color: #fff;
        margin: 10px 10px 0;
        padding: 16px 10px;
        border-radius: $borderRadius10;
        font-size: 1.4rem;
        box-sizing: border-box;
      }

      .invoice-box {
        width: calc(100% - 20px);

        padding-left: 8px;

        .invoice-type {
          h3 {
            display: inline-block;
            color: #353635;
          }

          .color-red-txt {
            margin-left: 8px;
          }
        }

        .invoice-info {
          margin-top: 10px;
          min-height: 20px;

          p {
            white-space: pre-line;

            span {
              display: block;
              width: 95%;
              word-break: break-all;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              text-overflow: ellipsis;
              max-height: 40px;
              overflow: hidden;
            }
          }
        }
      }

      span.btn-wrapper {
        position: absolute;
        right: 20px;
        top: 16px;
        width: 20%;
        height: 50px;
        text-align: right;
      }

      .angle-right {
        display: inline-block;
      }
    }

    .dialog {
      i {
        vertical-align: middle;
      }

      .error-msg {
        display: none;
        font-size: 1.2rem;
      }

      .input_wrapper {
        margin: 5px 0 40px;

        // .Mcompoent input[type="checkbox"]:checked+label.checkbox::before, .popup-box input[type="checkbox"]:checked+label.checkbox::before
        input[type="checkbox"] {
          position: absolute;
          left: -9999px;
          min-width: 0;
          box-sizing: border-box;
        }

        input[type="checkbox"] + label.checkboxLabel::before {
          content: "";
          display: inline-block;
          vertical-align: bottom;
          width: 19px;
          height: 19px;
          background-color: #fff;
          margin-right: 10px;
          border: 1.48px solid #404040;
          margin-right: 8px;
          border-radius: 3px;
          box-sizing: border-box;
        }

        input[type="checkbox"]:checked + label.checkboxLabel::before {
          background-image: url(https://m.shopping.friday.tw/static/images/common/square-tick-rd.png);
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          border: 0;
          width: 19px;
          height: 19px;
        }

        input[type="text"],
        select {
          font-size: 1.6rem;
          padding: 10px 15px;
          margin-top: 5px;
          border: 1px solid #f8f9f9;
          color: #3c3c3c;
          border-radius: 10px;
          width: 100%;
          box-sizing: border-box;
          background-color: #f8f9f9;
          -webkit-appearance: none;
          appearance: none;

          &::placeholder {
            color: #adadad;
          }
        }

        select {
          appearance: none;
          background: #f8f9f9
            url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOSIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE5IDE4Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbD0iIzNDM0MzQyIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTEzLjA4NSA0Ljk1Yy4yNjUgMCAuNTIzLjA3NS43NDEuMjE1LjU2NC4zNjEuNzM1IDEuMDYzLjQxMiAxLjYxNWwtLjA2Ny4xMDEtNC4wODYgNS42M2MtLjA5My4xMjctLjIxLjIzNy0uMzQ2LjMyNC0uNTY0LjM2Mi0xLjMyMi4yNTQtMS43NS0uMjNsLS4wNzYtLjA5NS00LjA4NS01LjYzYy0uMTQ4LS4yMDQtLjIyOC0uNDQ3LS4yMjgtLjY5NSAwLS42NDIuNTIxLTEuMTcgMS4xODgtMS4yM2wuMTI3LS4wMDVoOC4xN3oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNTcgLTU4NikgdHJhbnNsYXRlKDIwIDE3NikgdHJhbnNsYXRlKDAgMjQ2KSB0cmFuc2xhdGUoMCAzMykgdHJhbnNsYXRlKDAgODUpIHRyYW5zbGF0ZSg1IDM1KSB0cmFuc2xhdGUoMTMyLjA3NSAxMSkiLz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=")
            right 5px center/19px 18px no-repeat;
        }

        select:first-of-type {
          margin-right: 5px;
        }

        .error-msg {
          color: $colorRed;
          font-size: 1.2rem;
        }

        &.error {
          input[type="text"],
          select {
            border: 1px solid #f34f59;
          }

          .error-msg {
            display: inline-block;
          }
        }
      }

      .form-area {
        .radio-box {
          height: auto;
          margin: 10px 0;

          label {
            font-weight: normal;
            margin-left: 5px;
            vertical-align: middle;
          }

          input[type="radio"] {
            display: none;
          }
        }

        &.error .radio-box:last-of-type ~ .error-msg {
          display: inline-block;
          color: $colorRed;
        }
      }

      .box {
        position: relative;

        .header {
          font-weight: bold;
        }

        .body {
          padding: 10px 20px;
          margin-bottom: 50px;
          box-sizing: border-box;
          position: unset;

          .company-invoice-box .form-area {
            min-height: 193px;
          }

          .invoice-donate-box .form-area {
            min-height: 140px;
          }

          .member-paper-invoice-box .form-area {
            min-height: 300px;
          }

          .company-invoice-mail-box .form-area {
            height: 490px;
            margin-bottom: 170px;
          }

          .member-cloud-invoice-box .form-area {
            height: 170px;
          }

          .submit-area {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 10px 0 10px 0;
            border-top: 1px solid #e0e0e0;
            text-align: center;
            background-color: #fff;

            button {
              width: 46%;
              margin: 0 2%;
              height: 40px;
              text-align: center;
              border-radius: 10px;
              background-color: $colorRed;
              color: #ffffff;
              font-size: 1.6rem;
              cursor: pointer;
              border: 0;
              line-height: 1rem;
              font-weight: bold;

              &.reset-btn {
                background-color: #fff;
                color: $colorRed;
                border: 1px solid $colorRed;

                &.disabled {
                  background-color: #ffffff;
                  color: #c7c7c7;
                  border: 1px solid #d2d2d2;
                }
              }
            }
          }
        }
      }
    }
  }

  .icon-radio {
    display: none;
  }
}
</style>
