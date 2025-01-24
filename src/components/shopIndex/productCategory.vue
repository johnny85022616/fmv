<template>
<div class="productCategory">
  <h2 class="productCategory__bk">
    <span class="productCategory__bk-title">{{ title }}</span>
    <a class="productCategory__bk-gotoBtn" :href="url">

    </a>
  </h2>
  <productItem :isSingleAddToCart="true" :itemList="itemList" :fullInfoStyle="false" gaCategoryTitle="小網館首頁">
  </productItem>
</div>
</template>

<script>
import productItem from "../common/productItem.vue";
export default {
  name: "productCategory",
  data() {
    return {
      title: "",
      url: '',
    };
  },
  props: {
    data: Array,
    sid: Number,
  },
  components: {
    productItem,
  },
  computed: {
    itemList() {
      //整理成productItem所要的格式
      let arr = [];
      this.data.forEach((item) => {
        let url = this.configs.prefixUrl(item.url);
        let fullInfoStyle = false;
        let name = item.itemName;
        let restricted = false;
        let img = this.configs.checkImgSrc(
          item.img
        );
        let soldout = false;
        let pid = item.productId;
        let cid = 0;
        let sid = this.sid;
        let promotion = item.labelName === "." ? "" : item.labelName;
        let lifeProduct = false;
        let rewardPointInfo = {};
        let pricePrefix = "";
        let price = item.salePrice;
        let priceSuffix = "";
        let tags = item.tags;
        let payMethodList = item.payMethodList ? item.payMethodList : ['CASH']
        if (item.orderNum !== 1) { //orderNum =1 為 title
          arr.push({
            url,
            fullInfoStyle,
            name,
            restricted,
            img,
            soldout,
            pid,
            cid,
            sid,
            promotion,
            lifeProduct,
            rewardPointInfo,
            pricePrefix,
            price,
            priceSuffix,
            tags,
            payMethodList
          });
        } else {
          this.title = item.itemName;
          this.url = this.configs.prefixUrl(item.url) === undefined ? "" : this.configs.prefixUrl(item.url)
        }
      });
      return arr;
    },
  },
};
</script>

<style lang="scss" scoped>
.productCategory {
  padding: 10px 0;

  >div {
    padding: 0 15px;
  }

  &__bk {
    padding: 0 15px;
    background-size: 100% auto;
    background-position: center center;
    background-repeat: no-repeat;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 10px 10px 10px;
    box-sizing: border-box;

    &-title {
      color: #ffffff;
      width: 80%;
      overflow: hidden;
      white-space: nowrap;
      font-size: 1.5rem;
      text-overflow: ellipsis;
    }

    &-gotoBtn {
      background: url(../../images/icons/circle-right.svg);
      width: 20px;
      height: 20px;
    }
  }
}

.fed .productCategory__bk {
  background-image: url(../../images/icons/fed_title_bk.svg);
}

.sogo .productCategory__bk {
  background-image: url(../../images/icons/sogo_title_bk.svg);
}

.city .productCategory__bk {
  background-image: url(../../images/icons/city_title_bk.svg);
}
</style>
