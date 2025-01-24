<template>
  <div v-if="hourData && hourData.length>0" id="hourly-wrap" class="hourly-wrap">
    <div class="hourly-hours" @click="goOnSalePage($event)">
      <span>
        <font>整點</font>
        <font>特賣</font>
      </span>
      <div>
        <span v-for="(h, i) in hourData" :key="i" :class="[{ 'first': i === 0 }]">
          {{ h }}
        </span>
      </div>
      <i class="arrow-right-white"></i>
    </div>
    <carousel class="custom-carousel" :autoplay="true" :loop="true" :autoplayTimeout="3000" :perPage="1" :paginationEnabled="false" :navigateTo="0" :navigationEnabled="false">
      <slide class="wrap-item" v-for="(item, index) of items" :key="index">
        <card :item="item" />
      </slide>
    </carousel>
  </div>
</template>

<script>
import card from "./card.vue";
export default {
  name: "hourlyRec",
  data() {
    return {
      items: [],
      hourData: [],
      nowItemPage: 1,
    };
  },
  components: {
    card,
  },
  created() {
    this.getProductData();
  },
  methods: {
    async getProductData() {
      const siteData = this.siteData ? "&siteId=" + this.siteData.siteId : "";
      const data = await fetch(
        this.configs.hoursApiPath() +
          "personal/discount/products/current?pseudoId=" +
          this.tools.aiUserId() +
          siteData
      ).then((res) => res.json());

      if (!data) return;
      
      if (data.code === 1 && data.data && data.data.length > 0) {
        this.parseData(data);
      }
    },
    parseData(data) {
      this.items = data.data[0].products.map((v) => {
        return {
          pid: v.pid,
          name: v.name,
          image_url: v.imageUrl,
          discount: v.discount,
          after_discount: v.afterDiscount,
          list_price: v.listPrice,
          price: v.price,
        };
      });
      this.hourData = data.data.map((v) =>
        v.onSaleDisplayTime.split(" ").join("")
      );
      // document.cookie = `AI_HS=${data.data[0].jsonWebToken};path=/;max-age=${600};domain=.friday.tw;secure`;
    },
    goOnSalePage(e) {
      e.preventDefault();
      let link = "/onsale";
      window.location.href = link;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
@import "../../style/color";
@import "../../style/icons.module.scss";

.hourly-hours {
  background-color: #039;
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: 2px 4px;
  min-height: 38px;
  margin-bottom: 10px;

  > span {
    margin-right: 5px;
    display: flex;
    flex-direction: column;
    width: 35px;
    font-size: 1.4rem;
    font-weight: bold;
    color: $white;

    font {
      white-space: nowrap;

      &:first-of-type {
        color: yellow;
      }
    }
  }

  > div {
    width: 100%;
    overflow: scroll;
    display: flex;
    align-items: center;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      display: none;
    }

    span {
      text-align: center;
      margin-right: 5px;
      padding: 3px 6px;
      border-radius: 15px;
      color: $sliver;
      font-size: 1.8rem;
      background-color: $background;
      white-space: nowrap;
      display: inline-block;
      width: auto;
      line-height: 1;

      &.first {
        color: $white;
        background-color: $pomegranate;
      }
    }
  }

  i {
    float: right;
  }
}

.hourly-wrap {
  position: relative;
  border-radius: 10px;

  &__bottom {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    color: $gray;
    font-size: 1.8rem;

    span {
      padding: 0 0 0 15px;
      font-size: 1.5rem;
    }

    a {
      padding: 0 15px 0 0;
      font-size: 1.3rem;
      position: relative;

      &:after {
        position: absolute;
        right: 5px;
        content: ">";
      }
    }
  }

  .hourly-wrap__counter {
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

  img {
    width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
    margin-bottom: 5px;
    border-radius: 10px;
  }
}

.custom-carousel {
  ::v-deep .VueCarousel-navigation {
    &-button {
      padding: 0px !important;
    }

    &-next {
      right: 3px !important;
    }

    &-prev {
      left: 3px !important;
    }
  }
}
</style>
