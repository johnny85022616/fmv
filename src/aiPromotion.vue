<template>
  <div class="aiPromotion">
    <navigation v-if="isShowNavigation" :windowY="200" :isComponentMaskShow="isFilterShow" :directShowSearchInput="true" :isBsite="isBsite" />
    <div class="aiPromotion__products" v-if="data && data.length > 0">
      <p class="aiPromotion__products-aName">{{aName}}</p>
      <div v-if="aImg" class="aiPromotion__products-image" @click="goPromotionPage">
        <img :src="aImg">
      </div>
      <ul class="aiPromotion__products__block-list">
        <li v-for="item in data" :key="item.main.cateId">
          <p :class="['catName', { isMain: !item.mainSub }]">
            <font>{{ item.main.cateName }}</font>
            <a v-if="item.main.cateId !== 9999" :href="'/category/'+item.main.lId+'/'+item.main.cateId">看更多</a>
          </p>
          <div v-if="item.mainSub && item.mainSub.length > 0" class="aiPromotion__products-main">

            <div class="left" @click="tools.goProductPage(e, item.main.pid, item.main)">
              <div class="image">
                <img v-lazy="item.main.image_url" />
              </div>
              <p class="name">{{ item.main.name }}</p>
              <p v-if="item.main.price!=null" class="price mainLeftPrice">
                {{ tools.priceFormat(item.main.price) }}
              </p>
            </div>
            <div class="right">
              <template v-for="p in item.mainSub">
                <div :key="p.cateId" @click="tools.goProductPage(e, p.pid, p)">
                  <div class="image">
                    <img v-lazy="p.image_url" />
                  </div>
                  <p v-if="p.price!=null" class="price mainRightPrice">
                    {{ tools.priceFormat(p.price) }}
                  </p>
                </div>
              </template>
            </div>
          </div>
          <div class="aiPromotion__products-other">
            <ul>
              <li v-for="s in item.sub" :key="s.cateId" @click="tools.goProductPage(e, s.pid, s)">
                <div class="image">
                  <img v-lazy="s.image_url" />
                </div>
                <p class="name">{{ s.name }}</p>
                <p v-if="s.price!==null" class="price otherProductPrice">
                  {{ tools.priceFormat(s.price) }}
                </p>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <div class="aiPromotion__products__block-list">
        <div class="aiPromotion__products-other bottom">
          <p class="aiPromotion__products-title">更多商品</p>
          <ul>
            <li v-for="s in aOtherDatas" :key="s.cateId" @click="tools.goProductPage(e, s.pid, s)">
              <div class="image">
                <img v-lazy="s.image_url" />
              </div>
              <p class="name">{{ s.name }}</p>
              <p v-if="s.price!==null" class="price otherProductPrice">
                {{ tools.priceFormat(s.price) }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-else class="aiPromotion__gProducts">
      <a class="aiPromotion__gProducts-imgUrl" v-if="bImgUrl && bImg" :href="bImgUrl">
        <img class="aiPromotion__gProducts-img" :src="bImg">
      </a>
      <img v-if="bImg && !bImgUrl" class="aiPromotion__gProducts-img" :src="bImg">
      <p v-if="gData.length>0" class="aiPromotion__gProducts-bName">{{this.bName}}</p>
      <aiProductItem v-if="gData.length>0" :itemList="gData" :isTwoColumn="true" />
      <aiProductItem v-else-if="fetmcData.length>0" :itemList="fetmcData" :isTwoColumn="true" :isFromFetmcPromotion="true" />
    </div>
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import aiProductItem from "./components/common/aiProductItem.vue";
export default {
  name: "aiPromotion",
  data() {
    return {
      windowY: 0,
      currentY: 0,
      isAtBottom: false,
      pids: null,
      page: 0,
      totalPage: 0, //總頁數
      isApiOk: true,
      data: null, //策展資料
      aName: null, //策展名
      aImg: null, //策展banner圖片
      aImgLink: null, //策展banner連結
      aOtherDatas: [], //sub不滿6品的種類不會加入上面分類顯示單，統一顯示在最下方
      gData: [], //集合目錄資料
      bName: null, //集合目錄名
      bImgUrl: null,
      bImg: null,
      layoutType: "two",
      isBsite: false,
      isFilterShow: false,
      dueToBottomGap: window.innerHeight / 2,
      fetmcData: [],
      isShowNavigation: true, // 是否顯示公用天
    };
  },
  async created() {
    window.productsPool = {};

    if (this.siteData) {
      this.isBsite = true;
    }

    let promotionId;
    if (window.isLocal) {
      const param = this.tools.urlSearchToObj();
      promotionId = param.promotionId;
    } else {
      const promotionIdMatch = location.href.match(/[^/]+(?=\/$|$)/); //取得Bid
      if (promotionIdMatch && promotionIdMatch.length > 0) {
        promotionId = promotionIdMatch[0];
      }
    }

    window.addEventListener(
      "scroll",
      () => {
        const wy = window.scrollY;
        this.windowY = wy;
        this.currentY = wy !== 70 && wy !== 0 ? wy : this.currentY;
        if (
          window.innerHeight + wy + this.dueToBottomGap >=
          document.body.scrollHeight
        ) {
          this.isAtBottom = true;
        } else {
          this.isAtBottom = false;
        }
      },
      {
        passive: true,
      }
    );

    if (/^A/.test(promotionId)) {
      const { keyword, supplierIds } = await this.getKeyWordByPromotionId(
        promotionId
      );
      this.getProductByKeyword(keyword, supplierIds);
    } else if (/^fetmc_appfcoin/i.test(promotionId)) {
      this.isShowNavigation = false;
      this.pids = await this.getFetmcData();
    } else {
      this.pids = await this.getPidsByPromotionId(promotionId);
      this.getSearchBatch();
    }
  },
  methods: {
    //取得策展主題keyword
    async getKeyWordByPromotionId(promotionId) {
      const data = await fetch(
        `https://front.shopping.friday.tw/frontendapi/ai/promotion/curate/${promotionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res && res.resultData) {
            const { name, image, url } = res.resultData;
            this.aName = name;
            this.aImg = image;
            this.aImgLink = url;
            return {
              keyword: res.resultData.keyword,
              supplierIds: res.resultData.supplierIds,
            };
          } else {
            location.href = "/";
          }
        })
        .catch((err) => {
          console.error(`getKeyWordByPromotionId faliure.123`);
          console.error(err);
        });
      return data;
    },
    //利用keyword取得策展所有product
    async getProductByKeyword(keyWord, suIds = "") {
      let postData = {
        supplier_y: suIds ? 1 : 0,
        list_num: 500,
        type: 2,
      };

      postData.filter = this.api.ai.composeBListFilter(suIds, "", "", keyWord);

      const data = await this.api.ai.getAiData("getalist", postData);
      if (data && data.length > 0) {
        this.parseApromotionData(data);
      }
    },
    //取得集合目錄資料
    async getPidsByPromotionId(promotionId) {
      const data = await fetch(
        `${this.configs.frontApiPath()}ai/promotion/gather/${promotionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res && res.resultData) {
            this.bName = res.resultData.name;
            this.bImgUrl = res.resultData.url;
            this.bImg = res.resultData.image;
            if (typeof res.resultData.value === "string") {
              return res.resultData.value.split(",");
            }
          } else {
            location.href = "/";
          }
        })
        .catch((err) => {
          console.error(`getKeyWordByPromotionId faliure.`);
          console.error(err);
        });
      return data;
    },
    //取得新生活遠傳幣目錄資料
    async getPidsByFcoin() {
      const data = await fetch(
        `https://m.shopping.friday.tw/mobileapi/catalog/categories/415560/products?cid=415560&page=1&sid=872&mid=4&level=3&num=500&complexDiscount=0&imgType=3&orderBy=md`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res && res.payload) {
            this.bName = res.payload.categoryName;
            if (typeof res.payload.bottomCategoryProducts === "object") {
              return res.payload.bottomCategoryProducts
                .filter((v) => v.lifeProduct && !v.isSoldout)
                .map((v) => v.productId);
            }
          }
        })
        .catch((err) => {
          console.error(`getPidsByFcoin faliure.`);
          console.error(err);
        });
      return data;
    },
    //取得集合目錄資料response condition為3
    async getSearchBatch() {
      let pidArr;
      let allpostData;
      let fetchData;

      pidArr = this.pids;
      if (pidArr && pidArr.length > 0) {
        this.totalPage =
          pidArr.length % 10 !== 0
            ? Math.floor(pidArr.length / 10 + 1)
            : Math.floor(pidArr.length / 10);
        allpostData = pidArr;
        this.isApiOk = false;
        fetchData = allpostData.slice(this.page * 10, (this.page + 1) * 10);

        const productInfo = await this.tools.getPidsInfo(fetchData);
        if (productInfo && Object.keys(productInfo).length > 0) {
          const dArr = [];
          fetchData.forEach((v) => {
            const ele = productInfo[v];
            if (ele) {
              dArr.push({
                image_url: ele.image_url,
                name: ele.name,
                price: ele.price || null,
                pid: v,
              });
            }
          });
          this.gData = this.gData.concat(dArr);
          this.$nextTick(() => {
            if (this.page < this.totalPage) {
              this.page += 1;
              this.isApiOk = true;
              this.isAtBottom = false;
            }
          });
        } else {
          console.log("v2/productInfo no data.");
          if (this.page < this.totalPage - 1) {
            this.page += 1;
            this.getSearchBatch();
          }
        }
      }
    },
    //策展主題資料整理
    parseApromotionData(data) {
      if (!data) return false;

      let tempData = {};
      data.forEach((v) => {
        if (!tempData[v.auto_category_id_M]) {
          tempData[v.auto_category_id_M] = {
            main: {
              lId: v.auto_category_id_L,
              cateId: v.auto_category_id_M,
              cateName: v.auto_category_id_M_c,
              name: v.name,
              pid: v.pid,
              image_url: v.image_url,
              price: this.tools.priceFormat(v.price),
            },
            mainSub: [],
            sub: [],
          };
        } else if (tempData[v.auto_category_id_M].mainSub.length < 2) {
          tempData[v.auto_category_id_M].mainSub.push({
            name: v.name,
            pid: v.pid,
            image_url: v.image_url,
            price: this.tools.priceFormat(v.price),
          });
        } else {
          tempData[v.auto_category_id_M].sub.push({
            name: v.name,
            pid: v.pid,
            image_url: v.image_url,
            price: this.tools.priceFormat(v.price),
          });
        }
      });

      const groupData = [];

      Object.values(tempData).forEach((v) => {
        if (v.sub.length > 6) {
          let calcSubRows = Math.floor(v.sub.length / 3) * 3;
          calcSubRows = calcSubRows > 9 ? 9 : calcSubRows;
          groupData.push(
            Object.assign({}, v, {
              sub: v.sub.slice(0, calcSubRows),
            })
          );
          if (v.sub.length > 9) {
            this.aOtherDatas = this.aOtherDatas.concat(v.sub.slice(9));
          }
        } else {
          const mainData = {
            name: v.main.name,
            image_url: v.main.image_url,
            pid: v.main.pid,
            price: v.main.price,
          };
          this.aOtherDatas.push(mainData);
          v.mainSub.forEach((ele) => this.aOtherDatas.push(ele));
          v.sub.forEach((ele) => this.aOtherDatas.push(ele));
        }
      });
      this.data = groupData;
    },
    //點擊A banner導轉
    goPromotionPage() {
      location.href = this.aImgLink;
    },

    //取得心生活_特選品資料
    async getFetmcData() {
      this.fetmcData = await this.getaList();
    },

    async getaList() {
      let postData = {
        type: "2",
        q1_x: 0.5,
        supplier_y: 0.5,
        list_num: 500,
      };

      // 排除愛買243 及情趣L0006
      postData.filter = this.api.ai.composeBListFilter("", "243", "!!L0006", "");
      let data = await this.api.ai.getAiData("getalist", postData);

      // 過濾沒有貨
      data = data.filter((v) => v.isQuantity === 1);
      data = data.map((ele) => ({
        ...ele,
        img: ele.image_url,
        image_url: ele.image_url,
        exSearch: "&fcoin=exchange",
      }));
      return data;
    },
  },
  watch: {
    isAtBottom(newVal) {
      //gData.length >0 為取得集合目錄資料
      if (
        this.gData.length > 0 &&
        this.page < this.totalPage &&
        this.isApiOk &&
        newVal
      ) {
        this.getSearchBatch();
      }
    },
  },
  components: {
    navigation,
    aiProductItem,
  },
};
</script>

