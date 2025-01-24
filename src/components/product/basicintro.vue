<template>
  <div>
    <div class="gap-line"></div>
    <div class="product-component-container tab-section" data-tab="簡介">
      <div class="product-intro" v-html="introFilters"></div>
    </div>
    <div class="gap-line"></div>
  </div>
</template>

<script>
export default {
  name: "basicintro",
  data() {
    return {};
  },
  props: {
    intro: {
      type: String,
      default: "",
    },
  },
  created() {},
  computed: {
    introFilters() {
      let content = this.intro;
      content = content.replace(/\\r\\n/g, "");
      content = this.tools.figureToIframe(content);
      return content;
    },
  },
  methods: {},
};
</script>

<style lang="sass" scoped>
@import '../../style/color.scss'

.product-intro
  color: $web_main
  font-size: 1.4rem
  word-wrap: break-word
  p
    strong
      font-weight: 700
      span
        font-weight: 700
</style>

<style lang="sass">
.intro
  p
    strong
      font-weight: 700
</style>
