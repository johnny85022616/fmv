<template>
<div id="banners-wrap" class="banner">
  <carousel class="custom-carousel" :autoplay="true" :loop="true" :autoplayTimeout="8000" :perPage="1" :paginationPadding="5" :paginationSize="6" :navigateTo="[randomIndex,false]" paginationActiveColor="#FFFFFF">
    <slide class="banner__item" v-for="(item, index) of data" :key="index">
      <a :href="configs.prefixUrl(item.url)" :title="item.imgAlt">
        <img class="banner__item-img" :src="configs.checkImgSrc(item.img)" />
      </a>
    </slide>
  </carousel>
</div>
</template>

<script>
export default {
  name: "banners",
  props: {
    data: Array
  },
  data() {
    return {
      randomIndex: 0,
    };
  },
  created() {
    this.data.sort(function (a, b) {
      return a.orderNum - b.orderNum;
    });
    this.randomIndex = Math.floor(Math.random() * this.data.length)
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
.banner {
  &__item {
    &-img {
      width: 100%;
      height: auto;
      display: block;
      margin: 0 auto;
      margin-bottom: 5px;
    }
  }
}
</style>
