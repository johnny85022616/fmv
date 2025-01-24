<template>
  <div class="allCampaign">
    <navigation :windowY="200"></navigation>
    <div class="header">
      <p>所有優惠</p>
    </div>
    <div class="campaignBody">
      <div class="discountCodeArea">
        <a href="#" @click.prevent="goCoupon">領折價券</a>
        <a href="#" @click.prevent="goMyCampaign">我的優惠</a>
      </div>
      <couponList v-if="isDoFirstApi && campaignList && campaignList.length > 0" :conponList="campaignList" @drawCoupon="drawCoupon"></couponList>
      <p class="noData" v-else-if="isDoFirstApi && (!campaignList || (campaignList && campaignList.length === 0))">您目前還沒有任何折價券，快去逛逛商品並領取折價券哦！</p>
      <div id="aiPromotionBottomLine"></div>
    </div>
    <loading v-if="!isApiOk" />
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import couponList from "./components/GetCoupon/couponList.vue";
import loading from "./components/common/loading.vue";
export default {
  name: "allCampaign",
  data() {
    return {
      discountCode: "",
      campaignList: null,
      isDiscountInputOpen: false,
      isApiOk: false,
      isAtBottom: false,
      page: 1,
      pageSize: 9,
      allCampaignIds: null,
      isDoFirstApi: false,
      memberCampaignIds: null,
    };
  },
  components: { navigation, couponList, loading },
  async created() {
    await this.getMemberCampaign();
    await this.getAllCampaignIds();
    await this.getCampaign();
    this.seo.common();
    this.initScrollEvent();
  },
  methods: {
    async getMemberCampaign() {
      this.memberCampaignIds = await this.api.campaign.getMyCampaigns();
    },
    initScrollEvent() {
      window.addEventListener(
        "scroll",
        () => {
          const aiPromotionBottomLine = document.querySelector(
            "#aiPromotionBottomLine"
          );
          if (
            this.isApiOk &&
            aiPromotionBottomLine.getBoundingClientRect().top <
              window.innerHeight + window.innerHeight / 2
          ) {
            this.isAtBottom = true;
          } else {
            this.isAtBottom = false;
          }
        },
        {
          passive: true,
        }
      );
    },
    goCoupon() {
      window.location.href = this.siteData
        ? `/${this.siteData.urlSuffix}/couponfriday`
        : "/couponfriday";
    },
    goMyCampaign() {
      window.location.href = this.siteData
        ? `/${this.siteData.urlSuffix}/member/myCampaign`
        : "/member/myCampaign";
    },
    //領取
    async drawCoupon(campaignId, childCampaignId, discountCode) {
      let result;
      if (discountCode) {
        result = await this.api.campaign.drawDiscountCode(discountCode);
      } else {
        result = await this.api.campaign.drawCampaign([
          campaignId,
          childCampaignId,
        ]);
      }
      if (result && result.status === 0) {
        this.api.ui.alert.getFadeAlert(result.msg);
        return;
      }
      this.campaignList.forEach((ele) => {
        if (ele.campaignId === campaignId) {
          ele.isGeted = true;
        }
      });
      this.api.ui.alert.getFadeAlert("領取成功");
    },
    async getAllCampaignIds() {
      const allCampaignIds = await this.api.campaign.getCampaignIds();
      if (allCampaignIds) {
        this.allCampaignIds = allCampaignIds;
      }
      this.isApiOk = true;
    },
    async getCampaign() {
      const ids = this.allCampaignIds.slice(
        (this.page - 1) * this.pageSize,
        this.page * this.pageSize
      );

      this.page += 1;
      const campaignData = await this.api.campaign.parseCampaignDetail(
        ids,
        this.memberCampaignIds
      );
      if (campaignData && campaignData.length > 0) {
        this.isDoFirstApi = true;
        if (this.campaignList) {
          this.campaignList = this.campaignList.concat(campaignData);
        } else {
          this.campaignList = campaignData;
        }
      }
    },
  },
  watch: {
    async isAtBottom(newVal) {
      if (this.campaignList.length > 0 && newVal) {
        this.getCampaign();
      }
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

.allCampaign {
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
