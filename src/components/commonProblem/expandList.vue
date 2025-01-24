<template>
  <div>
    <ul class="expanList">
      <li v-for="(item, index) in data" :key="index" class="item" @click="setActiveNum(index)">
        <div class="item__topArea">
          <span class="item__topArea-num">{{ index + 1 }}</span>
          <p class="item__topArea-content">{{ item.q }}</p>
          <span :class="activeNum === index ? 'item__topArea-arrow active':'item__topArea-arrow'"></span>
        </div>
        <div v-if="activeNum === index" class="item__bottomArea" v-html="item.a"></div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "expanList",
  data() {
    return {
      activeNum:null
    };
  },
  props: ["data"],
  methods:{
    setActiveNum(index){
      if(this.activeNum === index){  //若點擊的原本就是打開的則關閉
        this.activeNum = null 
        return false
      }
      this.activeNum = index
    }
  },
  watch:{
    data(){ //若category有變化則將所有都設為關閉
      this.activeNum = null
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";
.expanList {
  .item {
    border-bottom: 1px solid $alto;
    color: $tundora;
    font-size: 1.4rem;
    &__topArea {
      display: flex;
      padding: 10px 20px;
      align-items: center;
      &-num {
        margin-right: 3%;
        display: block;
        font-size: 1.2rem;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: $white;
        background-color: $black;
        border-radius: 100%;
      }
      &-content{
        width: 90%;
      }
      &-arrow{
        background: url(../../images/icons/down.svg);
        width: 24px;
        height: 24px;
        &.active{
          background: url(../../images/icons/up.svg);
        }
      }
    }
    &__bottomArea{
      padding: 10px;
      background: $fair-pink;
      word-wrap: break-word;
    }
  }
}
</style>