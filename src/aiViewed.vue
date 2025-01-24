<template>
<div class="aiViewed">
  <navigation
    :windowY="200"
    :directShowSearchInput="true"
    v-on:stopBodyScroll="stopBodyScroll" />

    <div v-if="categoryData" class="aiViewed__box">
      <productItem :itemList="categoryData" />
  </div>
  
  <div v-else class="aiViewed__box empty">
    <img src="https://event.shopping.friday.tw/event/CP/common/mobile_icon/04_viewed.png" alt="no viewed records">
    <p>
      快去找找想買的商品吧
    </p>
  </div>
</div>
</template>

<script>
import productItem from './components/common/aiProductItem.vue';
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
export default {
  name: 'aiViewed',
  data() {
    return {
      categoryData: null
    }
  },
  created() {
    this.getCategoryProduct()
  },
  methods: {
    productPrice(price) {
      return new Intl.NumberFormat().format(price)
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
    getCategoryProduct(){
      const data = window.localStorage.getItem('viewed_product_cache')
      if(data){
        const viewed_product_cache = JSON.parse(data)
        this.categoryData = viewed_product_cache.data
      }
    }
  },
  components:{
    navigation,
    productItem
  }
}
</script>

<style lang="scss">
@import "./style/reset.module.scss";
@import "./style/flex.module.scss";
@import "./style/rwd.module.scss";
@import "./style/icons.module.scss";
@import "./style/global.module.scss";
</style>

<style lang="scss" scoped>
@import './style/color';

.aiViewed{
  &__box{
    padding: 0 20px 20px;
    margin: 20px 0 60px;
    &.empty{
      margin-top: calc((100vh - 100% + 2rem)/2);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      img {
        width: 40%;
        border-radius: 50%;
        margin-bottom: 5%;
        background-color: $web_main;
      }
      p {
        font-size: 2rem;
        margin: 0 auto;
      }
    }
  }
}
</style>
