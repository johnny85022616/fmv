<template>
  <div class="brands">
    <navigation :windowY="200" :isComponentMaskShow="false" :directShowSearchInput="true" :isBackBtnShow="true" />
    <p class="notice">
      [逛專櫃]是由AI自動開專櫃，提供您線上購物體驗。這裡的專櫃產品鮮明而精美，達成您的滿足感和品味享受旅程。立刻開始逛逛去～～
    </p>
    <counterRedBar />
    <div v-if="promoData" class="advertise">
      <a :href="promoData.url" target="_blank"><img :src="`${promoData.img}?${tools.version()}`" alt=""></a>
    </div>
    <div class="search">
      <p>找專櫃</p>
      <div class="input">
        <input type="text" placeholder="搜尋專櫃名稱" v-model="inputVal">
        <img data-v-deb93296="" src="https://event.shopping.friday.tw/event/CP/common/mobile_icon/search-gy.svg">
      </div>
    </div>
    <div class="brandList">
      <template v-if="filteredData&&Object.keys(filteredData).length>0">
        <div class='category' v-for="item in filteredData" :key="item.categoryId">
          <p>{{item.categoryName}}</p>
          <ul>
            <li v-for="brnadItem in item.list" :key="brnadItem.supplierId" @click="gotoPromoPage(brnadItem.urlSuffix)">
              <div class="image" :style="{ backgroundColor: `${brnadItem.headerColor ? brnadItem.headerColor : '#ddd5cc'}`}">
                <img v-lazy="brnadItem.logoMobile" :alt="brnadItem.siteName" @click="()=>changeBrand(brnadItem)">
              </div>
              <span class="brandName">{{brnadItem.siteName}}</span>
            </li>
          </ul>
        </div>
      </template>
      <template v-else-if="inputVal&&filteredData&&Object.keys(filteredData).length === 0">
        <p class="noBrand">無相關專櫃</p>
      </template>
    </div>
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue";
import counterRedBar from "./components/brandPromotion/counterRedBar.vue";
export default {
  name: "brands",
  data() {
    return {
      brandList: null,
      inputVal: null,
      allCategory: null,
      filteredData: null,
      promoData: null,
    };
  },
  async created() {
    this.setPromoData();
    await this.getCategorys();
    await this.getBrandData();
    this.inputVal = ""; //等資料準備好觸發第一次watch(不用immedialy是因為immedialy在資料回來前就會觸發第一次watch造成資料錯誤)
  },
  methods: {
    async setPromoData() {
      const data = await this.api.promotion.getPromoExpos("brands");
      const { mobile } = data || {};
      if (mobile) {
        this.promoData = mobile;
      }
    },
    //取得廠商資料
    async getBrandData() {
      const findCache = this.api.ai.getCache("brandWall_cache");
      if (findCache) {
        this.parseData(findCache);
        this.parseTopicData(findCache);
        return true;
      }
      let bd = await this.tools.getBwebApiData("GET", "");
      if (bd) {
        this.api.ai.setCache("brandWall_cache", bd, 180);
        this.parseData(bd);
        this.parseTopicData(bd);
      }
    },
    //取得所有類別
    async getCategorys() {
      const findCache = this.api.ai.getCache("category_cache");
      if (findCache) {
        this.allCategory = findCache[0];
        return false;
      }

      const postData = {
        target: "pseudoid",
        list_fun: "allCategory",
        list_args: "content",
        list_remote: "b01",
        supplier_id: "-",
        if_bWeb: "1",
        site_id: "-",
      };

      const data = await this.api.ai.getAiData("getvlist", postData);
      const { groupings } = data;
      if (!groupings) {
        console.log("no groupings data");
        return;
      }
      this.api.ai.setCache("category_cache", groupings, 300);
      this.allCategory = groupings[0];
    },
    //利用id取得category名稱
    getCategoryNameById(id) {
      return this.allCategory[id].name;
    },

    //點擊品牌後更換品牌
    changeBrand(e, brandData) {
      if (!this.isHorizon) {
        e.preventDefault();
        this.$emit("changeBrand", brandData);
        window.scrollTo(0, 0);
      }
    },
    //過濾可用的brand
    parseData(bd) {
      bd = bd.filter(
        (ele) =>
          ele.isUnderCounstruction === "N" &&
          ["B1", "b1"].includes(ele.siteType) &&
          ele.supplierId &&
          ele.skuCount > 10
      );
      this.brandList = bd;
    },
    parseTopicData(bd) {
      bd = bd.filter(
        (ele) => ele.isUnderCounstruction === "N" && ele.siteType === "B4"
      );
      this.brandList = [...bd, ...this.brandList];
    },
    //從所有品牌或filter出來的品牌種中整理出各品牌分類
    composeBrandWallCategory(brandList) {
      const categoryObj = {};
      for (let brand of brandList) {
        if (brand.siteType !== "B4") {
          if (!categoryObj[brand.categoryIdL]) {
            categoryObj[brand.categoryIdL] = {
              categoryName: "",
              list: [],
              categoryId: brand.categoryIdL,
            };
            categoryObj[brand.categoryIdL].list.push(brand);
            categoryObj[brand.categoryIdL].categoryName =
              this.getCategoryNameById(brand.categoryIdL);
          } else {
            categoryObj[brand.categoryIdL].list.push(brand);
            categoryObj[brand.categoryIdL].categoryName =
              this.getCategoryNameById(brand.categoryIdL);
          }
        } else {
          if (!categoryObj["topic"]) {
            categoryObj["topic"] = {
              categoryName: "主題網站",
              list: [],
              categoryId: 999,
            };
            categoryObj["topic"].list.push(brand);
          } else {
            categoryObj["topic"].list.push(brand);
          }
        }
      }
      return categoryObj;
    },
    // 打開friDay主站
    openFridaySite(evt) {
      if (evt) evt.preventDefault();
      window.location.href = "/";
    },
    gotoPromoPage(urlSuffix) {
      location.href = `brandPromotion?urlSuffix=${urlSuffix}`;
    },
  },
  watch: {
    inputVal: {
      handler: function () {
        if (this.inputVal) {
          const brandList = this.brandList.filter(
            (item) =>
              item.siteName.includes(this.inputVal) ||
              item.websiteGoogleName?.includes(this.inputVal)
          );
          const cd = this.composeBrandWallCategory(brandList);
          this.filteredData = cd;
          return false;
        }
        const cd = this.composeBrandWallCategory(this.brandList);
        this.filteredData = cd;
      },
    },
  },
  components: {
    navigation,
    counterRedBar,
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
.brands {
  margin-bottom: 60px;
  .advertise {
    width: 100%;
    a {
      display: inline-block;
      width: 100%;
      img {
        width: 100%;
      }
    }
  }
  .notice {
    padding: 10px;
    font-size: 1.3rem;
    background-color: $varden;
  }
  .search {
    margin-top: 15px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    p {
      font-size: 1.8rem;
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
  .brandList {
    min-height: 100vh;
    padding: 15px;
    display: flex;
    flex-direction: column;
    .category {
      display: flex;
      flex-direction: column;
      align-items: center;
      p {
        margin: 40px 0px 10px 0;
        align-self: flex-start;
        font-size: 2rem;
      }
      &:first-of-type {
        p {
          margin: 10px 0;
        }
      }
      ul {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 20px;
        width: 100%;
        list-style-type: none;
        li {
          .image {
            position: relative;
            display: block;
            width: 100%;
            padding-top: 100%;
            cursor: pointer;
            border-radius: 10px;
            border: 1px solid $sliver;
            img {
              border-radius: 10px;
              position: absolute;
              left: 0;
              top: 0;
              right: 0;
              bottom: 0;
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }
          .brandName {
            font-size: 1.5rem;
            display: inline-block;
            width: 100%;
            text-align: center;
            margin-top: 10px;
          }
        }
      }
    }
    .noBrand {
      font-size: 2rem;
      align-self: center;
      margin-top: 200px;
    }
  }
}
</style>
