<template>
<div id="banners-wrap" class="wrap">
  <carousel class="custom-carousel" :autoplay="true" :loop="true" :autoplayTimeout="8000" :perPage="1" :paginationEnabled="paginationEnabled" :navigationEnabled="false" :paginationPadding="5" :paginationSize="6">
    <slide class="wrap-item" v-for="(item, index) of items" :key="index">
      <a @click="goBanner($event, index, item.url)" :href="item.url">
        <img :src="item.img" />
      </a>
    </slide>
  </carousel>
</div>
</template>

<script>
export default {
  name: "banners",
  data() {
    return {};
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    paginationEnabled: {
      type: Boolean,
      default: () => true
    }
  },
  methods: {
    goBanner(evt, el, url) {
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
  img {
    width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
  }
}
</style>
