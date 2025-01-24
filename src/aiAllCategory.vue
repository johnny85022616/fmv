<template>
  <div class="aiAllCategory">
    <navigation :windowY="200" :directShowSearchInput="true" />
    <breadcrumb v-if="breadCrumbData" :breadCrumbData="breadCrumbData" />
    <div v-if="showFetLogoBoldLogo" class="fetLogoBold">
      <img src="./images/icons/fetLogo_bold.svg">
    </div>
    <!-- <categoryMenu v-if="category" :items="category" /> -->
    <!-- Banner -->
    <div class="aiLCategory-banner">
      <carousel v-if="isShowBanner" :autoplay="true" :loop="true" :perPage="1" :navigateTo="0" :scrollPerPage="false" :paginationEnabled="false" :navigationEnabled="false" @pageChange="pageChange">
        <slide v-for="(e, i) of validBanner" :key="i">
          <a :href="e.link" :title="e.title">
            <img :src="e.imgSrc" :alt="e.title" />
          </a>
        </slide>
      </carousel>
      <span v-if="validBanner && validBanner.length>0" class="counter">{{ nowItemPage }}/{{ validBanner.length }}</span>
    </div>
    <!-- 熱門人氣排行榜 -->
    <div v-if="hotRankingData.length > 0" class="hotranking-products">
      <div>
        <img class="hotranking-products__head" src="./images/ai_L_category_fetnetestore_hot_title.png" />
      </div>
      <aiProductItem :itemList="hotRankingData" :noWrap="true" />
    </div>
    <!-- 目錄商品 -->
    <productMenu v-if="bCategoryData && bCategoryData.length>0" :data="bCategoryData" />
  </div>
</template>

