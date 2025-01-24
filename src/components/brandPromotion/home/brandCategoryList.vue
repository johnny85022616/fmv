<template>
  <div class="category-keywords">
    <label>專櫃分類</label>
    <div class="category-keywords__container">
      <div class="category-keywords__items" :style="[{ width: keywordsBlockWidthPixels==='0px'? 'auto': keywordsBlockWidthPixels }]">
        <span v-for="(item, id) in category" :key="id" @click="()=>changePageRouter(id)" :ref="`a${id}`">
          {{item}}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "category",
  data() {
    return {
      keywordsBlockWidthPixels: "0px", // 熱門關鍵字捲軸寬度計算
    };
  },
  created() {},
  mounted() {
    let allLength = 0;
    const objectKeys = Object.keys(this.category);
    objectKeys.map((id) => {
      allLength += this.$refs[`a${id}`][0].offsetWidth;
    });
    allLength = Math.floor((allLength + 5 * objectKeys.length) / 2) + 100; //每一個元素寬度相加和每個元素間的margin-right(5px)相加除以兩行後加上原有padding-right(20px) + 100(buffer)
    this.keywordsBlockWidthPixels = `${allLength}px`;
  },
  props: {
    category: {
      type: Object,
    },
    supplierData: {
      type: Object,
    },
    barsLevel: {
      type: String,
      default() {
        return 0;
      },
    },
  },
  methods: {
    changePageRouter(id) {
      location.href = `/shop/${this.supplierData.urlSuffix}/category/${id}`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../style/color";

.category-keywords {
  background-color: #555555;
  padding: 10px 0;
  display: flex;

  label {
    width: 20px;
    background-image: url("../../../images/icons/07-hotKeyBg.png");
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    writing-mode: vertical-rl;
    display: inline-block;
    padding: 8px 13px 8px 4px;
    color: $white;
    font-size: 1.4rem;
  }

  &__container {
    box-sizing: border-box;
    width: auto;
    min-height: 85px;
    max-height: calc((1.3rem + 18px) * 2);
    margin: auto 0;
    padding-top: 5px;
    padding-left: 5px;
    overflow-x: auto;
    overflow-y: hidden;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__items {
    position: relative;
    width: 100%;
    padding-right: 20px;
    font-size: 1.3rem;

    span {
      line-height: 30px;
      display: inline-block;
      background-color: $white;
      color: $web_main;
      border-radius: 25px;
      margin: 0px 5px 15px 0;
      padding: 0 8px;
    }
  }
}
</style>
