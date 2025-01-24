<template>
  <div class="commonProblem">
    <navigation :isShowRedTop="isShowRedTop" :windowY="200" v-on:stopBodyScroll="stopBodyScroll" />
    <div class="QA">
      <div class="QA__head">
        <span class="QA__head-back" @click="handleHistoryBack"></span>
        <span class="QA__head-title">常見問題</span>
      </div>
      <category v-if="data" :categoryList="data | category" @categoryNum="getCategoryNum"></category>
      <expanList v-if="data" :data="data | qaArr(categoryNum)"></expanList>
    </div>
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import category from "./components/commonProblem/category.vue"; // 滑動式category
import expanList from "./components/commonProblem/expandList.vue"; // 展開式 QA list

export default {
  name: "commonProblem",
  data() {
    return {
      isShowRedTop: true,
      windowY: 0,
      isStopScrolling: false,
      categoryNum: 0,
      data: null,
    };
  },
  components: {
    navigation,
    category,
    expanList,
  },

  filters: {
    category(data) {
      return data.map((ele) => ele.category);
    },
    qaArr(data, categoryNum) {
      return data[categoryNum].qaArr;
    },
  },
  methods: {
    async getData() {
      const data = await fetch(
        `https://ec-w.shopping.friday.tw/commonProblem.json`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((res) => {
          this.data = res.data;
        })
        .catch((err) => {
          console.error(`getKeyWordByPromotionId faliure.123`);
          console.error(err);
        });
      return data;
    },
    stopBodyScroll(action, jumpCurrentY = true) {
      const body = document.body;
      if (!this.isStopScrolling) {
        body.style = "padding:0;margin:0;overflow:hidden;height:100%";
        this.isStopScrolling = !this.isStopScrolling;
      }
      if (action === "close") {
        body.style = "padding:0;margin:0;";
        if (jumpCurrentY) {
          setTimeout(() => {
            window.scrollTo(0, this.currentY);
          }, 0);
        }
        this.isStopScrolling = false;
      }
    },
    handleHistoryBack() {
      history.back();
    },
    getCategoryNum(num) {
      this.categoryNum = num;
    },
  },
  async created() {
    this.getData();
    window.addEventListener(
      "scroll",
      () => {
        const wy = window.scrollY;
        this.windowY = wy;
        this.currentY = wy !== 70 && wy !== 0 ? wy : this.currentY;
        this.isShowRedTop = wy > 0 ? false : true;
      },
      {
        passive: true,
      }
    );
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
.commonProblem {
  margin-bottom: 105px;

  .QA {
    &__head {
      display: flex;
      border-bottom: 1px solid $background;

      &-back {
        display: inline-block;
        padding: 15px 20px;
        box-sizing: border-box;
        font-size: 1.6rem;

        &::before {
          display: inline-block;
          font-family: "iconfont";
          font-style: normal;
          font-weight: normal;
          line-height: 1;
          -webkit-font-smoothing: antialiased;
          color: $tundora;
          content: "\EA03";
        }
      }

      &-title {
        display: inline-block;
        width: 100%;
        text-align: center;
        line-height: 50px;
        font-size: 1.8rem;
        font-weight: 500;
        margin-right: 50px;
        color: $mine-shaft;
      }
    }
  }
}
</style>
