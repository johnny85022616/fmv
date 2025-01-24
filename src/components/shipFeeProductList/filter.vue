<template>
  <div :class="['category-keywords']">
    <label>過濾</label>
    <div class="category-keywords__container">
      <div class="category-keywords__items" :style="[{ width: keywordsBlockWidthPixels }]">
        <span v-for="(item, idx) in keywordList" :key="idx" :class="[{ active: nowSelectedKeyword === item }]" @click="setNowKeyword(item)">
          {{ item }}
        </span>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "campaignFilter",
  data() {
    return {
      keywordList: null,
      keywordsBlockWidthPixels: "0px", // 熱門關鍵字捲軸寬度計算
      nowSelectedKeyword: null,
    };
  },
  created() {
    this.composeKeywordList();
  },
  props: {
    keywordArr: {
      type: Array,
    },
  },
  methods: {
    // 關鍵字
    setNowKeyword(str) {
      if (this.nowSelectedKeyword === str) {
        this.nowSelectedKeyword = null;
        this.$emit("changeKeyword", this.nowSelectedKeyword, false);
        return;
      }
      this.nowSelectedKeyword = str;
      this.$emit("changeKeyword", this.nowSelectedKeyword, true);
    },
    //組成品牌checkboxList資料
    composeKeywordList() {
      let keywordArr = this.keywordArr;
      const keywordsBlockWidth = keywordArr.reduce((p, v) => {
        return p + this.tools.strlen(v);
      }, 0);

      this.keywordsBlockWidthPixels =
        (Math.floor(keywordsBlockWidth) * 8.3) / 2 + "px";
      this.keywordList = keywordArr;
    },
    clearNowSelectedKeyword() {
      this.nowSelectedKeyword = null;
    },
  },
  watch: {
    keywordArr() {
      this.composeKeywordList();
    },
  },
};
</script>


<style lang="scss" scoped>
@import "../../style/color";

.active {
  color: $red;
}

.category-keywords {
  background-color: rgba(115, 115, 115, 0.4);
  padding: 3px 0;
  margin-bottom: 15px;
  display: flex;

  label {
    width: 15px;
    display: inline-block;
    padding: 10px;
    color: $white;
    font-size: 1.5rem;
  }

  &__container {
    box-sizing: border-box;
    width: 100%;
    min-height: 40px;
    max-height: calc((1.3rem + 18px) * 2);
    margin: auto 0;
    padding-top: 5px;
    overflow-x: auto;
    overflow-y: hidden;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__items {
    position: relative;
    width: 100%;
    font-size: 1.3rem;

    span {
      display: inline-block;
      padding: 3px 8px;
      background-color: $white;
      color: $web_main;
      border-radius: 25px;
      margin: 0px 5px 5px 0;

      &.active {
        color: $white;
        background-color: $red;
      }
    }
  }
}
</style>