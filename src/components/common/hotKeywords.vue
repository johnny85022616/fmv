<template>
  <div v-if="keywords.length > 0" :class="['category-keywords', { isBsite: isBsite }]">
    <label :class="`${isBsite ? 'hotKey_light' : ''}`">熱門關鍵字</label>
    <div class="category-keywords__container">
      <div class="category-keywords__items" :style="[{ width: keywordsBlockWidthPixels }]">
        <span v-for="(item, idx) in keywords" :key="idx" @click="goSearchPage(item.kcontent)">
          {{ item.kcontent }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "hotKeywords",
  data() {
    return {
      keywords: [], // 熱門關鍵字
      keywordsBlockWidthPixels: "0px", // 熱門關鍵字捲軸寬度計算
    };
  },
  created() {
    this.getHotkeywords();
  },
  props: {
    isBsite: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    goSearchPage(keyword) {
      const url = `/aisearch?keyword=${encodeURIComponent(keyword)}`;
      location.href = url;
    },
    parseHotKeywords(data) {
      const keywords = data.kids.slice(0, 30);
      const keywordsBlockWidth = keywords.reduce((p, v) => {
        return p + this.tools.strlen(v.kcontent);
      }, 0);

      this.keywordsBlockWidthPixels =
        (Math.floor(keywordsBlockWidth) * 8.6) / 2 + "px";
      this.keywords = keywords;
    },
    async getHotkeywords() {
      let payloadData = {
        target: "pseudoid",
        list_fun: "K3s27",
        list_args: "content",
        list_remote: "m",
      };
      let sId = "";

      if (this.siteData) {
        payloadData.list_fun = "KWSCloud";
        payloadData.list_remote = "b01";
        payloadData.list_num = "20";
        payloadData.site_id = this.siteData.siteId;

        sId = this.siteData.siteId;
      }

      const findCache = this.api.ai.getCache(`ai_keywords_${sId}_cache_bSite`);

      if (findCache) {
        this.parseHotKeywords(findCache);
        return;
      }

      const data = await this.api.ai.getAiData("getklist", payloadData);

      if (data && data.kids) {
        this.parseHotKeywords(data);
        this.api.ai.setCache(`ai_keywords_${sId}_cache_bSite`, data, 300);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/color";

.category-keywords {
  background-color: #555555;
  padding: 10px 0;
  display: flex;

  &.isBsite {
    background-color: #ddd5cc;
  }

  label {
    width: 20px;
    background-image: url("../../images/icons/07-hotKeyBg.png");
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    writing-mode: vertical-rl;
    display: inline-block;
    padding: 8px 13px 8px 4px;
    color: $white;
    font-size: 1.4rem;
  }

  &__container {
    box-sizing: border-box;
    width: 100%;
    min-height: 85px;
    max-height: calc((1.3rem + 18px) * 2);
    margin: auto 0;
    padding-top: 5px;
    padding-left: 5px;
    overflow-x: auto;
    overflow-y: hidden;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__items {
    position: relative;
    width: 100%;
    padding-right: 20px;
    font-size: 1.3rem;

    span {
      line-height: 30px;
      display: inline-block;
      background-color: $white;
      color: $web_main;
      border-radius: 25px;
      margin: 0px 5px 15px 0;
      padding: 0 8px;
    }
  }
}
</style>
