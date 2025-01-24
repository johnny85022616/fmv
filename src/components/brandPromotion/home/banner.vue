<template>
  <div>
    <div v-if="items && items.length > 0" class="item_box">
      <carousel :autoplay="true" :loop="true" :autoplayTimeout="5000" :perPage="1" :paginationEnabled="false" :paginationPadding="0" :paginationSize="0" :navigationEnabled="true" navigationNextLabel="<div class='arrow'></div>" navigationPrevLabel="<div class='arrow left'></div>" @page-change="getImgOneByOne">
        <slide v-for="(item, idx) of items" :style="[{ 'background-image': `url(${item.bgurl})` }]" :key="idx">
          <div v-if="item.img" class="a1-mode">
            <a v-if="item.link" :href="item.link">
              <img :src="item.img" />
            </a>
            <img v-else :src="item.img" />
          </div>
          <div v-else class="product-mode">
            <a v-for="(v, i) in item.data" :key="i" @click="tools.goProductPage(e, v.pid, v)">
              <img :src="v.image_url" />
              <div class="name_box">
                <span>{{ v.name }}</span>
                <span v-if="v.price !== null" class="price">{{ tools.priceFormat(v.price) }}</span>
              </div>
            </a>
          </div>
        </slide>
      </carousel>
    </div>
    <div v-if="imgData" class="wrap">
      <a :href="imgData.link" target="_blank">
        <img :src="imgData.img">
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "banner",
  data() {
    return {
      items: [],
      hasBgImg: [],
      imgData: null,
    };
  },
  props: {
    supplierData: {
      type: Object,
    },
    bannerData: {
      type: Array,
    },
  },
  watch: {
    supplierData() {
      this.hasBgImg = [];
    },
  },
  async created() {
    // 取得中間橫幅廣告
    this.getAd();

    // 取得A1圖片
    const aiData = await this.api.promotion.getA1Image(
      this.supplierData.siteId
    );
    // 0:顯示商品+BN, 1:只顯示BN
    if (aiData?.carousel === "1") {
      this.items = aiData.images;
      return;
    }

    // 中間2格商品
    this.parseData(this.bannerData);

    // A1 商品+圖片
    if (aiData?.carousel === "0") {
      this.items = this.items.concat(aiData.images);
    }
  },
  methods: {
    // 取得中間橫幅廣告
    getAd() {
      fetch(
        `https://ec-m.shopping.friday.tw/Deploy/getBannerImg/${this.supplierData.siteId}`
      )
        .then((res) => res.json())
        .then((res) => {
          if (res && res.img && res.link) {
            this.imgData = res;
          }
        });
    },
    parseData(pids) {
      pids = pids.map((v) => {
        const { name, image_url, price, pid } = v;
        return {
          name,
          image_url,
          price,
          pid,
          supplier_id: this.supplierData.supplierId,
          link: this.tools.genProductUrl(pid),
        };
      });

      let arr = [];
      for (let i = 0; i < pids.length; i += 2) {
        let temp1 = { data: pids.slice(i, i + 2) };
        arr.push(temp1);
      }

      const items = arr.filter((v) => v.data.length == 2);

      // 先取首張底圖
      if (items.length > 0) {
        this.getBgApi(items[0].data, 0);
        this.hasBgImg.push(0);
      }
      // 若還有data要預先取第二張底圖
      if (items.length > 1) {
        this.getBgApi(items[1].data, 1);
        this.hasBgImg.push(1);
      }

      this.items = items;
    },
    getBgApi(data, pos) {
      const url = this.configs.aiSearchWebApiPath();
      return fetch(
        `${url}background_image_api?url1=${data[0].img}&url2=${data[1].img}&return_type=1`
      )
        .then((res) => res.text())
        .then((res) => {
          if (res) {
            this.$set(this.items, pos, {
              bgurl: res,
              data: data,
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // get slide's current page
    getImgOneByOne(n) {
      // 換張數後發動 initial -> n=0
      const getBgIdx = n; // 已先取首(二)張底圖

      if (!this.hasBgImg.includes(getBgIdx) && getBgIdx <= this.items.length) {
        if (this.items[getBgIdx].data) {
          this.getBgApi(this.items[getBgIdx].data, getBgIdx);
          this.hasBgImg.push(getBgIdx);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../style/mixin";
@import "../../../style/color";

.item_box {
  background-color: #f4f4f4;
}

.wrap {
  padding-top: 10px;

  img {
    width: 100%;
  }
}

::v-deep .VueCarousel {
  &:hover {
    .VueCarousel-navigation {
      display: block;
    }
  }

  &-slide {
    width: 100%;
    background-size: cover;

    .product-mode {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      padding: 10px;
    }

    .a1-mode {
      padding: unset;
      width: 100%;
      aspect-ratio: 1/0.5;
      a {
        padding: unset;
        width: 100%;
        aspect-ratio: 1/0.5;
      }
      img {
        width: 100%;
        height: 100%;
        border-radius: unset;
        aspect-ratio: unset;
      }
    }

    a {
      width: 340px;
      // height: 340px;
      display: inline-block;
      position: relative;

      img {
        width: 100%;
        border-radius: 10px;
        aspect-ratio: 1/1;
      }

      .name_box {
        width: 100%;
        background-color: rgba($color: $black, $alpha: 0.9);
        padding: 5px;
        box-sizing: border-box;
        border-radius: 0 0 10px 10px;
        justify-content: space-between;
        position: absolute;
        bottom: 0;

        span {
          font-size: 1.5rem;
          font-weight: 300;
          color: $white;
          display: block;

          &:first-child {
            width: 80%;
            @include font-break;
          }
        }

        .price {
          display: block;
          font-size: 1.5rem;
          color: #ff0;
          width: 20%;
          text-align: end;

          &::before {
            content: "$";
          }
        }
      }
    }
  }
}

::v-deep .VueCarousel-navigation {
  display: none;

  &-button {
    width: 35px;
    height: 60px;
    background: rgba(0, 0, 0, 0.4) !important;
    background-image: url(../../../images/icons/index_arrow.png) !important;

    &:focus {
      outline: unset !important;
    }
  }

  &-next {
    border-radius: 5px 0 0 5px !important;
    background-position-y: 120px !important;
    right: 35px !important;
  }

  &-prev {
    left: 35px !important;
    border-radius: 0 5px 5px 0 !important;
  }
}
</style>
