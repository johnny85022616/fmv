<template>
<div class="wrap">
  <p>{{title}}</p>
  <div class="d-flex">
    <div class="items" v-for="(item, index) of items" :key="index" @click="goBanner($event, item.url)">
      <img :src="item.img" />
      <span>{{item.description}}</span>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "bannerThree",
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      default: () => ''
    },
    items: {
      type: Array,
      default: () => []
    },
  },
  methods: {
    goBanner(evt, url) {
      if (evt) {
        evt.preventDefault();
        location.href = url;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  padding-bottom: 10px;

  p {
    padding-left: 10px;
    min-height: 40px;
    line-height: 40px;
    font-size: 1.4rem;
    font-weight: 500;
    color: #ec1946;
  }

  .items {
    flex: 1 1 100%;
    padding: 10px;
    box-sizing: border-box;

    span {
      display: -webkit-box;
      overflow: hidden;
      font-size: 1.2rem;
      color: #333333;
      margin-top: 8px;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
  }

  img {
    width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
    image-rendering: -webkit-optimize-contrast;
  }
}
</style>
