<template>
  <div v-if="items" class="wrap">
    <div class="wrap-item">
      <div class="flex-wrapper">
        <div class="flex-item" v-for="(icon) in items" :key="icon.id">
          <a :href="icon.redirectUrl" target="_blank">
            <img :src="icon.img" :alt="icon.description" />
            <h3>{{ icon.itemName }}</h3>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "shortcutSlider",
  data() {
    return {
      items: null,
    };
  },
  created() {
    this.api.promotion.getHomepageShortcuts().then(res => {
      if (res.length > 0) {
        this.items = res;
      }
    })
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/color";

.wrap {
  display: flex;
  margin: 5px 0 0 0;
  padding: 10px 0;
  // border-top: 12px solid $background;
  // border-bottom: 12px solid $background;

  .wrap-item {
    font-size: 1.1rem;
    color: $web_minor;
    text-align: center;

    .flex-wrapper {
      width: 100%;
      display: flex;
      flex-wrap: wrap;

      .flex-item {
        flex: 1 1 20%;
        margin: 0 0 10px 0;

        a {
          text-decoration: none;

          h3 {
            color: #353635;
          }
        }
      }
    }

    img {
      width: 40px;
      height: 40px;
      display: block;
      margin: 0 auto;
      margin-bottom: 2px;
      object-fit: cover;
    }
  }
  .scrollbar-bg {
    width: 4rem;
    height: 0.2rem;
    background: $web_border;
    float: bottom;
    margin: 0 auto;
    margin-top: 162px;
    position: absolute;
    left: calc((100% - 30px) / 2);
    overflow: hidden;
    .scrollbar-fg {
      width: 50%;
      height: 100%;
      background: $red;
      transform: translateX(0px);
    }
  }
}
</style>
