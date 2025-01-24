<template>
  <div class="container">
    <template v-if="isShowVav">
      <div class="block-split">－看了此商品的人也看了－</div>
      <youmaylike v-on:haveData="haveData" rectype="AlsoView" :recgid="pid" :limit="10" />
    </template>

    <template v-if="isShowYml">
      <div class="block-split">－你可能會喜歡－</div>
      <youmaylike v-on:haveData="haveData" :recgid="pid" :limit="10" />
    </template>
  </div>
</template>

<script>
import youmaylike from "../common/youmaylike";

export default {
  name: "recommandation",
  data() {
    return {
      isShowVav: false,
      isShowYml: false,
      isApiFetch: false
    };
  },
  props: {
    pid: {
      type: Number,
    },
    currentY: {}
  },
  components: {
    youmaylike
  },
  watch: {
    currentY(n) {
      if (n > 1000) {
        if (!this.isApiFetch) {
          this.isApiFetch = true
          this.isShowVav = true
          this.isShowYml = true
        }
      }
    }
  },
  methods: {
    haveData(type, isShow) {
      if (type === 'vav') {
        this.isShowVav = isShow
      } else {
        this.isShowYml = isShow
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  background-color: #f4f4f4;
  padding-bottom: 60px;
}

.block-split {
  display: block;
  height: 44px;
  line-height: 44px;
  color: #adadad;
  text-align: center;
  font-size: 1.4rem;
}
</style>
