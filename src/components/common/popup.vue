<template>
  <div :class="['popupDialog', {mask : hasMask}]">
    <div class="messageBox">
      <div v-if="isShowHeader" class="topHead">
        <slot name="header"></slot>
        <i @click="cancelClick"></i>
      </div>
      <div class="content">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    isShowHeader: {
      type: Boolean,
      default: () => true,
    },
    hasMask: {
      type: Boolean,
      default: () => false,
    },
  },
  methods: {
    cancelClick() {
      this.$emit("closePopup");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";
.popupDialog {
  &.mask {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .messageBox {
    position: fixed;
    z-index: 999;
    top: 50%;
    left: 50%;
    width: 80vw;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.3);
    background-color: $white;
    .topHead {
      position: relative;
      height: 45px;
      i {
        // background-color: $emperor;
        z-index: 1;
        position: absolute;
        right: 0;
        top: 0;
        display: block;
        width: 45px;
        height: 45px;
        background-size: 45px;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAWqADAAQAAAABAAAAWgAAAABJfIu3AAAClUlEQVR4Ae3asW7iQBDG8YAoOaWMlJIy1Z3yBpGo4VGhRsobRHfVlZSRUp6OEkH2S9goQjaxzSwzVv4uYkzWM7M/W8va2qsrNgQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQACB7ysw8Oz6crn8sdvt7sfj8e/pdPqvRC2r1ep6s9n8Gg6HT7PZ7H+JHE1iukELebvd/klFTgaDwXOCmM7n879Nim7aZrFY3KULudrv97fpnPVoNPrphT1sWrR1O93JKeZEcQWRjh8FY5XngPx4QFbYySGnVYpWcdygNVzoTs7VJpAbK+xPyDc5vnIpZz6+9N4NWmOyhosE8JI7bYFdg/yiXKV+B3L9p/ZuY3Qu6gTMQ9sx2zJWrs9q7w6tjlgAWcSwQq2KEwL6XOzoyOpfGOiu2H1ADgfdFrsvyCGhm2L3CTks9FfY+r/m3JoO6rM2TRPTFK71TOX97PJ/Q43Rx92tu2vVrk/Iqjc0tAqswtb3eYt+J3/UmT9E3tdh9wVZtm6P4JEvbInaGDpKqFbEDA1dNWTkl1D8GFZczS5f1SFrCqd4TO+6qB6dcwo5v9Fr0uYorOthuKGjDWCbtq7KKXko6C5wXc7xQA8DfQ7YOedeCj0EtAWURYyS6O7QlkCWsazRXaFLwJSIaYHu9giuFURpLqzFLaavOjX901w7P9gISTmUSzkt0LrEcIPWMq0EoBVEb5vlC6Ia7FvlzPkuvXeDTnfdU+rsWh1OyFoSZvrS/hN2XqSzPuS8tPFbPtcx+jstcnS5uiRFAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEAgi8Ao5d1NEIRZWQAAAAABJRU5ErkJggg==);
      }
    }
    .content {
      max-height: 400px;
      overflow: auto;
      padding: 20px;
    }
  }
}
</style>
