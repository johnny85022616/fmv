<template>
  <div class="fourteenShop">
    <div v-if="data && data.length > 0" class="fourteenShop__menu">
      <ul ref="menuBar">
        <li v-for="item in data" :key="item.main.cateId" :class="[{ active: item.main.cateId === nowCategory }]" @click="(e) => changeBarActive(e, item.main.cateId)" :ref="item.main.cateId">
          {{ item.main.cateName }}
        </li>
      </ul>
    </div>
    <div class="fourteenShop__products" v-if="data && data.length > 0">
      <ul class="fourteenShop__products__block-list">
        <li v-for="item in data" :key="item.main.cateId" :ref="`block${item.main.cateId}`">
          <template v-if="(item.mainSub && item.mainSub.length === 2)||item.main.cateId === 9999">
            <pictureThreeBox v-if="siteData && item" :supplierData="siteData" :item="item" />
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import pictureThreeBox from "../common/pictureThreeBox.vue";
export default {
  name: "aiRecProducts",
  data() {
    return {
      nowCategory: "",
      data: null,
      scatteredData: [],
    };
  },
  components: {
    pictureThreeBox,
  },
  async created() {
    this.parseData(JSON.parse(JSON.stringify(this.listData)));
  },
  props: {
    windowY: {
      type: Number,
      required: true,
    },
    listData: {
      type: Array,
    },
  },
  watch: {
    windowY(newVal) {
      //scroll時product區塊連動category區塊
      for (let item of this.data) {
        if (newVal >= item.productBlockHeight - 115) {
          this.changeBarActive(null, item.main.cateId);
        }
      }
    },
  },
  methods: {
    parseData(data) {
      if (!data) return false;

      let tempData = {};
      data.forEach((v) => {
        if (!tempData[v.bid]) {
          tempData[v.bid] = {
            main: {
              cateId: `${v.lid}/${v.mid}/${v.bid}`,
              cateName: v.bidName,
              name: v.name,
              pid: v.pid,
              image_url: v.image_url,
              price: v.price ? this.tools.priceFormat(v.price) : null,
            },
            mainSub: [],
            sub: [],
          };
        } else if (tempData[v.bid].mainSub.length < 2) {
          tempData[v.bid].mainSub.push({
            name: v.name,
            pid: v.pid,
            image_url: v.image_url,
            price: v.price ? this.tools.priceFormat(v.price) : null,
          });
        } else {
          tempData[v.bid].sub.push({
            lid: v.lid,
            catName: v.bidName,
            name: v.name,
            pid: v.pid,
            image_url: v.image_url,
            price: v.price ? this.tools.priceFormat(v.price) : null,
            campaignQty: v.campaignQty,
          });
        }
      });

      const groupData = [];
      Object.values(tempData).forEach((v) => {
        if (v.sub.length >= 3) {
          let calcSubRows = Math.floor(v.sub.length / 3) * 3;
          calcSubRows = calcSubRows > 9 ? 9 : calcSubRows;
          groupData.push(
            Object.assign({}, v, {
              sub: v.sub.slice(0, calcSubRows),
            })
          );
          if (v.sub && v.sub.slice(calcSubRows).length > 0) {
            v.sub
              .slice(calcSubRows)
              .forEach((ele) => this.scatteredData.push(ele)); //顯示出來以外的放入暢銷夯品
          }
        } else if (v.mainSub.length === 2 && v.sub.length < 3) {
          //數量介於3~5
          groupData.push(
            Object.assign({}, v, {
              sub: [],
            })
          );
        } else {
          //不足3筆的放入暢銷夯品
          this.scatteredData.push(v.main);
          if (v.mainSub && v.mainSub.length > 0) {
            v.mainSub.forEach((ele) => this.scatteredData.push(ele));
          }
          if (v.sub && v.sub.length > 0) {
            v.sub.forEach((ele) => this.scatteredData.push(ele));
          }
        }
      });

      groupData.push({
        main: {
          cateId: 9999,
          cateName: "暢銷夯品推薦",
        },
        mainSub: [],
        sub: [],
      });

      this.data = groupData;
      groupData[groupData.length - 1].sub = this.scatteredData;

      this.nowCategory = groupData[0].main.cateId;

      this.$nextTick(() => {
        this.data = this.data.map((ele) => {
          const productBlockHeight =
            this.$refs[`block${ele.main.cateId}`][0].offsetTop;
          return {
            ...ele,
            productBlockHeight,
          };
        });
      });
    },
    changeBarActive(e, catId) {
      //點擊的category滾動到bar中間
      if (!e) {
        this.nowCategory = catId;
        const mBar = this.$refs.menuBar;
        const catEle = this.$refs[catId][0];
        const catEleLeft =
          catEle.offsetLeft - (window.innerWidth - catEle.offsetWidth) / 2;
        mBar.scrollTo({
          left: catEleLeft,
        });
      }
      //滾動到對應product
      else {
        const productBlockHeight = this.$refs[`block${catId}`][0].offsetTop;
        window.scrollTo({
          top: productBlockHeight - 115,
          behavior: "smooth",
        });
      }
    },
    goProductPage(pid) {
      this.tools.goProductPage(pid);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/color";
@import "../../style/mixin";

.fourteenShop {
  background: $white;
  &__menu {
    background-color: $white;
    z-index: 1;
    position: sticky;
    position: -webkit-sticky;
    top: 59px;
    left: 0;
    ul {
      width: 100%;
      padding: 0 20px;
      overflow: auto;
      white-space: nowrap;
      box-sizing: border-box;
      margin-bottom: 10px;
      @include shadow();

      &::-webkit-scrollbar {
        display: none;
      }

      li {
        padding: 10px;
        font-size: 1.6rem;
        color: $mine-shaft;
        display: inline-block;
        &.active {
          color: $red;
          border-bottom: 2px solid $red;
        }
      }
    }
  }
  &__products {
    .catName {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 8px;
      padding: 10px 15px;
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
        color: $blue;
        font-size: 1.4rem;
        text-decoration: none;
      }
    }
    &__block-list {
      > li {
        &:last-of-type {
          margin-bottom: 70px;
        }
      }
      li {
        margin-bottom: 10px;
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
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          line-clamp: 2;
          font-size: 1.3rem;
          color: $mine-shaft;
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
            padding-top: 5px;
            width: 85%;
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            line-clamp: 2;
            margin: 0 auto;
            font-size: 1.3rem;
          }
          .otherProductPrice {
            width: 85%;
            display: flex;
            align-items: center;
            margin: 0 auto 0px auto;
            font-size: 1.5rem;
          }
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
</style>
