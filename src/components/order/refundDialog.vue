<template>
  <div class="refundDialog" @click="closeAllFilterList">
    <fullscreenDialog @closeDialog="closeDialog">
      <template v-slot:header>退訂申請</template>
      <template v-slot:body>
        <div class="content">
          <p>交易編號：{{dealId}}</p>
          <template v-if="productsList&&productsList.length>0">
            <ul>
              <li v-for="(product,index) in productsList" :key="index">
                <div class="productArea">
                  <div class="left">
                    <i @click="chagePrdCheckboxStatus(index)" :class="['checkbox',{active: product.isChose}]"></i>
                  </div>
                  <div class="right">
                    <div class="mainPrd">
                      <a class="flex" :href="`/product?pid=${product.productId}`">
                        <img :src="product.images" alt="">
                      </a>
                      <div class="info">
                        <div class="top flex flex-space-between mb5">
                          <p>{{product.productName}}</p>
                        </div>
                        <div v-if="true" class="flex flex-space-between">
                          <p>規格： {{product.colorName}}</p>
                          <p>x{{product.quantity}}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="detail-bar">
                  <div v-if="product.productDiscountedPrice">
                    <p>單價：{{tools.priceFormat(product.productDiscountedPrice)}}</p>
                    <p class="gray">(折扣後)</p>
                  </div>
                  <p v-else>單價：{{tools.priceFormat(product.price)}}</p>
                  <p>折扣：{{tools.priceFormat(product.productDiscount)}}</p>
                  <p class="red">小計：{{tools.priceFormat(product.productPayAmount)}}</p>
                </div>
              </li>
            </ul>
            <div class="allChose">
              <i :class="['checkbox',{active: isAllChose}]" @click="chageAllChoseStatus"></i>
              <p>全選</p>
            </div>
          </template>
          <p v-else class="noData">暫無可退商品</p>
          <!-- form 區塊 -->
          <div class="refoundForm" v-if="isShowRefundBankForm">
            <p class="title">退款資訊</p>
            <div :class="['refoundForm__input' , {error: bankNameAlert.length > 0}]">
              <div>
                <p>銀行</p>
                <div class="input_block">
                  <div class="bankNameInput" @click.stop="">
                    <input type="text" v-model="bankNameInputVal" placeholder="輸入名稱或代號" @keyup="filterBankName">
                    <ul class="bankNameFilterList" v-if="isBankNameFilterListOpen">
                      <li v-for="bankNamObj in bankNameFilterArr" :key="bankNamObj.code" @click="setBankName(bankNamObj.name, bankNamObj.code, bankNamObj.id)">
                        ({{bankNamObj.code}}){{bankNamObj.name}}
                      </li>
                    </ul>
                  </div>
                  <span>{{bankNameAlert}}</span>
                </div>
              </div>
            </div>
            <div :class="['refoundForm__select',{error: bankBranchAlert.length>0}]">
              <div>
                <p>分行</p>
                <div class="input_block">
                  <div class="bankBranchInput" @click.stop="">
                    <input type="text" v-model="bankBranchInputVal" placeholder="輸入名稱或代號" @keyup="filterBankBranch">
                    <ul class="bankBranchFilterList" v-if="isBankBranchFilterListOpen">
                      <li v-for="bankBranchObj in bankBranchFilterArr" :key="bankBranchObj.code" @click="setBankBranch(bankBranchObj.name, bankBranchObj.code, bankBranchObj.id)">
                        ({{bankBranchObj.code}}){{bankBranchObj.name}}
                      </li>
                    </ul>
                  </div>
                  <span>{{bankBranchAlert}}</span>
                </div>
              </div>
            </div>
            <div :class="['refoundForm__input' , {error: accountAlert.length > 0}]">
              <div>
                <p>銀行帳號</p>
                <div class="input_block">
                  <input type="text" v-model="account" placeholder="請輸入銀行帳號">
                  <span>{{accountAlert}}</span>
                </div>
              </div>
            </div>
            <div :class="['refoundForm__input' , {error: bankUserNameAlert.length > 0}]">
              <div>
                <p>銀行戶名</p>
                <div class="input_block">
                  <input type="text" v-model="bankUserName" placeholder="請輸入姓名">
                  <span>{{bankUserNameAlert}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="refoundForm" v-if="order.isShowReturnAddressForm">
            <p class="title">收回商品資訊</p>
            <!-- <div class="sameAsReceiverChose">
              <i :class="['checkbox',{active: isSameAsReceiver}]" @click="isSameAsReceiverStatus"></i>
              <p>同收貨人資訊</p>
            </div> -->
            <div :class="['refoundForm__input' , {error: nameAlert.length > 0}]">
              <div>
                <p>收貨人姓名</p>
                <div class="input_block">
                  <input type="text" v-model="name" placeholder="請輸入姓名" autocomplete="new-password">
                  <span>{{nameAlert}}</span>
                </div>
              </div>
            </div>
            <div :class="['refoundForm__input' , {error: phoneAlert.length > 0}]">
              <div>
                <p>收貨人電話</p>
                <div class="input_block">
                  <input type="text" v-model="phone" placeholder="請輸入電話" autocomplete="new-password">
                  <span>{{phoneAlert}}</span>
                </div>
              </div>
            </div>
            <div :class="['refoundForm__address',{error: addressAlert.length > 0}]">
              <div class="top">
                <p>退貨取件地址</p>
                <div>
                  <select name="city" v-model="city" @change="isUserChange = true">
                    <option value="">請選擇縣市</option>
                    <option v-for="city in cityArr" :key="city.id" :value="city.id">{{city.name}}</option>
                  </select>
                  <select name="region" v-model="region" ref="region">
                    <option v-for="(region , index) in regionArr" :key="index" :value="region.id">{{region.name}}</option>
                  </select>
                </div>
              </div>
              <div class="bottom">
                <p></p>
                <div>
                  <input type="text" v-model="road" placeholder="請輸入地址">
                  <i v-if="road.length > 0" @click="road = ''"></i>
                  <span>{{addressAlert}}</span>
                </div>
              </div>
            </div>
          </div>
          <p class="gray notice"><input type="checkbox" v-model="isAgreeInvoiceProcess">您同意YSDT(遠時數位科技)於退貨後，代為處理退貨退款之發票及折讓單事宜，以加速退貨退款作業，提醒您，原已開立之發票將進行作廢/折讓，請勿進行申報，避免申報不實，遭受罰鍰。</p>
          <div v-if="isCheckoutApiLoading" class="loadingBtn">
            <span>
              <i></i>
            </span>
          </div>
          <div v-else class="submitBtn">
            <span @click="confirmClick">確認</span>
          </div>
        </div>
      </template>
    </fullscreenDialog>
  </div>
</template>

<script>
import fullscreenDialog from "../../components/common/fullscreenDialog.vue";
export default {
  data() {
    return {
      productsList: null,
      isAllChose: true,
      isUserClickAllChose: false,
      //收穫商品資訊
      cityArr: [],
      regionArr: [],
      city: "", //城市
      region: "", //地區
      road: "", //街道
      addressAlert: "", //地址錯誤訊息
      name: "",
      nameAlert: "",
      phone: "",
      phoneAlert: "",
      isSameAsReceiver: false,
      isUserChange: false, //地址是否為使用者手動點選
      //銀行
      bankNameInputVal: "", //input
      bankName: "", //code
      bankNameId: "", //id
      bankNameAlert: "",
      bankNameArr: [],
      bankNameFilterArr: [],
      isBankNameFilterListOpen: false,
      //分行
      bankBranchInputVal: "", //input
      bankBranch: "", //code
      bankBranchAlert: "",
      bankBranchArr: [],
      bankBranchFilterArr: [],
      isBankBranchFilterListOpen: false,

      bankUserName: "",
      bankUserNameAlert: "",
      account: "",
      accountAlert: "",

      memberReceiverData: null, //使用者預設收貨人
      formData: null,
      isCheckoutApiLoading: false, //送出api是否完成
      isAgreeInvoiceProcess: false, // 是否同意 代為處理退貨退款之發票及折讓單事宜
    };
  },
  props: {
    products: {
      type: Array,
    },
    dealId: {
      type: String,
    },
    memberId: {
      type: String,
    },
    order: {
      type: Object,
    },
  },
  async created() {
    this.composeProductList();
    this.getCity();
    this.getMemberReceiverData();
    this.getBanks();
  },
  computed: {
    /**
     * 付款方式=>信用卡分期 / 信用卡紅利 退款資訊顯示條件：
      a. 有付款成功，勾選了deal底下全部的item=>不需要出現
      b. 有付款成功，勾選了deal底下部分的item=>需要填寫匯款資料
      c. 尚未付款成功=>不需要出現
      d. 如果deal底下有已完成退貨退款的商品，即使只剩下部分item可以勾選部分也算是部分退貨，符合第二個條件=>需要填寫匯款資料
     */
    isShowRefundBankForm() {
      const { isShowRefundBankForm, isShowRefundBankSelected } = this.order;
      return (isShowRefundBankForm && !isShowRefundBankSelected) || (isShowRefundBankForm && isShowRefundBankSelected && !this.isAllChose);
    }
  },
  methods: {
    //取得縣市Arr
    async getCity() {
      this.cityArr = await this.api.member.getCity(this.city);
    },
    //關閉popup
    closeDialog() {
      this.$emit("closeRefundDialog");
    },
    //確定按鈕
    confirmClick() {
      this.submit();
    },
    //取得銀行名稱Arr
    async getBanks() {
      this.bankNameArr = await this.api.order.getBanks();
    },
    //bankName input filter
    filterBankName() {
      const val = this.bankNameInputVal;
      if (/^\d+$/.test(val)) {
        this.bankNameFilterArr = this.bankNameArr.filter((ele) => {
          const code = ele.code.toString();
          return code.startsWith(val);
        });
      } else {
        this.bankNameFilterArr = this.bankNameArr.filter((ele) => {
          const name = ele.name;
          return name.startsWith(val);
        });
      }
      if (this.bankNameFilterArr.length > 0) {
        this.openBankNameFilterList();
      }
    },
    //bankBranch input filter
    filterBankBranch() {
      const val = this.bankBranchInputVal;
      if (/^\d+$/.test(val)) {
        this.bankBranchFilterArr = this.bankBranchArr.filter((ele) => {
          const code = ele.code.toString();
          return code.startsWith(val);
        });
      } else {
        this.bankBranchFilterArr = this.bankBranchArr.filter((ele) => {
          const name = ele.name;
          return name.startsWith(val);
        });
      }
      if (this.bankBranchFilterArr.length > 0) {
        this.openBankBranchFilterList();
      }
    },
    //從符合條件的bankName中選擇
    setBankName(name, code, id) {
      console.log(name, id);
      this.bankNameInputVal = name;
      this.bankName = code;
      this.bankNameId = id;
      this.resetBankBranch();
      this.closeBankNameFilterList();
    },
    //從符合條件的bankBranch中選擇
    setBankBranch(name, code, id) {
      console.log(name, id);
      this.bankBranchInputVal = name;
      this.bankBranch = code;
      this.closeBankBranchFilterList();
    },
    //清空分行相關值
    resetBankBranch() {
      this.bankBranchInputVal = "";
      this.bankBranch = "";
    },
    openBankNameFilterList() {
      this.isBankNameFilterListOpen = true;
    },
    closeBankNameFilterList() {
      this.isBankNameFilterListOpen = false;
    },
    openBankBranchFilterList() {
      this.isBankBranchFilterListOpen = true;
    },
    closeBankBranchFilterList() {
      this.isBankBranchFilterListOpen = false;
    },
    closeAllFilterList() {
      this.closeBankNameFilterList();
      this.closeBankBranchFilterList();
    },
    async composeProductList() {
      let prodList = [];
      for (let prod of this.products) {
        const prdInfo = await this.api.product.getProducts([prod.productId]);
        prodList.push({
          ...prod,
          isChose: true,
          images: prdInfo[prod.productId].images,
          canReturn: true,
        });
      }
      prodList = prodList.filter((ele) => ele.canReturn);
      this.productsList = prodList;
    },
    chagePrdCheckboxStatus(index) {
      const prd = this.productsList[index];
      prd.isChose = !prd.isChose;
      const plength = this.productsList.length;
      const trueCount = this.productsList.reduce((tc, ele) => {
        if (ele.isChose) {
          return (tc += 1);
        } else {
          return tc;
        }
      }, 0);
      if (trueCount === plength) {
        this.isAllChose = true;
      } else {
        this.isAllChose = false;
      }
    },
    //全選按鈕狀態改變
    chageAllChoseStatus() {
      this.isAllChose = !this.isAllChose;
      if (this.isAllChose) {
        this.productsList.forEach((ele) => {
          ele.isChose = true;
        });
      } else {
        this.productsList.forEach((ele) => {
          ele.isChose = false;
        });
      }
    },
    //取得使用者預設收貨人
    async getMemberReceiverData() {
      if (!this.memberReceiverData) {
        let d = await this.api.member.getConsignee();
        if (d && d.length > 0) {
          this.memberReceiverData = d[0];
          const { name, mobile, addr } = this.memberReceiverData;
          this.name = name;
          this.phone = mobile;
          this.city = addr.city;
          this.road = addr.addr;
        }
      }
    },
    checkFullAddress(address) {
      let addrAlert = "";
      address = address.replace(/\s+/g, "");
      if (!address) addrAlert = "此欄位不可為空";
      return addrAlert;
    },
    checkAccount(account) {
      account = account.replace(/\s+/g, "");
      let accountAlert = "";
      if (!account) accountAlert = "此欄位不可為空";
      return accountAlert;
    },
    //將地址組成字串
    composeReturnPickupAddress() {
      const city = this.cityArr.filter((ele) => ele.id === this.city)?.[0];
      const region = this.regionArr.filter(
        (ele) => ele.id === this.region
      )?.[0];
      if (city && region) {
        return city.name + region.name + this.road;
      }
    },
    //防呆檢查
    formCheck() {
      let { checkName, checkMoblie, checkAddress } = this.tools;
      this.bankNameAlert = this.bankName ? "" : "請輸入銀行名稱或代號";
      this.bankBranchAlert = this.bankBranch ? "" : "請輸分行名稱或代號";
      this.bankUserNameAlert = checkName(this.bankUserName);
      this.accountAlert = this.nameAlert = this.checkAccount(this.account);

      this.nameAlert = checkName(this.name);
      this.phoneAlert = checkMoblie(this.phone);
      this.addressAlert = checkAddress(this.city, this.region, this.road);

      const topFormAlert =
        this.bankNameAlert.length > 0 ||
        this.bankBranchAlert.length > 0 ||
        this.bankUserNameAlert.length > 0;
      const bottomFormAlert =
        this.nameAlert.length > 0 ||
        this.phoneAlert.length > 0 ||
        this.addressAlert.length > 0;

      const refundData = {
        account: this.account,
        accountName: this.bankUserName,
        bank: this.bankName,
        bankBranch: this.bankBranch,
      };
      const returnPickupData = {
        name: this.name,
        address: this.composeReturnPickupAddress(),
        phone: this.phone,
        zipcode: this.getZip(this.region),
      };

      if (
        this.isShowRefundBankForm &&
        this.order.isShowReturnAddressForm
      ) {
        if (topFormAlert || bottomFormAlert) {
          return false;
        }
        this.formData = {
          refundData,
          returnPickupData,
        };
      } else if (
        this.isShowRefundBankForm &&
        !this.order.isShowReturnAddressForm
      ) {
        if (topFormAlert) {
          return false;
        }
        this.formData = {
          refundData,
        };
      } else if (
        !this.isShowRefundBankForm &&
        this.order.isShowReturnAddressForm
      ) {
        if (bottomFormAlert) {
          return false;
        }
        this.formData = {
          returnPickupData,
        };
      }
      return true;
    },
    //取得區碼
    getZip(regionId) {
      const matchArr = this.regionArr.filter((item) => item.id === regionId);
      return matchArr[0].zip;
    },
    async submit() {
      if (this.isCheckoutApiLoading) return;
      const pass = this.formCheck();
      if (!pass) return;
      if (!this.isAgreeInvoiceProcess) {
        alert("是否同意YSDT(遠時數位科技)代為處理退貨退款之發票及折讓單事宜?");
        return;
      }
      const dealId = this.dealId;
      const productData = [];
      let hasChose = false;
      for (let prd of this.productsList) {
        if (prd.isChose) {
          hasChose = true;
          //主商品
          productData.push({ sizeId: prd.sizeId, quantity: prd.quantity });
          //加購品
          if (prd.combodata) {
            for (let combo of prd.combodata) {
              productData.push({
                sizeId: combo.sizeId,
                quantity: combo.quantity,
              });
            }
          }
          //贈品
          if (prd.giftdata) {
            for (let gift of prd.giftdata) {
              productData.push({
                sizeId: gift.sizeId,
                quantity: gift.quantity,
              });
            }
          }
        }
      }
      if (this.productsList && !hasChose) {
        alert("請選擇退訂商品");
        return;
      }
      const returnType = this.isAllChose ? "all" : "partial";
      const submitData = {
        dealId,
        memberId: this.memberId,
        productData,
        ...this.formData,
        returnType,
        sameAsReceiver: "N",
      };

      this.isCheckoutApiLoading = true;
      const isOk = await this.api.order.setOrderRefund(submitData);
      if (!isOk) {
        alert("退訂異常，請聯絡客服專人為您處理。");
        return;
      }
      this.isCheckoutApiLoading = false;
      this.$emit("refreshOrder");
      this.$emit("closeRefundDialog");
    },
  },
  watch: {
    //選擇縣市後取得區域資料並預選
    async city() {
      const regionArr = await this.api.member.getCounty(this.city);
      this.regionArr = regionArr;
      //設定預設區域(預設:預選第一個區域id，但須由使用者直接點擊觸發 ; 修改:預選choseData中的區域id)
      this.$nextTick(function () {
        if (this.regionArr.length > 0) {
          if (this.isUserChange) {
            this.region = this.regionArr?.[0]?.id;
          } else {
            this.region = this.memberReceiverData.addr.county;
          }
        }
      });
    },
    async bankName() {
      this.bankBranchArr = await this.api.order.getBankBranch(this.bankNameId);
    },
  },
  components: {
    fullscreenDialog,
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";
@import "../../style/tailwind.module.scss";
.content {
  padding: 10px;
  margin-bottom: 80px;
  ul {
    list-style-type: none;
    li {
      padding: 20px 0;
      border-bottom: 1px solid $alto;
      &:last-of-type {
        border-bottom: none;
      }
    }
  }
  .productArea {
    // padding: 15px;
    // border: 1px solid $alto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      width: 10%;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        width: 20px;
        height: 20px;
        display: inline-block;
      }
    }
    .right {
      width: 88%;
      .mainPrd {
        display: flex;
        justify-content: space-between;
        > a {
          max-width: 20%;
          width: 20%;
          aspect-ratio: 1 / 1;
          border: 1px solid $alto;
          margin-right: 10px;
          img {
            width: 100%;
          }
        }
        .info {
          width: 78%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .top {
            p {
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
  .detail-bar {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin-top: 10px;
    p,
    a {
      text-align: center;
    }
  }
  .allChose,
  .sameAsReceiverChose {
    display: flex;
    align-items: center;
    margin: 20px 0;
    i {
      width: 20px;
      height: 20px;
      display: inline-block;
      margin-right: 5px;
    }
  }
  .refoundForm {
    font-size: 1.6rem;
    padding: 30px 0;
    input {
      font-size: 1.5rem;
      padding: 10px 15px;
      margin-top: 5px;
      border: 1px solid $sliver;
      color: $black;
      border-radius: 10px;
      width: 100%;
      box-sizing: border-box;
      &::placeholder {
        color: $sliver;
      }
    }
    &__input,
    &__select {
      margin-bottom: 15px;
      > div {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        p {
          width: 28%;
          font-size: 1.4rem;
          color: $black;
        }
        .input_block {
          width: 72%;
          .addressNotice {
            width: 100%;
            margin-top: 5px;
            color: $sliver;
          }
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
      .top {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        p {
          width: 28%;
          color: $black;
          font-size: 1.4rem;
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
    select {
      width: 100%;
      font-size: 1.5rem;
      padding: 10px 15px;
      margin-top: 5px;
      border: 1px solid $sliver;
      border-radius: 10px;
      box-sizing: border-box;
      color: $black;
    }
    .error {
      span {
        display: block;
        color: $red;
      }
      input,
      select {
        border: 1px solid $red;
        color: $sliver;
      }
    }
  }
  .notice {
    display: flex;
    line-height: 25px;
    input {
      flex: 1 0 20px;
      width: 20px;
      height: 20px;
    }
  }
  .submitBtn,
  .loadingBtn {
    width: 100%;
    height: 60px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: $white;
    text-align: center;
    border-top: 1px solid #e0e0e0;
    display: flex;

    justify-content: center;
    align-items: center;
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
  .loadingBtn {
    span {
      background-color: $alto;
      padding: 0;
      i {
        width: 35px;
        height: 35px;
        background: url("../../images/icons/checkout_animation.gif") center/35px
          no-repeat;
      }
    }
  }
  .title {
    margin-bottom: 20px;
    padding: 10px;
    background-color: $background;
  }
  .gray-border-top {
    border-top: 1px solid $alto;
  }
  .bankNameInput,
  .bankBranchInput {
    position: relative;
  }
  .bankNameFilterList,
  .bankBranchFilterList {
    position: absolute;
    z-index: 3;
    background-color: $white;
    left: 2px;
    right: 2px;
    top: 50px;
    list-style-type: none;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.3);
    max-height: 300px;
    overflow: auto;
    li {
      padding: 10px;
      text-align: center;
    }
  }
  .noData {
    font-size: 2.2rem;
    text-align: center;
    margin: 100px 0;
  }
}
</style>