<script>
// import categoryMenu from "./components/category/categoryMenu.vue";
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import productMenu from "./components/category/productMenu.vue";
import breadcrumb from "./components/common/breadcrumb.vue";
import aiProductItem from "./components/common/aiProductItem.vue";
export default {
  name: "aiAllCategory",
  data() {
    return {
      bCategoryData: [], //該M目錄下所有的B商品資料
      breadCrumbData: null, //麵包屑資料:
      category: null, //分類menu資料
      tree: null, //樹
      hotRankingData: [],
      KVBannerFolder: "https://event.shopping.friday.tw/event/20231212/",
      KVBannerJson:
        "https://event.shopping.friday.tw/event/20231212/KVBanner.json",
      KVBanners: [],
      isApiOk: true,
      isAtBottom: false,
      page: 0,
      totalPage: 0, //總頁數
      pageSize: 1,
      isShowBanner: false,
      isFetnetEstore: false,
      catArr: null,
      nowItemPage: 1,
      showFetLogoBoldLogo: false,
    };
  },
  async created() {
    await this.api.ai.getCategorys();
    await this.getMenuData();

    if (this.catArr?.[0] === "L0021") {
      this.fetnetInit();
      this.categoryBannerInit();
    }
    this.getBreadcrumb();
    this.initScrollEvent();

    await this.getMCategoryData();
    this.seo.aiAllCategory(this.breadCrumbData);
  },
  props: {},
  methods: {
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
    //組categoryMenu資料
    async getMenuData() {
      const { catg } = this.tools.urlSearchToObj();
      const exSearch = catg ? "?catg=" + catg : "";
      let menu;
      let tree;

      if (!this.siteData) {
        //本站
        tree = this.getCatCache("")?.[0];
      } else {
        //b站
        if (!catg) {
          if (this.siteData.siteType !== "B2") {
            tree = this.getCatCache("1")?.[0];
          } else {
            tree = this.getCatCache("")?.[0];
          }
        } else {
          tree = this.getCatCache("2")?.[0];
        }
      }

      this.tree = tree;
      let catArr = this.tools.getUrlCategoryConstruction(location.pathname);
      this.catArr = catArr;

      if (catArr) {
        let sub = this.getSub(catArr, tree);

        if (sub) {
          menu = Object.values(sub).map((v) => {
            const vsub = v.sub;
            return {
              id: v.cid,
              itemName: v.name,
              url: `${location.pathname}/${v.cid}${
                exSearch ? `${exSearch}` : ""
              }`,
              hasSub: vsub ? true : false,
            };
          });
        }
      }
      if (menu?.length > 0) {
        this.totalPage =
          menu.length % this.pageSize !== 0
            ? Math.floor(menu.length / this.pageSize + 1)
            : Math.floor(menu.length / this.pageSize);

        this.category = menu;
      }
    },
    //取得下方商品目錄資料
    async getMCategoryData() {
      let arr = [];
      if (this.category) {
        const nowPageArr = this.category.slice(
          this.page * this.pageSize,
          (this.page + 1) * this.pageSize
        );
        for (let cat of nowPageArr) {
          let tempGroups = {};

          // 取得該目錄商品資料
          const data = await this.getPrdApi(cat.id);

          // 取得該目錄曝光連結
          const proLinks = !this.siteData
            ? await this.api.promotion.getCategoryPromotionLinks(cat.id)
            : [];

          if (data) {
            let productItemData = data.map((ele) => {
              return {
                ...ele,
                img: ele.image_url,
                name: ele.name,
                pid: ele.pid,
              };
            });
            tempGroups.category = cat;
            tempGroups.products = productItemData;
            tempGroups.proLinks = proLinks;
            arr.push(tempGroups);
          }
        }
        this.bCategoryData = this.bCategoryData.concat(arr);
        this.$nextTick(() => {
          if (this.page < this.totalPage) {
            this.page += 1;
            this.isApiOk = true;
            this.isAtBottom = false;

            // 避免載入數量不夠，自動往下延伸
            const lastEle = this.bCategoryData[this.bCategoryData.length-1];
            if (lastEle?.products?.length < 9) {
              this.getMCategoryData()
            }
          }
        });
      }
    },
    //麵包屑
    getBreadcrumb() {
      const { catg } = this.tools.urlSearchToObj();
      const { urlSuffix } = this.siteData || {};
      
      let list = [];
      let url = urlSuffix ? `/${urlSuffix}/category` : '/category';

      const findTreeData = (pos, ary, tree) => {
        return ary.slice(0, pos + 1).reduce((obj, key, idx) => {
          return idx === 0 ? obj[key] : obj.sub[key];
        }, tree);
      };

      this.catArr.forEach((cid, idx, ary) => {
        url += `/${cid}`;
        const { name } = findTreeData(idx, ary, this.tree);
        list.push({ name, url });
      });
      
      //判斷是否加上cat=uni
      if (catg) {
        list = list.map((bred) => {
          return {
            ...bred,
            url: bred.url + "?catg=uni",
          };
        });
      }
      this.breadCrumbData = list;
    },
    // 取得category快取
    getCatCache(id) {
      let siteId = "-";
      if (this.siteData) {
        siteId = this.siteData.siteId;
      }
      return this.api.ai.getCache(`ai_category_${siteId}_cache${id}`);
    },
    //取得當前層數的sub
    getSub(ca, tr) {
      return ca.reduce((subtr, cat) => {
        if (subtr && subtr[cat]) {
          subtr = subtr[cat].sub;
          return subtr;
        }
        return;
      }, tr);
    },
    //主站、B站(B1)取商品列表
    async getPrdApi(apiCatg) {
      const { catg } = this.tools.urlSearchToObj();
      const { siteType, isOthersExposeToMe } = this.siteData
        ? this.siteData
        : {};
      let postData = {
        type: 2,
        q1_x: 0.5,
        supplier_y:
          (this.siteData && !catg) ||
          ((siteType === "B1" || siteType === "b1") &&
            isOthersExposeToMe === "N")
            ? 1
            : 0, // 若為bSite 且沒有帶 catg=uni 就設定為 1
        list_num: 20,
      };
      let keywords = "";

      if (this.siteData && !catg) {
        const { supplierId, b4Info } = this.siteData;
        if (supplierId) {
          postData.filter = this.api.ai.composeBListFilter(
            supplierId,
            "",
            apiCatg,
            ""
          );
        }
        if (b4Info?.supplierIds) {
          postData.filter = this.api.ai.composeBListFilter(
            b4Info.supplierIds.join(','),
            "",
            apiCatg,
            ""
          );
        }

      } else {
        if (this.isFetnetEstore) {
          keywords = "!!拆封,福利,福利品";
        }
        postData.filter = this.api.ai.composeBListFilter(
          "",
          "",
          apiCatg,
          keywords
        );
      }

      return await this.api.ai.getAiData("getalist", postData);
    },
    // 遠傳相關banner及熱銷排行榜
    fetnetInit() {
      // 是否呈現安插Banner
      const catArr = this.catArr;
      if (catArr && catArr.length === 1 && catArr[0] === "L0021") {
        this.isFetnetEstore = true;
        this.showFetLogoBoldLogo = true;
        this.getFetnetKVB();
        // 遠傳固定熱門人氣商品
        this.getTopProducts();
        this.category = this.fetChangeDataSort(this.category);
      }
    },
    // 取得L層後台設定的Banner
    categoryBannerInit() {
      const catArr = this.catArr;
      if (
        !this.siteData &&
        catArr &&
        catArr.length === 1 &&
        catArr[0] !== "L0021"
      ) {
        this.getCategoryBanners(catArr[0]);
      }
    },
    // 取得遠傳手機廣告
    async getFetnetKVB() {
      const json = await fetch(this.KVBannerJson + "?v=" + new Date().getTime())
        .then((r) => r.json())
        .then((r) => r);
      if (json && json.length > 0) {
        this.KVBanners = json.map(({ end, imgSrc, link, start, title }) => ({
          start: new Date(start).getTime(),
          end: new Date(end).getTime(),
          imgSrc: "https://event.shopping.friday.tw/event/20231212/" + imgSrc,
          link,
          title,
        }));
        this.isShowBanner = true;
      }
    },
    // 目錄層專屬BANNER
    getCategoryBanners(catg0) {
      const { imgJsonDomain } = this.configs;
      this.axios
        .get(
          imgJsonDomain + `images/ai4/index_deploy/${catg0}/A1/${catg0}.json`,
          {
            params: {
              nocache: this.today,
            },
          }
        )
        .then((res) => {
          const { data } = res;
          if (data && data.length > 0) {
            this.KVBanners = data.map((v) => {
              return {
                start: new Date("2024/01/01").getTime(),
                end: new Date(v.bannerDate + " 23:59:59").getTime(),
                link: v.bannerUrl,
                title: "",
                imgSrc: imgJsonDomain + v.bannerImageUrl,
              };
            });
            this.isShowBanner = true;
          }
        });
    },
    // 取得熱銷人氣商品
    async getTopProducts() {
      this.api.campaign.getHotRankingInfo().then(async (rawPids) => {
        const pidData = await this.api.product.getProducts(rawPids);
        if (pidData) {
          this.hotRankingData = rawPids
            .map((p) => pidData?.[p])
            .filter((v) => !!v && v.name);
        }
      });
    },
    //若有手機類別(M0127)則排到列表最前方
    fetChangeDataSort(cat) {
      const firstMidArr = [],
        secondMidArry = [];
      cat.forEach((v) => {
        if (v.id === "M0127") {
          firstMidArr.push(v);
        } else {
          secondMidArry.push(v);
        }
      });
      cat = firstMidArr.concat(secondMidArry);

      return cat;
    },
    pageChange(val) {
      this.nowItemPage = val + 1;
    },
  },
  computed: {
    today() {
      return new Date().getTime();
    },
    validBanner() {
      return this.KVBanners.filter(
        (e) => e.start < this.today && this.today <= e.end
      );
    },
  },
  watch: {
    async isAtBottom(newVal) {
      // gData.length > 0 為取得集合目錄資料
      if (
        this.bCategoryData.length > 0 &&
        this.page < this.totalPage &&
        this.isApiOk &&
        newVal
      ) {
        console.log('continue get');
        await this.getMCategoryData();
      }
    },
  },
  components: {
    // categoryMenu,
    navigation,
    productMenu,
    breadcrumb,
    aiProductItem,
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

.aiAllCategory {
  margin-bottom: 60px;
}

.fetLogoBold {
  background-color: $background;
  width: 100%;
  padding: 0 10px 15px 10px;
  box-sizing: border-box;
  img {
    width: 70%;
  }
}

.aiLCategory-banner {
  position: relative;
  img {
    width: 100%;
    aspect-ratio: 2.727 / 1;
    -webkit-aspect-ratio: 2.727 / 1;
  }
  .counter {
    position: absolute;
    right: 5px;
    bottom: 10px;
    box-sizing: border-box;
    padding: 1px 5px;
    border-radius: 10px;
    color: $white;
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 19px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.6);
  }
}
.hotranking-products {
  margin: 10px 0;
  > div {
    padding-left: 10px;
    &:first-child {
      padding: 0 10px;
      img {
        width: 100%;
      }
    }
  }
}
</style>
