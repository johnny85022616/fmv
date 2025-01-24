<template>
  <div class="pictureThreeBox" :style="{backgroundColor: bgColor? bgColor: '#fff'}">
    <p :class="['catName', { isMain: !item.mainSub }]">
      <font>{{ item.main.cateName }}</font>
      <a v-if="item.main.cateId !== 9999 && hasLink" :href="composeUrl(item.main.cateId)">{{this.catType !=='b'&&this.catType !== null ?"看更深":"看更多"}}</a>
    </p>
    <div v-if="item.main.cateId !== 9999" class="pictureThreeBox-main">
      <div class="left" @click="tools.goProductPage(e, item.main.pid, item.main)">
        <div>
          <div class="image">
            <img v-lazy="item.main.image_url" />
          </div>
          <p class="name">{{ item.main.name }}</p>
          <div class="iconArea">
            <p v-if="item.main.campaignQty" class="campaignIcon">折({{item.main.campaignQty}})</p>
          </div>
        </div>
        <div class="priceArea">
          <p v-if="item.main.price!==null" class="price mainLeftPrice">
            {{ tools.priceFormat(item.main.price) }}
          </p>
          <p class="priceSuffix">{{item.main.priceSuffix}}</p>
        </div>
      </div>
      <div class="right">
        <div v-for="p in item.mainSub" :key="p.pid" @click="tools.goProductPage(e, p.pid, p)">
          <div class="image">
            <img v-lazy="p.image_url" />
          </div>
          <div class="iconArea">
            <p v-if="p.campaignQty" class="campaignIcon">折({{p.campaignQty}})</p>
          </div>
          <div class="priceArea">
            <p v-if="p.price!==null" class="price mainRightPrice">
              {{ tools.priceFormat(p.price) }}
            </p>
            <p class="priceSuffix">{{p.priceSuffix}}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="item.sub && item.sub.length>0" class="pictureThreeBox-other">
      <aiProductItem :showCampaignQtyIcon="true" :itemList="item.sub"></aiProductItem>
    </div>
  </div>
</template>

<script>
/*
  item 傳入格式
  {
    main: type Object (「非專櫃」的首頁若要進L層，main中的catId請帶'/${lid}'，若要近M層main中的catId請帶/${lid}/${mid}，B層以此類推)
    subMain: type Array
    sub: type Array
  }
*/
import aiProductItem from "../../components/common/aiProductItem.vue";
export default {
  name: "pictureThreeBox",
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
    //是否顯示看更多或看更深
    hasLink: {
      type: Boolean,
      default: () => true,
    },
    bgColor: {
      type: String,
    },
  },
  components: {
    aiProductItem,
  },
  methods: {
    //回傳url
    composeUrl(id) {
      this.getCategoryType(id);
      return `/category/${this.deepCategoryTypeForNormal(id)}`;
    },
    getCategoryType(id) {
      if (id.match(/(L[\d]{4})\/(M[\d]{4})\/(B[\d]{4})/)) {
        return false;
      }
      if (id.match(/(L[\d]{4})/)) {
        this.catType = "l";
        return false;
      }
      if (id.match(/(M[\d]{4})/)) {
        this.catType = "m";
        return false;
      }
      if (id.match(/(B[\d]{4})/)) {
        this.catType = "b";
        return false;
      }
    },
    //for /category/${lid}/${mid}/${bid}形式 或首頁
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

      //category頁(url有lid一定是category頁面)
      if (lid) {
        switch (this.catType) {
          case "l":
            return `${id}`;
          case "m":
            return `${lid}/${id}`;
          case "b":
            return `${lid}/${mid}/${id}`;
        }
      } else {
        //首頁
        return id;
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import "../../style/color";
@import "../../style/mixin";

.pictureThreeBox {
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
  &-main {
    display: flex;
    justify-content: space-between;
    padding: 0px 10px 10px;
    background-color: #ddd5cc;
    margin: 0 8px;
    .left {
      width: 60%;
      background-color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      font-weight: bold;
      > div {
        .image {
          position: relative;
          width: 100%;
          height: 0px;
          padding-bottom: 100%;
          margin: 0 auto;
          img {
            position: absolute;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        .name {
          width: 95%;
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          font-size: 1.3rem;
          color: $mine-shaft;
          margin: 10px auto 0 auto;
        }
        .iconArea {
          width: 95%;
          font-size: 1.3rem;
          margin: 10px auto 0 auto;
        }
      }
      .priceArea {
        display: flex;
        align-items: flex-end;
        margin: 10px 0 5px 0;
        .mainLeftPrice {
          font-size: 2rem;
        }
        .priceSuffix {
          margin-left: 5px;
          font-size: 1.4rem;
          color: $special;
        }
      }
    }
    .right {
      width: 37%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      font-weight: bold;
      justify-content: space-between;
      > div {
        background-color: $white;
        &:first-of-type {
          margin-bottom: 10px;
        }
        .image {
          position: relative;
          width: 100%;
          height: 0px;
          padding-bottom: 100%;
          margin: 0 auto;
        }
        img {
          display: inline-block;
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .iconArea {
          font-size: 1.2rem;
          margin-right: 2px;
          padding: 3px;
        }
        .priceArea {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          margin: 5px 0 5px 0;
          .mainRightPrice {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.5rem;
          }
          .priceSuffix {
            margin-left: 3px;
            font-size: 1.1rem;
            color: $special;
          }
        }
      }
    }
  }
  &-other {
    // background-color: $white;
    margin: 15px 8px 0 8px;
  }
  .price {
    color: $red;
    font-size: 2rem;
    &::before {
      content: "$";
      margin-right: 2px;
    }
  }
  .iconArea {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .campaignIcon {
      background-color: $red;
      box-sizing: border-box;
      color: $white;
      border-radius: 5px;
      padding: 2px 5px;
    }
  }
}
</style>