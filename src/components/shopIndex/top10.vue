<template>
<div class="topTen__box">
  <div class='wrap'>
    <h2 class="header">銷售排行榜</h2>
    <ul class="saleMarket">
      <li class="saleMarket__item" v-for="(item, index) in data" :key="index">
        <a class="saleMarket__item-link" :href="configs.prefixUrl(item.url)" :title="item.imgAlt">
          <span class="saleMarket__item-icon">{{item.orderNum}}</span>
          <img class="saleMarket__item-img" :src="configs.checkImgSrc(item.img)" />
          <p class="saleMarket__item-price">{{item.salePrice}}</p>
        </a>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
export default {
  name: "topTen",
  props: {
    data: Array,
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.topTen__box {
  background: #f4f4f4;
  padding: 10px 0;

  .wrap {
    background: #ffffff;
    padding: 10px 0 10px 10px;

    .header {
      font-size: 14px;
      font-weight: bold;
      margin: 0 0 10px 0;
    }

    .saleMarket {
      display: flex;
      overflow: auto;
      padding: 0px;
      margin: 0px;

      &__item {
        list-style-type: none;
        margin-right: 10px;

        &-link {
          position: relative;
          display: inline-block;
          text-decoration: none;
        }

        &-icon {
          position: absolute;
          width: 17px;
          height: 22px;
          font-size: 12px;
          top: 1px;
          left: 0;
          text-align: center;
          color: #fff;
          background: url('../../images/icons/tag.svg')
        }

        &-img {
          width: 125px;
          height: 125px;
          object-fit: contain;
          border: 1px solid #efefef;
        }

        &-price {
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          color: #e60012;
          padding: 5px 0;
          margin: 0;

          &::before {
            display: inline-block;
            content: "$";
            font-size: 10px;
          }
        }
      }
    }
  }
}
</style>
