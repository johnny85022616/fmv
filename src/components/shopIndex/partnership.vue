<template>
<div :class="classArr">
  <div class="fixtop">
    <span class="logo"></span>
  </div>
  <banners v-if="checkBlockExsisted('K39')" :data="jsonPayload.K39.cmsTabs[0].cmsItems" :isSkipReplaceImgAsTypeNine="isSkipReplaceImgAsTypeNine"></banners>
  <brand v-if="checkBlockExsisted('L11') && jsonPayload.L11.cmsTabs[0].cmsItems.length > 7" :data="jsonPayload.L11.cmsTabs[0].cmsItems" :isSkipReplaceImgAsTypeNine="isSkipReplaceImgAsTypeNine" :row="2"></brand>
  <recommend v-if="checkBlockExsisted('K40')" :data="jsonPayload.K40.cmsTabs" :isSkipReplaceImgAsTypeNine="isSkipReplaceImgAsTypeNine" :sid="sid" />
  <ul>
    <li v-for="(item , index) in productCategoryArea" :key="index">
      <productCategory v-if="checkBlockExsisted(item)" :data="jsonPayload[item].cmsTabs[0].cmsItems" :isSkipReplaceImgAsTypeNine="isSkipReplaceImgAsTypeNine" :sid="sid" />
    </li>
  </ul>
</div>
</template>

<script>
import banners from "./banners.vue"; //輪播
import brand from './brand.vue'; //品牌專區
import recommend from './recommend.vue'; //推薦
import productCategory from './productCategory.vue';

export default {
  name: "partnership",
  data() {
    return {
      productCategoryArea: ['K33', 'K34', 'K35', 'K36', 'K37', 'K38'],
      classArr: ["partnership"],
    };
  },
  components: {
    banners,
    brand,
    recommend,
    productCategory,
  },
  props: {
    jsonPayload: Object,
    isSkipReplaceImgAsTypeNine: Boolean,
    sid: Number
  },
  methods: {
    checkBlockExsisted(block1, block2) { //判斷是否要render該component
      if (!block2) {
        return this.jsonPayload[block1] && this.jsonPayload[block1].cmsTabs && this.jsonPayload[block1].cmsTabs[0].cmsItems.length > 0
      } else {
        return this.jsonPayload[block1] && this.jsonPayload[block1].cmsTabs && this.jsonPayload[block1].cmsTabs[0].cmsItems.length > 0 && this.jsonPayload[block2] && this.jsonPayload[block2].cmsTabs
      }
    },
    sidToStore(sid) { //sid -> class 轉換
      let store = {
        '145': 'fed',
        '146': 'sogo',
        '167': 'city'
      }
      return store[sid]
    }
  },
  created() {
    this.classArr.push(this.sidToStore(this.sid));
  }
};
</script>

<style lang="scss" scoped>
.partnership {
  .logo {
    width: 90px;
    height: 30px;
    display: inline-block;
    padding: 10px 0 0 20px;
    background-size: 100% auto;
    background-position: center center;
    background-repeat: no-repeat;
    vertical-align: middle;
  }
}

.fed .logo {
  background-image: url(../../images/icons/fed.svg);
}

.sogo .logo {
  background-image: url(../../images/icons/sogo.svg);
}

.city .logo {
  background-image: url(../../images/icons/citysuper.svg);
}

.fed .fixtop {
  border-bottom: 3px solid #004ea2;
}

.sogo .fixtop {
  border-bottom: 3px solid #da332b;
}

.city .fixtop {
  border-bottom: 3px solid #27781e;
}
</style>
