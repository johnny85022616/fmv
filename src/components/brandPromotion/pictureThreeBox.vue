<template>
  <div class="pictureThreeBox">
    <p :class="['catName', { isMain: !item.mainSub }]">
      <font>{{ item.main.cateName }}</font>
      <a v-if="item.main.cateId !== 9999" :href="composeUrl(item.main.cateId)">
        {{ item.main.hasSub ? '看更深' : '看更多' }}
      </a>
    </p>
    <div v-if="item.main.cateId !== 9999" class="pictureThreeBox-main">
      <div class="left" @click="tools.goProductPage(e, item.main.pid, item.main)">
        <div class="image">
          <img v-if="lazy" v-lazy="item.main.image_url" />
          <img v-else :src="item.main.image_url" />
        </div>
        <p class="name">{{ item.main.name }}</p>
        <p v-if="item.main.price !== null" class="price mainLeftPrice">
          {{ tools.priceFormat(item.main.price) }}
        </p>
      </div>
      <div class="right">
        <div v-for="p in item.mainSub" :key="p.cateId" @click="tools.goProductPage(e, p.pid, p)">
          <div class="image">
            <img v-if="lazy" v-lazy="p.image_url" />
            <img v-else :src="p.image_url" />
          </div>
          <p v-if="p.price !== null" class="price mainRightPrice">
            {{ tools.priceFormat(p.price) }}
          </p>
        </div>
      </div>
    </div>
    <div v-if="item.sub.length > 0" class="pictureThreeBox-other">
      <ul>
        <li v-for="s in item.sub" :key="s.cateId" @click="tools.goProductPage(e, s.pid, s)">
          <div class="image">
            <img v-lazy="s.image_url" />
          </div>
          <p class="name">{{ s.name }}</p>
          <div class="priceBox">
            <p v-if="s.price !== null" class="price otherProductPrice">
              {{ tools.priceFormat(s.price) }}
            </p>
            <p v-if="s.campaignQty" class="campaignIcon">折({{ s.campaignQty }})</p>
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
    urlCidAry: {
      type: Array,
      default: () => []
    },
    hasSub: {
      type: Boolean,
      default: () => false,
    },
    lazy: {
      type: Boolean,
      default: () => true,
    },
  },
  created() {
  },
  methods: {
    //回傳url
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
      box-sizing: border-box;
      font-weight: bold;

      .image {
        position: relative;
        width: 100%;
        height: 0px;
        padding-bottom: 100%;

        img {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .name {
        width: 95%;
        margin-top: 10px;
        font-size: 1.3rem;
        color: $mine-shaft;
        @include font-break(2);
      }

      .mainLeftPrice {
        margin-top: 10px;
        font-size: 2rem;
      }
    }

    .right {
      width: 37%;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      font-weight: bold;
      justify-content: space-between;

      >div {
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

        .mainRightPrice {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.5rem;
        }
      }
    }
  }

  &-other {
    background-color: $white;
    padding: 15px 0px 0px;

    ul {
      display: flex;
      flex-wrap: wrap;

      li {
        width: 33.33333%;
        margin-bottom: 10px;

        .image {
          position: relative;
          width: 85%;
          height: 0px;
          margin: 0 auto;
          padding-bottom: 85%;
          border: 1px solid $ghost;
          border-radius: 10px;

          img {
            position: absolute;
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 10px;
          }
        }

        .name {
          width: 85%;
          margin: 0 auto;
          font-size: 1.3rem;
          @include font-break(2);
        }

        .otherProductPrice {
          display: flex;
          align-items: center;
          font-size: 1.5rem;
        }

        .priceBox {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 85%;
          margin: 0 auto;

          .campaignIcon {
            background-color: $red;
            box-sizing: border-box;
            color: $white;
            border-radius: 5px;
            padding: 0 3px;
            font-size: 1.2rem;
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
}
</style>