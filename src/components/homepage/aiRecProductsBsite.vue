<template>
  <div class="fourteenShop">
    <div v-if="fourteenShopData && fourteenShopData.length > 0" class="fourteenShop__menu">
      <ul ref="menuBar">
        <li v-for="item in fourteenShopData" :key="item.main.cateId" :class="[{ active: item.main.cateId === nowCategory }]" @click="(e) => changeBarActive(e, item.main.cateId)" :ref="item.main.cateId">
          {{ item.main.cateName }}
        </li>
      </ul>
    </div>
    <div class="fourteenShop__products" v-if="fourteenShopData && fourteenShopData.length > 0">
      <ul class="fourteenShop__products__block-list">
        <li v-for="item in fourteenShopData" :key="item.main.cateId" :ref="`block${item.main.cateId}`">
          <p :class="['catName', { isMain: !item.mainSub }]">
            <font>{{ item.main.cateName }}</font>
            <a v-if="item.main.cateId !== 9999" :href="item.main.look_more_link">看更多</a>
          </p>
          <div v-if="item.mainSub && item.mainSub.length > 0" class="fourteenShop__products-main">
            <div class="left" @click="tools.goProductPage(e, item.main.pid, item.main)">
              <div class="image">
                <img v-lazy="item.main.image_url" />
              </div>
              <p class="name">{{ item.main.name }}</p>
              <p v-if="item.main.price!==null" class="price mainLeftPrice">
                {{ tools.priceFormat(item.main.price) }}
              </p>
            </div>
            <div class="right">
              <div v-for="(p, i) in item.mainSub" :key="i" @click="tools.goProductPage(e, p.pid, p)">
                <div class="image">
                  <img v-lazy="p.image_url" />
                </div>
                <p v-if="p.price!==null" class="price mainRightPrice">
                  {{ tools.priceFormat(p.price) }}
                </p>
              </div>
            </div>
          </div>
          <div class="fourteenShop__products-other">
            <ul>
              <li v-for="(s, i) in item.sub" :key="i" @click="tools.goProductPage(e, s.pid, s)">
                <div class="image">
                  <img v-lazy="s.image_url" />
                </div>
                <p class="name">{{ s.name }}</p>
                <div class="priceBox">
                  <p v-if="s.price!==null" class="price otherProductPrice">
                    {{ tools.priceFormat(s.price) }}
                  </p>
                  <p v-if="s.campaignQty" class="campaignIcon">折({{s.campaignQty}})</p>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "aiRecProductsBsite",
  data() {
    return {
      fourteenShopData: [],
      scatteredData: [],
      nowCategory: "",
    };
  },
  async created() {
    const { siteType, isOthersExposeToMe } = this.siteData ? this.siteData : {};
    const sid = this.siteData.supplierId || "";
    let postData = {
      type: "2",
      q1_x: 0.5,
      supplier_y:
        (siteType === "B1" || siteType === "b1") && isOthersExposeToMe === "N"
          ? 1
          : 0.5, // 若為bSite 且沒有帶 catg=uni 就設定為 1
      list_num: 250,
    };

    postData.filter = {
      k: "1000",
      v: [sid, "", "", ""],
    };
    const data = await this.api.ai.getAiData("getalist", postData);

    if (data && data.length > 0) {
      this.parseData(data);
    }
  },
  props: {
    windowY: {
      type: Number,
      required: true,
    },
  },
  watch: {
    windowY(newVal) {
      //scroll時product區塊連動category區塊
      for (let item of this.fourteenShopData) {
        if (newVal >= item.productBlockHeight - 45 - 44) {
          this.changeBarActive(null, item.main.cateId);
        }
      }
    },
  },
  methods: {
    parseData(data) {
      if (!data) return false;

      const urlSuffix = this.siteData.urlSuffix;
      let tempData = {};

      // 整理1帶2 及 9格資料
      data.forEach((v) => {
        if (!tempData[v.auto_category_id]) {
          tempData[v.auto_category_id] = {
            main: {
              cateId: v.auto_category_id,
              cateName: v.auto_category_id_c,
              name: v.name,
              pid: v.pid,
              image_url: v.image_url,
              price: v.price ? this.tools.priceFormat(v.price) : null,
              supplier_id: v.supplier_id,
              look_more_link:
                "/" +
                urlSuffix +
                "/category/" +
                v.auto_category_id +
                (parseInt(this.siteData.supplierId) !== v.supplier_id &&
                this.siteData.isOthersExposeToMe === "Y"
                  ? "?catg=uni"
                  : ""),
            },
            mainSub: [],
            sub: [],
          };
        } else if (tempData[v.auto_category_id].mainSub.length < 2) {
          tempData[v.auto_category_id].mainSub.push({
            name: v.name,
            pid: v.pid,
            image_url: v.image_url,
            price: v.price ? this.tools.priceFormat(v.price) : null,
          });
        } else {
          tempData[v.auto_category_id].sub.push({
            name: v.name,
            pid: v.pid,
            image_url: v.image_url,
            price: v.price ? this.tools.priceFormat(v.price) : null,
            campaignQty: v.campaignQty,
          });
        }
      });

      const groupData = [];
      let scatterData = [];

      Object.values(tempData).forEach((v) => {
        if (v.mainSub.length === 2 && v.sub.length === 0) {
          groupData.push(Object.assign({}, v));
        } else if (v.sub.length > 0) {
          let calcSubRows = Math.floor(v.sub.length / 3) * 3;
          calcSubRows = calcSubRows > 9 ? 9 : calcSubRows;
          groupData.push(
            Object.assign({}, v, {
              sub: v.sub.slice(0, calcSubRows),
            })
          );

          scatterData = scatterData.concat(
            v.sub.slice(calcSubRows, v.sub.length)
          );
        } else {
          scatterData = scatterData.concat([v.main]);
          scatterData = scatterData.concat(v.mainSub);
          scatterData = scatterData.concat(v.sub);
        }
      });

      groupData.push({
        main: {
          cateId: 9999,
          cateName: "暢銷夯品推薦",
        },
        mainSub: [],
        sub: scatterData,
      });

      this.fourteenShopData = groupData;

      this.nowCategory = groupData[0].main.cateId;

      this.$nextTick(() => {
        this.fourteenShopData = this.fourteenShopData.map((ele) => {
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
          top: productBlockHeight - 120,
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

$bgc: #ddd5cc;

.fourteenShop {
  background: $white;

  &__menu {
    background-color: $white;
    z-index: 1;
    position: sticky;
    position: -webkit-sticky;
    top: 60px;
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
      background: $bgc;

      &.isMain {
        background-color: #d6d6ad;
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
      background-color: $bgc;
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
            margin: 0 auto;
            font-size: 1.3rem;
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
            margin: 0 auto 0px auto;

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
