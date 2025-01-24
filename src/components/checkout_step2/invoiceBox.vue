<template>
  <div v-if="isShowInvoiceBlock" class="invoiceBox">
    <div class="invoiceBox_head">
      <h3 class="title">發票資訊</h3>
    </div>
    <ul class="form">
      <li class="invoiceSection">
        <div class="top">
          <div class="radio">
            <i :class="['icon-radio', {active: choseType === 4 ||choseType === 5 }]" @click="changeInvoiceType(4)"></i>
            <p>個人電子發票<span @click="openDecriptionDialog(4)" class="desciptionBtn">(說明)</span></p>
          </div>
          <p class="red">中獎會主動寄出</p>
        </div>
        <div class="gray gap">如欲使用手機條碼載具，請於輸入框輸入驗證</div>
        <div :class="['invoiceBox__input', 'gap',{error: vehicleAlert.length > 0}]">
          <div class="invoice">
            <input type="text" v-model="vehicle">
            <span>{{vehicleAlert}}</span>
          </div>
        </div>
      </li>
      <li class="invoiceSection">
        <div class="top">
          <div class="radio">
            <i :class="['icon-radio', {active: choseType === 1}]" @click="changeInvoiceType(1)"></i>
            <p>發票捐贈<span class="desciptionBtn" @click="openDecriptionDialog(1)">(說明)</span></p>
          </div>
          <p class="gray">伊甸園基金會</p>
        </div>
      </li>
      <li class="invoiceSection">
        <div class="top mb20">
          <div class="radio">
            <i :class="['icon-radio', {active: choseType === 7}]" @click="changeInvoiceType(7)"></i>
            <p>公司電子發票<span class="desciptionBtn" @click="openDecriptionDialog(7)">(說明)</span></p>
          </div>
        </div>
        <div v-if="choseType === 7" class="company gap">
          <div :class="['invoiceBox__input mb20',{error: vatAlert.length > 0}]">
            <p>統一編號</p>
            <input type="tel" v-model="vat" placeholder="請輸入統一編號" @input="formatVat">
            <span>{{vatAlert}}</span>
          </div>
          <div :class="['invoiceBox__input mb20',{error: companyAlert.length > 0}]">
            <p>公司名稱</p>
            <input type="text" v-model="company" placeholder="請輸入公司名稱">
            <span>{{companyAlert}}</span>
          </div>
        </div>
      </li>
    </ul>
    <popupDialog v-if="isDesciptDialogOpen" @closeCenterDialog="closeDecriptionDialog" :isSimple="true">
      <div class="descriptMsg" v-html="descriptMsg"></div>
    </popupDialog>
  </div>
</template>

