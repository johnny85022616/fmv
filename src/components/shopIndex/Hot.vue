<template>
<div class="hot__box">
  <h2 class="header">熱銷商品</h2>
  <productItem :isSingleAddToCart="true" :itemList="itemList" :fullInfoStyle="false" gaCategoryTitle="小網館首頁">
  </productItem>
</div>
</template>

<script>
import productItem from '../common/productItem.vue';
export default {
  name: "hot",
  props: {
    data: Array,
    sid: Number,
  },
  components: {
    productItem
  },
  computed: {
    itemList() {
      //整理成productItem所要的格式
      return this.data.map(item => {
        let url = this.configs.prefixUrl(item.url);
        let fullInfoStyle = false
        let name = item.itemName
        let restricted = false
        let img = this.configs.checkImgSrc(item.img)
        let soldout = false
        let pid = item.productId
        let cid = 0
        let sid = this.sid
        let promotion = item.labelName === '.' ? '' : item.labelName
        let lifeProduct = false
        let rewardPointInfo = {}
        let pricePrefix = ''
        let price = item.salePrice
        let priceSuffix = ""
        let tags = item.tags
        let payMethodList = item.payMethodList ? item.payMethodList : ['CASH']

        return {
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
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.hot__box {
  padding: 10px 0;

  >div {
    padding: 0 15px;
  }

  .header {
    font-size: 14px;
    font-weight: bold;
    margin: 0 0 10px 0;
    padding: 0 10px;
  }
}
</style>
