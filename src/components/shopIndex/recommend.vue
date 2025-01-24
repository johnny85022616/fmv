<template>
<div class="recommend__box">
  <h2 class="header">{{title}}</h2>
  <ul class="recommendMenu">
    <li v-for="(item , index) in renderData" :key="index" class="recommendMenu__item">
      <a class="recommendMenu__item-link" :href="configs.prefixUrl(item.url)" :title="item.imgAlt">
        <img class="recommendMenu__item-img" :src="configs.checkImgSrc(item.img)" />
        <p class="recommendMenu__item-name">{{item.itemName}}</p>
        <p class="recommendMenu__item-price">{{item.salePrice}}</p>
      </a>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  name: "recommend",
  data() {
    return {
      title: '',
      renderData: [],
    }
  },
  props: {
    data: Array,
    sid: Number
  },
  created() {
    //只選擇tabCode非K40_1的(K40_1為title)
    let arr = [];
    this.data.forEach((ele) => {
      let theItem = ele.cmsItems !== undefined ? ele.cmsItems[0] : null;
      if (ele.tabCode !== "K40_1" && theItem !== undefined) {
        arr.push(theItem)
      } else {
        this.title = theItem.itemName
      }
    });
    this.renderData = arr
  },
  methods: {

  }
};
</script>

<style lang="scss" scoped>
.recommend__box {
  padding: 10px 0;

  .header {
    font-size: 14px;
    font-weight: bold;
    margin: 0 0 10px 0;
    padding: 0 10px;
  }

  .recommendMenu {
    display: flex;
    padding: 10px;

    &__item {
      list-style-type: none;
      padding: 0 6px;
      width: 33%;

      &-link {
        display: inline-block;
        text-decoration: none;
      }

      &-img {
        width: 100%;
      }

      &-name {
        display: -webkit-box;
        overflow: hidden;
        font-size: 1.2rem;
        color: #333333;
        margin-top: 8px;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      &-price {
        text-align: center;
        font-size: 1.8rem;
        font-weight: bold;
        color: #e60012;
        padding: 5px 0;
        margin: 0;
        text-align: center;

        &::before {
          display: inline-block;
          content: "$";
          font-size: 1.2rem;
        }
      }
    }
  }
}

.fed .header {
  color: #004ea2;
}

.sogo .header {
  color: #da332b;
}

.city .header {
  color: #27781e;
}
</style>
