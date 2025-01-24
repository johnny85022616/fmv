<template>
  <div class="wrap" @scroll="bindScrollbar()">
    <div class="wrap-item" v-for="(item, i) in items" :key="i">
      <div class="flex-wrapper">
        <div class="flex-item" v-for="(icon, ii) in item.items" :key="ii">
          <a
            @click="
              goPage($event, ii, icon.url, icon.itemName, icon.targetBlank)
            "
          >
            <img :src="icon.img" :alt="icon.description" />
            <h3>{{ icon.itemName }}</h3>
          </a>
        </div>
      </div>
    </div>
    <div class="scrollbar-bg"><div class="scrollbar-fg"></div></div>
  </div>
</template>

<script>
export default {
  name: 'shortcutSlider',
  data() {
    return {
      items: {},
    };
  },
  created() {
    // GET Shortcut
    this.axios
      .get('api/home/page/shortcut', {
        baseURL: this.configs.apiPath(),
      })
      .then((res) => {
        if (res.data.code == 1 && res.data.payload[0].channels.length > 0) {
          const data = res.data.payload[0].channels;
          this.items = data.map((oriObj) => {
            const items = oriObj.items
            oriObj['items'] = items;
            return oriObj;
          });
        }
      });
  },
  methods: {
    goPage(evt, el, url, title, target) {
      evt.preventDefault();
      if (evt) {
        evt.preventDefault();
        this.ga.event(
          '小網首頁',
          '快捷促購版位_click',
          `快捷促購版位 @ ${title} @ ${url}`
        );
        if (target) {
          window.open(url, '_blank');
        } else {
          location.href = url;
        }
      }
    },
    bindScrollbar() {
      let scrollbarRed = document.querySelector('.scrollbar-fg');
      let scrollbarGrey = document.querySelector('.scrollbar-bg');
      let scrolling = Math.abs(
        scrollbarGrey.getBoundingClientRect().width -
          scrollbarRed.getBoundingClientRect().width
      );
      if (this.$el.scrollLeft !== 0) {
        let moveVal = Math.abs(this.$el.scrollLeft / scrolling);
        scrollbarRed.style.transform = `translateX(${moveVal}px)`;
      }
      if (this.$el.scrollLeft === this.$el.scrollWidth - this.$el.clientWidth) {
        scrollbarRed.style.transform = `translateX(${scrolling}px)`;
      }
      if (this.$el.scrollLeft === 0) {
        scrollbarRed.style.transform = `translateX(0px)`;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
@import '../../style/color';

@media screen and (max-width: 320px) {
  .flex-item {
    width: 5rem !important;
    margin-right: 24px !important;
  }
  .scrollbar-bg {
    margin-top: 154px !important;
  }
}
@media screen and (min-width: 412px) {
  .flex-item {
    width: 65px !important;
    margin-right: 23px !important;
  }
}
@media screen and (min-width: 641px) {
  .flex-wrapper {
    width: 26rem !important;
  }
  .scrollbar-bg {
    margin-top: 176px !important;
  }
}
.wrap {
  display: flex;
  margin: 20px 0 32px 0;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }

  .VueCarousel {
    width: 100%;
  }

  .wrap-item {
    font-size: 1.2rem;
    color: $web_minor;
    text-align: center;
    &:first-of-type {
        margin-left: 38px;
      }

    .flex-wrapper {
      width: 32rem;
      display: flex;
      flex-wrap: wrap;

      .flex-item {
        width: 6rem;
        margin: 0 20px 16px 0;
        &:nth-of-type(4n) {
          margin-right: 0;
        }

        a {
          text-decoration: none;

          h3 {
            color: #353635;
            white-space: nowrap;
            overflow: hidden;
          }
        }
      }
    }

    img {
      width: 46px;
      height: 46px;
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
    left: calc((100% - 30px)/2);
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
