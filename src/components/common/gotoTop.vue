<template>
  <div id="m_top_btn" :class="styleObj" @click="scrolltoTop">
    <div class="icon"></div>
    <span>Top</span>
  </div>
</template>

<script>
export default {
  name: "gotoTop",
  data() {
    return {
      styleObj: {
        m_top_btn: true,
        slideIn: false,
        slideOut: false,
      },
    };
  },
  methods: {
    scrolltoTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
  },
  created() {
    window.addEventListener(
      "scroll",
      () => {
        let scrollTop = window.scrollY; //滾動高度
        let windowHeight = document.documentElement.scrollHeight; //document高度
        let clientHeight = document.documentElement.clientHeight; //可視高度
        //滾動至底部
        if ((scrollTop + clientHeight) >= windowHeight) {
          this.styleObj.slideIn = true;
          this.styleObj.slideOut = false;
        //滾動至頂部
        } else if (scrollTop === 0) {
          this.styleObj.slideIn = false;
          this.styleObj.slideOut = true;
        }
      },
      {
        passive: true,
      }
    );
  },
};
</script>

<style lang="scss" scoped>
  @keyframes slideIn {
    0% {
      bottom: -100px;
    }
    100% {
      bottom: 50px;
    }
  }
  @keyframes slideOut {
    0% {
      bottom: 50px;
    }
    100% {
      bottom: -100px;
    }
  }
  .m_top_btn {
    box-sizing: border-box;
    position: fixed;
    bottom: -100px;
    right: 0px;
    width: 50px;
    height: 50px;
    z-index: 2;
    cursor: pointer;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.2);
    &.slideIn {
      animation-name: slideIn;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }
    &.slideOut {
      animation-name: slideOut;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
    }
    .icon {
      width: 50px;
      height: 22px;
      margin-top: 5px;
      background: #fff url(../../images/icons/m_main_ui.png)
        no-repeat;
      background-size: 375px 1500px;
      background-position: 0 -65px;
      background-color: rgba(255, 255, 255, 0);
    }
    .span {
      text-align: center;
      font-size: 11px;
      color: #404040;
      display: block;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  }
</style>