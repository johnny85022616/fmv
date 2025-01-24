<template>
  <div class="pictureTwo">
    <p :class="['catName', { isMain: !item.mainSub }]">
      <font>{{ item.main.cateName }}</font>
      <a v-if="item.main.cateId !== 9999" :href="composeUrl(item.main.cateId)">{{this.catType !=='b'?"看更深":"看更多"}}</a>
    </p>
    <div class="content">
      <div>
        <div class="image">
          <img :src="item.main.image_url" alt="">
        </div>
        <p class="name">{{ item.main.name }}</p>
        <p v-if="item.main.price!==null" class="price">{{ tools.priceFormat(item.main.price) }}</p>
      </div>
      <div v-if="item.mainSub && item.mainSub.length>0">
        <div class="image">
          <img :src="item.mainSub[0].image_url" alt="">
        </div>
        <p class="name">{{ item.mainSub[0].name }}</p>
        <p v-if="item.mainSub[0].price!==null" class="price">{{ tools.priceFormat(item.mainSub[0].price) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
/*
  item 傳入格式
  {
    main: type Object
    subMain: type Array
    sub: type Array
  }
*/
export default {
  name: "pictureTwoBox",
  data() {
    return {
      catType: null,
    };
  },
  props: {
    item: {
      type: Object,
    },
    supplierData: {
      type: Object,
    },
  },
  methods: {
    //回傳看更多url
    composeUrl(id) {
      const page = this.page ? this.page : "";
      this.getCategoryType(id);
      //url為/category/${lid}/${mid}/${bid}形式(主題頁)
      if (/^(category)/.test(location.pathname)) {
        return `/category/${this.deepCategoryTypeForNormal(id)}`;
      }
      //url為?lid=${lid}或？mid="${mid}"或?bid=${bid}形式(專櫃頁)
      return `/${page}?urlSuffix=${
        this.supplierData.urlSuffix
      }&${this.deepCategoryTypeForBrand(id)}=${id}`;
    },
    getCategoryType(id) {
      if (id.match(/(L[\d]{4})/)) {
        this.catType = "l";
      }
      if (id.match(/(M[\d]{4})/)) {
        this.catType = "m";
      }
      if (id.match(/(B[\d]{4})/)) {
        this.catType = "b";
      }
    },
    //for ?lid=${lid}或？mid="${mid}"或?bid=${bid}
    deepCategoryTypeForBrand() {
      switch (this.catType) {
        case "l":
          return "lid";
        case "m":
          return "mid";
        case "b":
          return "bid";
      }
    },
    //for /category/${lid}/${mid}/${bid}形式
    deepCategoryTypeForNormal(id) {
      let lid, mid;
      const lmatch = location.href.match(/(L[\d]{4})/); //取得lid
      if (lmatch && lmatch.length > 0) {
        lid = lmatch[1];
      }
      const mmatch = location.href.match(/(M[\d]{4})/); //取得Mid
      if (mmatch && mmatch.length > 0) {
        mid = mmatch[1];
      }

      switch (this.catType) {
        case "l":
          return `${id}`;
        case "m":
          return `${lid}/${id}`;
        case "b":
          return `${lid}/${mid}/${id}`;
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import "../../style/color";

.pictureTwo {
  .catName {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 8px;
    padding: 10px 10px;
    background: #ddd5cc;
    &.isMain {
      background-color: #ddd5cc;
    }
    font {
      color: $mine-shaft;
      font-weight: bold;
      font-size: 1.6rem;
    }
    a {
      color: $sliver;
      background-color: $white;
      border: 1px solid $sliver;
      padding: 3px 10px;
      font-size: 1.2rem;
      text-decoration: none;
      border-radius: 10px;
    }
  }
  .content {
    display: flex;
    justify-content: space-between;
    padding: 0px 10px 10px 10px;
    background-color: #ddd5cc;
    margin: 0 8px;
    > div {
      width: 48%;
      background-color: $white;
    }
    .image {
      position: relative;
      width: 100%;
      height: 0px;
      padding-bottom: 100%;
      img {
        position: absolute;
        width: 100%;
        height: 100%;
        -o-object-fit: cover;
        object-fit: cover;
      }
    }
    .name {
      width: 95%;
      margin-top: 10px;
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      font-size: 1.3rem;
      color: #3f3f3f;
    }
    .price {
      color: $red;
      font-size: 1.6rem;
      margin-top: 5px;
      &::before {
        content: "$";
        margin-right: 2px;
      }
    }
  }
}
</style>