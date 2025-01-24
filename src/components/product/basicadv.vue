<template>
  <div>
    <div :class="['product-component-container', { 'no-padding': isSimpleProductCnt }]">
      <div class="product-detail">
        <div :class="['product-detail__title', 'tab-section', { 'no-padding': isSimpleProductCnt }]" data-tab="詳情">
          －商品詳情－
        </div>
        <div class="product-detail__content">
          <div class="product-detail__sku">
            <label></label>
            <span></span>
            <span class="url" @click="copyNumber(nowBrowserUrl)">&nbsp;</span>
          </div>
          <div v-html="productDescriptionFilters" ref="productDescriptionFilters" class="html-content"></div>
        </div>
      </div>
    </div>
    <div class="gap-line"></div>
  </div>
</template>

<script>
export default {
  name: "basicadv",
  data() {
    return {
      productDescription: "",
      isApiLoaded: false,
    };
  },
  components: {},
  props: {
    // 針對簡易版的商品頁作處理
    isSimpleProductCnt: {
      type: Boolean,
      default: () => false,
    },
    currentY: {
      type: Number,
      default: () => 0,
    },
    pid: {
      type: Number,
    },
  },
  watch: {
    currentY(n) {
      if (n > 375 && !this.isApiLoaded) {
        this.isApiLoaded = true;
        this.getProductDescription();
      }
    },
  },
  created() { },
  mounted() {
    const productDescriptionFiltersDom = this.$refs.productDescriptionFilters;
    const imgEles = productDescriptionFiltersDom.getElementsByTagName("img");
    if (!imgEles || (imgEles && imgEles.length === 0)) return;
    imgEles.forEach((imgEle) => {
      const imgSrc = imgEle.getAttribute("src");
      const imgObj = new Image();
      imgObj.onerror = () => {
        imgEle.style.display = "none";
      };
      imgObj.src = imgSrc;
    });
  },
  computed: {
    nowBrowserUrl() {
      // const url = "https://fri.page.link/?isi=785988886&ibi=tw.com.gohappy.www&efr=0&apn=com.gohappy.mobileapp&link=" +
      //   encodeURIComponent(
      //     location.origin + location.pathname + location.search
      //   )
      //   ;
      const isSuperApp = /super-app/i.test(document.cookie);
      return '【' + window.location.href + '】【' + navigator.userAgent + '】【isSuperApp:' +isSuperApp + '】';
    },
    productDescriptionFilters() {
      let content = this.productDescription;
      if (content) {
        content = this.tools.replaceTplImagePath(content);
        content = this.tools.replaceWidthAndHeight(content);
        content = this.tools.figureToIframe(content);
      }
      return content;
    },
  },
  methods: {
    copyNumber(content) {
      navigator.clipboard.writeText(content).then(() => {
        alert(`已複製${content}至剪貼簿`);
      });
    },
    // 取得簡介
    getProductDescription() {
      fetch(
        `${this.configs.frontCloudApiPath()}product/v2/${this.pid}/description`
      )
        .then((res) => res.json())
        .then((res) => {
          this.productDescription = res.resultData.description;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/color.scss";

.product-component-container {
  padding: 0 0 15px 0;

  &.no-padding {
    padding: 0;
  }
}

.product-component-blocks {
  padding: 0 20px;

  span {
    width: 80%;
    flex: 1 1 80%;
  }
}

.product-campaign__promotion {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-detail {
  label {
    width: 20%;
    color: $sliver;
  }

  &__sku {
    position: relative;
    padding: 10px 20px;

    .url {
      display: inline-block;
      position: absolute;
      right: 10px;
      width: 20px;
      height: 20px;
    }
  }

  &__title {
    width: 100%;
    height: 44px;
    line-height: 44px;
    color: $sliver;
    text-align: center;
    background-color: $background;

    &.no-padding {
      height: 40px;
      line-height: 30px;
      padding-top: 0px;
    }
  }

  &__spec-content {
    padding: 0 15px;

    >div {
      display: unset;
    }

    ul {
      li {
        line-height: 40px;
      }
    }
  }
}
</style>

<style lang="scss">
@import "../../style/color.scss";
@import "../../style/mixin.scss";

.html-content {
  padding: 0 10px;
  word-break: break-word;

  img {
    width: 100%;
    padding: unset;
  }
}

.product-detail__spec-content {
  ul {
    padding: 10px 0 0;
  }

  li {
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;

    label {
      flex: 0 1 20%;
      color: $sliver;
    }

    span {
      flex: 0 1 80%;
      padding-right: 10px;
      @include font-break;
    }
  }

  p {
    margin-top: 10px;
  }
}
</style>
