<template>
  <div class="wrap">
    <p>{{title}}</p>
    <carousel class="custom-carousel" :autoplay="true" :loop="true" :autoplayTimeout="8000" :perPage="1" :paginationEnabled="true" :navigationEnabled="false" :paginationPadding="5" :paginationSize="6">
      <slide class="wrap-item" v-for="(item, index) of items" :key="index">
        <a @click="goBanner($event, item.url)" :href="item.url">
          <img :src="item.img" />
        </a>
      </slide>
    </carousel>
  </div>
</template>
  
  <script>
export default {
  name: "bannerSquare",
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      default: () => "",
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    goBanner(evt, url) {
      if (evt) {
        evt.preventDefault();
        location.href = url;
      }
    },
  },
};
</script>
  
  <style lang="scss" scoped>
.wrap {
  padding-bottom: 10px;

  p {
    text-align: left;
    background-color: #f46c00;
    color: #fff;
    padding: 13px 10px;
    font-size: 1.4rem;
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
  