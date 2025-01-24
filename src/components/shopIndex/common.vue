<template>
<div class="common">
  <banners
    v-if="checkBlockExsisted(['L2'])"
    :data="jsonPayload.L2.cmsTabs[0].cmsItems"
    :isSkipReplaceImgAsTypeNine="isSkipReplaceImgAsTypeNine"></banners>
  <banners
    v-else-if="checkBlockExsisted(['K39'])"
    :data="jsonPayload.K39.cmsTabs[0].cmsItems"
    :isSkipReplaceImgAsTypeNine="isSkipReplaceImgAsTypeNine"></banners>

  <palySix
    v-if="checkBlockExsisted(['L11', 'L35'])"
    :data='jsonPayload.L35.cmsTabs[0].cmsItems'
    :isSkipReplaceImgAsTypeNine="isSkipReplaceImgAsTypeNine"></palySix>

  <topTen
    v-if="checkBlockExsisted(['L7'])"
    :data="jsonPayload.L7.cmsTabs[0].cmsItems"
    :isSkipReplaceImgAsTypeNine="isSkipReplaceImgAsTypeNine"></topTen>

  <brand
    v-if="checkBlockExsisted(['L11'])"
    :data="jsonPayload.L11.cmsTabs[0].cmsItems"
    :isSkipReplaceImgAsTypeNine="isSkipReplaceImgAsTypeNine"
    :row="1"></brand>

  <hot
    v-if="checkBlockExsisted(['Hot'])"
    :data="jsonPayload.Hot.cmsTabs[0].cmsItems"
    :isSkipReplaceImgAsTypeNine="isSkipReplaceImgAsTypeNine"
    :sid="sid"></hot>

  <hot
    v-if="checkBlockExsisted(['Hot3C'])"
    :data="jsonPayload.Hot3C.cmsTabs[0].cmsItems"
    :isSkipReplaceImgAsTypeNine="isSkipReplaceImgAsTypeNine"
    :sid="sid"></hot>
  
  <hot
    v-if="sid === 866"
    :data="kBlockData"
    :isSkipReplaceImgAsTypeNine="isSkipReplaceImgAsTypeNine"
    :sid="sid"></hot>
</div>
</template>

<script>
import banners from "./banners.vue"; //輪播
import palySix from './playSix.vue'; // 六分類
import topTen from './top10.vue'; // 銷售排行榜
import brand from './brand.vue'; //品牌專區
import hot from './Hot.vue'; //熱門商品
export default {
  name: "common",
  data() {
    return {
      kBlockData: []
    };
  },
  components: {
    banners,
    palySix,
    topTen,
    brand,
    hot
  },
  props: {
    jsonPayload: {
      type: Object,
      default: () => null
    },
    isSkipReplaceImgAsTypeNine: Boolean,
    sid: Number
  },
  created() {
    // for 快速到貨館 K33 ~ K38
    if (this.sid === 866) {
      const blockAry = ['K33', 'K34', 'K35', 'K36', 'K37', 'K38']
      blockAry.forEach(b => {
        this.kBlockData = this.kBlockData.concat(this.jsonPayload[b].cmsTabs[0].cmsItems)
      })
    }
  },
  methods: {
    checkBlockExsisted(blockAry) { //判斷是否要render該component
      const blockLen = blockAry.length
      let pass = false

      for (let i = 0; i < blockLen; i++) {
        const idx = blockAry[i]
        if (this.jsonPayload && this.jsonPayload[idx] && this.jsonPayload[idx].cmsTabs && this.jsonPayload[idx].cmsTabs[0].cmsItems.length > 0) {
          pass = true
        } else {
          pass = false
          break
        }
      }

      return pass
    },
  },
};
</script>
