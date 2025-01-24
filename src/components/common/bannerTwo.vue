<template>
  <div v-if="items && items.length > 0" class="bannerTwo">
    <carousel :autoplay="true" :loop="true" :autoplayTimeout="5000" :perPage="1" :paginationEnabled="false" :paginationPadding="0" :paginationSize="0" :navigationEnabled="true" navigationNextLabel="<div class='arrow'></div>" navigationPrevLabel="<div class='arrow left'></div>" @page-change="getImgOneByOne">
      <slide v-for="(item, idx) of items" :style="[{ 'background-image': `url(${item.bgurl})`}]" :key="idx">
        <div>
          <a v-for="(v, i) in item.data" :key="i" :href="v.link">
            <img :src="v.img" />
            <div class="name_box">
              <span>{{ v.name }}</span>
              <span v-if="v.price!==null" class="price">{{ tools.priceFormat(v.price) }}</span>
            </div>
          </a>
        </div>
      </slide>
    </carousel>
  </div>
</template>

<script>
export default {
  name: "bannerTwo",
  data() {
    return {
      items: [],
      hasBgImg: [],
    };
  },
  props: {
    bannerData: {
      type: Array,
    },
    supplierData: {
      type: Object,
    },
  },
  watch: {
    supplierData() {
      this.hasBgImg = [];
    },
    bannerData() {
      this.parseData(this.bannerData);
    },
  },
  created() {
    if (this.bannerData) {
      this.parseData(this.bannerData);
    }
  },
  methods: {
    parseData(pids) {
      pids = pids.map((v) => {
        const { name, img, price, pid } = v;
        return {
          name,
          img,
          price,
          pid,
          supplier_id: this.supplierData
            ? this.supplierData.supplierId
            : this.siteData.supplierId,
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
        .catch(err => {
          console.error(err)
        })
    },
    // get slide's current page
    getImgOneByOne(n) {
      // 換張數後發動 initial -> n=0
      const getBgIdx = n; // 已先取首(二)張底圖

      if (!this.hasBgImg.includes(getBgIdx) && getBgIdx <= this.items.length) {
        this.getBgApi(this.items[getBgIdx].data, getBgIdx);
        this.hasBgImg.push(getBgIdx);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/mixin";
@import "../../style/color";
.bannerTwo {
  background-color: #f4f4f4;
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
    > div {
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
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
        vertical-align: top;
      }
      .name_box {
        width: 100%;
        background-color: rgba($color: $black, $alpha: 0.6);
        padding: 5px;
        box-sizing: border-box;
        border-radius: 0 0 10px 10px;
        justify-content: space-between;
        position: absolute;
        bottom: 0;
        span {
          font-size: 1.5rem;
          font-weight: 350;
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
    background-image: url(../../images/icons/index_arrow.png) !important;
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
