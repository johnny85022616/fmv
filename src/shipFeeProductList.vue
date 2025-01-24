<template>
  <div class="shipFeeProductList">
    <navigation></navigation>
    <div v-if="titleData" class="info">
      <p v-if="isDoubleEleven" class="campaignTitle">超取免運費</p>
      <p v-else class="campaignTitle">滿<font>{{titleData.shipFeeRule}}</font>元，免<font>{{titleData.shipFee}}</font>元運費</p>
    </div>
    <shipFeeProductsFilter v-if="keywords" :keywordArr="keywords" @changeKeyword="changeKeyword" ref="shipFeeProductsFilter"></shipFeeProductsFilter>
    <div class="search">
      <div class="">
        <p>搜尋</p>
        <p>活動商品</p>
      </div>
      <div class="input">
        <input type="text" placeholder="搜尋優惠商品活動" v-model="inputVal" @keyup.enter="goSearch">
        <img data-v-deb93296="" src="https://event.shopping.friday.tw/event/CP/common/mobile_icon/search-gy.svg">
      </div>
    </div>
    <div class="shipFeeProductList__wrap">
      <productItem v-if="originData" :itemList="originData" :showCampaignQtyIcon="true" />
      <p v-else-if="isShowNoData" class="noData">尚無湊免運商品</p>
    </div>
    <loading v-if="isAlistLoaded" />
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import productItem from "./components/common/aiProductItem.vue";
import shipFeeProductsFilter from "./components/shipFeeProductList/filter.vue";
import loading from "./components/common/loading.vue";

