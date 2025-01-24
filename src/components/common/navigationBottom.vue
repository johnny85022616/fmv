<template>
  <div :class="['navigation-bottom-bar', { 'is-bsite': supplierData }]">
    <a :href="setHomepageUrl"
      >首頁
      <i :class="`${supplierData ? 'homepage_bk' : 'homepage'}`"></i>
    </a>
    <a href="#" @click="openMenu($event)"
      >全分類
      <i :class="`${supplierData ? 'catalog_bk' : 'catalog'}`"></i>
    </a>
    <a :href="setCartUrl"
      >購物車
      <i :class="`${supplierData ? 'shoppingcart_bk' : 'shoppingcart'}`"></i>
      <span class="countShoppingBag">{{ cartCount }}</span>
    </a>
    <a :href="viewedUrl"
      >我的最愛
      <i :class="`${supplierData ? 'viewed_bk' : 'viewed'}`"></i>
    </a>
    <a href="#" @click.prevent="openMyProfile"
      >我的
      <i :class="`${supplierData ? 'mine_bk' : 'mine'}`"></i>
    </a>
  </div>
</template>

<script>
  export default {
    name: 'navigationBottom',
    data() {
      return {
        cartCount: 0,
        cartType: 1,
        cartTypeNum: 0,
      };
    },
    created() {
      this.getCart();
    },
    props: {
      supplierData: {
        type: Object,
      },
    },
    watch: {
      supplierData(n) {
        const { cartCount } = n;
        if (cartCount !== undefined) {
          this.cartCount = cartCount;
          window.sessionStorage.setItem('cartCount', this.cartCount);
        }
      },
    },
    methods: {
      getCart() {
        this.api.cart.getCartBagCount().then(num => {
          this.cartCount = num;
        })
      },
      openMenu(evt) {
        this.$emit('showMenu', evt);
      },
      openMyProfile() {
        if (this.api.member.isLogin && !this.siteData) {
          //登入狀態轉會員中心頁
          location.href = '/memberCenter';
          return;
        }
        //未登入觸發peoplelinks
        window.location.href = this.api.member.loginUrl();
      },
    },
    computed: {
      setHomepageUrl() {
        return this.siteData ? `/${this.siteData.urlSuffix}` : '/';
      },
      viewedUrl() {
        return this.siteData ? `/${this.siteData.urlSuffix}/member/favorite` : '/member/favorite';
      },
      setCartUrl() {
        if (this.siteData) {
          return `/${this.siteData.urlSuffix}/shoppingcart`;
        } else {
          return `/shoppingcart`;
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../../style/color';
  @import '../../style/mixin';

  $tag_width: 14px;

  @mixin tag {
    display: flex;
    position: absolute;
    top: 2px;
    right: 23px;
    align-items: center;
    box-sizing: border-box;
    width: fit-content;
    min-width: $tag_width;
    height: 15px;
    padding: 1px 5px;
    border-radius: 25px;
    color: $white;
    font-size: 12px;
    background-color: $pomegranateapprox;
  }

  .navigation-bottom-bar {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    position: fixed;
    z-index: 2;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 50px;
    background-color: $dune;
    padding: 5px 0;

    &.is-bsite {
      background-color: $white;
      border-top: 1px solid #ddd;
      a {
        color: $dune;
      }
    }

    a {
      font-size: 10px;
      color: $white;
      width: 50px;
      height: fit-content;
      text-decoration: none;
      display: inline-flex;
      flex-direction: column-reverse;
      align-items: center;
      position: relative;
    }

    .countShoppingBag,
    .notice,
    .fcoin {
      @include tag;
    }

    .fcoin {
      justify-content: center;
      padding-left: 13px;

      &::before {
        content: '';
        background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLjY2NyAxLjY2NykiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGNpcmNsZSBmaWxsPSIjRkZBRjAwIiBjeD0iOC4zMzMiIGN5PSI4LjMzMyIgcj0iOC4zMzMiLz4KICAgICAgICA8cGF0aCBkPSJNOC4zMzMgMTUuMjc4YTYuOTQ0IDYuOTQ0IDAgMSAxIDAtMTMuODkgNi45NDQgNi45NDQgMCAwIDEgMCAxMy44OXptMC0uNjk1YTYuMjUgNi4yNSAwIDEgMCAwLTEyLjUgNi4yNSA2LjI1IDAgMCAwIDAgMTIuNXoiIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIvPgogICAgICAgIDxwYXRoIGQ9Ik0xMC4yOTMgNS4zMjNjLjExNi0uMTU1LjE1MS0uMzUuMTAyLS41ODJhLjcxNC43MTQgMCAwIDAtLjczMi0uNTc0Yy0xLjYxOSAwLTIuNTA1LjgzOS0yLjU2NiAyLjQyNmwtLjAwNy4xOC0uMjMuMDEzYS42MzIuNjMyIDAgMCAwLS40MTIuMjEyLjc1OC43NTggMCAwIDAtLjE5OC41MjQuNzcuNzcgMCAwIDAgLjE5OC41MjguNjMuNjMgMCAwIDAgLjQxMS4yMTJsLjIzNC4wMTRWMTIuNWgxLjQ2VjguMjc2aDEuMDM5YS42MDQuNjA0IDAgMCAwIC40NTgtLjIxNS43ODMuNzgzIDAgMCAwIC4xOTItLjUyOS43Ny43NyAwIDAgMC0uMTkzLS41MjQuNi42IDAgMCAwLS40NTctLjIxNEg4LjU0OFY2LjU4YzAtLjU1My4xNjgtLjg4MyAxLjAyOS0uOTMyLjMxMi0uMDE4LjU3My0uMTM2LjcxNi0uMzI2IiBmaWxsPSIjRkZGIi8+CiAgICA8L2c+Cjwvc3ZnPgo=');
        display: inline-block;
        width: 15px;
        height: 15px;
        background-size: 110%;
        position: absolute;
        left: -4.5px;
        top: -1.5px;
      }
    }

    i {
      width: 30px;
      height: 30px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;

      &.homepage {
        background-image: url('../../images/icons/01_homepage.png');
      }

      &.catalog {
        background-size: 75%;
        background-image: url('../../images/icons/02_catalog.png');
      }

      &.shoppingcart {
        background-size: 85%;
        background-image: url('../../images/icons/03_shoppingcart.png');
      }

      &.viewed {
        background-size: 85%;
        background-image: url('https://event.shopping.friday.tw/event/CP/common/mobile_icon/favorite.png');
      }

      &.notification {
        background-size: 65%;
        background-image: url('../../images/icons/05_notification.png');
      }

      &.mine {
        background-size: 65%;
        background-image: url('../../images/icons/06_mine.png');
      }
      &.homepage_bk {
        background-image: url('https://event.shopping.friday.tw/event/CP/common/mobile_icon/01_homepage_bk.png');
      }

      &.catalog_bk {
        background-size: 75%;
        background-image: url('https://event.shopping.friday.tw/event/CP/common/mobile_icon/02_catalog_bk.png');
      }

      &.shoppingcart_bk {
        background-size: 85%;
        background-image: url('https://event.shopping.friday.tw/event/CP/common/mobile_icon/03_shoppingcart_bk.png');
      }

      &.viewed_bk {
        background-size: 85%;
        background-image: url('https://event.shopping.friday.tw/event/CP/common/mobile_icon/ai4Favorite.png');
      }

      &.notification_bk {
        background-size: 65%;
        background-image: url('https://event.shopping.friday.tw/event/CP/common/mobile_icon/05_notification_bk.png');
      }

      &.mine_bk {
        background-size: 65%;
        background-image: url('https://event.shopping.friday.tw/event/CP/common/mobile_icon/06_mine_bk.png');
      }
    }
  }
</style>
