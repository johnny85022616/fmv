<template>
  <div class="campaign">
    <div v-if="campaignData" class="campaign-container">
      <!-- 活動主圖 -->
      <template v-if="campaignData.otherInformation.image">
        <a v-if="campaignData.otherInformation.hyperlink" :href="campaignData.otherInformation.hyperlink" target="_blank">
          <img class="campaignImg" :src="campaignData.otherInformation.image" alt="">
        </a>
        <img v-else class="campaignImg" :src="campaignData.otherInformation.image" alt="">
      </template>

      <!-- 活動標題 -->
      <div class="info">
        <p v-if="campaignData.campaignPageTitle" class="campaignTitle" v-html="campaignData.campaignPageTitle"></p>
        <p v-if="campaignData.couponExpireTime" class="couponExpireTime" v-html="campaignData.couponExpireTime"></p>
        <div class="campaignNameTime">
          <p class="campaignName"> {{campaignData.campaignName}}</p>
          <p v-if="campaignData.isAdditionalDiscount">可與其他優惠併用</p>
          <p class="campaignTime">{{campaignData.campaignEndTime}}</p>
        </div>
      </div>

      <!-- 關鍵字過濾 -->
      <campaignFilter v-if="keywords && keywords.length>0" :keywordArr="keywords" @changeKeyword="changeKeyword"></campaignFilter>
      
      <!-- 商品清單 -->
      <div v-if="filterData && filterData.length>0" class="campaign-items">
        <aiProductItem :showCampaignQtyIcon="true" :itemList="filterData" />
      </div>
      <p v-else-if="hasInitData && !apiLoaded" class="noData">暫無商品參加活動。<a href="" @click="(e)=>goHomePage(e)">繼續購買</a></p>
      
      <div id="aiPromotionBottomLine"></div>
      <div v-if="isGetCampaignAreaShow" class="getCampaignArea">
        <button v-if="!campaignData.isGeted" @click="drawCampaign()" class="getDiscountBtn red">馬上領優惠</button>
        <button v-else class="getDiscountBtn gary">已領取</button>
      </div>
    </div>
    <loading v-if="!isApiOk || apiLoaded"></loading>
    <campaignPopup v-if="isCampaignPopupOpen" @closeCampaignPopup="closeCampaignPopup">
    </campaignPopup>
  </div>
</template>

