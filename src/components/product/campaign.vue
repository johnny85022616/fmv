<template>
  <div v-if="campaignUI&&Object.keys(campaignUI).length>0">
    <div class="campaign123 product-component-container">
      <div class="product-component-blocks">
        <div class="campaignInfo">
          <div class="container">
            <p>優惠</p>
            <ul>
              <li :class="{green: key==='ADD', purple:key==='ASD'}" @click="openCampaignDialog(key)" v-for="item,key in this.pInfo.couponCategory" :key="key">{{item.tagTitle}}</li>
            </ul>
          </div>
          <p class="campaignBoxText" @click="openCampaignDialog()">點我領優惠</p>
        </div>
      </div>
      <autoscreendialog v-if="isCampaignDialogOpen" @closeDialog="closeCampaignDialog">
        <template v-slot:header>優惠</template>
        <template v-slot:body>
          <div class="campaignDialog">
            <div class="popupTop">
              <a class="getAllCampaign" href="" @click.prevent="drawAllCampaign">一鍵全領</a>
              <a href="" @click="(e)=> changeDiscountInputOpenStatus(e)">如果我有折扣碼</a>
            </div>
            <div class="discountCodeArea">
              <div v-if="isDiscountInputOpen" class="disCountCode">
                <input type="text" v-model="discountCode" placeholder="輸入折扣碼領優惠">
                <button @click="drawDiscount(discountCode)">GO</button>
              </div>
            </div>
            <div v-if="campaignPopupData && campaignPopupData.length>0">
              <ul>
                <li :class="composeCouponUiType(item)" v-for="(item,index) in campaignPopupData" :key="index">
                  <div class="left bgStyle">
                    <div v-if="!item.childCampaignInfo" class="flex justify-between items-center">
                      <p class="gray">{{item.ui.campaignEndTime}}</p>
                      <p class="sundown" v-if="item.ui.isAdditionalDiscount">可與其他優惠併用</p>
                    </div>
                    <div v-if="!item.ui.discountCode" class="commonType">
                      <!-- d9 -->
                      <template v-if="item.childCampaignInfo">
                        <div class="mb-2">
                          <p class="title" v-html="item.ui.title"></p>
                          <div class="middle flex items-center mb-2 blue">
                            <p>{{item.ui.rule}}</p>
                            <p><a class="campaignUrl" :href="item.ui.campaignUrl">看全部商品</a></p>
                          </div>
                        </div>
                        <div class="d9Discount bgStyle">
                          <div class="mb-1">
                            <p class="d9Title" v-html="`本活動<span>${item.childCampaignInfo.title}</span>`"></p>
                          </div>
                          <p class="d9Content">{{item.childCampaignInfo.rule}}</p>
                        </div>
                      </template>
                      <!-- 一般 -->
                      <template v-else>
                        <div class="mb-2">
                          <p class="title" v-html="item.ui.title"></p>
                        </div>
                        <div class="middle flex items-center mb-2 blue">
                          <p>{{item.ui.rule}}</p>
                          <p>{{item.ui.couponExpireTime}}</p>
                        </div>
                        <a class="campaignUrl" :href="item.ui.campaignUrl">看全部商品</a>
                      </template>
                    </div>
                    <div v-else class="discountCodeType">
                      <div class="topArea">
                        <p class="content red">輸入折扣碼</p>
                        <p class="rule gray">{{item.ui.rule}}</p>
                      </div>
                      <div class="bottomArea">
                        <p class="code blue">{{item.ui.discountCode}}</p>
                        <p class="name red" v-html="item.ui.title"></p>
                      </div>
                      <p class="copy" @click="copyNumber(item.ui.discountCode)">點我複製折扣碼</p>
                      <a class="campaignUrl" :href="item.ui.campaignUrl">看全部商品</a>
                      <div v-if="item.childCampaignInfo" class="d9Discount bgStyle">
                        <div class="mb-1">
                          <p class="d9Title" v-html="`本活動<span>${item.childCampaignInfo.title}</span>`"></p>
                        </div>
                        <p class="d9Content">{{item.childCampaignInfo.rule}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="right bgStyle">
                    <div v-if="!item.ui.isGeted && !item.ui.discountCode" @click="drawCampaign(item.ui.campaignId,item.childCampaignInfo?.campaignId)">
                      <i class="checkbox"></i>
                      <p>打勾領取</p>
                    </div>
                    <div v-else-if="!item.ui.isGeted && item.ui.discountCode" @click="drawDiscount(item.ui.discountCode,item.childCampaignInfo?.campaignId)">
                      <i class="checkbox"></i>
                      <p>打勾領取</p>
                    </div>
                    <template v-else>
                      <a v-if="item.ui.campaignUrl" class="link" :href="item.ui.campaignUrl">已領，逛更多</a>
                    </template>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </template>
      </autoscreendialog>
    </div>
  </div>
</template>

<script>
import { isBsite } from "../../utils/tools";
import autoscreendialog from "../common/autoscreenDialog.vue"; // 蓋版提示框

export default {
  name: "campaign",
  data() {
    return {
      showInsurance: false,
      insurancePrice: 0,
      showDialog: false,
      coupon: [], // 折價卷資料
      isCampaignDialogOpen: false,
      campaignUI: null, //外層campaign資料
      campaignPopupData: null, // campaignPopup資料
      isDiscountInputOpen: false, //領折價券input顯示
      discountCode: "", //折扣碼input值
    };
  },
  components: {
    autoscreendialog,
  },
  props: {
    pInfo: {
      type: Object,
    },
    currentY: {},
    bsiteLogin: {
      type: Boolean,
    },
  },
  created() {
    this.composeCampaignUI();
  },
  methods: {
    //領折扣碼input顯示開關
    changeDiscountInputOpenStatus(e) {
      e.preventDefault();
      this.isDiscountInputOpen = true;
    },
    composeCouponUiType(campaignData) {
      const { isGeted, isAnti } = campaignData.ui;
      //D9特別未領取
      if (!isGeted && campaignData.childCampaignInfo) {
        return "d9NoGeted";
      }
      //D9已領取
      else if (isGeted && campaignData.childCampaignInfo) {
        return "d9Geted";
      }
      //未領無鋸齒
      else if (!isGeted && !isAnti) {
        return "noGetedNoAnti";
      }
      //已領無鋸齒
      else if (isGeted && !isAnti) {
        return "getedNoAnti";
      }
      //未領有鋸齒
      else if (!isGeted && isAnti) {
        return "noGetedAnti";
      }
      //已領有鋸齒
      else if (isGeted && isAnti) {
        return "getedAnti";
      }
    },
    //組成外層campaign資料
    composeCampaignUI() {
      if (this.pInfo && this.pInfo.couponCategory) {
        const arr = [];
        const campignIdArr = [];
        for (const [key, value] of Object.entries(this.pInfo.couponCategory)) {
          value.data.forEach((ele) => {
            //取不重複資料
            if (
              !campignIdArr.some((campaignId) => campaignId === ele.campaignId)
            ) {
              arr.push({ ...ele, couponType: key });
              campignIdArr.push(ele.campaignId); //推進現有campaignId pool
            }
          });
        }
        this.campaignUI = arr;
      }
    },
    //重新排序popup中資料
    composePopupUI(couponType) {
      if (couponType) {
        let topCouponData = [];
        let bottomCouponData = [];
        this.campaignUI.forEach((ele) => {
          if (couponType !== "ASD") {
            if (ele.couponType === couponType) {
              topCouponData.push(ele);
            } else {
              bottomCouponData.push(ele);
            }
          } else {
            if (ele.childCampaignInfo) {
              topCouponData.push(ele);
            } else {
              bottomCouponData.push(ele);
            }
          }
        });
        this.campaignPopupData = [...topCouponData, ...bottomCouponData];
        return;
      }
      this.campaignPopupData = this.campaignUI;
    },
    campaignUrl(campaignUrl) {
      let url = campaignUrl;
      if (this.siteData) {
        url = "/" + this.siteData.urlSuffix + url;
      }
      return url;
    },
    checkIsDiscodeCodeType(digitalType) {
      return ["d6", "d7"].includes(digitalType);
    },
    closeDialog() {
      this.showDialog = false;
      this.$emit("stopBodyScroll", "close");
    },
    openDialog() {
      this.showDialog = true;
      this.$emit("stopBodyScroll");
    },
    //打開campaign popup
    openCampaignDialog(couponType) {
      this.composePopupUI(couponType);
      this.isCampaignDialogOpen = true;
      this.$emit("stopBodyScroll");
    },
    //關閉campaign popup
    closeCampaignDialog() {
      this.isCampaignDialogOpen = false;
      this.$emit("stopBodyScroll", "close");
    },
    //領取(有itemCouponType表示點我領優惠途徑)
    async drawCampaign(campaignId, childCampaignId) {
      const pass = await this.doDrawCampaingApi([campaignId, childCampaignId]);
      if (!pass) return;

      let index;
      this.campaignUI.forEach((ele, idx) => {
        if (ele.campaignId === campaignId) {
          index = idx;
        }
      });
      const nowObj = this.campaignUI[index].ui;
      this.setChoseCampaignGetedStatus(nowObj);
      this.api.ui.alert.getFadeAlert("領取成功");
    },
    //領取折扣碼(有itemCouponType表示點我領優惠途徑)
    async drawDiscount(discountCode, childCampaignId) {
      const pass = await this.doDrawDiscountApi(discountCode);
      if (!pass) return;
      //有帶娃娃
      if (childCampaignId) {
        const childPass = await this.doDrawCampaingApi(childCampaignId);
        if (!childPass) return;
      }
      let index = null;
      this.campaignUI.forEach((ele, idx) => {
        if (
          ele.ui &&
          ele.ui.discountCode &&
          ele.ui.discountCode === discountCode
        ) {
          index = idx;
        }
      });
      if (index) {
        const nowObj = this.campaignUI[index].ui;
        this.setChoseCampaignGetedStatus(nowObj);
      }
      this.discountCode = "";
      this.api.ui.alert.getFadeAlert("領取成功");
    },
    //領全部券
    async drawAllCampaign() {
      const campaignArr = [];
      for (let item of this.campaignPopupData) {
        //一般券
        if (!item.ui.discountCode) {
          campaignArr.push(item.ui.campaignId);
          //娃娃
          if (item.childCampaignInfo) {
            campaignArr.push(item.childCampaignInfo?.campaignId);
          }
        }
        //折扣碼
        else {
          const childPass = await this.doDrawDiscountApi(item.ui.discountCode);
          if (!childPass) return;
          //有帶娃娃
          if (item.childCampaignInfo) {
            campaignArr.push(item.childCampaignInfo?.campaignId);
          }
        }
      }
      const pass = await this.doDrawCampaingApi(campaignArr);
      if (!pass) return;
      //所有券狀態改為已經領
      this.campaignUI.forEach((ele) => {
        ele.ui.isGeted = true;
      });
      this.api.ui.alert.getFadeAlert("領取成功");
    },
    //領券api
    async doDrawCampaingApi(campaignArr) {
      const result = await this.api.campaign.drawCampaign(campaignArr);
      if (result && result.status === 0) {
        this.api.ui.alert.getFadeAlert(result.msg);
        return false;
      }
      return true;
    },
    //領折價券api
    async doDrawDiscountApi(discountCode) {
      const drawResult = await this.api.campaign.drawDiscountCode(discountCode);
      if (drawResult.status === 0) {
        this.api.ui.alert.getFadeAlert(drawResult.msg);
        return false;
      }
      return true;
    },
    //外層ui選中的折價券geted狀態變更
    setChoseCampaignGetedStatus(nowObj) {
      nowObj.isGeted = true;
      nowObj.buttonText = "已領，逛更多";
    },
    //複製折扣碼
    copyNumber(content) {
      navigator.clipboard.writeText(content).then(() => {
        alert(`已複製${content}至剪貼簿`);
      });
    },
  },
  computed: {
    // 是否結帳再折扣商品
    isDiscountAfterCheckout() {
      return this.pInfo.price.promoPrice;
    },
    isLoginStatus() {
      if (isBsite) {
        return this.bsiteLogin;
      }
      return this.tools.getCookie("FEEC-B2C-UID");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/color";
@import "../../style/tailwind.module.scss";
.opacity7 {
  opacity: 0.7;
}
.campaignInfo {
  display: block;
  .container {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    position: relative;
    p {
      width: 10%;
      color: $sliver;
    }
    ul {
      width: 88%;
      display: flex;
      flex-wrap: wrap;
      li {
        margin-right: 5px;
        color: $white;
        background-color: $bean-red;
        padding: 2px 6px;
        border-radius: 5px;
        margin-bottom: 2px;
        &.green {
          background-color: $olivine;
        }
        &.purple {
          background-color: $electric-violet;
        }
      }
    }
    .arrow-right {
      top: 5px;
    }
  }
  .campaignBoxText {
    text-decoration: underline;
    color: $blue-ribbon;
    text-align: right;
  }
}
.campaignDialog {
  padding: 15px;
  > div {
    margin-bottom: 15px;
  }
  .head {
    font-size: 1.5rem;
    padding: 5px;
    text-align: center;
    background-color: $background;
    margin-bottom: 20px;
    font-weight: bold;
  }
  .popupTop {
    display: flex;
    justify-content: flex-end;
    .getAllCampaign {
      margin-right: 10px;
    }
  }
  .discountCodeArea {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    a {
      color: $dodger-blue;
      font-size: 1.5rem;
      margin-bottom: 10px;
    }
    .disCountCode {
      display: flex;
      justify-content: flex-end;
      input {
        border: 1px solid $sliver;
        padding: 8px;
        margin-right: 10px;
        border-radius: 3px;
      }

      button {
        padding: 3px 5px;
        background-color: $dodger-blue;
        color: $white;
        letter-spacing: 3px;
        text-indent: 3px;
        border-radius: 5px;
        border: 0;
      }
    }
  }
  ul {
    li {
      min-height: 155px;
      margin-bottom: 15px;
      display: flex;
      .left {
        flex: 1 1 80%;
        padding: 15px;
        p {
          &:first-child {
            min-height: 21px;
          }
        }
      }
      .right {
        flex: 1 1 20%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 10px 0;
        p {
          writing-mode: vertical-rl;
          text-orientation: upright;
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: 2px;
        }
        i {
          display: inline-block;
          background: $white;
          border-radius: 5px;
        }
        .link {
          writing-mode: vertical-rl;
          text-orientation: upright;
          text-decoration: none;
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: 2px;
        }
      }
      .discountCodeType {
        margin-top: 10px;
        .topArea {
          display: flex;
          .content {
            width: 45%;
          }
          .rule {
            width: 55%;
          }
        }
        .bottomArea {
          display: flex;
          font-size: 2.5rem;
          .code {
            width: 45%;
          }
          .name {
            width: 55%;
            text-align: left;
          }
        }
        .copy {
          color: $sliver;
          font-size: 1rem;
          margin-bottom: 10px;
        }
      }
      .left,
      .right {
        &.bgStyle {
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
        }
      }
      .middle {
        position: relative;
        min-height: 20px;
        p {
          &:first-of-type {
            width: 35%;
          }
          &:last-of-type {
            width: 65%;
            text-align: right;
            color: red;
          }
        }
        input {
          position: absolute;
          left: 20%;
          right: 0px;
          width: 170px;
          outline: none;
          font-size: 1.5rem;
          padding: 5px 0;
          border: 2px solid #f4f4f4;
          border-radius: 15px;
          box-shadow: 1px 1px 1px $nobel inset;
          text-align: center;
          align-items: center;
        }
      }
      .campaignUrl {
        text-align: right;
        display: block;
      }
      .title {
        font-size: 2.6rem;
        font-weight: bold;
        color: $red;
        text-align: center;
        ::v-deep {
          font {
            font-size: 3rem;
          }
        }
      }
      .btn {
        border-radius: 10px;
        padding: 3px 15px;
        color: $white;
        background-color: $dodger-blue;
        font-size: 12px;
        &.noneActive {
          background-color: $sliver;
        }
      }
    }
  }
  .blue {
    color: $dodger-blue;
  }
  .gray {
    color: $sliver;
  }
  .red {
    color: $red;
  }
  .sundown {
    color: $sundown1;
  }
  //D9未領
  .d9NoGeted {
    .left {
      background-image: url("../../images/icons/Coupon01_L.png");
    }
    .right {
      background-image: url("../../images/icons/Coupon01_R.png");
      color: $yellow;
      a {
        color: $yellow;
      }
    }
  }

  //D9有領
  .d9Geted {
    .left {
      background-image: url("../../images/icons/Coupon02_L.png");
    }
    .right {
      background-image: url("../../images/icons/Coupon02_R.png");
      color: $white;
      a {
        color: $white;
      }
    }
  }

  //沒領無鋸齒
  .noGetedNoAnti {
    .left {
      background-image: url("../../images/icons/Coupon01_L.png");
    }
    .right {
      background-image: url("../../images/icons/Coupon01_R.png");
      color: $yellow;
      a {
        color: $yellow;
      }
    }
  }
  //有領無鋸齒
  .getedNoAnti {
    .left {
      background-image: url("../../images/icons/Coupon02_L.png");
    }
    .right {
      background-image: url("../../images/icons/Coupon02_R.png");
      color: $white;
      a {
        color: $white;
      }
    }
  }
  //沒領有鋸齒
  .noGetedAnti {
    .left {
      background-image: url("../../images/icons/Coupon01_L.png");
    }
    .right {
      background-image: url("../../images/icons/Coupon03_R.png");
      color: $yellow;
      a {
        color: $yellow;
      }
    }
  }
  //有領有鋸齒
  .getedAnti {
    .left {
      background-image: url("../../images/icons/Coupon02_L.png");
    }
    .right {
      background-image: url("../../images/icons/Coupon04_R.png");
      color: $white;
      a {
        color: $white;
      }
    }
  }
  .d9Discount {
    background-image: url("../../images/icons/flowerTicket.svg");
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    // padding: 16px 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 20px;
    .d9Title {
      font-size: 1.8rem;
      font-weight: bold;
      color: $mine-shaft;
      text-align: center;
      ::v-deep {
        span {
          font-size: 2rem;
          color: $red;
        }
      }
    }
  }
}
</style>
