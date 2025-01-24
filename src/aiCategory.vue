<template>
  <div class="aiCategory">
    <navigation :windowY="200" :directShowSearchInput="true" @stopBodyScroll="stopBodyScroll" :openMenu="isShowMenu" />

    <div class="category-wrap">
      <h1>{{ titleName }}</h1>
      <button @click="openMenu">看全部分類</button>
    </div>
    <ul class="lPromotion" v-if="items && items.lPromotion">
      <li v-for="(item, index) in items.lPromotion" :key="index">
        <a :href="item.url">{{ item.urlName }}</a>
      </li>
    </ul>
    <div class="category-items">
      <div v-for="(v, i) in items" :key="i" class="category-item">
        <p v-show="false">{{v.id}}</p>
        <h3>{{ v.name }}</h3>
        <ul class="mPromotion">
          <li v-for="(mp, idx) in v.mPromotion" :key="idx">
            <a :href="mp.url">{{ mp.urlName }}</a>
          </li>
        </ul>
        <ul>
          <li v-for="(s, k) in v.sub" :key="k" @click="goPage(s.url)">
            <img v-lazy="s.image_url" :alt="s.name" />
            <span>{{ s.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
export default {
  name: "aiCategory",
  data() {
    return {
      isBsite: false,
      categoryId: null,
      lid: null,
      titleName: "",
      items: {},
      isShowMenu: false,
      windowY: 0,
      isScoll: false,
    };
  },
  created() {
    if (this.siteData) {
      this.isBsite = true;
    }
    const { categoryId } = this.getLNum();
    this.categoryId = categoryId;
    const findCache = this.api.ai.getCache(`category_${categoryId}_list_cache`);
    if (findCache) {
      this.parseData(findCache);
    } else {
      this.getCategoryData();
    }
    window.addEventListener(
      "scroll",
      () => {
        const wy = window.scrollY;
        this.windowY = wy;
      },
      {
        passive: true,
      }
    );
  },
  props: {},
  methods: {
    openMenu() {
      this.isShowMenu = true;
    },
    stopBodyScroll(opt) {
      if (opt && opt === "close") {
        this.isShowMenu = false;
      }
    },
    goPage(url) {
      window.location.href = url;
    },
    //取得大目錄和中目錄編號
    getLNum() {
      let categoryId;
      if (window.isLocal) {
        const param = this.tools.urlSearchToObj();
        categoryId = param.lid;
      } else {
        const reg = location.href.match(/((L|M|B)[\d]{4})/); //取得categoryId
        if (reg && reg.length > 0) {
          categoryId = reg[1];
        }
      }
      return {
        categoryId,
      };
    },
    async getCategoryData() {
      const { siteType, isOthersExposeToMe } = this.siteData
        ? this.siteData
        : {};
      const isCatg = /catg=uni/i.test(location.search);
      let postData = {
        type: "2",
        q1_x: 0.5,
        supplier_y:
          (this.siteData && !isCatg) ||
          ((siteType === "B1" || siteType === "b1") &&
            isOthersExposeToMe === "N")
            ? 1
            : 0, // 若為bSite 且沒有帶 catg=uni 就設定為 1
        list_num: 300,
      };
      if (this.siteData && this.siteData.supplierId && !isCatg) {
        postData.filter = {
          k: "1010",
          v: [this.siteData.supplierId, "", this.categoryId, ""],
        };
      } else {
        postData.filter = { k: "0010", v: ["", "", this.categoryId, ""] };
      }

      const data = await this.api.ai.getAiData("getalist", postData);
      if (data && data.length > 0) {
        this.parseData(data);
        this.api.ai.setCache(
          `category_${this.categoryId}_list_cache`,
          data,
          300
        );
      }
    },
    async parseData(data) {
      const { urlSuffix } = this.siteData || {};
      if (!data) return false;
      let tempData = {};

      for (let v of data) {
        if (v.auto_category_id_M) {
          if (this.titleName === "") {
            this.titleName = v.auto_category_id_L_c;

            if (!this.isBsite) {
              const lp = await this.api.ai.getAiPromotionApi(
                v.auto_category_id_L
              );
              if (lp && lp.length > 0) {
                tempData.lPromotion = lp;
              }
            }
          }
          if (!tempData[v.auto_category_id_M]) {
            tempData[v.auto_category_id_M] = {
              id: v.auto_category_id_M,
              name: v.auto_category_id_M_c,
              sub: {},
            };
          }
          if (!tempData[v.auto_category_id_M].sub[v.auto_category_id]) {
            tempData[v.auto_category_id_M].sub[v.auto_category_id] = {
              name: v.auto_category_id_c,
              image_url: v.image_url,
              url: `${urlSuffix ? `/${urlSuffix}` : ""}/category/${
                v.auto_category_id_L
              }/${v.auto_category_id_M}/${v.auto_category_id}${
                location.search
              }`,
            };
          }
        }
      }
      this.items = tempData;

      if (!this.isBsite) {
        this.getFirstfourPromotionCategory();
      }
    },

    async getFirstfourPromotionCategory() {
      for (const [index, ele] of Object.values(this.items).entries()) {
        if (index < 4) {
          if (ele.id) {
            const mb = await this.api.ai.getAiPromotionApi(ele.id);
            if (mb && mb.length > 0) {
              this.$set(ele, "mPromotion", mb);
            }
          }
        }
      }
    },
    async getOtherPromotionCategory() {
      for (const [index, ele] of Object.values(this.items).entries()) {
        if (index >= 4) {
          const mb = await this.api.ai.getAiPromotionApi(ele.id);
          if (mb && mb.length > 0) {
            this.$set(ele, "mPromotion", mb);
          }
        }
      }
    },

    async getPromotionCategory(categoryId) {
      const data = await fetch(
        `https://front.shopping.friday.tw/frontendapi/ai/promotion/url/${categoryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res && res.resultData) {
            return res.resultData;
          }
        })
        .catch((err) => {
          console.error(`getKeyWordByPromotionId faliure.123`);
          console.error(err);
        });
      return data;
    },
  },

  watch: {
    windowY() {
      if (!this.isScoll) {
        this.isScoll = true;
        this.getOtherPromotionCategory();
      }
    },
  },
  components: {
    navigation,
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
@import "./style/mixin";

.category-wrap {
  position: relative;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h1 {
    color: $dodger-blue;
    font-size: 1.8rem;
  }

  button {
    padding: 4px 8px;
    border: 0;
    border-radius: 10px;
    color: $web_main;
    background-color: $alto;
  }
}

.category-items {
  padding: 0 20px 40px;

  .category-item {
    margin-bottom: 20px;
  }

  h3 {
    margin-bottom: 10px;
    color: $web_main;
    font-size: 1.5rem;
  }

  ul {
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    li {
      margin-bottom: 15px;
      list-style-type: none;
      text-align: center;

      span {
        font-size: 1.3rem;
        text-align: center;
        @include font-break(2);
      }
    }
  }

  img {
    width: 100px;
    height: 100px;
    border: 1px solid $web_border;
    border-radius: 5px;
    object-fit: cover;
  }
}

.lPromotion {
  padding: 0 20px;
  list-style-type: none;

  li {
    margin-bottom: 5px;

    a {
      font-size: 1.6rem;
      color: $web_main;
      text-decoration: none;

      &::before {
        display: inline-block;
        position: relative;
        margin-right: 8px;
        content: "◆";
        font-size: 11px;
      }
    }
  }
}

.mPromotion {
  display: block !important;

  li {
    margin-bottom: 15px;

    a {
      display: flex;
      align-items: center;
      color: $web_main;
      font-size: 1.5rem;
      text-decoration: none;

      &::before {
        display: inline-block;
        position: relative;
        margin-right: 8px;
        content: "◆";
        font-size: 11px;
      }
    }
  }
}
</style>
