<template>
  <div class="category">
    <ul class="category-moveArea">
      <li
        v-for="(item, index) in categoryList"
        :key="index"
        :class="activeNum === index ? 'active' : ''"
        @click="handleClick(index)"
        :ref="`${index}`"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name:'category',
  data() {
    return {
      activeNum: 0,
    };
  },
  props: {
    categoryList: {
      type: Array,
      require: false,
      default: () => [],
    },
  },
  methods:{
    handleClick(index){
      this.activeNum = index
      this.$emit('categoryNum' , this.activeNum)
      let element = this.$refs[index][0]; //取得點擊元素
      element.scrollIntoView({behavior: "smooth", inline: "center", block:'center'}); //將元素滾動到中間
    },
    getCategory(){

    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";
.category {
  background: $background;
  padding: 0 0 0 20px;
  border-top: 1px solid $alto;
  border-bottom: 1px solid $alto;
  box-sizing: border-box;
  &-moveArea {
    width: 100%;
    overflow: auto;
    white-space: nowrap;
    li {
      display: inline-block;
      font-size: 14px;
      padding: 15px 10px;
      margin: 0 5px;
      color: $tundora;
      &.active {
        color: $redapprox;
        border-bottom: 2px solid $redapprox;
      }
    }
  }
}
</style>