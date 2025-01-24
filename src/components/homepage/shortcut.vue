<template>
<div class="wrap">
  <div
    class="wrap-item"
    v-for="(item, index) of items"
    :key="index">
    <a @click="goBanner($event, index, item.url, item.itemName)" :href="item.url" :title="item.description">
      <img :src="item.img" :alt="item.description" />
    </a>
    {{ item.itemName }}
  </div>
</div>
</template>

<script>
export default {
  name: "shortcut",
  data() {
    return {
      items: []
    };
  },
  created() {
    const {
      getCache,
      setCache
    } = this.tools
    const {
      blockCache
    } = this.configs

    const findCache = getCache('shortcut_cache')
    if (findCache) {
      this.items = findCache
    } else {
      this.axios.get("api/home/shortcut").then(res => {
        const data = res.data;
        if (data.code === 1 && data.payload.length > 0) {
          const { shortcuts } = data.payload[0]
          this.items = shortcuts;
          setCache('shortcut_cache', shortcuts, blockCache)
        }
      });
    }

  },
  methods: {
    goBanner(evt, el, url) {
      if (evt) {
        evt.preventDefault();
        location.href = url;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
.wrap {
  display: flex;
  margin: 15px 0px;

  .wrap-item {
    flex: 20%;
    font-size: 1.2rem;
    color: #adadad;
    text-align: center;

    img {
      width: 43px;
      height: 43px;
      display: block;
      margin: 0 auto;
      margin-bottom: 5px;
    }
  }
}
</style>
