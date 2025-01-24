<template>
  <div class="myCampaign">
    <navigation :windowY="200"></navigation>
    <div class="header">
      <p>我的優惠</p>
    </div>
    <div class="campaignBody">
      <div class="discountCodeArea">
        <a href="#" @click.prevent="goCoupon">領折價券</a>
        <a href="#" @click.prevent="goAllCampaign">所有優惠</a>
        <div class="discountInput">
          <a href="" @click="(e)=> changeDiscountInputOpenStatus(e)">我有折扣碼</a>
          <div v-if="isDiscountInputOpen" class="disCountCode">
            <input type="text" v-model="discountCode" placeholder="輸入折扣碼領優惠">
            <button @click="drawDiscount">GO</button>
          </div>
        </div>
      </div>
      <couponList v-if="isApiOk && campaignList.length > 0" :conponList="campaignList" :page="'myCampaign'"></couponList>
      <p class="noData" v-else-if="isApiOk && campaignList.length === 0">您目前還沒有任何折價券，快去逛逛商品並領取折價券哦！</p>
    </div>
    <loading v-if="!isApiOk" />
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import couponList from "./components/GetCoupon/couponList.vue";
import loading from "./components/common/loading.vue";
export default {
  name: "myCampaign",
  data() {
    return {
      discountCode: "",
      campaignList: null,
      isDiscountInputOpen: false,
      isApiOk: false,
    };
  },
  components: { navigation, couponList, loading },
  created() {
    this.getCampaign();

    this.seo.common();
  },
  methods: {
    goAllCampaign() {
      window.location.href = this.siteData
        ? `/${this.siteData.urlSuffix}/campaignlist`
        : "/campaignlist";
    },
    goCoupon() {
      window.location.href = this.siteData
        ? `/${this.siteData.urlSuffix}/couponfriday`
        : "/couponfriday";
    },
    async drawDiscount() {
      const disCode = this.discountCode;
      if (!disCode) return;

      // 領取
      this.isApiOk = false;
      const drawResult = await this.api.campaign.drawDiscountCode(disCode);
      this.isApiOk = true;
      if (drawResult.status === 0) {
        this.api.ui.alert.getFadeAlert(drawResult.msg);
        return;
      }

      // 成功 清空
      this.discountCode = "";
      this.getCampaign();
      this.api.ui.alert.getFadeAlert(drawResult.msg);
    },
    async getCampaign() {
      const myCampaigns = await this.api.campaign.getMyCampaigns(true);
      this.isApiOk = true;
      if (!myCampaigns) return;
      this.campaignListFilter(myCampaigns);
    },
    campaignListFilter(originCampaign) {
      this.campaignList = originCampaign?.filter(
        (ele) => ele.isShowInMyCampaign
      );
    },
    changeDiscountInputOpenStatus(e) {
      e.preventDefault();
      this.isDiscountInputOpen = true;
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

.myCampaign {
  margin-bottom: 60px;
  .header {
    display: flex;
    font-size: 1.5rem;
    justify-content: center;
    border-bottom: 1px solid #ddd5cc;
    padding: 12px;
    position: relative;
  }
  .campaignBody {
    padding: 10px;
    .discountCodeArea {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 30px;
      a {
        color: $dodger-blue;
        font-size: 1.5rem;
      }
      .discountInput {
        text-align: right;
        .disCountCode {
          display: flex;
          justify-content: flex-end;
          margin-top: 10px;
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
    }
    .noData {
      margin-top: 100px;
      font-size: 2rem;
      text-align: center;
    }
  }
  .gray {
    color: $sliver;
  }
}
</style>
