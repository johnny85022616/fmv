<template>
  <div>
    <div class="categoryFilter">
      <fullscreendialog v-if="showDialog" :isFullscreen="true" @closeDialog="closeDialog">
        <template v-slot:header>品牌選擇</template>
        <template v-slot:body>
          <ul class="brandList" v-if="brandList">
            <li class="brandList__item" v-for="(item, index) in brandList" :key="index">
              <checkbox :isActive="item.isChose" :name="item.name" :callback="() => changeBrandChose(index)"></checkbox>
            </li>
          </ul>
          <div class="button">
            <span class="btns" @click="cancelBrand">清除條件</span>
            <span class="btns" @click="confirmBrand">確認</span>
          </div>
        </template>
      </fullscreendialog>
      <div class="categoryFilter__sort">
        <span @click="changeSortType('default')" :class="[{ active: sortType.sortType === 'default' }]">預設排序</span>
        <span @click="changeSortType('new')" :class="[{ active: sortType.sortType === 'new' }]">最新品</span>
        <span @click="changeSortType('price')" :class="[{ active: sortType.sortType === 'price' }]">價格<i :class="[
              { priceArrowUp: sortType.priceSmallToBig === true },
              { priceArrowDown: sortType.priceSmallToBig === false },
            ]"></i></span>
      </div>
      <div class="categoryFilter__filter">
        <span v-if="brandList && brandList.length > 1" :class="[
            'brand',
            { brandActive: filterType.brand && filterType.brand.length > 0 },
          ]" @click="openDialog">品牌<i class="triangle_down"></i></span>
        <layout @changeLayoutType="changeLayoutType" :layoutType="layoutType" />
      </div>
    </div>
    <div v-if="keywordList && keywordList.length" :class="['category-keywords']">
      <label>過濾</label>
      <div class="category-keywords__container">
        <div class="category-keywords__items" :style="[{ width: keywordsBlockWidthPixels }]">
          <span v-for="(item, idx) in keywordList" :key="idx" :class="[{ active: nowSelectedKeyword === item }]" @click="setNowKeyword(item)">
            {{ item }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fullscreendialog from "../common/fullscreenDialog.vue"; // 全畫面蓋版提示框
import checkbox from "../common/checkbox.vue";
import layout from "../common/layout.vue";
export default {
  name: "categoryFilter",
  data() {
    return {
      filterType: {
        brand: null, //選取出的品牌
        keyword: null, // 關鍵字過濾
      },
      sortType: {
        sortType: "default",
        priceSmallToBig: null, //排序方式(null:無 true:低到高 false:高到低)
      },
      brandList: null,
      keywordList: null,
      keywordsBlockWidthPixels: "0px", // 熱門關鍵字捲軸寬度計算
      nowSelectedKeyword: null,
      showDialog: false,
    };
  },
  created() {},
  props: {
    originData: {
      type: Array,
    },
    keywordData: {
      type: Array,
    },
    brandData: {
      type: Array,
    },
    filterData: {
      type: Array,
    },
    layoutType: {
      type: String,
    },
  },
  methods: {
    // 關鍵字
    setNowKeyword(kws) {
      location.href = location.pathname + "?keyword=" + encodeURIComponent(kws);
    },
    changeSortType(type) {
      if (["new", "price"].indexOf(type) !== -1) {
        const sortRule = {};

        switch (type) {
          // 排序價格
          case "price":
            if (
              this.sortType.priceSmallToBig === null ||
              this.sortType.priceSmallToBig === false
            ) {
              this.sortType.priceSmallToBig = true;
              sortRule.sorting = "PRICE_LOW";
            } else if (this.sortType.priceSmallToBig === true) {
              this.sortType.priceSmallToBig = false;
              sortRule.sorting = "PRICE_HIGH";
            }
            break;
          // 最新品
          case "new":
            this.sortType.priceSmallToBig = null;
            sortRule.sorting = "NEW_ARRIVAL";

            break;
        }

        this.sortType.sortType = type;
        this.$emit("setSorting", sortRule);
      } else {
        this.sortType.priceSmallToBig = null;
        this.sortType.sortType = type;
        this.$emit("setSorting", { sorting: "RELEVANT" });
      }
    },
    //關閉品牌視窗
    closeDialog() {
      this.showDialog = false;
      this.$emit("setFilterFullscreenOpen", false);
    },
    //開啟品牌視窗
    openDialog() {
      this.initBrand();
      this.showDialog = true;
      this.$emit("setFilterFullscreenOpen", true);
    },
    //改變temp brand 選取狀態
    changeBrandChose(index) {
      this.brandList[index].isChose = !this.brandList[index].isChose;
    },
    //確認要filter的brand
    confirmBrand() {
      this.filterType.brand = this.brandList.filter(
        (ele) => ele.isChose === true
      );
      this.closeDialog();
    },
    //取消所有brand
    cancelBrand() {
      this.brandList = this.brandList.map((ele) => {
        ele.isChose = false;
        return ele;
      });
      this.confirmBrand();
    },
    //變更要傳入aiProductItem的排版
    changeLayoutType(layoutType) {
      this.$emit("changeLayoutType", layoutType);
    },
    //每次打開時都重新設定一次打勾的，避免選了某品牌後按下叉叉，下次再打開時那個被取消的品牌還是打勾的
    initBrand() {
      for (const brand of this.brandList) {
        brand.isChose = false;
        if (this.filterType.brand && this.filterType.brand.length > 0) {
          for (const cb of this.filterType.brand) {
            if (brand.name === cb.name) {
              brand.isChose = true;
            }
          }
        }
      }
    },
  },
  computed: {},
  components: {
    fullscreendialog,
    checkbox,
    layout,
  },
  watch: {
    keywordData(n) {
      if (n && n.length > 0) {
        const finalKeywordArr = n.splice(0, 30);
        const keywordsBlockWidth = finalKeywordArr.reduce((p, v) => {
          return p + this.tools.strlen(v);
        }, 0);

        this.keywordsBlockWidthPixels =
          (Math.floor(keywordsBlockWidth) * 8.3) / 2 + "px";
        this.keywordList = finalKeywordArr;
      }
    },
    brandData(n) {
      if (n.length > 0) {
        this.brandList = n.map((v) => {
          return {
            name: v,
            isChose: false,
          };
        });
      }
    },
    filterType: {
      handler: function () {
        this.$emit("changeFilterData", this.filterType);
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/color";

.categoryFilter {
  background-color: $white;
  padding: 6px 10px;
  display: flex;
  justify-content: space-between;

  &__sort {
    display: flex;
    align-items: center;

    span {
      font-size: 1.5rem;
      padding: 0 10px;
      font-weight: bold;
    }

    .priceArrowUp {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyNy4zLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i5ZyW5bGkXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iNTBweCIgaGVpZ2h0PSI0My4zcHgiIHZpZXdCb3g9IjAgMCA1MCA0My4zIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MCA0My4zOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS7oo73kvZzpmbDlvbF7ZmlsbDpub25lO30NCgku5ZyT6KeSX3gwMDIwXzJfeDAwMjBf6buee2ZpbGw6I0ZGRkZGRjtzdHJva2U6IzIzMTgxNTtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9DQoJLuWNs+aZguWPjeWwhF94MDAyMF9Ye2ZpbGw6bm9uZTt9DQoJLuaflOWMluaWnOinkntmaWxsOnVybCgjU1ZHSURfMV8pO30NCgku6buD5piPe2ZpbGw6I0ZGRkZGRjt9DQoJLuiRieWtkF9HU3tmaWxsOiNGRkUxMDA7fQ0KCS7pq5jmjbLlvI/pq67lnotfR1N7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDojNENBQ0UyO30NCgkuc3Qwe2ZpbGw6I0YzNEY1OTt9DQo8L3N0eWxlPg0KPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF8xXyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSItMjQuNjg4NSIgeTE9Ii0yOC4zOTM5IiB4Mj0iLTIzLjk4MTQiIHkyPSItMjcuNjg2OCI+DQoJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6I0U2RTdFQSIvPg0KCTxzdG9wICBvZmZzZXQ9IjAuMTc0NyIgc3R5bGU9InN0b3AtY29sb3I6I0UyRTNFNiIvPg0KCTxzdG9wICBvZmZzZXQ9IjAuMzUzOCIgc3R5bGU9InN0b3AtY29sb3I6I0Q2RDdEQSIvPg0KCTxzdG9wICBvZmZzZXQ9IjAuNTM0OSIgc3R5bGU9InN0b3AtY29sb3I6I0MxQzRDNSIvPg0KCTxzdG9wICBvZmZzZXQ9IjAuNzE3NCIgc3R5bGU9InN0b3AtY29sb3I6I0E0QThBOCIvPg0KCTxzdG9wICBvZmZzZXQ9IjAuODk5MyIgc3R5bGU9InN0b3AtY29sb3I6IzgwODU4NCIvPg0KCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiM2ODZFNkMiLz4NCjwvbGluZWFyR3JhZGllbnQ+DQo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjUsMGwyNSw0My4zSDBMMjUsMHoiLz4NCjwvc3ZnPg0K)
        no-repeat 50%/100%;
      margin-bottom: 1px;
      margin-left: 2px;
    }

    .priceArrowDown {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyNy4zLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i5ZyW5bGkXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iNTBweCIgaGVpZ2h0PSI0My4zcHgiIHZpZXdCb3g9IjAgMCA1MCA0My4zIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MCA0My4zOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS7oo73kvZzpmbDlvbF7ZmlsbDpub25lO30NCgku5ZyT6KeSX3gwMDIwXzJfeDAwMjBf6buee2ZpbGw6I0ZGRkZGRjtzdHJva2U6IzIzMTgxNTtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9DQoJLuWNs+aZguWPjeWwhF94MDAyMF9Ye2ZpbGw6bm9uZTt9DQoJLuaflOWMluaWnOinkntmaWxsOnVybCgjU1ZHSURfMV8pO30NCgku6buD5piPe2ZpbGw6I0ZGRkZGRjt9DQoJLuiRieWtkF9HU3tmaWxsOiNGRkUxMDA7fQ0KCS7pq5jmjbLlvI/pq67lnotfR1N7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDojNENBQ0UyO30NCgkuc3Qwe2ZpbGw6I0YzNEY1OTt9DQo8L3N0eWxlPg0KPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF8xXyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSItMjQuNjg4NSIgeTE9Ii0yOC4zOTM5IiB4Mj0iLTIzLjk4MTQiIHkyPSItMjcuNjg2OCI+DQoJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6I0U2RTdFQSIvPg0KCTxzdG9wICBvZmZzZXQ9IjAuMTc0NyIgc3R5bGU9InN0b3AtY29sb3I6I0UyRTNFNiIvPg0KCTxzdG9wICBvZmZzZXQ9IjAuMzUzOCIgc3R5bGU9InN0b3AtY29sb3I6I0Q2RDdEQSIvPg0KCTxzdG9wICBvZmZzZXQ9IjAuNTM0OSIgc3R5bGU9InN0b3AtY29sb3I6I0MxQzRDNSIvPg0KCTxzdG9wICBvZmZzZXQ9IjAuNzE3NCIgc3R5bGU9InN0b3AtY29sb3I6I0E0QThBOCIvPg0KCTxzdG9wICBvZmZzZXQ9IjAuODk5MyIgc3R5bGU9InN0b3AtY29sb3I6IzgwODU4NCIvPg0KCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiM2ODZFNkMiLz4NCjwvbGluZWFyR3JhZGllbnQ+DQo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMjUsMGwyNSw0My4zSDBMMjUsMHoiLz4NCjwvc3ZnPg0K)
        no-repeat 50%/100%;
      margin-bottom: 1px;
      margin-left: 2px;
      transform: rotate(180deg);
    }
  }

  &__filter {
    display: flex;
    align-items: center;

    .brand {
      font-size: 1.4rem;
      border: 1px solid $sliver;
      color: $sliver;
      padding: 3px 11px 3px 18px;
      border-radius: 25px;
      margin-right: 5px;

      &.brandActive {
        color: $red;
        border: 1px solid $red;
      }
    }

    .triangle_down {
      display: inline-block;
      width: 14px;
      height: 14px;
      margin-bottom: -1px;
      background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOC4xNzcuODVjLjIwNiAwIC40MDcuMDU4LjU3Ny4xNjdhLjkyNi45MjYgMCAwMS4zMiAxLjI1NmwtLjA1Mi4wNzlMNS44NDQgNi43M2EuOTk2Ljk5NiAwIDAxLS4yNjkuMjUyIDEuMDY3IDEuMDY3IDAgMDEtMS4zNjEtLjE3OWwtLjA2LS4wNzRMLjk3OCAyLjM1MUEuOTIuOTIgMCAwMS44IDEuODFjMC0uNS40MDUtLjkxLjkyNC0uOTU3bC4wOTgtLjAwNGg2LjM1NVYuODV6IiBmaWxsPSIjNjY2IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48L3N2Zz4=)
        center/50% no-repeat;
    }
  }

  .button {
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: 1px solid $alto;
    background-color: $white;
    height: 60px;
    line-height: 60px;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .btns {
      font-size: 1.5rem;
      display: inline-block;
      width: 45%;
      height: 40px;
      box-sizing: border-box;
      line-height: 40px;
      text-align: center;
      font-size: 1.6rem;
      font-weight: 500;
      border-radius: 10px;
      color: $white;
      background-color: $red;

      &:first-of-type {
        color: $red;
        background-color: $white;
        border: 1px solid $red;
      }
    }
  }
}

.active {
  color: $red;
}

.brandList {
  padding: 20px;
  margin-bottom: 60px;

  &__item {
    margin-bottom: 10px;
    font-size: 1.5rem;
    list-style-type: none;
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
