<template>
  <div class="campaignPopup">
    <popup :isShowHeader="false" :hasMask="true">
      <template v-slot:body>
        <div class="campaignPopupBody">
          <template v-if="!isGetedOpen">
            <div class="inputBlock">
              <p>輸入快速通關序號 享優先出貨</p>
              <input type="text" v-model="discountCode" placeholder="輸入快速通關序號領優惠">
              <button @click="drawDiscount">確認</button>
            </div>
            <div class="notice">
              <p>如何取得快速通關序號？<a class="gray" href="https://friday.tw/v937a">立即了解</a></p>
              <a class="blue" @click="e=>noCodeBuy(e)" href="">無序號繼續購買</a>
            </div>
          </template>
          <div v-else class="getetBlock">
            <p class="title">已領取快速通關序號</p>
            <p class="red text mb-2">貼心提醒</p>
            <p class="text text-left mb-1">1. 若您尚未完成購買，請繼續完成選購。</p>
            <p class="text text-left mb-1">2. 每組序號僅限購買一次，重複購買將失去資格。</p>
            <p class="text text-left mb-1">3. 序號領取後會儲存在您的「我的優惠」內，您可前往查詢使用狀況。</p>
            <button @click="changePageUrl">確認</button>
          </div>
        </div>
      </template>
    </popup>
  </div>
</template>

<script>
import popup from "../../components/common/popup.vue";
export default {
  name: "campaign",
  data() {
    return {
      discountCode: "",
      isGetedOpen: false,
    };
  },
  async created() {},

  methods: {
    closePopup() {
      this.$emit("closeCampaignPopup");
    },
    async drawDiscount() {
      const disCode = this.discountCode;
      if (!disCode) return;

      // 領取
      const drawResult = await this.api.campaign.drawDiscountCode(disCode);

      if (drawResult.msg === "請先登入會員！") {
        this.api.ui.alert.getFadeAlert(drawResult.msg);
        this.closePopup();
        return;
      }

      if (drawResult.code === 801) {
        this.discountCode = "";
        this.api.ui.alert.getFadeAlert("快速通關碼輸入錯誤");
        return;
      }

      //領取成功
      if (drawResult.code === 0) {
        this.api.ai.setCache("iphone16_tracking_code", true, 180);
        this.changePageUrl();
      }

      //已領過
      if (drawResult.code === 499) {
        this.isGetedOpen = true;
        this.api.ai.setCache("iphone16_tracking_code", true, 180);
      }
    },
    //無序號購買
    noCodeBuy(e) {
      e.preventDefault();
      this.api.ai.setCache("iphone16_tracking_code", true, 180);
      this.changePageUrl();
    },
    //url加上追蹤碼
    changePageUrl() {
      const nowUrl = location.origin + location.pathname;
      location.href =
        nowUrl +
        "?WT.mg_id=fetmc_ticket_2409_fri_i16_fastpass&utm_source=fetmc&utm_medium=ticket&utm_campaign=2409_fri_i16_fastpass";
    },
  },
  components: { popup },
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";
@import "../../style/tailwind.module.scss";
.campaignPopupBody {
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .buttonBlock {
    display: flex;
    justify-content: space-around;
    align-items: center;
    span {
      width: 38%;
      color: $white;
      background-color: $dodger-blue;
      padding: 10px;
      font-size: 1.4rem;
      text-align: center;
    }
  }
  .inputBlock {
    text-align: center;
    p {
      font-size: 1.7rem;
      text-align: center;
      margin-bottom: 15px;
    }
    input {
      border: 1px solid $sliver;
      padding: 8px;
      border-radius: 3px;
      text-align: center;
      width: 75%;
    }

    button {
      margin-top: 20px;
      width: 38%;
      padding: 5px 5px;
      background-color: $dodger-blue;
      color: $white;
      letter-spacing: 3px;
      text-indent: 3px;
      border-radius: 5px;
      border: 0;
    }
  }
  .notice {
    text-align: center;
    margin-top: 20px;
    font-size: 1.5rem;
  }
  .getetBlock {
    text-align: center;
    .title {
      font-size: 1.8rem;
      margin-bottom: 20px;
    }
    .text {
      font-size: 1.5rem;
    }
    button {
      margin-top: 20px;
      width: 38%;
      padding: 5px 5px;
      background-color: $dodger-blue;
      color: $white;
      letter-spacing: 3px;
      text-indent: 3px;
      border-radius: 5px;
      border: 0;
    }
  }
  .red {
    color: $red;
  }
  .gray {
    color: $sliver;
  }
  .blue {
    color: $dodger-blue;
  }
}
</style>