<template>
  <div v-if="data && data.length > 0" class="productMenu">
    <ul>
      <li v-for="(item, idx) of processData" :key="idx">
        <div class="header">
          <p>{{ item.category.itemName }}</p>
        </div>
        <div class="list">
          <productItem :itemList="item.products" :showCampaignQtyIcon="true" />
          <span class="lookMore" v-if="data[idx].products.length >= 10" @click="gotoBPage(item.category.url)">{{item.category.hasSub?'看更深...':'看更多...'}}</span>
        </div>
        <!-- 相關曝光活動 -->
        <div v-if="item.proLinks.length" class="promotion-links">
          <h3>和「{{ item.category.itemName }}」的相關活動</h3>
          <ul>
            <li v-for="(obj, k) of item.proLinks" :key="k">
              <a :href="obj.campUrl">
                {{ obj.campaignName }}》
              </a>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <div id="aiPromotionBottomLine"></div>
  </div>
</template>

<script>
import productItem from "../common/aiProductItem.vue";
export default {
  name: "productMenu",
  data() {
    return {};
  },
  created() {},
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    //點擊該類別的看更多
    gotoBPage(url) {
      location.href = url;
    },
  },
  computed: {
    processData() {
      return this.data.map((ele) => {
        const products = ele.products.slice(0, 9);
        return { category: ele.category, proLinks: ele.proLinks, products };
      });
    },
  },
  components: {
    productItem,
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/color";
.productMenu {
  .header {
    padding: 8px 10px;
    font-size: 1.6rem;
    color: $black;
    background: $mercury;
  }
  .list {
    padding: 10px;
    .lookMore {
      display: inline-block;
      width: 100%;
      margin-top: 15px;
      color: $brightblue;
      font-size: 1.3rem;
      text-align: right;
    }
  }
}

.promotion-links {
  width: 100%;
  padding: 10px 20px 25px;
  font-size: 1.4rem;
  border-top: 1px dashed $sliver;
  box-sizing: border-box;
  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      list-style: none;
      width: 50%;
      margin-bottom: 10px;
      a {
        color: $blue;
        text-decoration: none;
        white-space: nowrap; /* 防止文本換行 */
        overflow: hidden; /* 隱藏超出範圍的文本 */
        text-overflow: ellipsis;
        display: inline-block;
        width: 100%;
      }
    }
  }
}
</style>
