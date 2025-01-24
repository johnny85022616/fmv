<template>
  <div class="home">
    <div class="brandNav">
      <div class="logo">
        <a :href="logoUrl" target="_blank">
          <img :src="supplierData.logoMobile" :style="{ backgroundColor: `${supplierData.headerColor ? supplierData.headerColor : '#ddd5cc'}`}">
        </a>
      </div>
      <div class="search">
        <p>櫃內搜尋</p>
        <div class="input">
          <input type="text" placeholder="搜尋櫃內商品" v-model="inputVal" @keydown="goSearchByEnter">
          <img data-v-deb93296="" src="https://event.shopping.friday.tw/event/CP/common/mobile_icon/search-gy.svg" @click="goSearch">
        </div>
      </div>
    </div>
    <topBanner :supplierData="supplierData"></topBanner>
    <brandCategoryList v-if="category" :category="category" :barsLevel="barsLevel" :supplierData="supplierData" />
    <banner v-if="supplierData && bannerData" :bannerData="bannerData" :supplierData="supplierData"></banner>
    <homeProductList v-if="supplierData && category" :supplierData="supplierData" :barsLevel="barsLevel" />
  </div>
</template>

<script>
import banner from "./home/banner.vue";
import brandCategoryList from "./home/brandCategoryList.vue";
import homeProductList from "./home/homeProductList.vue";
import ailog from "../../utils/ailog";
import topBanner from "../../components/homepage/topBanner.vue";

export default {
  name: "home",
  data() {
    return {
      originData: null,
      bannerData: null,
      category: null,
      inputVal: "",
      keyword: "",
      barsLevel: null,
    };
  },
  props: {
    supplierData: {
      type: Object,
    },
  },
  created() {
    this.getCategory();
    this.getData();
    ailog.homepage(this.supplierData?.siteId);
  },

  methods: {
    // 中間2格Carousel商品資料
    async getData() {
      const supplierId = this.supplierData.supplierId; //需要的供應商商品
      let postData = {
        supplier_y: 1,
        list_num: 10,
        type: 3,
      };
      const filterData = this.api.ai.composeBListFilter(supplierId, "", "", "");

      postData.filter = filterData;
      this.bannerData = await this.api.ai.getAiData("getalist", postData);
    },
    // 取得專櫃分類資料
    async getCategory() {
      const postData = {
        target: "pseudoid",
        list_fun: "allCategory",
        list_args: "content",
        list_remote: "b01",
        site_id: this.supplierData.siteId,
        if_bWeb: "1",
      };
      const data = await this.api.ai.getAiData("getvlist", postData);
      this.parseCategory(data);
    },
    // 整理專櫃分類資料
    parseCategory(data) {
      let category;
      let catObj = {};
      if (data && data.catg1 && data.catg1[0] !== null) {
        category = data.catg1[0];
      }
      if (data && data.groupings && data.groupings[0] !== null) {
        category = data.groupings[0];
      }
      Object.values(category).forEach((cat) => {
        catObj[cat.cid] = cat.name;
      });
      this.category = catObj;

      let m = Object.keys(catObj)[0].match(/([LMB]{1})\d{4}/);
      m = m[1];
      let pageLevel;

      switch (m) {
        case "L":
          pageLevel = "lid";
          break;
        case "M":
          pageLevel = "mid";
          break;
        case "B":
          if (this.category.sub) {
            pageLevel = "mid";
            break;
          } else {
            pageLevel = "bid";
          }
      }
      this.barsLevel = pageLevel;
    },
    //搜尋框點擊事件
    goSearch() {
      this.keyword = this.inputVal; //按下enter或點擊時才送出關鍵字(避免美輸入一個字就做一次搜尋)
      location.href = `/shop/${this.supplierData.urlSuffix}/search?kw=${this.keyword}`;
    },
    //搜尋框enter事件
    goSearchByEnter(evt) {
      if (evt && evt.keyCode === 13) {
        evt.preventDefault();
        this.goSearch();
        evt.stopPropagation();
      }
    },
  },

  computed: {
    logoUrl() {
      return "/shop/" + this.supplierData.urlSuffix;
    },
  },

  components: {
    banner,
    brandCategoryList,
    homeProductList,
    topBanner,
  },
};
</script>


<style lang="scss" scoped>
@import "../../style/_color.scss";
.home {
  .brandNav {
    display: flex;
    align-items: center;
    padding: 5px 10px;
    position: sticky;
    top: 87px;
    z-index: 1;
    background-color: $white;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.16);
    .logo {
      margin-right: 20px;
      border-radius: 5px;
      img {
        width: auto;
        max-height: 40px;
        object-fit: contain;
        border-radius: 5px;
        vertical-align: top;
      }
    }
    .search {
      flex: 1 1 70%;
      margin: 5px 0;
      display: flex;
      align-items: center;
      p {
        font-size: 14px;
        margin-right: 5px;
        min-width: 60px;
      }
      .input {
        width: 100%;
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
  }
}
</style>