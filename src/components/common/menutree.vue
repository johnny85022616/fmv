<template>
  <div class="wrap">
    <hotKeywords v-if="(!isBsite)||(isBsite && !['B4', 'b1'].includes(siteData.siteType))" :isBsite="supplierData ? true : false" />

    <div class="category-shop" :style="[{'height': categoryHeight}]">
      <div v-if="bsiteShopItems">
        <label for="">{{ bsiteShopItemsTitle }}</label>
        <ul class="category-shop__items">
          <li v-for="(item, idx) in bsiteShopItems" :key="idx" @click="goCategoryPage(item.url, 2)">
            <div>
              <img :src="item.img_url" alt="">
            </div>
            <p>{{item.name}}</p>
          </li>
        </ul>
      </div>
      <template v-if="shopItems && shopItems.length > 0">
        <label for="">{{ shopItemsTitle }}</label>
        <ul class="category-shop__items">
          <li v-for="(item, idx) in shopItems" :key="idx" @click="goCategoryPage(item.url, 1)">
            <div>
              <img :src="item.img_url" alt="">
            </div>
            <p>{{item.name}}</p>
          </li>
        </ul>
      </template>
    </div>

  </div>
</template>

<script>
import hotKeywords from "./hotKeywords.vue";

export default {
  name: "menutree",
  components: {
    hotKeywords,
  },
  data() {
    return {
      isBsite: false,
      bsiteShopItems: null,
      shopItems: [],
      bsiteShopItemsTitle: "全部分類",
      shopItemsTitle: "全部分類",
    };
  },
  created() {
    window.scrollTo(0, 0);
    if (this.siteData) {
      this.isBsite = true;

      const { siteType, siteId } = this.siteData || {};
      switch (siteType) {
        case "B4":
          this.getBsiteCategorys(siteId);
          break;
        case "B2":
          this.getBsiteCategorys();
          break;
        default:
          this.bsiteShopItemsTitle = "本站商品分類";
          this.shopItemsTitle = "友商推薦商品分類";
          this.getBsiteCategorys(siteId);
      }
    } else {
      this.getBsiteCategorys();
    }
  },
  props: {
    supplierData: {
      type: Object,
    },
  },
  methods: {
    goCategoryPage(url, siteType = 1 /* 1 friDay本站 2 bSite本站 */) {
      if (this.siteData && siteType === 1) {
        url += "?catg=uni";
      }
      window.location.href = url;
    },
    // 取得指定網站的目錄
    async getBsiteCategorys(siteId = "-") {
      const findCache1 = this.api.ai.getCache(`ai_category_${siteId}_cache1`);
      if (findCache1) {
        this.parseBsiteCategorys(findCache1, 1);
      }
      const findCache2 = this.api.ai.getCache(`ai_category_${siteId}_cache2`);
      if (findCache2) {
        this.parseBsiteCategorys(findCache2, 2);
      }

      if (findCache1 || findCache2) return false;

      const data = await this.api.ai.getAiData("getvlist", {
        target: "pseudoid",
        list_fun: "allCategory",
        list_args: "content",
        list_remote: "b01",
        if_bWeb: "1",
        site_id: siteId,
      });

      const { catg1, catg2, groupings } = data;

      // 有供應商所產生的[本站的樹]
      if (catg1) {
        console.log("有供應商所產生的[本站的樹]", catg1);
        this.api.ai.setCache(`ai_category_${siteId}_cache1`, catg1, 300);
        this.parseBsiteCategorys(catg1, 1);
      }

      // 有供應商所產生的[聯合曝光的樹]
      if (catg2) {
        console.log("有供應商所產生的[聯合曝光的樹]", catg2);
        this.api.ai.setCache(`ai_category_${siteId}_cache2`, catg2, 300);
        this.parseBsiteCategorys(catg2, 2);
      }

      // 沒有供應商 catg1 & catg2 都是null 時,提供給網站使用的default 樹 (或者是site id 傳入"-")
      if (groupings) {
        console.log(
          "沒有供應商 catg1 & catg2 都是null 時,提供給網站使用的default 樹 ",
          groupings
        );
        this.parseBsiteCategorys(groupings);
        this.api.ai.setCache(`ai_category_${siteId}_cache`, groupings, 300);
      }

      //  save to cache
    },
    parseBsiteCategorys(data, block = 1 /* 1=bsiteShopItems, 2=shopItems */) {
      const grouping = Object.entries(data[0]).map((cat) => {
        const id = cat[0];
        const val = cat[1];
        const obj = this.getBottom(id, data[0]);
        const url = this.siteData
          ? `/${this.siteData.urlSuffix}/category/${id}`
          : `/category/${id}`;

        return {
          cid: val.id,
          name: val.name,
          url: url,
          img_url: obj.img_url,
        };
      });

      if (block === 1) {
        this.bsiteShopItems = grouping.filter((v) => v);
      } else {
        this.shopItems = grouping.filter((v) => v);
      }
    },
    //找到該目錄結構最底層(為了取圖片)
    getBottom(ca, tr) {
      if (!tr[ca]?.sub || Object.keys(tr[ca]?.sub).length === 0) {
        return tr[ca];
      }
      const newCa = Object.keys(tr[ca]?.sub)[0];
      const newTr = tr[ca].sub;

      return this.getBottom(newCa, newTr);
    },
  },
  computed: {
    // 100%-navigationBottom's height-keyword's height
    categoryHeight() {
      return "calc(100% - 61px - 106px)";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/color";
.wrap {
  position: fixed;
  z-index: 2;
  top: 0px;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
}

.category-shop {
  color: $web_main;
  overflow: auto;
  padding-bottom: 60px;
  label {
    display: inline-block;
    padding: 15px 15px 10px 15px;
    font-size: 1.4rem;
  }

  &__items {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    font-size: 1.3rem;
    &::-webkit-scrollbar {
      display: none;
    }
    li {
      margin-bottom: 10px;
      list-style-type: none;
      > div {
        position: relative;
        width: 75%;
        height: 0px;
        padding-bottom: 75%;
        margin: 0 auto;
        border: 1px solid $ghost;
        border-radius: 5px;
        img {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 5px;
        }
      }
      p {
        color: $web_main;
        text-align: center;
        padding: 0 10px;
      }
    }
  }
}
</style>
