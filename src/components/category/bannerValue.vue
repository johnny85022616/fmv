<template>
<div v-if="items && items.length > 0" class="category-banner-value">
  <div>
    <span>超值活動</span>
    <span v-show="items.length >= 7" @click="lookMore">看全部</span>
  </div>
  <carousel
    class="custom-carousel"
    :autoplay="items.length >= 7"
    :loop="items.length >= 7"
    :autoplayTimeout="5000"
    :perPage="1"
    :paginationEnabled="false"
    :navigationEnabled="false"
    :paginationPadding="5"
    :paginationSize="6">
    <slide
      class="wrap-item"
      v-for="(item, index) of items"
      :key="index">
      <a @click="goBanner($event, index, item.url)" :href="item.url">
        <img :src="item.img" :style="'height:'+imgHeight" />
        <span>
          {{ item.title }}
        </span>
      </a>
    </slide>
  </carousel>
</div>
</template>

<script>
export default {
  name: "bannerValue",
  data() {
    return {
      items: [
        // {
        //   img: "https://img.shopping.friday.tw/cmsimg/7b4f3cf5/f7ce423b/807c22f8/4dddb88b/s687720.jpg?tr=737953",
        //   url: "",
        //   title: "【WONDERLAND】全館$33up↘滿額再折 館$33up↘滿額再折",
        // },
      ],
      imgHeight: '100%'
    };
  },
  created() {
    this.getCamapign()
  },
  props: {
    catalogParams: {
      type: Object
    }
  },
  methods: {
    getCamapign() {
      this.axios
        .get(`api/promotion/category?cid=${this.catalogParams.cid}`)
        .then((res) => {
          const data = res.data;
          if (data.code === 1) {
            if (data.payload && data.payload[0]) {
              const payload = data.payload[0];
              const itemData = payload.eventLables[0]
              this.items = itemData?.eventList.map(v => {
                return {
                  title: v.eventName,
                  url: v.eventUrl,
                  img: v.eventImg
                }
              })
            }

            this.$nextTick(() => {
              const dom = document.querySelector('.category-banner-value .wrap-item')
              if (dom) {
                this.imgHeight = (document.querySelector('.category-banner-value .wrap-item').clientWidth * 0.4) + 'px'
              }
            })
          }
        });
    },
    lookMore() {
      window.location.href = `/mobileweb/promotion/category/${this.catalogParams.cid}?sid=${this.catalogParams.sid}&mid=${this.catalogParams.mid}`
    },
    goBanner(evt, el, url) {
      if (evt) {
        evt.preventDefault();
        window.location.href = url;
      }
    },
  },
  computed: {}
};
</script>

<style lang="sass" scoped>
@import '../../style/color.scss'
@import '../../style/mixin.scss'

.category-banner-value
  padding: 10px 20px 20px
  color: $web_main
  font-size: 1.4rem
  overflow: hidden
  >div
    &:first-child
      display: flex
      justify-content: space-between
      span
        &:first-child
          font-weight: bold
        &:last-child
          text-align: right
          color: $web_minor
    &:last-child
      padding: 10px 0 0
      a
        display: inline-block
        border: 1px solid $web_border
        border-radius: 10px
        color: $web_main
        font-size: 1.3rem
        text-decoration: none
        img
          width: 100%
          border-top-left-radius: 10px
          border-top-right-radius: 10px
          object-fit: cover
        span
          display: inline-block
          padding: 0 10px
          height: 30px
          line-height: 25px
          box-sizing: border-box
          @include font-break(1)
</style>

<style lang="sass">
.category-banner-value
  .wrap-item
    padding: 0 5px
    // &:last-child
    //   padding: 0
    box-sizing: border-box
  .VueCarousel-wrapper
    overflow: inherit !important
</style>
