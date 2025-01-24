<template>
  <div class="promo-wrap">
    <carousel
      :autoplay="true"
      :loop="true"
      :autoplayTimeout="8000"
      :perPage="3"
      :paginationPadding="5"
      :paginationSize="6"
      :navigationClickTargetSize="0"
    >
      <slide class="wrap-item" v-for="(item,index) of items" :key="index">
        <a
          @click="goBanner($event, index, item.url, item.description)"
          :href="item.url"
          :title="item.description"
        >
          <img :src="item.img" :alt="item.description" />
        </a>
      </slide>
    </carousel>
  </div>
</template>

<script>
export default {
  name: "promoevent",
  data() {
    return {
      items: []
    };
  },
  created() {
    // GET PromoEvent
    this.axios.get("api/home/promoEvent").then(res => {
      const data = res.data;
      if (data.code === 1 && data.payload.length > 0) {
        this.items = data.payload[0].promoEvents;
      }
    });
  },
  methods: {
    goBanner(evt, el, url, title) {
      if (evt) {
        evt.preventDefault();
        this.ga.event(
          "小網首頁",
          "快捷促購版位_click",
          `快捷促購版位 @ ${title} @ ${url}`
        );
        location.href = url;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
.promo-wrap {
  width: 100%;
  box-sizing: border-box;

  .wrap-item {
    text-align: center;
    width: 100%;
    padding: 0 5px;
    box-sizing: border-box;

    img {
      width: 100%;
      border-radius: 10px;
      margin-bottom: 5px;
      image-rendering: -webkit-optimize-contrast;
    }
  }
}
</style>
