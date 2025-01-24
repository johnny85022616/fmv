<template>
<div
  id="banners-wrap"
  class="wrap"
>
  <img :src="getImgUrl" />

  <div v-if="isShowCountdown">
    <countdown
      :endTime="endTime"
      :isDarkMode="true"
    />
  </div>
</div>
</template>

<script>
import countdown from "../common/countdown";

export default {
  name: "bannerOutlet",
  data() {
    return {
      isShowCountdown: false,
      endTime: 0
    };
  },
  components: {
    countdown,
  },
  props: {
    items: {
      type: Object,
      default: () => {}
    },
  },
  created() {
    if (this.items.outletEndTime && this.items.outletEndTime[0]) {
      this.isShowCountdown = true
      this.endTime = this.items.outletEndTime[0]
    }
  },
  computed: {
    getImgUrl() {
      return this.configs.cmsImgUrlPath() + this.items.outletImgUrl
    }
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  img {
    width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
  }
}
</style>
