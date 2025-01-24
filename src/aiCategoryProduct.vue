<template>
  <div class="aiCategoryProduct">
    <navigation :windowY="200" :isComponentMaskShow="isFilterShow" :directShowSearchInput="true" />
    <categoryMenu v-if="groupings" :items="groupings" />
    <categoryFilter v-if="categoryData" :originData="categoryData" :filterData="filterData" :layoutType="layoutType" @setFilterFullscreenOpen="setFilterFullscreenOpen" @changeFilterData="changeFilterData" @changeLayoutType="changeLayoutType" />
    <div v-if="isApiLoaded" class="aiCategoryProduct__wrap">
      <template v-if="filterData">
        <productItem v-if="filterData" :itemList="filterData" :layoutType="layoutType" :showCampaignQtyIcon="true" @changeItemWishActive="changeItemWishActive" @changeItemWishUnActive="changeItemWishUnActive" @initWishStatus="initWishStatus" />
      </template>
      <template v-else>
        <div class="search_nodata">此目錄無相關商品，請試試其他條件。</div>
      </template>
    </div>
  </div>
</template>

<script>
import productItem from "./components/common/aiProductItem.vue";
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import categoryMenu from "./components/category/categoryMenu.vue";
import categoryFilter from "./components/category/filter.vue";
export default {
  name: "aiCategoryProduct",
  data() {
    return {
      windowY: 0,
      isApiLoaded: false,
      reTryTimes: 0,
      categoryData: null,
      filterData: null,
      groupings: null,
      breadCrumbData: null, //麵包屑資料:
      sortType: "default",
      layoutType: "two",
      isFilterShow: false,
    };
  },
  async created() {
    window.productsPool = {};
    this.getCategoryProduct();

    await this.api.ai.getCategorys();
    this.getBreadcrumb();
    this.seo.aiAllCategory(this.breadCrumbData);
  },
  props: {},
  methods: {
    //取得product資料
    async getCategoryProduct() {
      // const supplier_id = this.tools.aiSuppierId()

      const { catg } = this.tools.urlSearchToObj();
      const lastCat = this.getLastCategory();

      const { siteType, isOthersExposeToMe } = this.siteData
        ? this.siteData
        : {};
      let postData = {
        type: "3",
        q1_x: 0.5,
        supplier_y:
          (this.siteData && !catg) ||
          ((siteType === "B1" || siteType === "b1") &&
            isOthersExposeToMe === "N")
            ? 1
            : 0, // 若為bSite 且沒有帶 catg=uni 就設定為 1
        list_num: 500,
      };
      let apiEndpoint = "getalist";

      if (this.siteData && !catg) {
        const { supplierId, b4Info } = this.siteData;
        if (supplierId) {
          postData.filter = this.api.ai.composeBListFilter(
            supplierId,
            "",
            lastCat,
            ""
          );
        }
        if (b4Info?.supplierIds) {
          postData.filter = this.api.ai.composeBListFilter(
            b4Info.supplierIds.join(','),
            "",
            lastCat,
            ""
          );
        }
      } else {
        postData.filter = this.api.ai.composeBListFilter("", "", lastCat, "");
      }

      // 改用帶CACHE機制的 getwlist. only for siteId 帶空
      if (!this.siteData || (this.siteData && !this.siteData.siteId)) {
        apiEndpoint = "getwlist";
      }

      const data = await this.api.ai.getAiData(apiEndpoint, postData);
      if (data) {
        this.categoryData = data.map((ele) => {
          return {
            ...ele,
            img: ele.image_url && ele.image_url.replace("-uat2", ""),
            name: ele.name,
            pid: ele.pid,
            new_date: ele.new_date,
            brand: ele.brand,
            kids: ele.kids_show,
            wishActive: false,
            price: ele.promoPrice || ele.price,
            priceSuffix: ele.promoPrice && "(折扣後)",
          };
        });
        this.filterData = JSON.parse(JSON.stringify(this.categoryData));
        this.isApiLoaded = true;
      } else {
        if (this.reTryTimes < 4) {
          this.reTryTimes += 1;
          setTimeout(() => {
            this.getCategoryProduct();
          }, 300);
        } else {
          this.isApiLoaded = true;
        }
      }
    },
    // 取得category快取
    getCatCache() {
      let siteId = '-';
      if (this.siteData) {
        siteId = this.siteData.siteId;
      }
      console.log(`ai_category_${siteId}_cache`);
      return this.api.ai.getCache(`ai_category_${siteId}_cache`);
    },
    //麵包屑
    getBreadcrumb() {
      let list = [];
      const categoryTree = this.getCatCache()?.[0];
      if (!categoryTree) return;

      const findTreeData = (pos, ary, tree) => {
        return ary.slice(0, pos + 1).reduce((obj, key, idx) => {
          return idx === 0 ? obj[key] : obj.sub[key];
        }, tree);
      };

      const catArr = this.tools.getUrlCategoryConstruction(location.pathname);
      catArr.forEach((cid, idx, ary) => {
        const { name } = findTreeData(idx, ary, categoryTree);
        list.push({ name });
      });
      this.breadCrumbData = list;
    },
    //經過sort和filter後更新
    changeFilterData(filterData) {
      this.filterData = filterData;
    },
    //變更要傳入aiProductItem的排版
    changeLayoutType(layoutType) {
      this.layoutType = layoutType;
    },
    changeItemWishActive(pid) {
      for (const data of this.categoryData) {
        if (data.pid === pid) {
          data.wishActive = true;
        }
      }
      for (const data of this.filterData) {
        if (data.pid === pid) {
          data.wishActive = true;
        }
      }
    },
    changeItemWishUnActive(pid) {
      for (const data of this.categoryData) {
        if (data.pid === pid) {
          data.wishActive = false;
        }
      }
      for (const data of this.filterData) {
        if (data.pid === pid) {
          data.wishActive = false;
        }
      }
    },
    initWishStatus(wishList) {
      if (wishList && wishList.length > 0) {
        for (let item of wishList) {
          for (let prd of this.categoryData) {
            if (item.product.productId === prd.pid) {
              prd.wishActive = true;
            }
          }
        }
      }
      this.filterData = JSON.parse(JSON.stringify(this.categoryData));
    },
    setFilterFullscreenOpen(isShow) {
      this.isFilterShow = isShow;
    },
    //取的最後的
    getLastCategory() {
      let catArr = this.tools.getUrlCategoryConstruction(location.pathname);
      return catArr[catArr.length - 1];
    },
  },
  components: {
    navigation,
    productItem,
    categoryMenu,
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
    padding: 0 20px 20px;
    margin: 0 0 60px;
  }
}

.search_nodata {
  padding-top: 50px;
  text-align: center;
  font-size: 1.7rem;
}
</style>
