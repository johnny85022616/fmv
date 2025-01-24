<template>
<div class="brand">
  <div class="brand__title">
    <span>全台首創   眾多品牌   全AI自動行銷</span>
    <a @click="controlBox(true)">詳</a>
    <div class="black">
      <a href="https://ai4.ysdt.com.tw/entrance/brand" target="_blank">
        ⬇往下搜尋您想找的品牌 體驗您個人專屬AI網站
      </a>
    </div>
    <div class="brand__title-description" v-if="isBoxOpen">
      <p>本網站為「網站品牌商公司」銷售商品的網站，而本網站所有AI生成技術及網站系統均是遠時數位科技股份有限公司(以下稱YSDT)建置，日常營運之客服、金流、發票、退貨退款均由YSDT負責。本網站除了銷售「網站品牌商公司」商品外，也同時展示其它YSDT廠商的商品，而這些商品透過YSDT獨家AI 友商推薦商品    技術展示，並會顯示 友商推薦商品    標誌。透過 友商推薦商品技術，「網站品牌商公司」  就會有成千上萬的商品陳列，並進一步提供優惠折扣，讓每一位消費者可看到適合自已且具有吸引力的商品，享有嶄新的購物體驗！</p>
      <span @click="controlBox(false)">關閉</span>
    </div>
  </div>
  <div class="brand__list">
    <a href="https://ai4.ysdt.com.tw/BW076760/aisearch?keyword=apple">
      <img src="../../images/icons/Logo_1.jpeg" alt="">
    </a>
    <a href="https://ai4.ysdt.com.tw/BW016889/aisearch?keyword=swich">
      <img src="../../images/icons/Logo_2.jpeg" alt="">
    </a>
    <a href="https://ai4.ysdt.com.tw/BW096685/aisearch?keyword=Samsung">
      <img src="../../images/icons/Logo_3.jpeg" alt="">
    </a>
    <a href="https://ai4.ysdt.com.tw/BW039010/aisearch?keyword=razer">
      <img src="../../images/icons/Logo_4.jpeg" alt="">
    </a>
    <a href="https://ai4.ysdt.com.tw/BW097145/aisearch?keyword=%E5%B0%8F%E7%B1%B3">
      <img src="../../images/icons/Logo_5.jpeg" alt="">
    </a>
  </div>
  <a class="brand__link" href=" https://ai4.ysdt.com.tw/entrance/brand">看所有AI品牌旗艦店></a>
  <a class="brand__bigImg" href="https://ai4.ysdt.com.tw/entrance">
    <img src="../../images/icons/ai_bn.jpg" alt="">
  </a>
</div>
</template>

<script>
export default {
  name: "brand",
  data() {
    return {
      isBoxOpen: false
    };
  },
  created() {
    
  },
  methods: {
    controlBox(flag){
      this.isBoxOpen = flag
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
@import '../../style/color';

.brand{
  background-color: $satin_linen;
  text-align: center;
  &__title{
    position: relative;
    background-color: $red_berry;
    font-size: 1.8rem;
    text-align: center;
    color: $white;
    padding: 10px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    a{
      margin-left: 5px;
      font-size: 1rem;
      font-weight: unset;
      text-decoration: underline;
    }
    .black{
      position: absolute;
      display: flex;
      align-content: center;
      top: 84%;
      padding: 5px 20px;
      color: $turbo;
      background-color: $black;
      font-size: 1.2rem;
      border-radius: 20px;
      white-space: nowrap;
      z-index: 0;
      a {
        font-size: 1.2rem;
        text-decoration: none;
        color: #ee0;
      }
    }
    &-description{
      position: absolute;
      top: 84%;
      font-size: 1rem;
      background-color: $white;
      z-index: 1;
      font-weight: unset;
      padding: 10px;
      width: 80%;
      border: 3px solid $swirl;
      border-radius: 5px;
      p{
        color: $emperor;
        text-align: left;
      }
      span{
        color: $brightblue;
        display: block;
        text-align: right;
        margin-top: 10px;
      }
    }
  }
  &__list{
    padding: 40px 10px 0 10px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 2%;
    a{
      position: relative;
      display: inline-block;
      width: 100%;
      padding-top: 50%;
      background-color: $white;
      img{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
  &__link{
    color: $brightblue;
    padding: 6px 15px;
    border: 1px solid $dustygray;
    border-radius: 25px;
    box-sizing: border-box;
    display: inline-block;
    margin: 20px 0;
    text-decoration: none;
    font-size: 1.3rem;
  }
  &__bigImg{
    display: inline-block;
    width: 100%;
    height: auto;
    img{
      vertical-align: top;
      width: 100%;
    }
  }
}
</style>
