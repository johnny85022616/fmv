<template>
  <div class="picture1_6Box">
    <p :class="['catName', { isMain: !item.mainSub }]">
      <font>{{ item.main.cateName }}</font>
      <a v-if="item.main.cateId !== 9999 && hasLink" :href="composeUrl(item.main.cateId)">{{this.catType !=='b'&&this.catType !== null ?"看更深":"看更多"}}</a>
    </p>
    <div v-if="item.main.cateId !== 9999" class="picture1_6Box-main">
      <div @click="tools.goProductPage(e, item.main.pid, item.main)">
        <div class="image">
          <img v-lazy="item.main.image_url" />
        </div>
        <div class="info">
          <p class="name">{{ item.main.name }}</p>
          <div class="iconArea">
            <p v-if="item.main.campaignQty" class="campaignIcon">折({{item.main.campaignQty}})</p>
          </div>
          <div class="priceArea">
            <p v-if="item.main.price!==null" class="price mainLeftPrice">
              {{ tools.priceFormat(item.main.price) }}
            </p>
            <p class="priceSuffix">{{item.main.priceSuffix}}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="item.sub && item.sub.length>0" class="picture1_6Box-other">
      <ul>
        <li v-for="s in item.sub" :key="s.pid" @click="tools.goProductPage(e, s.pid, s)">
          <div class="image">
            <img v-lazy="s.image_url" />
          </div>
          <p class="name">{{ s.name }}</p>
          <div class="iconArea">
            <p v-if="item.main.campaignQty" class="campaignIcon">折({{item.main.campaignQty}})</p>
          </div>
          <div class="priceArea">
            <p v-if="s.price!==null" class="price otherProductPrice">
              {{ tools.priceFormat(s.price) }}
            </p>
            <p class="priceSuffix">{{s.priceSuffix}}</p>
          </div>
        </li>
      </ul>
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
export default {
  name: "picture1_6Box",
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

.picture1_6Box {
  .catName {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 10px;
    background: $downriver;
    &.isMain {
      background-color: $downriver;
    }
    font {
      color: $white;
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
    background-color: $elf-green;
    padding: 10px;
    > div {
      width: 100%;
      background-color: $white;
      display: flex;
      justify-content: space-between;
      box-sizing: border-box;
      font-weight: bold;
      padding: 10px;
      .image {
        position: relative;
        width: 50%;
        aspect-ratio: 1/1;
        border-radius: 5px;
        border: 1px solid $alto;
        img {
          position: absolute;
          width: 100%;
          object-fit: cover;
          border-radius: 5px;
        }
      }
      .info {
        width: 46%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        .name {
          margin-top: 10px;
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          font-size: 1.6rem;
          color: $mine-shaft;
          width: 100%;
        }
        .iconArea {
          width: 100%;
          font-size: 1.2rem;
        }
        .priceArea {
          display: flex;
          align-items: flex-end;
          margin-top: 10px;
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
    }
  }
  &-other {
    padding: 0px 10px 10px 10px;
    margin-bottom: 10px;
    background-color: $elf-green;
    ul {
      display: grid;
      grid-template-columns: repeat(3, 33%);
      gap: 10px 0;
      li {
        background-color: $white;
        .image {
          position: relative;
          width: 85%;
          height: 0px;
          margin: 0 auto;
          padding-bottom: 85%;
          border: 1px solid $ghost;
          border-radius: 10px;
          margin-top: 10px;
          img {
            position: absolute;
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 10px;
          }
        }
        .name {
          padding-top: 5px;
          width: 85%;
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          margin: 0 auto;
          font-size: 1.3rem;
        }
        .iconArea {
          margin: 5px auto 0 auto;
          width: 85%;
        }
        .otherProductPrice {
          display: flex;
          align-items: center;
          font-size: 1.5rem;
        }
        .priceArea {
          // display: flex;
          // align-items: flex-end;
          width: 85%;
          margin: 10px auto 10px auto;
          .priceSuffix {
            margin-left: 5px;
            font-size: 1rem;
            color: $special;
          }
        }
      }
    }
  }
  ul {
    li {
      list-style-type: none;
    }
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