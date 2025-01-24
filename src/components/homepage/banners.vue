<template>
  <div id="banners-wrap" class="banners-wrap">
    <carousel class="custom-carousel" :autoplay="true" :loop="true" :autoplayTimeout="3000" :perPage="1" :paginationEnabled="false" :navigateTo="navigateTo" @pageChange="pageChange">
      <slide class="wrap-item" v-for="(item, index) of items" :key="index">
        <a :href="item.url" :title="item.description" class="ga-event" data-ga-category="首頁A1" :data-ga-label="item.title">
          <img :src="item.img" :alt="item.description" />
          <img v-if="iconURL" class="campaignImg" :src="iconURL">
        </a>
      </slide>
    </carousel>
    <span class="banners-wrap__counter">{{ nowItemPage }}/{{ items.length }}</span>
  </div>
</template>

<script>
export default {
  name: "banners",
  data() {
    return {
      items: [],
      nowItemPage: 1,
      iconURL: null,
    };
  },
  created() {
    // GET Banners
    fetch(`${this.configs.apiPath()}api/home/banner/mobileweb`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.code === 1 && data?.payload?.length > 0) {
          if (this.lighthouse) {
            this.items = data.payload[0].banners.splice(0, 1);
          } else {
            this.items = data.payload[0].banners;
          }
        }
      });
    this.api.promotion.getPromoExpos("homepageMainBanner").then((res) => {
      this.iconURL = res?.iconURL || "";
    });
  },
  methods: {
    pageChange(val) {
      this.nowItemPage = val + 1;
    },
  },
  computed: {
    navigateTo() {
      return Math.floor(Math.random() * this.items.length);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
@import "../../style/color";

.banners-wrap {
  position: relative;
  border-radius: 10px;

  .banners-wrap__counter {
    position: absolute;
    right: 5px;
    bottom: 10px;
    box-sizing: border-box;
    padding: 1px 5px;
    border-radius: 10px;
    color: $white;
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 19px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.6);
  }
  a {
    position: relative;
    display: flex;
  }
  img {
    width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
    margin-bottom: 5px;
    border-radius: 10px;
  }
  .campaignImg {
    width: 18%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
  }
}
</style>
