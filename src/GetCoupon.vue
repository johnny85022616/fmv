<template>
  <div class="getCoupon">
    <navigation :windowY="200"></navigation>
    <div class="couponHead">
      <a v-if="couponList && couponList.length > 0" href="" class="getAll" @click="e=>drawAllCampaign(e)">
        <img src="./images/icons/icon_getAllCoupon.gif" alt="">
      </a>
      <div>
        <a @click.prevent="goAllCampaign">所有優惠</a>
        <a @click.prevent="goMyCampaign">我的優惠</a>
      </div>
    </div>
    <div class="couponBody">
      <couponList v-if="couponList && couponList.length > 0" :conponList="couponList" :page="'getCoupon'" @drawCoupon="drawCoupon"></couponList>
      <p class="noData" v-else-if="isApiOk && (!couponList || (couponList && couponList.length === 0))">您目前還沒有折價券，快去逛逛商品並領取折價券哦！</p>
    </div>
    <loading v-if="!isApiOk"></loading>
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import couponList from "./components/GetCoupon/couponList.vue";
import loading from "./components/common/loading.vue";
export default {
  name: "getCoupon",
  data() {
    return {
      discountCode: "",
      couponList: null,
      isDiscountInputOpen: false,
      isApiOk: false,
    };
  },
  components: { navigation, couponList, loading },
  created() {
    this.getCoupon();
    this.seo.common();
  },
  methods: {
    goAllCampaign() {
      window.location.href = this.siteData
        ? `/${this.siteData.urlSuffix}/campaignlist`
        : "/campaignlist";
    },
    goMyCampaign() {
      window.location.href = this.siteData
        ? `/${this.siteData.urlSuffix}/member/myCampaign`
        : "/member/myCampaign";
    },
    //領取
    async drawCoupon(campaignId, childCampaignId) {
      this.isApiOk = false;
      const result = await this.api.campaign.drawCampaign([
        campaignId,
        childCampaignId,
      ]);
      this.isApiOk = true;
      if (result && result.status === 0) {
        this.api.ui.alert.getFadeAlert(result.msg);
        return;
      }
      this.couponList.forEach((ele) => {
        if (ele.campaignId === campaignId) {
          ele.isGeted = true;
        }
      });
      this.api.ui.alert.getFadeAlert("領取成功");
    },
    //領全部
    async drawAllCampaign(e) {
      this.isApiOk = false;
      e.preventDefault();
      if (this.couponList && this.couponList.length === 0) {
        this.api.ui.alert.getFadeAlert("目前無折價券");
        return;
      }
      const couponIds = this.couponList.reduce((ids, item) => {
        //一般
        ids.push(item.campaignId);
        //娃娃
        if (item.childCampaignInfo) {
          ids.push(item.childCampaignInfo.campaignId);
        }
        return ids;
      }, []);
      const result = await this.api.campaign.drawCampaign(couponIds);
      this.isApiOk = true;
      if (result && result.status === 0) {
        this.api.ui.alert.getFadeAlert(result.msg);
        return;
      }

      this.couponList.forEach((ele) => {
        ele.isGeted = true;
      });
      this.api.ui.alert.getFadeAlert("領取成功");
      window.sessionStorage.removeItem("friday_coupons");
    },
    //取得couponList
    async getCoupon() {
      const myCoupon = await this.api.campaign.getEventCampaign();
      this.isApiOk = true;
      if (!myCoupon) return;
      this.couponList = myCoupon;
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

.getCoupon {
  margin-bottom: 60px;
  .couponHead {
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .getAll {
      width: 60%;
      img {
        width: 100%;
      }
    }
    > div {
      width: 38%;
      display: flex;
      justify-content: space-between;
      a {
        width: 47%;
        font-size: 1.4rem;
        text-align: center;
        color: $dodger-blue;
        text-decoration: underline;
      }
    }
  }
  .couponBody {
    padding: 0 20px 20px 20px;
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
