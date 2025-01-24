<template>
  <div v-if="items && items.length > 0" class="banner-items">
    <carousel class="custom-carousel" :autoplay="true" :loop="true" :autoplayTimeout="8000" :perPage="1" :paginationEnabled="false" :navigationEnabled="false" :paginationPadding="5" :paginationSize="6" @page-change="getImgOneByOne">
      <slide :class="['wrap-item',{noPadding: item.img}]" v-for="(item, index) of items" :style="[{ 'background-image': item.bgurl ? `url(${item.bgurl})` : '' }]" :key="index">
        <div v-if="item.img" :class="['a1-mode']">
          <a v-if="item.link" :href="item.link">
            <img :src="item.img" />
          </a>
          <img v-else :src="item.img" />
        </div>
        <div v-else class="banner-item">
          <a v-for="(v, i) in item.data" :key="i" :href="v.link">
            <img :src="v.image_url" />
            <div>
              <span>{{ v.name }}</span>
              <span>{{ tools.priceFormat(v.price) }}</span>
            </div>
          </a>
        </div>
      </slide>
    </carousel>
  </div>
</template>

<script>
export default {
  name: "bsiteBanner",
  data() {
    return {
      items: [],
      hasBgImg: [],
    };
  },
  props: {
    productData: {
      type: Array,
    },
  },
  async created() {
    const aiData = await this.getA1Image();
    //a1 type=1 只顯示圖片，反之顯示商品加上圖片
    if (aiData && aiData.carousel === "1" && aiData.images.length > 0) {
      this.items = aiData.images;
    } else {
      let data = null;
      if (!this.productData) {
        data = await this.getProductData();
      } else {
        data = this.productData;
      }
      if (data) {
        this.parseData(data);
      }
      if (aiData && aiData.images && aiData.images.length > 0) {
        this.items = this.items.concat(aiData.images);
      }
    }
  },
  methods: {
    //取得商品資料(若props productData沒有傳入商品資料才會執行)
    async getProductData() {
      const { siteType, isOthersExposeToMe } = this.siteData
        ? this.siteData
        : {};
      let postData = {
        type: "3",
        q1_x: 0.5,
        supplier_y:
          (siteType === "B1" || siteType === "b1") && isOthersExposeToMe === "N"
            ? 1
            : 0.5, // 若為bSite 且沒有帶 catg=uni 就設定為 1,
        list_num: 100,
      };
      const sid = this.siteData.supplierId || "";
      postData.filter = {
        k: "1000",
        v: [sid, "", "", ""],
      };

      const data = await this.api.ai.getAiData("getalist", postData);
      return data;
    },
    async getA1Image() {
      return await this.api.promotion.getA1Image(this.siteData.siteId);
    },
    parseData(data) {
      const { urlSuffix } = this.siteData || {};
      const temp = {};

      // 取L來歸類 一個L 2個PID
      data.forEach((v) => {
        if (!temp[v.auto_category_id_L]) {
          temp[v.auto_category_id_L] = {
            data: [],
          };
        }
        if (temp[v.auto_category_id_L].data.length < 2) {
          const { name, image_url, price, pid, supplier_id } = v;
          temp[v.auto_category_id_L].data.push({
            name,
            image_url,
            price,
            pid,
            supplier_id,
            link: `${urlSuffix ? `/${urlSuffix}` : ""}/product/` + pid,
          });
        }
      });

      const twoLayer = Object.values(temp).filter((v) => v.data.length == 2);
      let items = twoLayer;
      if (
        twoLayer &&
        twoLayer.length === 0 &&
        (this.siteData.siteType === "B1" || this.siteData.siteType === "b1")
      ) {
        let arr = [];
        data.forEach((v) => {
          if (arr.length === 0 || arr[arr.length - 1].length === 2) {
            arr.push({ data: [] });
          }
          const { name, image_url, price, pid, supplier_id } = v;
          arr[arr.length - 1].data.push({
            name,
            image_url,
            price,
            pid,
            supplier_id,
            link: "/product/" + pid,
          });
        });
        items = arr.filter((v) => v.data.length == 2);
      }

      // 先取首張底圖
      if (items.length > 0) {
        this.getBgApi(items?.[0].data, 0);
        this.hasBgImg.push(1);
      }
      // 若還有data要預先取第二張底圖
      if (items.length > 1) {
        this.getBgApi(items?.[1].data, 1);
        this.hasBgImg.push(2);
      }
      this.items = items.slice(0, 5);
    },
    getBgApi(data, pos) {
      const url = this.configs.aiSearchWebApiPath();
      return fetch(
        `${url}background_image_api?url1=${data?.[0].image_url}&url2=${data?.[1].image_url}&return_type=1`
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
      const getBgIdx = n + 1; // 已先取首(二)張底圖

      if (!this.hasBgImg.includes(getBgIdx) && getBgIdx < this.items.length) {
        this.getBgApi(this.items[getBgIdx].data, getBgIdx);
        this.hasBgImg.push(getBgIdx);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/mixin";

.wrap-item {
  background-color: #f4f4f4;
  margin: 0 0 10px 0;
  padding: 10px 0;
  &.noPadding {
    padding: 0;
    background-color: white;
    display: flex;
  }
}

.banner-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;

  a {
    position: relative;
    flex: 1 1 48%;
    display: flex;
    justify-content: center;

    > div {
      display: flex;
      position: absolute;
      bottom: 0;
      justify-content: space-between;
      width: 90%;
      height: 35px;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.7);
      padding: 2px 5px;

      span {
        line-height: calc(35px / 2);
        &:first-child {
          width: 110px;
          height: 35px;
          color: white;
          font-size: 1.2rem;
          @include font-break(2);
        }

        &:last-child {
          width: 32%;
          color: #ff0;
          font-size: 1.4rem;
          text-align: right;

          &:before {
            content: "$";
            font-size: 1.2rem;
          }
        }
      }
    }

    img {
      width: 90%;
      height: auto;
      aspect-ratio: 1;
      object-fit: cover;
    }
  }
}
.a1-mode {
  width: 100%;
  display: flex;
  a {
    width: 100%;
  }
  img {
    width: 100%;
    vertical-align: top;
  }
}
</style>
