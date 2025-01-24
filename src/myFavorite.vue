<template>
  <div class="myFavorite">
    <navigation :isShowRedTop="isShowRedTop" :windowY="200" v-on:stopBodyScroll="stopBodyScroll" />
    <div v-if="isFridayLoginBtnShow" class="loginBtn">
      <a :href="this.api.member.loginUrl()">登入會員</a>
    </div>
    <template v-else>
      <div class="myFavorite__title">
        <i></i>
        <p>我的最愛</p>
      </div>
      <div class="myFavorite__list">
        <ul v-if="favoriteData && favoriteData.length > 0">
          <li v-for="item of favoriteData" :key="item.pid">
            <div class="image">
              <img :src="item.image_url" alt="">
            </div>
            <div class="info">
              <a @click="()=>gotoProductPage(item.pid)">
                <p class="name">{{item.name}}</p>
              </a>
              <p v-if="item.price!==null" class="price">{{item.price}}</p>
              <div class="button">
                <span class="delete" @click="deletePrd(item.pid)">刪除</span>
                <span v-if="item.soldOut" class="soldOut">補貨中</span>
                <span v-else @click="()=>gotoProductPage(item.pid)" class="addCart">加入購物車</span>
              </div>
            </div>
          </li>
        </ul>
        <p v-else-if="favoriteData && favoriteData.length === 0" class="noDataMessage">查無我的最愛資料</p>
      </div>
      <div class="myFavorite__notice">
        <p>注意事項：</p>
        <ul>
          <li>我的最愛共可放入 100 項商品，以放入時間起算，三個月後自動刪除。</li>
          <li>已停售的商品，將自動從我的最愛中移除，不再另行通知。</li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列

export default {
  name: "shoppingCheat",
  data() {
    return {
      isShowRedTop: true,
      windowY: 0,
      isStopScrolling: false,
      favoriteData: null,
      isBsite: false,
      isFridayLoginBtnShow: false,
    };
  },
  components: {
    navigation,
  },
  methods: {
    stopBodyScroll(action, jumpCurrentY = true) {
      const body = document.body;
      if (!this.isStopScrolling) {
        body.style = "padding:0;margin:0;overflow:hidden;height:100%";
        this.isStopScrolling = !this.isStopScrolling;
      }
      if (action === "close") {
        body.style = "padding:0;margin:0;";
        if (jumpCurrentY) {
          setTimeout(() => {
            window.scrollTo(0, this.currentY);
          }, 0);
        }
        this.isStopScrolling = false;
      }
    },
    //取得本站所有我的最愛商品
    async getFavoriteData() {
      const isLogin = this.api.member.isLogin;

      //未登入
      if (!isLogin) {
        this.isFridayLoginBtnShow = true;
        return;
      }
      const data = await this.api.product.queryFavorite();
      if (!data) {
        this.favoriteData = [];
      }
      this.favoriteData = data.map((p) => {
        return {
          ...p,
          price: p.price || null,
          pid: p.productId,
          image_url: p.imageUrl,
        };
      });
    },

    //取得B站所有我的最愛商品
    async getBsiteFavoriteData() {
      const url = `${this.configs.ysdtDomain()}/FetchFavorite/list_favorite`;

      fetch(url, {
        method: "POST",
        body: JSON.stringify({
          site_type: this.siteData.siteType,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            let d = res.data;
            d = d.map((ele) => {
              return { ...ele, price: ele.price || null };
            });
            this.favoriteData = d;
          } else {
            this.favoriteData = [];
            console.error(`getBsiteFavoriteData faliure`);
          }
        });
    },
    //刪除本站指定的商品
    async delteFavorite(pid) {
      const data = await this.api.product.deleteFavorite(pid);
      if (data.resultCode === 0) {
        this.getFavoriteData();
      }
    },
    //刪除B站指定的商品
    deleteBsiteFavorite(pid) {
      const url = `${this.configs.ysdtDomain()}/FetchFavorite/del_favorite`;

      fetch(url, {
        method: "POST",
        body: JSON.stringify({
          site_type: this.siteData.siteType,
          pid,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 200) {
            this.getBsiteFavoriteData();
          } else {
            console.error(`deleteBsiteFavorite faliure`);
          }
        });
    },
    async deletePrd(pid) {
      if (this.isBsite) {
        this.deleteBsiteFavorite(pid);
      }
      this.delteFavorite(pid);
    },
    //前往單品頁
    gotoProductPage(pid) {
      if (this.isBsite) {
        let urlSuffix = this.siteData.urlSuffix;
        location.href = `/${urlSuffix}/product/${pid}`;
      } else {
        location.href = `/product?pid=${pid}`;
      }
    },
  },
  async created() {
    window.addEventListener(
      "scroll",
      () => {
        const wy = window.scrollY;
        this.windowY = wy;
        this.currentY = wy !== 70 && wy !== 0 ? wy : this.currentY;
        this.isShowRedTop = wy > 0 ? false : true;
      },
      {
        passive: true,
      }
    );
    this.seo.common();

    if (this.siteData) {
      this.isBsite = true;
      await this.getBsiteFavoriteData();
      return;
    }
    await this.getFavoriteData();
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
@import "./style/_color.scss";
.myFavorite {
  .loginBtn {
    display: flex;
    a {
      width: 70%;
      padding: 8px;
      display: inline-block;
      font-size: 15px;
      border-radius: 4px;
      color: $white;
      margin: 200px auto;
      background-color: $red;
      text-align: center;
    }
  }
  margin-bottom: 80px;
  &__title {
    padding: 10px 15px;
    display: flex;
    align-items: center;
    i {
      width: 40px;
      height: 40px;
      background: url(./images/icons/coupon_icon.png) center/40px no-repeat;
      margin-right: 10px;
    }
    p {
      font-size: 2rem;
      color: $clementine;
      font-weight: bold;
    }
  }
  &__notice {
    color: $grayapprox;
    padding: 10px 15px;
    ul {
      margin-top: 10px;
      font-size: 1.2rem;
      margin-left: 15px;
      list-style-type: disc;
      li {
        margin-top: 5px;
      }
    }
  }
  &__list {
    ul {
      li {
        padding: 15px;
        border-bottom: 1px solid $alto;
        display: flex;
        &:first-of-type {
          border-top: 1px solid $alto;
        }
        .image {
          margin-right: 15px;
          img {
            object-fit: cover;
            width: 80px;
            height: 80px;
          }
        }
        .info {
          flex-grow: 1;
          .name {
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            line-height: 20px;
            max-height: 40px;
            color: $mariner;
          }
          .price {
            color: $red;
            font-size: 16px;
            margin-top: 5px;
            &::before {
              content: "$";
              font-size: 12px;
            }
          }
          .button {
            display: flex;
            justify-content: flex-end;
            span {
              padding: 8px;
              display: inline-block;
              border-radius: 4px;
              color: $white;
              margin-right: 5px;
              &:last-of-type {
                margin-right: 0;
              }
            }
            .delete,
            .soldOut {
              background-color: $sliver;
            }
            .addCart {
              background-color: $dodger-blue;
            }
          }
        }
      }
    }
    .noDataMessage {
      display: flex;
      justify-content: center;
      margin: 100px 0 200px 0;
      font-size: 2rem;
      font-weight: bold;
    }
  }
  a {
    text-decoration: unset;
  }
}
</style>
