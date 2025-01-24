<template>
<div class="wrap">
  <div class="items" v-for="item in itemList" :key="item.pid">
    <a :href="item.url">
      <div class="items-wrap">

        <img :src="item.img" />

      </div>
    </a>
  </div>
</div>
</template>

<script>
export default {
  name: 'bannerOnly',
  props: {
    itemList: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  margin-bottom: 20px;

  .items {
    flex: 0 0 100%;
    display: flex;
    padding: 5px 20px;
    box-sizing: border-box;

    a {
      text-decoration: none;
    }

    .items-wrap {
      width: 100%;
      border-radius: 10px;

      img {
        width: 100%;
        border-radius: 10px;
      }
    }
  }
}
</style>
