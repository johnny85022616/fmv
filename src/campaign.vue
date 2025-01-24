<template>
  <div class="campaign">
    <navigation :windowY="200"></navigation>
    <template v-if="campaignData">
      <layoutOrigin v-if="!campaignData.otherInformation.layout || campaignData.otherInformation.layout === '0'" :campaignData="campaignData"></layoutOrigin>
      <layoutOther v-else :campaignData="campaignData"></layoutOther>
    </template>
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import layoutOrigin from "./components/campaign/layoutOrigin.vue";
import layoutOther from "./components/campaign/layoutOther.vue";
export default {
  name: "campaign",
  data() {
    return {
      campaignData: null,
    };
  },
  async created() {
    this.seo.common();
    await this.getCampaignInfo();
  },

  methods: {
    //取得campaign資料
    async getCampaignInfo() {
      this.campaignData =
        (await this.api.ui.campaign.getCampaignInfo()) || null;
    },
    //領取活動
    async drawCampaign() {
      const { discountCode, campaignId } = this.campaignData;
      const result = discountCode
        ? await this.api.campaign.drawDiscountCode(discountCode)
        : await this.api.campaign.drawCampaign(campaignId);
      if (result && result.status === 0) {
        this.api.ui.alert.getFadeAlert(result.msg);
        return;
      }
      this.campaignData.isGeted = true;
      this.api.ui.alert.getFadeAlert("領取成功");
    },
  },
  components: {
    navigation,
    layoutOrigin,
    layoutOther,
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
@import "./style/_color.scss";
.campaign {
  margin-bottom: 125px;
  &-items {
    padding: 0 15px 15px;
  }
  .getCampaignArea {
    position: fixed;
    bottom: 60px;
    width: 100vw;
    background-color: $white;
    border-top: 1px solid $alto;
    display: flex;
    justify-content: center;
    padding: 10px 0;
    button {
      width: 96%;
      padding: 10px 5px;
      border: none;
      color: $white;
      font-size: 16px;
      text-align: center;
      border-radius: 5px;
      &.red {
        background-color: $red;
      }
      &.gary {
        background-color: $gray;
      }
    }
  }
  .campaign-container {
    font-size: 2rem;
    .campaignImg {
      width: 100%;
      aspect-ratio: 4 / 1;
      object-fit: cover;
    }
    .info {
      background-color: $black;
      color: $white;
      padding: 10px;
      margin: 0 0 10px 0;
      .campaignTitle {
        margin-bottom: 10px;
        font-weight: bold;
        text-align: center;
        ::v-deep {
          font {
            color: $bean-red;
            font-size: 2.2rem;
            margin: 0 3px;
          }
        }
      }
      .couponExpireTime {
        font-size: 1.2rem;
        text-align: center;
        color: $gray;
      }
      .campaignNameTime {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 1.2rem;
        color: $gray;
      }
      .campaignName {
        display: flex;
        align-items: center;
      }
    }
  }
  .noData {
    text-align: center;
    margin-top: 180px;
  }
}
</style>
