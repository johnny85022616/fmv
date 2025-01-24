<template>
  <div class="fourteenShop">
    <div class="fourteenShop__products" v-if="fourteenShopData && fourteenShopData.length > 0">
      <ul class="fourteenShop__products__block-list">
        <li v-for="item in fourteenShopData" :key="item.main.cateId">
          <template v-if="(item.mainSub && item.mainSub.length === 2) || item.main.cateId === 9999">
            <pictureThreeBox v-if="supplierData && item" :supplierData="supplierData" :item="item" :lazy="false" />
          </template>
        </li>
        <div v-if="!isApiOk" class="loading">
          <i class="loading-img"></i>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
/*
  只要有三筆資料就顯示1帶2區塊，不足3筆丟暢銷夯品
*/
import pictureThreeBox from "../pictureThreeBox.vue";
export default {
  name: "homeProductList",
  data() {
    return {
      fourteenShopData: [],
      scatteredData: [],
      tempData: {},
      category: null,
      isApiOk: true,
      isShowLoading: false,
    };
  },
  created() {
    this.getData();
  },
  props: {
    supplierData: {
      type: Object,
    },
    barsLevel: {
      type: String,
    },
  },
  methods: {
    async getData() {
      const { supplierId, siteId } = this.supplierData;
      this.api.ai
        .getCampaignMixedProducts({ supplierId, siteId, supplier_y: 1 })
        .then((data) => {
          this.parseData(data);
        });
    },
    parseData(data) {
      if (!data) return false;

      // 定義自動分類的映射
      const categoryMap = {
        mid: { id: "auto_category_id_M", name: "auto_category_id_M_c" },
        bid: { id: "auto_category_id", name: "auto_category_id_c" },
        default: { id: "auto_category_id_L", name: "auto_category_id_L_c" },
      };

      const { id: autoCategoryId, name: autoCategoryName } =
        categoryMap[this.barsLevel] || categoryMap.default;

      let tempData = new Map();

      const formatPrice = (price) =>
        price ? this.tools.priceFormat(price) : null;

      data.forEach((v) => {
        const categoryId = v[autoCategoryId];
        if (!tempData.has(categoryId)) {
          tempData.set(categoryId, {
            main: {
              cateId: categoryId,
              cateName: v[autoCategoryName],
              name: v.name,
              pid: v.pid,
              image_url: v.image_url,
              price: formatPrice(v.price),
              hasSub: true,
            },
            mainSub: [],
            sub: [],
          });
        }

        const category = tempData.get(categoryId);
        const formattedData = {
          name: v.name,
          pid: v.pid,
          image_url: v.image_url,
          price: formatPrice(v.price),
        };

        if (category.mainSub.length < 2) {
          category.mainSub.push(formattedData);
        } else {
          category.sub.push({
            ...formattedData,
            campaignQty: v.campaignQty,
          });
        }
      });

      const groupData = Array.from(tempData.values()).map((v) => {
        if (v.sub.length > 0) {
          const calcSubRows = Math.min(Math.floor(v.sub.length / 3) * 3, 9);
          return { ...v, sub: v.sub.slice(0, calcSubRows) };
        }
        return v;
      });

      // 添加推薦品數據
      groupData.push({
        main: {
          cateId: 9999,
          cateName: "暢銷夯品推薦",
        },
        mainSub: [],
        sub: [],
      });

      this.fourteenShopData = groupData;

      // 設置當前分類並獲取熱銷推薦
      this.nowCategory = groupData[0].main.cateId;
      this.getHotRecommendation();
    },
    // 取得暢銷推薦
    async getHotRecommendation() {
      const postData = {
        q1_x: 0.5,
        supplier_y: 1,
        list_num: 15,
        type: 3,
        ui_cnt: "homeProductList_hotRecommendation",
      };

      postData.filter = this.api.ai.composeBListFilter(
        this.supplierData.supplierId
      );

      const data = await this.api.ai.getAiData("getalist", postData);
      if (!data) return;

      this.fourteenShopData[this.fourteenShopData.length - 1].sub = data;
    },
    goProductPage(pid) {
      this.tools.goProductPage(pid);
    },
  },
  components: {
    pictureThreeBox,
  },
};
</script>

<style lang="scss" scoped>
@import "../../../style/color";
@import "../../../style/mixin";

.fourteenShop {
  margin-top: 10px;
  background: $white;

  &__products {
    &__block-list {
      position: relative;

      > li {
        &:last-of-type {
          margin-bottom: 70px;
        }
      }

      li {
        margin-bottom: 10px;
      }
    }
  }
}

ul {
  li {
    list-style-type: none;
  }
}

.price {
  color: $red;
  font-size: 2rem;

  &::before {
    content: "$";
    margin-right: 2px;
  }
}

.loading {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 90px;
  position: relative;

  .loading-img {
    top: -20px;
    position: absolute;
    width: 20px;
    height: 20px;
    background: url(../../../images/icons/ajax-loader.gif) center/20px no-repeat;
  }
}
</style>
