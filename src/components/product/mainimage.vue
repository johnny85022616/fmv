<template>
  <div class="product-images" :style="imgStyle">
    <fridayCardNotice v-if="!isBsite && pInfo && isfridayCardNoticeShow" :pInfo="pInfo"></fridayCardNotice>
    <span>
      <font>{{ current }}/{{ totals }}</font>
    </span>
    <template v-if="imagesData.length > 1">
      <carousel class="custom-carousel" :autoplay="false" :loop="false" :autoplayTimeout="5000" :perPage="1" :paginationEnabled="false" @page-change="currentNumber">
        <slide v-for="(item, index) of imagesData" :key="index" class="carousel-slide">
          <img :src="item.image_url" :style="imgStyle" />
          <i v-if="item.isVideo" @click="openYoutube" class="product-images__play-icon"></i>
        </slide>
      </carousel>
    </template>
    <template v-else>
      <img :src="imagesData[0].image_url" :style="imgStyle" />
      <i v-if="imagesData[0].isVideo" @click="openYoutube" class="product-images__play-icon"></i>
    </template>

    <fullscreendialog v-if="isShowVideo" :isFullscreen="true" @closeDialog="closeDialog">
      <template v-slot:header>商品影片</template>
      <template v-slot:body>
        <div class="product-images__youtube-iframe">

          <iframe v-if="isYoutubeVideo" type="text/html" id="youtubeIframe" :src="'https://www.youtube.com/embed/' +
            videoId +
            '?enablejsapi=1&amp;version=3&amp;playerapiid=ytplayer'
            " frameborder="0" allowfullscreen="" :style="youtubeIframeStyle"></iframe>

          <video v-else controls autoplay width="100%" height="100%">
            <source :src="video" type="video/mp4">
          </video>
        </div>
      </template>
    </fullscreendialog>
  </div>
</template>

<script>
import fullscreendialog from "../../components/common/fullscreenDialog.vue"; // 全畫面蓋版提示框
import fridayCardNotice from "./fridayCardNotice.vue";

export default {
  name: "mainimage",
  components: {
    fullscreendialog,
    fridayCardNotice,
  },
  data() {
    return {
      current: 1,
      isShowVideo: false,
      isYoutubeVideo: true,
      isBsite: false,
    };
  },
  props: {
    images: {
      type: Array,
      default: () => [],
    },
    video: {
      type: Array,
      default: () => [],
    },
    pInfo: {
      type: Object,
    },
  },
  created() {
    // trick for iphone ios 17 render ui bug.
    if (/iPhone OS (17|18|19)/i.test(navigator.userAgent)) {
      setTimeout(() => {
        document.querySelector(".VueCarousel-slide").style[
          "-webkit-touch-callout"
        ] = "default";
      }, 100);
    }

    if (/\.mp4/i.test(this.video[0])) {
      this.isYoutubeVideo = false;
    }

    if (this.siteData) {
      this.isBsite = true
    }
  },
  methods: {
    openYoutube() {
      this.isShowVideo = true;
    },
    closeDialog() {
      this.isShowVideo = false;
    },
    currentNumber(n) {
      this.current = n + 1;
    },
  },
  computed: {
    isfridayCardNoticeShow() {
      var today = new Date().getDay();
      return /[25]/.test(today) || false;
    },
    totals() {
      return this.imagesData.length;
    },
    videoId() {
      return this.video[0] && this.tools.getYoutubeId(this.video[0]);
    },
    youtubeIframeStyle() {
      return {
        width: "100%",
        height: Math.floor(window.innerWidth / 1.77) + "px",
        left: "0px",
      };
    },
    imagesData() {
      let imageObj = this.images.map((v, i) => {
        return {
          image_url: v,
          isVideo:
            i === 0 && this.video[0] && this.video[0].match(/v=([\d\w]+)/i)
              ? true
              : false,
        };
      });

      // 判斷是否商品帶影片
      if (this.video[0]) {
        // 是否為Youtube連結。解析iframe
        if (this.videoId) {
          imageObj = [
            {
              image_url: `https://i.ytimg.com/vi/${this.videoId}/hqdefault.jpg`,
              isVideo: true,
            },
            ...imageObj,
          ];
        }

        // 是否為mp4檔案連結。解析video tag
        if (/\.mp4$/i.test(this.video[0])) {
          const firstImg = imageObj[0];
          imageObj[0] = {
            image_url: firstImg.image_url,
            isVideo: true,
          };
        }
      }

      return imageObj;
    },
    imgStyle() {
      const ww = window.innerWidth;
      return {
        width: "100%",
        height: ww + "px",
      };
    },
  },
};
</script>

<style lang="scss">
.product-images .dialog .box .body {
  padding: 0;
}
</style>
<style lang="scss" scoped>
.product-images {
  position: relative;

  &__play-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // margin: 50% auto;
    display: inline-block;
    width: 80px;
    height: 80px;
    background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGNpcmNsZSBmaWxsLW9wYWNpdHk9Ii4zIiBmaWxsPSIjMDAwIiBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiLz4KICAgICAgICA8cGF0aCBkPSJNNDAgNS41YzE5LjA1MyAwIDM0LjUgMTUuNDQ0IDM0LjUgMzQuNSAwIDE5LjA1Ni0xNS40NDcgMzQuNS0zNC41IDM0LjVTNS41IDU5LjA1NiA1LjUgNDBDNS41IDIwLjk0NCAyMC45NDcgNS41IDQwIDUuNXptMCAxLjg2N0MyMS45NzcgNy4zNjcgNy4zNjcgMjEuOTc2IDcuMzY3IDQwUzIxLjk3NyA3Mi42MzMgNDAgNzIuNjMzYzE4LjAyMyAwIDMyLjYzMy0xNC42MDkgMzIuNjMzLTMyLjYzM1M1OC4wMjMgNy4zNjcgNDAgNy4zNjd6TTI5LjUgMjJsMjcgMTgtMjcgMThWMjJ6IiBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz4KICAgIDwvZz4KPC9zdmc+Cg==")
      no-repeat;
  }

  &__youtube-iframe {
    display: flex;
    align-items: center;
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: #000000;
  }

  img {
    object-fit: cover;
    will-change: height;
  }

  span {
    position: absolute;
    z-index: 1;
    right: 10px;
    bottom: 10px;
    display: inline-block;
    text-align: center;
    width: 55px;
    height: 24px;
    line-height: 24px;
    background-color: #000000;
    opacity: 0.6;
    border-radius: 15px;
  }

  font {
    font-size: 1.3rem;
    font-weight: 500;
    color: #ffffff;
  }
}
</style>
