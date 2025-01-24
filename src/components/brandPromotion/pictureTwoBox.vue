<template>
  <div v-if="item.main.image_url" class="pictureTwo">
    <p :class="['catName', { isMain: !item.mainSub }]">
      <font>{{ item.main.cateName }}</font>
      <a v-if="item.main.cateId !== 9999 && item.mainSub.length > 2" :href="composeUrl(item.main.cateId)">{{ item.main.hasSub ? '看更深' : '看更多' }}</a>
    </p>
    <div class="content">
      <div>
        <div class="image">
          <a :href="'/product/' + item.main.pid">
            <img :src="item.main.image_url" alt="">
          </a>
        </div>
        <p class="name">{{ item.main.name }}</p>
        <p v-if="item.main.price !== null" class="price">{{ tools.priceFormat(item.main.price) }}</p>
      </div>
      <div v-if="item.mainSub && item.mainSub.length > 0">
        <div class="image">
          <img :src="item.mainSub[0].image_url" alt="">
        </div>
        <p class="name">{{ item.mainSub[0].name }}</p>
        <p v-if="item.mainSub[0].price !== null" class="price">{{ tools.priceFormat(item.mainSub[0].price) }}</p>
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
    urlCidAry: {
      type: Array,
      default: () => []
    },
  },
  methods: {
    //回傳看更多url
    composeUrl(id) {
      const { urlSuffix } = this.supplierData;
      let url = `/shop/${urlSuffix}/category/`;
      if (this.urlCidAry.length > 0) {
        url += `${this.urlCidAry.join('/')}/`;
      }
      return `${url}${id}`;
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

    >div {
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