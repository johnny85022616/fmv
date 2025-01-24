<template>
  <div class="aiCategoryProduct">
    <navigation :windowY="200" :isComponentMaskShow="isFilterShow" :directShowSearchInput="true" />
    <div class="aiCategoryProduct__layout">
      <categoryFilter v-if="aiData.length > 0" :originData="aiData" :filterData="filterData" @setFilterFullscreenOpen="setFilterFullscreenOpen" :layoutType="layoutType" @changeFilterData="changeFilterData" @changeLayoutType="changeLayoutType" @setOnlyBW="setOnlyBW" />
    </div>
    <div v-if="filterData.length > 0 || bwData.length > 0" class="aiCategoryProduct__wrap">
      <productItem v-if="isShowAiData" hrefTarget="_blank" :isAiData="true" :aiDataCount="aiDataCount" :bwDataCount="bwDataCount" :itemList="filterData" :layoutType="layoutType" @changeItemWishActive="changeItemWishActive" @changeItemWishUnActive="changeItemWishUnActive" @initWishStatus="initWishStatus" />
      <productItem v-if="isShowBWData" hrefTarget="_blank" :isAiData="false" :aiDataCount="aiDataCount" :bwDataCount="bwDataCount" :itemList="bwData" :layoutType="layoutType" @changeItemWishActive="changeItemWishActive" @changeItemWishUnActive="changeItemWishUnActive" @initWishStatus="initWishStatus" />
    </div>
    <div v-else-if="isFirstApiLoaded" class="search_nodata">{{ noResultWording }}</div>
  </div>
</template>

<script>
import productItem from "./components/common/aiProductItem.vue";
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import categoryFilter from "./components/search/filterBw.vue";

