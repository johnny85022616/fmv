<template>
  <div id="banners-wrap" class="banners-wrap">
    <carousel class="custom-carousel" :autoplay="true" :loop="true" :autoplayTimeout="3000" :perPage="1" :paginationEnabled="false">
      <slide class="wrap-item" v-for="(item, key) of items" :key="key">
        <a :href="item.url">
          <img :src="item.img" />
        </a>
      </slide>
    </carousel>
  </div>
</template>

<script>
export default {
  name: "topBanner",
  data() {
    return {
      items: null,
    };
  },
  props: {
    supplierData: {
      type: Object,
      default: () => null,
    },
  },
  async created() {
    this.getTopImage();
  },
  methods: {
    async getTopImage() {
      this.items = await this.api.promotion.getAiTopBanner(
        this.supplierData.siteId
      );
    },
  },
  computed: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
@import "../../style/color";

.banners-wrap {
  position: relative;
  width: 100%;
  img {
    width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
    margin-bottom: 5px;
    aspect-ratio: 2.7/1;
  }
}
</style>
