<template>
  <div>
    <div class="category-keywords">
      <label>過濾</label>
      <div class="category-keywords__container">
        <div class="category-keywords__items" :style="[{ width: keywordsBlockWidthPixels }]" ref="items">
          <span v-for="(item, idx) in keywordArr" :key="idx" :class="[{ active: nowSelectedKeyword === item }]" ref="item" @click="setNowKeyword(item)">
            {{ item }}
          </span>
        </div>
      </div>
    </div>
    <div class="keyword-input">
      <span>搜尋<br>活動商品</span>
      <div>
        <input v-model="nowInputKeyword" @keyup.enter="goSearch" />
        <img src="https://event.shopping.friday.tw/event/CP/common/mobile_icon/search-gy.svg" @click="goSearch" />
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "campaignFilter",
  data() {
    return {
      keywordsBlockWidthPixels: "0px", // 熱門關鍵字捲軸寬度計算
      nowSelectedKeyword: null,
      nowInputKeyword: '',
    };
  },
  created() {},
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
      this.nowInputKeyword = null;
      this.$emit("changeKeyword", this.nowSelectedKeyword, true);
    },
    // 手動輸入關鍵字
    goSearch() {
      const kw = this.nowInputKeyword.replace(/^\s/, '');
      if (kw) {
        this.nowSelectedKeyword = null;
        this.$emit("changeKeyword", kw, true);
        return;
      }
      this.$emit("changeKeyword", '', false);
    }
  },
  /*
    重新計算寬度
    一開始將category-keywords__items設為inline-flex是為了讓所有span一字排開不會造成擠壓計算出每個span正常狀況下的寬度但最後還是需要設為block才會讓span在超出計算寬度時換行
  */
  //重新計算寬度(一開始將)
  mounted() {
    const allItems = this.$refs["item"];
    const allWidth = allItems.reduce((p, v) => {
      const eleWidth = v.clientWidth;
      return p + (eleWidth + 8);
    }, 0);
    this.keywordsBlockWidthPixels = allWidth / 2 + "px";
    this.$refs["items"].style.display = "block";
  },
};
</script>


<style lang="scss" scoped>
@import "../../style/color";

.active {
  color: $red;
}

.keyword-input {
  display: flex;
  padding: 3px 15px;
  align-items: center;
  margin-bottom: 5px;
  span {
    flex: 0 0 20%;
    font-size: 1.2rem;
    font-weight: 500;
  }
  div {
    flex: 1 1 auto;
    position: relative;
    input {
      display: inline-flex;
      box-sizing: border-box;
      width: 100%;
      height: 30px;
      border: 2px solid rgba(255, 0, 0, 0.5);
      border-radius: 5px;
      background-color: $white;
      padding-left: 10px;
      font-size: 1.5rem;
    }
    img {
      position: absolute;
      top: 6px;
      right: 4px;
    }
  }
}

.category-keywords {
  background-color: rgba(115, 115, 115, 0.4);
  padding: 3px 0;
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
    display: inline-flex;
    span {
      display: inline-block;
      padding: 3px 8px;
      background-color: $white;
      color: $web_main;
      border-radius: 25px;
      margin: 0px 5px 5px 0;
      white-space: nowrap;
      &.active {
        color: $white;
        background-color: $red;
      }
    }
  }
}
</style>