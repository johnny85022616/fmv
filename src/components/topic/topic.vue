<template>
  <div class="topic">
    <topBanner :supplierData="siteData"></topBanner>
    <topicCategoryList v-if="grouping" :category="grouping" />
    <bsiteBanner v-if="bannerData" :productData="bannerData"></bsiteBanner>
    <topicRecProducts v-if="listData" :windowY="windowY" :listData="listData" />
  </div>
</template>

<script>
import topicCategoryList from "../../components/topic/topicCategoryList.vue";
import topicRecProducts from "../../components/topic/topicRecProducts.vue";
import topBanner from "../../components/homepage/topBanner.vue";
import bsiteBanner from "../../components/homepage/bsiteBanner.vue";
export default {
  name: "topic",
  data() {
    return {
      windowY: 0,
      isScoll: false,
      isShowMenu: false,
      grouping: null,
      bannerData: null,
      listData: null,
    };
  },
  created() {
    this.getThemeData();
    this.getThemeCategory();
    window.addEventListener(
      "scroll",
      () => {
        const wy = window.scrollY;
        this.windowY = wy;
      },
      {
        passive: true,
      }
    );
  },
  props: {},
  methods: {
    stopBodyScroll(opt) {
      if (opt && opt === "close") {
        this.isShowMenu = false;
      }
    },
    //取得主題館資料
    async getThemeData() {
      const data = await this.api.ai.getYsdtThemeData(400, "", null, 'getwlist');
      this.parseData(data);
    },
    async parseData(data) {
      data = data.map((ele) => ({
        ...ele,
      }));
      this.bannerData = data;
      this.listData = data.slice(10);
    },
    async getThemeCategory() {
      const data = await this.api.ai.getAiData("getvlist", {
        target: "pseudoid",
        list_fun: "allCategory",
        list_args: "content",
        list_remote: "b01",
        site_id: this.siteData.siteId,
        if_bWeb: "1",
      });
      if (
        data &&
        data.catg1 &&
        data.catg1.length > 0 &&
        data.catg1[0] !== null
      ) {
        const catalog = data.catg1[0];
        let catObj = {};
        Object.entries(catalog).forEach(([key, v]) => {
          catObj[key] = v.name;
        });

        this.grouping = catObj;
      }

      this.seo.homepage();
    },
  },

  watch: {},
  components: {
    topicCategoryList,
    bsiteBanner,
    topicRecProducts,
    topBanner,
  },
};
</script>

<style lang="scss">
@import "../../style/reset.module.scss";
@import "../../style/flex.module.scss";
@import "../../style/rwd.module.scss";
@import "../../style/icons.module.scss";
@import "../../style/global.module.scss";
</style>

<style lang="scss" scoped>
@import "../../style/color";
@import "../../style/mixin";
</style>
