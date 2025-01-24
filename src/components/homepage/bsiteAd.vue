<template>
  <div v-if="imgData" class="wrap">
    <a :href="imgData.link">
      <img :src="imgData.img">
    </a>
  </div>
</template>

<script>
export default {
  name: 'bsiteAd',
  data() {
    return {
      imgData: null
    };
  },
  created() {
    this.getAd();
  },
  props: {
    // 供應商資料
    supplierData: {
      type: Object
    }
  },
  methods: {
    getAd() {
      fetch(`https://ec-m.shopping.friday.tw/Deploy/getBannerImg/${this.supplierData.siteId}`)
        .then(res => res.json())
        .then(res => {
          if (res && res.img && res.link) {
            this.imgData = res;
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap {
  margin: 5px 0;

  a {
    img {
      width: 100%;
    }
  }
}
</style>
