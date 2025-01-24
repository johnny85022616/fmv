<template>
  <div class="dialog" :style="{top: dialogHeight}">
    <div v-if="!isFullscreen" class="bg" :style="{height: bgHeight}"></div>
    <div class="box" :style="{height: boxHeight}">
      <div class="header">
        <i v-if="!useClose" @click="close" class="angle-left"></i>
        <slot name="header"></slot>
        <i v-if="useClose" @click="close" class="close"></i>
      </div>

      <div class="body" :style="{height: bodyHeight, backgroundColor: backgroundColor}">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "fullscreenDialog",
  data() {
    return {
      dialogready: false,
      dialogHeight: window.innerHeight + "px",
      bgHeight: "0px",
      boxHeight: window.innerHeight + "px",
      bodyHeight: window.innerHeight - 46 + "px",
      iframeHeight: window.innerHeight - 46 + "px",
    };
  },
  mounted() {
    setTimeout(() => {
      this.calcuCntHeight();
    }, 50);
  },
  props: {
    isFullscreen: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    useClose: {
      type: Boolean,
      default: () => true,
    },
    backgroundColor: {
      type: String,
    },
  },
  methods: {
    calcuCntHeight() {
      this.dialogHeight = "0px";
      if (this.isFullscreen) {
        this.bgHeight = "0px";
        this.boxHeight = "100%";
      } else {
        this.bgHeight = window.innerHeight * 0.2 + "px";
        const boxH = window.innerHeight - window.innerHeight * 0.2;
        this.boxHeight = boxH + "px";
        this.bodyHeight = boxH - 56 + "px";
      }
      this.dialogready = true;

      // check iframe ele and set iframe height
      const ifm = this.$el.querySelector(".body > iframe");
      if (ifm) {
        ifm.style.height = this.iframeHeight;
      }
    },
    close() {
      this.$emit("closeDialog");
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog {
  position: fixed;
  transition: all 0.2s;
  z-index: 999;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;

  .bg {
    opacity: 0.5;
    background-color: #333333;
    width: 100%;
    height: 100%;
  }

  .box {
    background-color: #ffffff;
    overflow: hidden;
    width: 100%;
    height: 100%;

    .header {
      position: relative;
      line-height: 45px;
      text-align: center;
      font-size: 1.8rem;
      border-bottom: 1px solid #e0e0e0;
      min-height: 46px;

      i.close {
        position: absolute;
        right: 0;
        top: 0;
        display: block;
        width: 45px;
        height: 45px;
        background-size: 45px;
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAWqADAAQAAAABAAAAWgAAAABJfIu3AAAClUlEQVR4Ae3asW7iQBDG8YAoOaWMlJIy1Z3yBpGo4VGhRsobRHfVlZSRUp6OEkH2S9goQjaxzSwzVv4uYkzWM7M/W8va2qsrNgQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQACB7ysw8Oz6crn8sdvt7sfj8e/pdPqvRC2r1ep6s9n8Gg6HT7PZ7H+JHE1iukELebvd/klFTgaDwXOCmM7n879Nim7aZrFY3KULudrv97fpnPVoNPrphT1sWrR1O93JKeZEcQWRjh8FY5XngPx4QFbYySGnVYpWcdygNVzoTs7VJpAbK+xPyDc5vnIpZz6+9N4NWmOyhosE8JI7bYFdg/yiXKV+B3L9p/ZuY3Qu6gTMQ9sx2zJWrs9q7w6tjlgAWcSwQq2KEwL6XOzoyOpfGOiu2H1ADgfdFrsvyCGhm2L3CTks9FfY+r/m3JoO6rM2TRPTFK71TOX97PJ/Q43Rx92tu2vVrk/Iqjc0tAqswtb3eYt+J3/UmT9E3tdh9wVZtm6P4JEvbInaGDpKqFbEDA1dNWTkl1D8GFZczS5f1SFrCqd4TO+6qB6dcwo5v9Fr0uYorOthuKGjDWCbtq7KKXko6C5wXc7xQA8DfQ7YOedeCj0EtAWURYyS6O7QlkCWsazRXaFLwJSIaYHu9giuFURpLqzFLaavOjX901w7P9gISTmUSzkt0LrEcIPWMq0EoBVEb5vlC6Ia7FvlzPkuvXeDTnfdU+rsWh1OyFoSZvrS/hN2XqSzPuS8tPFbPtcx+jstcnS5uiRFAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEAgi8Ao5d1NEIRZWQAAAAABJRU5ErkJggg==");
      }
    }

    iframe {
      width: 100%;
      border: 0;
    }

    .body {
      position: relative;
      padding: 10px 10px 0 10px;
      font-size: 1.4rem;
      overflow: auto;
    }
  }
}
</style>
