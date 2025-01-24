<template>
  <div :class="['fadeAlert',{close: isClose}]">
    <span><i></i></span>
    <p>{{message}}</p>
  </div>
</template>

<script>
export default {
  name: "fadeAlert",
  data() {
    return {
      isClose: false,
    };
  },
  props: {
    message: {
      type: String,
    },
  },
  created() {
    setTimeout(() => {
      this.closeAlert();
    }, 3000);
  },
  methods: {
    closeAlert() {
      this.isClose = true;
      setTimeout(() => {
        this.$emit("closeFadeAlert");
      }, 300);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";

.fadeAlert {
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  width: 80%;
  color: $white;
  padding: 15px;
  position: fixed;
  left: calc((100% - 80%) / 2);
  z-index: 9999;
  animation-name: open;
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-timing-function: ease-in;
  display: flex;
  align-items: center;

  span {
    display: inline-flex;
    margin-right: 10px;
    border-radius: 50%;
    background-color: red;
    width: 15px;
    height: 15px;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding-bottom: 4px;
    i {
      width: 3px;
      height: 6px;
      border-right: 2px solid $white;
      border-bottom: 2px solid $white;
      transform: rotate(40deg);
    }
  }
  p {
    font-size: 13px;
  }
  &.close {
    animation-name: close;
    animation-duration: 0.3s;
    animation-fill-mode: both;
    animation-timing-function: ease-out;
  }
}

@keyframes open {
  from {
    opacity: 0;
    top: 0px;
  }

  to {
    opacity: 1;
    top: 70px;
  }
}

@keyframes close {
  from {
    opacity: 1;
    top: 70px;
  }

  to {
    opacity: 0;
    top: 0px;
  }
}
</style>