export default {
  name: "shipFeeProductList",
  data() {
    return {
      keywords: null, //filter關鍵字
      originData: null,
      titleData: null, //title數字部分
      shipFeeData: null, //alist data
      inputVal: "", //湊免運input
      apiFilter: null,
      choseKeyword: null,
      isShowNoData: false,
      //searchApi相關參數
      apiParams: {
        target_value: this.tools.aiUserId(),
        remote: /ysdt\.tw/.test(location.hostname) ? "ym" : "m",
        sorting: "RELEVANT",
        kws: "",
        page: 1,
        size: 9,
      },
      nextPage: true,
      apiLoaded: false, //serch api loaded
      isAlistLoaded: false, //getalist api loaded
      isDoubleEleven: false, //是否為雙11活動
    };
  },
  components: {
    navigation,
    productItem,
    shipFeeProductsFilter,
    loading,
  },
  methods: {
    //一般(getalist)
    async doCommon() {
      await this.getShipFeeData();
      if (this.originData) {
        this.composeKeyword();
      }
    },
    //搜尋(aiSearch)
    async doSearch(keyword) {
      //由過濾keyword觸發
      let d = this.inputVal;
      if (keyword) {
        d = keyword;
      }
      this.apiParams["kws"] = d;
      this.apiParams["kws64"] = this.tools.base64Encode(d);
      this.apiParams["filter"] = this.apiFilter;
      await this.getSearchData();
      this.initScroll();
    },
    //取alist
    async getShipFeeData() {
      const { shipmentPreserveId, supplierId, cartType, rule } =
        this.tools.urlSearchToObj();

      this.isDoubleEleven =
        this.api.campaign.checkCampaignDay && cartType === "store";
      let data;

      let postData = {
        type: "3",
        q1_x: 0.5,
        supplier_y: 1,
        list_num: 500,
      };

      //組title資料
      if (rule) {
        const [shipFeeRule, shipFee] = rule.split(",");
        this.titleData = {
          shipFeeRule,
          shipFee,
        };
      }

      const prodTag = cartType === "store" ? "S" : "";
      this.apiFilter = this.api.ai.composeBListFilter(
        supplierId,
        "",
        "",
        "",
        "",
        "",
        prodTag,
        "",
        "",
        shipmentPreserveId === "undefined" ? "" : shipmentPreserveId
      );
      postData.filter = this.apiFilter;
      if (this.shipFeeData) {
        data = this.shipFeeData;
      } else {
        this.isAlistLoaded = true;
        data = await this.api.ai.getAiData("getalist", postData);
        this.isAlistLoaded = false;
      }
      if (data) {
        this.shipFeeData = data;
        const shipFeeData = data.map((ele) => {
          return {
            ...ele,
            img: ele.image_url && ele.image_url.replace("-uat2", ""),
            kids: ele.kids ? ele.kids.map((v) => v.kcontent) : [],
          };
        });

        this.originData = shipFeeData;
      } else {
        this.isShowNoData = true;
      }
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
          if (this.originData) {
            this.originData = this.originData.concat(searchData);
          } else {
            this.originData = searchData;
          }

          // 第一頁設定關鍵字
          if (this.apiParams.page === 1) {
            this.keywords = data.kws_cloud;
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
    initScroll() {
      window.addEventListener("scroll", this.makeNextFunc);
    },
    //search瀑布流事件
    makeNextFunc() {
      const innerH = window.innerHeight;
      const wy = window.scrollY;
      // if (wy < this.windowY) return; // if scroll to up

      this.windowY = wy;

      if (innerH + wy >= document.body.scrollHeight - 200) {
        this.getSearchData();
      }
    },
    // 關鍵字處理
    composeKeyword() {
      let keywords = []; // 商品關鍵字集合
      let tempKids = []; // 暫存關鍵字
      this.shipFeeData.forEach((v) => {
        const { kids } = v;
        // 合併關鍵字
        tempKids = tempKids.concat(kids);
      });
      // 統計出現次數
      const kwObj = {};
      tempKids.forEach((v) => {
        if (!v) return;
        const kw = v.kcontent;
        if (!kwObj[kw]) {
          kwObj[kw] = {
            kw,
            count: 1,
          };
        } else {
          kwObj[kw].count += 1;
        }
      });
      // 排序出現次數最多
      const kwSortResult = Object.values(kwObj).sort(
        (a, b) => b.count - a.count
      );
      // 取不重複
      kwSortResult.forEach((k) => {
        const kw = k.kw;
        if (!keywords.includes(kw)) {
          keywords.push(kw);
        }
      });
      this.keywords = keywords.slice(0, 50);
    },
    //設定過濾關鍵字
    changeKeyword(keyword, hasKeyword) {
      this.inputVal = "";
      //選取關鍵字
      this.resetState();
      if (hasKeyword) {
        this.doSearch(keyword);
        return;
      }
      //關鍵字取消
      this.doCommon();
      window.removeEventListener("scroll", this.makeNextFunc);
    },
    //input框enter事件
    goSearch() {
      this.resetState();
      if (this.$refs.shipFeeProductsFilter) {
        this.$refs.shipFeeProductsFilter.clearNowSelectedKeyword();
      }

      if (this.inputVal === "") {
        this.doCommon();
        window.removeEventListener("scroll", this.makeNextFunc);
      } else {
        this.doSearch();
      }
    },
    resetState() {
      // this.shipFeeData = null;
      this.originData = null;
      this.apiParams.page = 1;
      this.nextPage = true;
      this.isShowNoData = false;
    },
  },
  async created() {
    this.doCommon();
  },
  watch: {},
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
.shipFeeProductList {
  .info {
    background-color: $black;
    color: $white;
    padding: 20px 10px;
    font-size: 2rem;
    .campaignTitle {
      font-weight: bold;
      text-align: center;
      font {
        color: $bean-red;
        font-size: 2.5rem;
        margin: 0 3px;
      }
    }
  }
  .search {
    margin-top: 15px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    box-sizing: border-box;
    padding: 0 10px;
    p {
      font-size: 1.4rem;
      text-align: center;
    }
    .input {
      width: 80%;
      position: relative;
      input {
        width: 100%;
        box-sizing: border-box;
        padding: 0 10px;
        height: 40px;
        border-radius: 10px;
        background-color: #fff;
        border: 1px solid $sliver;
      }
      img {
        position: absolute;
        top: 8px;
        right: 15px;
      }
    }
  }
  &__wrap {
    padding: 20px;
    margin-bottom: 60px;
    .noData {
      text-align: center;
      font-size: 2rem;
      margin-top: 150px;
    }
  }
}
</style>
