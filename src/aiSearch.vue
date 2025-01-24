<template>
  <div class="aiCategoryProduct">
    <navigation :windowY="200" :isComponentMaskShow="isFilterShow" :directShowSearchInput="true" />
    <div class="aiCategoryProduct__layout">
      <categoryFilter v-if="!isShowNoData && !isCategoryRelated" :keywordData="keywordData" :brandData="brandData" :originData="aiData" :filterData="filterData" @setFilterFullscreenOpen="setFilterFullscreenOpen" :layoutType="layoutType" @changeFilterData="changeFilterData" @changeLayoutType="changeLayoutType" @setSorting="setSorting" />
    </div>
    <div v-if="aData" class="aiCategoryProduct__wrap">
      <productItem :itemList="aData" :isAiData="true" />
    </div>
    <div v-if="bwData.length > 0" class="aiCategoryProduct__wrap">
      <productItem v-if="isShowBWData" hrefTarget="_blank" :isAiData="false" :aiDataCount="aiDataCount" :bwDataCount="bwDataCount" :itemList="bwData" :layoutType="layoutType" :showCampaignQtyIcon="true" @changeItemWishActive="changeItemWishActive" @changeItemWishUnActive="changeItemWishUnActive" @initWishStatus="initWishStatus" />
    </div>
    <div v-else-if="isShowNoData" class="search_nodata">{{ noResultWording }}</div>
  </div>
</template>

<script>
import productItem from "./components/common/aiProductItem.vue";
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import categoryFilter from "./components/search/filter.vue";