<style lang="scss">
@import "./style/reset.module.scss";
@import "./style/flex.module.scss";
@import "./style/rwd.module.scss";
@import "./style/icons.module.scss";
@import "./style/global.module.scss";
</style>

<style lang="scss" scoped>
@import "./style/color";
@import "./style/mixin";
.aiPromotion {
  background: $white;
  &__menu {
    background-color: $white;
    z-index: 1;
    position: sticky;
    position: -webkit-sticky;
    top: 45px;
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
    padding-top: 10px;
    &-aName {
      margin: 10px 8px;
      font-size: 1.8rem;
      font-weight: bold;
      color: $mine-shaft;
    }
    &-image {
      margin: 0 8px 10px 8px;
      img {
        width: 100%;
        object-fit: cover;
      }
    }
    &-title {
      font-size: 1.6rem;
      font-weight: bold;
      color: $mine-shaft;
      margin: 0 10px 10px 10px;
    }
    .catName {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 8px;
      padding: 10px 15px;
      background: #d6d6ad;
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
      li {
        margin-bottom: 10px;
      }
    }
    &-main {
      display: flex;
      justify-content: space-between;
      padding: 0px 10px 10px;
      background-color: #d6d6ad;
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
          -webkit-line-clamp: 2;
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
            -webkit-line-clamp: 2;
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
  &__gProducts {
    padding: 0 20px;
    margin: 20px 0 60px 0;
    &-bName {
      margin: 10px 8px;
      font-size: 1.8rem;
      font-weight: bold;
      color: $mine-shaft;
    }
    &-img {
      width: 100%;
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
.bottom {
  margin-bottom: 60px;
}
</style>
