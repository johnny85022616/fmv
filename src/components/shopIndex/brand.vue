<template>
<div :class="classObj">
  <h2 v-if="row === 1" class="header">品牌推薦</h2>
  <ul class="brandMenu">
    <li class="brandMenu__item" v-for="(item, index) in data" :key="index">
      <a class="brandMenu__item-link" :href="configs.prefixUrl(item.url)" :title="item.imgAlt">
        <img class="brandMenu__item-img" :src="configs.checkImgSrc(item.img)" />
        <p class="brandMenu__item-price">{{ item.salePrice }}</p>
      </a>
    </li>
  </ul>
</div>
</template>

<script>
export default {
  data() {
    return {
      classObj: {
        brand__box: true,
        row1: true,
        row2: false,
      },
    };
  },
  name: "brand",
  props: {
    data: Array,
    row: { //行數
      type: Number,
      default: () => 1,
    },
  },
  created() {
    if (this.row === 2) {
      this.classObj.row1 = false;
      this.classObj.row2 = true;
    }
  },
};
</script>

<style lang="scss" scoped>
.brand__box {
  padding: 10px 0 10px 10px;

  &.row1 {
    .header {
      font-size: 14px;
      font-weight: bold;
      margin: 0 0 10px 0;
    }

    .brandMenu {
      display: flex;
      overflow: auto;
      padding: 0px;
      margin: 0px;

      &__item {
        margin-right: 10px;
        list-style-type: none;

        &-link {
          display: inline-block;
          margin-right: 10px;
          text-decoration: none;
        }

        &-img {
          width: 100px;
          object-fit: contain;
          border: 1px solid #efefef;
          box-sizing: border-box;
        }
      }
    }
  }

  &.row2 {
    overflow: auto;
    background: #f4f4f4;
    margin: 10px 0;

    .brandMenu {
      display: flex;
      flex-wrap: wrap;
      width: 600px;

      &__item {
        display: flex;
        width: 80px;
        height: 80px;
        background: #ffffff;
        padding: 10px;
        margin: 2px;
        box-sizing: border-box;
        border-radius: 10px;
        box-shadow: 0 2px 3px rgb(58 58 58 / 30%);
        align-items: center;

        &_link {
          display: inline-block;
          width: 100%;
          margin-right: 10px;
          text-decoration: none;
        }

        &-img {
          width: 100%;
          object-fit: contain;
          box-sizing: border-box;
        }
      }
    }
  }
}
</style>