export default {
  name: "aiSearch",
  data() {
    return {
      windowY: 0,
      data: [],
      aiData: [], // AI RAW資料
      bwData: [], // BW RAW資料
      aiDataCount: 0,
      bwDataCount: 0,
      filterData: [], // AI Filtering資料
      isShowAiData: true, // 是否解析 AI 資料
      isShowBWData: true, // 是否解析 BW 資料
      layoutType: "two",
      isFilterShow: false,
      isShowRedTop: true,
      nextPage: true,
      pagination: {},
      isFirstApiLoaded: false,
      apiLoaded: false,
      apiParams: {
        device: "mobile",
        sorting: "RELEVANT",
        filters: true,
        keyword: "",
        page: 1,
        rows: 12,
        sid: -999,
      },
      bodyParams: {},
      noResultWording: "無相關商品，請試試其他條件。",
      isShowNoData: false,
    };
  },
  async created() {
    window.productsPool = {};
    const searchStr = this.tools.urlSearchToObj();
    this.apiParams = Object.assign(this.apiParams, searchStr);
    // 初始化取用AI + 宇匯
    this.initAllApi();

    this.seo.search({}, searchStr.keyword);
  },
  methods: {
    async initAllApi() {
      await this.getAiApi();
      await this.initGetBwApi();
    },
    //取得product資料
    async getAiApi() {
      const searchStr = this.tools.urlSearchToObj();
      const list_num = searchStr.list_num; // 總筆數
      const supplier_y = searchStr.supplier_y; //bsite商品的比例
      const exSid = searchStr.exSup_id; //排除的供應商商品
      const sid = searchStr.supplier_Id; //需要的供應商商品
      const { siteType, isOthersExposeToMe } = this.siteData
        ? this.siteData
        : {};
      let postData = {
        type: 3,
        q1_x: 0.5,
        supplier_y:
          (siteType === "B1" || siteType === "b1") && isOthersExposeToMe === "N"
            ? 1
            : supplier_y
            ? supplier_y
            : 0.7, // 若為bSite 且沒有帶 catg=uni 就設定為 1
        list_num: list_num ? list_num : 99,
      };
      const supplierId = this.siteData
        ? this.siteData.supplierId
        : sid
        ? sid
        : ""; //判斷是否有sideData，如果沒有判斷queryString有無sideId，所以上都無則為空白

      let kStr = "";
      const v = [];
      v[0] = supplierId ? supplierId : "";
      v[1] = exSid ? exSid : "";
      v[2] = searchStr.bid ? searchStr.bid : "";
      v[3] = searchStr.keyword ? searchStr.keyword : "";

      v.forEach((flag) => {
        if (flag === "") {
          kStr += "0";
        } else {
          kStr += "1";
        }
      });

      //途徑為看商品頁「看本分類所有商品」進入
      if (searchStr.bid && searchStr.pid && searchStr.type) {
        // postData.filter = { k: "0010", v: ["", "", searchStr.bid, ""] };
        postData.filter = this.api.ai.composeBListFilter(
          "",
          "",
          searchStr.bid,
          ""
        );
      } else {
        postData.filter = { k: kStr, v: v };
        postData.filter = this.api.ai.composeBListFilter(
          supplierId,
          exSid,
          searchStr.bid,
          searchStr.keyword
        );
      }
      const data = await this.api.ai.getAiData("getalist", postData);
      if (data) {
        this.aiData = data.map((ele) => {
          return {
            img: ele.image_url,
            name: ele.name,
            price: ele.price,
            pid: ele.pid,
            new_date: ele.new_date,
            brand: ele.brand,
            wishActive: false,
            kids: ele.kids_show,
          };
        });
        this.aiDataCount = this.aiData.length;
        this.filterData = JSON.parse(JSON.stringify(this.aiData));
        this.isFirstApiLoaded = true;
      }
    },
    // 最新及價格排序僅取宇匯資料，避免UI資料捲動後排序亂掉
    async setOnlyBW(isBW, bwPayload) {
      this.bwData = [];
      this.nextPage = true;
      this.isShowNoData = false;
      this.apiParams = Object.assign(this.apiParams, { page: 1 }, bwPayload);
      if (isBW) {
        this.isShowAiData = false;
        this.isShowBWData = true;
        this.initGetBwApi();
      } else {
        this.isShowAiData = true;
        this.isShowBWData = true;
      }
    },
    // init getApi & calculating scrollHeight
    initGetBwApi() {
      const dis = window.innerHeight * 2;
      const makeNextFunc = () => {
        {
          const wy = window.scrollY;
          this.windowY = wy;

          if (dis + wy > document.body.scrollHeight) {
            this.getBwAPI();
          }
        }
      };
      window.removeEventListener("scroll", makeNextFunc);
      window.addEventListener("scroll", makeNextFunc);
      this.getBwAPI(true);
    },
    // 取語匯api
    async getBwAPI(autoNextPage = false) {
      if (this.apiLoaded) {
        return;
      }
      if (!this.nextPage) {
        return;
      }
      this.apiLoaded = true;
      this.isShowNoData = false;

      if (this.apiParams.page === 1) {
        window.scrollTo(0, 0);
      }
      this.axios
        .post(`v2/search`, null, {
          headers: {
            Authorization: "Bearer MCwCFGVS24f",
          },
          params: this.apiParams,
          data: this.bodyParams,
          baseURL: this.configs.mserviceApiPath(),
        })
        .then((res) => {
          const data = res.data;
          if (data.status === 1 && data.meta && data.meta.redirectUrl) {
            window.location.href = data.meta.redirectUrl;
            return;
          }
          if (data.status === 1 && data.payload.pagination.total > 0) {
            const payload = data.payload;

            let searchData = payload.data.map((i) => {
              return {
                pid: i.pid,
                img: i.image_url,
                name: i.name,
                price: i.price,
                promo_price: i.promo_price,
                payMethodList: i.payMethodList,
                rewardPointInfo: i.rewardPointInfo,
                tags: i.tags,
                restricted: i.restricted,
                promotion: i.promotion,
                productStatus: i.productStatus,
                fullInfoStyle: true,
                soldout: [3, 4].indexOf(i.productStatus.id) > -1 ? true : false,
                priceSuffix: i.showSaleMsg ? "(折扣後)" : "",
              };
            });
            this.bwData = this.bwData.concat(searchData);
            this.bwDataCount = this.bwData.length;

            if (
              payload.pagination.current_page < payload.pagination.total_pages
            ) {
              this.apiParams.page = parseInt(this.apiParams.page) + 1;
              this.nextPage = true;
            } else {
              this.nextPage = false;
            }

            if (this.apiParams.page >= 2) {
              this.apiParams.filters = false;
            }

            if (payload.filters) this.filters = payload.filters;
            if (payload.dimension) this.dimensionFilters = payload.dimension;
            this.categoryFilters = payload.category;
            this.fuzzyData = payload.fuzzy;
            this.pagination = payload.pagination;

            setTimeout(() => {
              this.apiLoaded = false;

              if (autoNextPage) {
                // 判斷body高度不及window高時，需要再取資料補畫面
                if (
                  this.nextPage &&
                  document.body.clientHeight < window.innerHeight
                ) {
                  this.$nextTick(() => {
                    this.getBwAPI();
                  });
                }
              }
            }, 200);
          } else {
            this.searchResults = [];
            this.categoryFilters = [];
            this.dimensionFilters = [];
            this.fuzzyData = {};
            this.pagination = {};
          }

          this.isFirstApiLoaded = true;
        });
    },
    //經過sort和filter後更新
    changeFilterData(filterData, isFiltering, sortType) {
      // 如果使用品牌或關鍵字過濾  則不顯示BW資料
      if (isFiltering) {
        this.isShowAiData = true;
        this.isShowBWData = false;
      } else {
        switch (sortType.sortType) {
          case "default":
            this.isShowAiData = true;
            this.isShowBWData = true;
            break;
          case "new":
          case "price":
            this.isShowBWData = true;
            this.isShowAiData = false;
            break;
        }
      }

      this.filterData = filterData;
      if (this.filterData.length === 0) {
        this.isShowNoData = true;
      } else {
        this.isShowNoData = false;
      }
    },
    //變更要傳入aiProductItem的排版
    changeLayoutType(layoutType) {
      this.layoutType = layoutType;
    },
    changeItemWishActive(pid) {
      for (const data of this.data) {
        if (data.pid === pid) {
          data.wishActive = true;
        }
      }
    },
    changeItemWishUnActive(pid) {
      for (const data of this.data) {
        if (data.pid === pid) {
          data.wishActive = false;
        }
      }
    },
    initWishStatus(wishList) {
      if (wishList && wishList.length > 0) {
        for (let item of wishList) {
          for (let prd of this.data) {
            if (item.product.productId === prd.pid) {
              prd.wishActive = true;
            }
          }
        }
      }
    },
    setFilterFullscreenOpen(isShow) {
      this.isFilterShow = isShow;
    },
  },
  components: {
    navigation,
    productItem,
    categoryFilter,
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

.aiCategoryProduct {
  &__wrap {
    padding: 15px 20px 20px;
    margin: 0px 0 60px;
  }
}

.search_nodata {
  padding-top: 50px;
  text-align: center;
  font-size: 1.7rem;
}
</style>