export default {
  name: "aiSearch",
  data() {
    return {
      windowY: 0,
      data: [],
      aiData: [], // AI RAW資料
      bwData: [], // BW RAW資料
      aData: null,
      aiDataCount: 0,
      bwDataCount: 0,
      filterData: [], // AI Filtering資料
      isShowBWData: true, // 是否解析 BW 資料
      layoutType: "two",
      isFilterShow: false,
      isShowRedTop: true,
      nextPage: true,
      firstLanding: true,
      apiLoaded: false,
      apiParams: {
        target_value: this.tools.aiUserId(),
        remote: /ysdt\.tw/.test(location.hostname) ? "ym" : "m",
        sorting: "RELEVANT",
        keyword: "",
        kws: "",
        and_brand: "",
        page: 1,
        size: 9,
      },
      noResultWording: "無相關商品，請試試其他條件。",
      isShowNoData: false,
      pidUrlKs: "",
      searchTimeStamp: Math.ceil(new Date().getTime() / 1000),
      keywordData: [],
      brandData: [],
      isCategoryRelated: false,
    };
  },
  async created() {
    window.productsPool = {};
    const searchStr = this.tools.urlSearchToObj();
    if (searchStr.type === "categoryRelated") {
      this.isCategoryRelated = true;
      await this.getaData();
      return;
    }
    // 設定SEO
    this.seo.search({}, searchStr.keyword);

    // 設定搜尋API Payload
    this.pidUrlKs = encodeURIComponent(searchStr.keyword);
    this.apiParams = Object.assign(this.apiParams, searchStr, {
      kws: searchStr.keyword,
      kws64: this.tools.base64Encode(searchStr.keyword),
    });

    // B SITE 供應商不允許其他廠商商品出現在我這 isOthersExposeToMe
    if (this.siteData) {
      const { isOthersExposeToMe, supplierId, b4Info } = this.siteData;
      if (isOthersExposeToMe === "N") {
        this.apiParams.and_supplier_id = supplierId;
      }
      if (b4Info) {
        const b4SupplierId = b4Info.supplierIds;
        if (b4SupplierId) {
          this.apiParams.and_supplier_id = b4SupplierId.toString();
        }
      }
    }

    // friDay主站
    if (window.fridaySiteData) {
      const { unShowSupplierIds } = window.fridaySiteData;
      let filterUnShowSupplierIds = "";

      if (unShowSupplierIds)
        filterUnShowSupplierIds = unShowSupplierIds.toString();
      this.apiParams.filter = this.api.ai.composeBListFilter(
        "",
        filterUnShowSupplierIds
      );
    }

    // 初始化宇匯
    this.initgetSearchAPI();
  },
  methods: {
    //商品頁
    async getaData() {
      let supplier_id = "";
      const { supplierId } = this.siteData ? this.siteData : {};
      if (supplierId) {
        supplier_id = supplierId;
      }
      let postData = {
        type: "3",
        q1_x: 0.5,
        supplier_y: 0.7,
        list_num: 500,
      };

      const { bid } = this.tools.urlSearchToObj();
      postData.filter = this.api.ai.composeBListFilter(supplier_id, "", bid, "");

      const data = await this.api.ai.getAiData("getalist", postData);
      if (data) {
        this.aData = data.map((ele) => {
          return {
            ...ele,
            img: ele.image_url,
            name: ele.name,
            pid: ele.pid,
            new_date: ele.new_date,
            brand: ele.brand,
            kids: ele.kids_show,
            wishActive: false,
          };
        });

        this.seo.search({}, data?.[0]?.auto_category_id_L_c + '・' + data?.[0]?.auto_category_id_c);
      }
    },
    // init getApi & calculating scrollHeight
    initgetSearchAPI() {
      const innerH = window.innerHeight;
      const makeNextFunc = () => {
        {
          const wy = window.scrollY;
          // if (wy < this.windowY) return; // if scroll to up

          this.windowY = wy;

          if (innerH + wy >= document.body.scrollHeight - 200) {
            this.getSearchAPI();
          }
        }
      };
      window.removeEventListener("scroll", makeNextFunc);
      window.addEventListener("scroll", makeNextFunc);
      this.getSearchAPI(true);
      this.getBrandAPI();
    },
    // 調整排序
    async setSorting(payload) {
      this.reSend(payload);
    },
    // 取搜尋結果
    getSearchAPI(autoNextPage = false) {
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

      let prodFlag = null;
      if (this.siteData) {
        prodFlag = this.siteData?.b4Info?.prodFlag;
        this.apiParams["and_flag"] = prodFlag;
      }

      this.api.ai.getSearchData(this.apiParams).then((data) => {
        console.log("data", data);
        if (
          data.status === "success-end" &&
          data.results &&
          data.results.length > 0
        ) {
          const searchData = data.results;
          this.bwData = this.bwData.concat(searchData);
          this.bwDataCount = this.bwData.length;

          // 第一頁設定關鍵字
          if (this.apiParams.page === 1) {
            this.keywordData = data.kws_cloud;
          }

          // 判斷是否已達最後一頁
          this.apiParams.page = parseInt(this.apiParams.page) + 1;
          this.nextPage = true;

          setTimeout(() => {
            this.apiLoaded = false;
            if (autoNextPage) console.log("autoNextPage");
            // if (autoNextPage) {
            //   // 判斷body高度不及window高時，需要再取資料補畫面
            //   if (
            //     this.nextPage &&
            //     document.body.clientHeight < window.innerHeight
            //   ) {
            //     this.$nextTick(() => {
            //       this.getSearchAPI();
            //     });
            //   }
            // } else {
            //   if (
            //     window.scrollY + window.innerHeight >
            //     document.body.scrollHeight - 1
            //   ) {
            //     this.getSearchAPI();
            //   }
            // }
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
    // 取搜尋品牌相關資料
    async getBrandAPI() {
      this.axios
        .post(`/brand`, this.apiParams, {
          baseURL: this.configs.aiSearchApiPath(),
        })
        .then((res) => {
          const data = res.data[0];
          if (data.status === "success" && data.brands.length > 0) {
            this.brandData = data.brands.filter((v) => !/([#\s,\d]+)/.test(v));
          }
        });
    },
    // 品牌過濾
    changeFilterData(payload) {
      const bnd = {
        and_brand: "",
      };
      if (payload.brand) {
        bnd.and_brand = payload.brand.map((v) => v.name).join(",");
      }
      this.reSend(bnd);
    },
    reSend(payload) {
      this.apiParams = Object.assign(this.apiParams, { page: 1 }, payload);
      this.bwData = [];
      this.nextPage = true;
      this.getSearchAPI(true);
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
