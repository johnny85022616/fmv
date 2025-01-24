<template>
  <div class="productFilterList">
    <categoryFilter v-if="filterData" :filterData="filterData" @setSorting="setSorting" />
    <div class="aiCategoryProduct__wrap">
      <productItem v-if="filterData" :itemList="filterData" :layoutType="layoutType" />
    </div>
  </div>
</template>

<script>
import productItem from "../../components/common/aiProductItem.vue";
import categoryFilter from "./filter.vue";
export default {
  name: "productFilterList",
  data() {
    return {
      sortType: "default",
      layoutType: "two",
      isFilterShow: false,
    };
  },
  created() {},
  props: {
    filterData: {
      type: Array,
    },
  },
  methods: {
    // 搜尋排序
    setSorting(payload) {
      this.$emit("setSorting", payload);
    },
  },

  components: {
    productItem,
    categoryFilter,
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/color";

.aiCategoryProduct {
  &__wrap {
    padding: 0 20px 20px;
    margin: 0 0 60px;
  }
}
</style>