<script>
import aiProductItem from "../common/aiProductItem.vue";
import campaignFilter from "./filter.vue";
import loading from "../common/loading.vue";
import campaignPopup from "./campaignPopup.vue";
export default {
  name: "layoutOrigin",
  data() {
    return {
      campaignPidsType: null,
      keyRes: null,
      keywords: null,
      productItems: null, //最初始拿到的product array
      originData: null,
      filterData: null,
      isGetOthersAlready: false,
      isApiOk: true,
      page: 1,
      pageSize: 10,
      maxPage: 0,
      isAtBottom: false,
      isCampaignPopupOpen: false,
      hasInitData: false, //避免畫面先閃出暫無商品參加活動區塊
      isGetCampaignAreaShow: false,
      //-------------- searchApi相關參數 --------------
      apiParams: {
        target_value: this.tools.aiUserId(),
        remote: /ysdt\.tw/.test(location.hostname) ? "ym" : "m",
        sorting: "RELEVANT",
        kws: "",
        page: 1,
        size: 9,
        filter: null,
      },
      nextPage: true,
      apiLoaded: false, //serch api loaded
    };
  },
  async created() {
    this.apiParams.and_campaign_id = this.campaignData?.campaignId;
    //設定apiParam filter參數
    this.apiParams.filter = this.api.ai.composeBListFilter(
      this.siteData?.supplierId || "",
      this.campaignData?.campaignRange?.v?.[1] || "",
      "",
      "",
      "",
      "",
      "",
      ""
    );
    //以下幾種以外才需顯示馬上領優惠按鈕區塊
    this.isGetCampaignAreaShow = ![
      "PD",
      "PC",
      "SC",
      "OC",
      "DO",
      "ASC",
    ].includes(this.campaignData.campaignId?.split("_")?.[0]);
    //取關鍵字
    this.getKeywords();
    await this.getCampaignData();
    this.checkCampaignGet();
  },
  props: {
    campaignData: {
      type: Object,
    },
  },
  methods: {
    getKeywords() {
      this.api.ui.campaign
        .getKeyword("KWSCloud", this.campaignData.campaignId)
        .then((data) => {
          const campaignKeywords = data?.kids?.map((ele) => ele.kcontent);
          this.keywords = campaignKeywords || [];
        });
    },
    getCampaignType(campaignId) {
      return campaignId.split("_")?.[0] || "";
    },
    //返回首頁
    goHomePage(e) {
      e.preventDefault();
      let url = "/";
      if (this.siteData && this.siteData.urlSuffix) {
        url = `/${this.siteData.urlSuffix}`;
      }
      location.href = url;
    },
    //檢查是否有追檢查是否有追碼
    checkCampaignGet() {
      const { campaignId } = this.campaignData || {};
      const iphone16_tracking_code = this.api.ai.getCache(
        "iphone16_tracking_code"
      );
      if (campaignId === "DO_240911220205491" && !iphone16_tracking_code) {
        this.isCampaignPopupOpen = true;
      }
    },
    closeCampaignPopup() {
      this.isCampaignPopupOpen = false;
    },
    //一般模式下滾動事件(非關鍵字查詢模式下的滾動事件)
    async originScrollEvent() {
      const aiPromotionBottomLine = document.querySelector(
        "#aiPromotionBottomLine"
      );
      if (
        this.isApiOk &&
        aiPromotionBottomLine.getBoundingClientRect().top <
          window.innerHeight + window.innerHeight / 2
      ) {
        if (this.isAtBottom) return;
        this.isApiOk = false;
        if (this.campaignPidsType === 1) {
          this.page += 1;
          let pi = null;
          // const d = this.parseData(productItems);
          pi = this.productItems.slice(
            (this.page - 1) * this.pageSize,
            this.page * this.pageSize
          );
          const data = await this.api.ui.campaign.getCampaignProducts(
            this.campaignData,
            null,
            pi
          );

          const d = data.productItems;
          if (d && d.length <= 0) {
            this.isAtBottom = true;
          }
          this.originData = this.originData.concat(d);
          this.filterData = this.filterData.concat(d);
        } else {
          if (!this.isGetOthersAlready) {
            const { productItems } =
              await this.api.ui.campaign.getCampaignAiProducts(
                this.campaignData,
                200
              );
            const d2 = await this.getProductInfo2(productItems);
            this.originData = this.originData.concat(d2);
            this.filterData = this.filterData.concat(d2);
            this.isGetOthersAlready = true;
          }
        }
        this.isApiOk = true;
      }
    },
    //初始化一般模式下滾動事件(非關鍵字查詢模式下的滾動事件)
    initOriginScrollEvent() {
      window.addEventListener("scroll", this.originScrollEvent, {
        passive: true,
      });
    },
    //移除一般模式下滾動事件(非關鍵字查詢模式下的滾動事件)
    removeOriginScrollEvent() {
      window.removeEventListener("scroll", this.originScrollEvent);
    },
    //關鍵字搜尋滾動事件
    searchScrollEvent() {
      const innerH = window.innerHeight;
      const wy = window.scrollY;
      this.windowY = wy;
      if (innerH + wy >= document.body.scrollHeight - 200) {
        this.getSearchData();
      }
    },
    //初始化關鍵字搜尋滾動事件
    initSearchScrollEvent() {
      window.addEventListener("scroll", this.searchScrollEvent, {
        passive: true,
      });
    },
    //移除關鍵字搜尋滾動事件
    removeSearchScrollEvent() {
      window.removeEventListener("scroll", this.searchScrollEvent);
    },
    //取得campaign資料
    async getCampaignData() {
      this.campaignPidsType = this.campaignData.campaignPidsType;
      const pidCount =
        this.campaignData.campaignRange.v[9]?.split(",")?.length || 0;
      this.maxPage = Math.ceil(pidCount / this.pageSize);

      //type1
      if (this.campaignPidsType === 1) {
        this.isApiOk = false;
        const { productItems } = await this.api.ui.campaign.getCampaignProducts(
          this.campaignData,
          null
        );
        this.productItems = productItems;
        let pi = null;
        // const d = this.parseData(productItems);
        pi = this.productItems.slice(
          (this.page - 1) * this.pageSize,
          this.page * this.pageSize
        );

        const data = await this.api.ui.campaign.getCampaignProducts(
          this.campaignData,
          null,
          pi
        );
        this.isApiOk = true;
        const d = data.productItems;

        //若沒有資料且小於總頁數則繼續打到有資料為止
        if (d && d.length === 0 && this.page < this.maxPage) {
          this.page += 1;
          this.getCampaignData();
          return;
        }

        this.originData = d || [];
        this.filterData = d || [];
        if (this.filterData) {
          this.hasInitData = true;
        }
        this.initOriginScrollEvent();
        return;
      }
      const data = await this.api.ui.campaign.getCampaignAiProducts(
        this.campaignData
      );
      const d2 = await this.getProductInfo2(data.productItems);
      this.originData = d2 || [];
      this.filterData = d2 || [];
      if (this.filterData) {
        this.hasInitData = true;
      }
      this.initOriginScrollEvent();
    },
    //取得商品價格(type2)
    async getProductInfo2(productItems) {
      const pids = productItems.map((v) => v.pid);
      const priceData = await this.api.product.getProducts(pids, 2);
      const originData = productItems.map((e) => {
        if (priceData[e.pid]) {
          return {
            ...e,
            ...priceData[e.pid],
          };
        } else {
          return e;
        }
      });
      const d = this.parseData(originData);
      this.isApiOk = true;
      return d;
    },
    //變為productItem格式
    parseData(productItems) {
      if (productItems) {
        return productItems.map((ele) => {
          return { ...ele, img: ele.images, pid: ele.productId };
        });
      }
      return [];
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
    //設定過濾關鍵字
    async changeKeyword(keyword, hasKeyword) {
      this.resetState(); //重置處理
      //有關鍵字
      if (hasKeyword) {
        this.removeOriginScrollEvent();
        this.initSearchScrollEvent();
        this.doSearch(keyword);
        return;
      }
      this.removeSearchScrollEvent();
      this.initOriginScrollEvent();
      this.doCommon();
    },
    //重置處理
    resetState() {
      this.filterData = null;
      this.resetSearchApiParam();
      // this.resetOriginParam();
    },
    //重置搜尋api參數
    resetSearchApiParam() {
      this.apiParams.page = 1;
      this.nextPage = true;
    },
    //重置普通資料頁碼
    // resetOriginParam() {
    //   this.isAtBottom = false;
    //   this.isGetOthersAlready = false;
    // },
    //處理普通流程(非關鍵字搜尋情況)
    async doCommon() {
      if (!this.originData) {
        await this.getCampaignData();
      } else {
        this.filterData = this.originData;
      }
    },
    //處理關鍵字搜尋流程
    async doSearch(keyword) {
      //由過濾keyword觸發
      this.apiParams["kws"] = keyword;
      this.apiParams["kws64"] = this.tools.base64Encode(keyword);
      // this.apiParams["filter"] = this.apiFilter;
      await this.getSearchData();
    },
    // 取得aiSerach資料
    async getSearchData() {
      if (this.apiLoaded) {
        return;
      }
      if (!this.nextPage) {
        return;
      }
      this.apiLoaded = true;
      this.apiParams["limit_cnts"] =
        Math.ceil((this.apiParams.page * this.apiParams.size) / 100) * 100;

      if (this.apiParams.page === 1) {
        window.scrollTo(0, 0);
      }

      this.api.ai.getSearchData(this.apiParams).then((data) => {
        if (
          data &&
          data.status === "success-end" &&
          data.results &&
          data.results.length > 0
        ) {
          const searchData = data.results;
          if (this.filterData) {
            this.filterData = this.filterData.concat(searchData);
          } else {
            this.filterData = searchData;
          }

          // 判斷是否已達最後一頁
          this.apiParams.page = parseInt(this.apiParams.page) + 1;
          this.nextPage = true;

          setTimeout(() => {
            this.apiLoaded = false;
          }, 50);
        } else {
          this.apiLoaded = false;
          this.nextPage = false;

          // 僅第一頁沒資料才處理
          if (this.apiParams.page === 1) {
            this.isShowNoData = true;
          }
        }
      });
    },
  },
  components: {
    aiProductItem,
    campaignFilter,
    loading,
    campaignPopup,
  },
};
</script>

<style lang="scss">
@import "../../style/reset.module.scss";
@import "../../style/flex.module.scss";
@import "../../style/rwd.module.scss";
@import "../../style/icons.module.scss";
@import "../../style/global.module.scss";
</style>

<style lang="scss" scoped>
@import "../../style/_color.scss";
.campaign {
  margin-bottom: 60px;
  &-items {
    padding: 0 15px 75px;
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
