<template>
  <div>
    <div v-if="isShow" class="bg"></div>
    <div v-if="isShow" class="container" @click="clickBanner" :style="imgCover">
      <div class="close" @click="closeBanner($event)">
        <img
          src="https://event.shopping.friday.tw/event/CP/common/mobile_icon/mobile_ad_close_button.png"
        />
      </div>
      <youtube
        v-if="isVideoShow"
        :video-id="ytVideoId"
        :player-width="videoSize.width"
        :player-height="videoSize.height"
        :player-vars="ytVideoParams"
        :mute="true"
        style="margin-top: 24.5%"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'coverbanner',
  data() {
    return {
      ytVideoParams: {
        start: 1,
        autoplay: 1,
      },
      isShow: false,
      isVideoShow: false,
      ytVideoId: null,
      dataObj: {},
      imgHeightRatio: 0,
    }
  },
  computed: {
    videoSize() {
      let w = window.innerWidth * 0.85
      return { width: w, height: w / 1.7777 }
    },
    imgCover() {
      let ratio = 0.85
      let bnW = window.innerWidth * ratio
      let bnH = bnW * this.imgHeightRatio
      return `background: url(${
        this.dataObj.cover
      }) center center / 100% 100% no-repeat rgb(255, 255, 255);width:${ratio *
        100}%;height:${bnH}px`
    },
  },
  created() {
    // Check already watched?
    const cache = this.storage.get('mobileAdCover')
    if (cache) {
      return
    }
    const now = new Date()

    // GET Mobile Cover Banner Configurations.
    this.axios
      .get('bannerapi/getCrazyAD')
      .then((res) => {
        const data = res.data
        if (data.response.status !== 'OK') {
          return
        }

        const payload = data.payload[0]
        if (now > payload.endDate || now < payload.startDate) {
          return
        }

        const imgObj = new Image()
        imgObj.onload = () => {
          this.imgHeightRatio = imgObj.height / imgObj.width
          this.isShow = true
        }
        imgObj.src = payload.cover

        this.dataObj = payload

        if (payload.yturl) {
          let vid = payload.yturl.match(/\?v=(.*)/i)
          if (vid) {
            this.isVideoShow = true
            this.ytVideoId = vid[1]
          }
        }

        // if already watch and save records to localstorage.
        this.storage.set(
          'mobileAdCover',
          true,
          this.configs.homepageCoverAdExpire
        )
      })
  },
  methods: {
    closeBanner: function(evt) {
      this.isShow = false
      if (evt) {
        evt.stopPropagation()
      }
    },
    clickBanner() {
      this.ga.event(
        '小網首頁',
        'skybanner_click',
        'skybanner @ ' + this.dataObj.links
      )
      window.open(this.dataObj.links)
      this.closeBanner()
    },
  },
}
</script>

<style lang="scss" scoped>
.bg {
  transition: all 0.5s ease;
  background-color: rgba(0, 0, 0, 0.75);
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 998;
}

.container {
  margin: auto;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 999;
  border-radius: 15px;
  transition: all 0.5s ease 0s;
}

.close {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 999;

  img {
    width: 25px;
    height: 25px;
  }
}
</style>
