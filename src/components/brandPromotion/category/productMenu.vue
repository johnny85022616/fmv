<template>
  <div v-if="data && data.length > 0" class="productMenu">
    <ul>
      <li v-for="(item, idx) of processData" :key="idx">
        <div class="header">
          <p>{{ item.category.itemName }}</p>
        </div>
        <div class="list">
          <productItem :itemList="item.products" />
          <span class="lookMore" v-if="data[idx].products.length >= 10" @click="gotoBPage(item.category.url)">看更多...</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import productItem from "../../common/aiProductItem.vue";
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
        return { category: ele.category, products };
      });
    },
  },
  components: {
    productItem,
  },
};
</script>

<style lang="scss" scoped>
@import "../../../style/color";
.productMenu {
  .header {
    padding: 12px 10px;
    font-size: 1.8rem;
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
</style>