<script>
import popupDialog from "../common/popupDialog.vue";
export default {
  name: "invoiceBox",
  data() {
    return {
      memberInvoiceData: null,
      vehicle: "",
      vehicleAlert: "",
      choseType: 4,
      isDesciptDialogOpen: false,
      descriptMsg: "",
      vat: "",
      vatAlert: "",
      company: "",
      companyAlert: "",
      submitData: null,
      isShowInvoiceBlock: true, // 是否顯示發票區塊
    };
  },
  async created() {
    // 只能幣金結帳就不用開發票  預設為會員載具
    if (this.cart?.coinOnly) {
      this.isShowInvoiceBlock = false;
      return;
    }

    await this.getInvoiceData();
    if (this.memberInvoiceData) {
      this.setOldInvoiceData();
    }
  },
  components: { popupDialog },
  props: {
    cart: { type: Object },
  },
  watch: {
    vehicle(value) {
      // 將使用者輸入的值都轉成大寫 並且 去除英數字.+-以外字元
      this.vehicle = value.toUpperCase().replace(/[^0-9A-Z.+-]/g, "");
    },
  },
  methods: {
    changeInvoiceType(invoiceType) {
      this.choseType = invoiceType;
    },
    async getInvoiceData() {
      const invoice = await this.api.invoice.getInvoice();
      if (invoice) {
        this.memberInvoiceData = invoice;
      }
    },
    setOldInvoiceData() {
      this.memberInvoiceData.forEach((ele) => {
        if (ele.type === 5) {
          this.vehicle = ele.vehicle.replace(/\//g, ""); // 去除載具開頭的斜線
        }
        if (ele.type === 7) {
          this.vat = ele.vatNumber;
          this.company = ele.companyName;
        }
      });
    },
    //統一編號防呆
    formatVat() {
      this.vat = this.vat.replace(/[^\d]/g, "");
    },
    //檢查手機條碼載具api
    async checkEInvoiceVehicle() {
      const vehicle = "/" + this.vehicle; // 載具加上斜線做驗證
      return await this.api.invoice.verifyVehicle(vehicle);
    },
    async checkInvoice() {
      this.submitData = null; //重設submit
      this.vehicleAlert = "";
      this.vatAlert = "";
      this.companyAlert = "";
      if (this.choseType === 4 || this.choseType === 5) {
        if (this.vehicle == "") {
          //手
          this.choseType = 4;
          this.submitData = {
            invoiceType: this.typeToName(this.choseType),
          };
          return true;
        }
        const status = await this.checkEInvoiceVehicle();
        if (!status) {
          this.vehicleAlert = "手機條碼載具碼有誤，請重新輸入。";
          return false;
        }
        this.choseType = 5;
        this.submitData = {
          invoiceType: this.typeToName(this.choseType),
          einvoiceMobileVehicleNum: "/" + this.vehicle,
        };
      } else if (this.choseType === 1) {
        //雲端發票捐贈
        this.submitData = {
          invoiceType: this.typeToName(this.choseType),
          donateId: 25885,
          donateName: "伊甸基金會",
        };
      } else if (this.choseType === 7) {
        let check = true;
        if (!this.tools.checkVat(this.vat)) {
          this.vatAlert = "輸入格式錯誤，請重新輸入。";
          check = false;
        }
        if (!this.company) {
          this.companyAlert = "必填欄位。";
          check = false;
        }
        if (!check) {
          return false;
        }
        this.submitData = {
          invoiceType: this.typeToName(this.choseType),
          vatNumber: this.vat,
          companyName: this.company,
        };
      }
    },
    //invoicetype數字轉文字
    typeToName(type) {
      const typeToName = {
        1: "DONATE",
        4: "E_COPIES",
        5: "MOBILE_COPIES",
        7: "THREE_COPIES",
      };
      return typeToName[type];
    },
    openDecriptionDialog(invoiceType) {
      const descriptMsg = {
        4: `
        <ul>
          <li>
            <p>friDay購物已採用電子發票，開立 後可至【訂單查詢】點選「發票資訊」，即可查詢發票圖像。</p>
          </li>
          <li>
            <p>電子發票會在開獎次日自動兌獎，如中獎會於次月5號以紙本寄送【掛號信】至會員地址(使用手機載具將由財政部自動兌獎)。</p>
          </li>
          <li>
            <p>依統一發票使用辦法規定：統一發票一經開立，不得任意更改或改開公司發票。<a target="_blank" href="https://www.einvoice.nat.gov.tw/">(財政部電子發票流程說明)</a></p>
          </li>
        </ul>
        `,
        1: `
        <ul>
          <li>
            <p>依統一發票使用辦法規定：統一發票一經開立，不得任意更改或改開公司發票。<a target="_blank" href="https://www.einvoice.nat.gov.tw/">(財政部電子發票流程說明)</a></p>
          </li>
        </ul>
        `,
        7: `
        <ul>
          <li>
            <p>如您需紙本發票，請至【訂單查詢】點選「發票資訊」直接下載列印PDF。</p>
            <p>依統一發票使用辦法規定：電子發票一經開立，不得任意更改或改開公司發票。<a target="_blank" href="https://www.einvoice.nat.gov.tw/">(財政部電子發票流程說明)</a></p>
          </li>
        </ul>
        `,
      };
      this.descriptMsg = descriptMsg[invoiceType];
      this.isDesciptDialogOpen = true;
    },
    vehicleFocus() {
      if (this.vehicle === "") {
        this.vehicle = "/";
      }
    },
    vehicleBlur() {
      if (this.vehicle === "/") {
        this.vehicle = "";
      }
    },
    closeDecriptionDialog() {
      this.isDesciptDialogOpen = false;
    },
    async submit() {
      //通過check invoiceSubmitData會有值
      await this.checkInvoice();
      return this.submitData;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";
.invoiceBox {
  padding-bottom: 20px;
  background-color: $white;
  &__input {
    position: relative;
    span {
      display: none;
    }
    i {
      position: absolute;
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
    outline: none;
    &:focus {
      border: 1px solid $black;
    }
    &::placeholder {
      color: $sliver;
    }
  }
  .invoiceBox_head {
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
  .form {
    margin: 0 20px;
    list-style-type: none;
    .invoiceSection {
      border-bottom: 1px solid $alto;
      font-size: 14px;
      padding: 10px 0;
      &:last-of-type {
        border-bottom: 0;
      }
      > .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .radio {
          display: flex;
          align-items: center;
          i {
            margin-right: 5px;
          }
        }
      }
    }
    .desciptionBtn {
      margin-left: 5px;
      color: $blue;
    }
    .gap {
      margin: 10px 0 0 28px;
    }
  }
  .gray {
    color: $sliver;
  }
  .red {
    color: $red;
  }
  .mb20 {
    margin-bottom: 20px;
  }
  .descriptMsg {
    margin-left: 20px;
    margin-bottom: 50px;
    font-size: 15px;
  }
  ::v-deep .descriptMsg > ul {
    li {
      margin-bottom: 10px;
      a {
        color: $blue;
      }
    }
  }
  .invoice {
    position: relative;
    input {
      padding-left: 50px;
    }
    &::before {
      content: "/";
      position: absolute;
      width: 35px;
      height: 38px;
      background-color: $silver1;
      top: 6px;
      left: 1px;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
