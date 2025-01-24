<template>
<ul class="playsix">
  <li class="playsix__item" v-for="(item, index) in data" :key="index">
    <a class="playsix__item-link" :href="configs.prefixUrl(item.url)" :title="item.imgAlt">
      <img class="playsix__item-img" :src="configs.checkImgSrc(item.img)" />
    </a>
  </li>
</ul>
</template>

<script>
export default {
  name: "palySix",
  props: {
    data: Array,
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.playsix {
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  padding: 0 2%;
  flex-wrap: wrap;
  box-sizing: border-box;
  margin-top: 0px;

  &__item {
    list-style-type: none;
    width: 33.33%;
    box-sizing: border-box;
    padding: 1% 3%;

    &-link {
      display: inline-block;
      border-radius: 100%;
      border: 1px solid #ddd;
      overflow: hidden;
    }

    &-img {
      object-fit: contain;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
