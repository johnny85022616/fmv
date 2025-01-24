<template>
  <div class="popupDialog" @click="cancelClick">
    <div class="content" @click.stop="">
      <p class="title" v-if="title">{{title}}</p>
      <i v-else class="content__img"></i>
      <div class="content__info">
        <slot></slot>
      </div>
      <div v-if="isSimple" class="content__button center">
        <span class="primary" @click="cancelClick">確認</span>
      </div>
      <div v-else class="content__button">
        <span @click="cancelClick">取消</span>
        <span class="primary" @click="confirmClick">確認</span>
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
    //簡易版只有確認鍵並且無事件處理
    isSimple: {
      type: Boolean,
      default: () => false,
    },
    title: {
      type: String,
      default: () => null,
    },
    callback: {
      //按下確定後要觸發的 function
      type: Function,
      default() {
        return () => {};
      },
    },
  },
  methods: {
    cancelClick() {
      this.$emit("closeCenterDialog");
    },
    async confirmClick() {
      const pass = await this.callback(); //呼叫傳入方法
      if (pass) {
        this.$emit("closeCenterDialog");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";

.popupDialog {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;

  .content {
    width: 82.6%;
    min-height: 154px;
    background: $white;
    color: $tundora;
    border-radius: 10px;
    padding: 20px;
    text-align: left;
    box-sizing: border-box;
    animation-name: grow;
    animation-duration: 0.6s;
    animation-fill-mode: both;
    animation-timing-function: ease;

    .title {
      font-size: 1.5rem;
      text-align: center;
      padding-bottom: 10px;
      margin-bottom: 20px;
      border-bottom: 1px solid $alto;
    }

    &__img {
      width: 130px;
      height: 20px;
      background: url(../../images/icons/fridayshop_logo.svg) center/130px 20px
        no-repeat;
      margin-bottom: 15px;
    }

    &__info {
      font-size: 1.5rem;
      margin-bottom: 15px;
    }

    &__button {
      text-align: right;

      span {
        display: inline-block;
        min-height: 38px;
        border-radius: 7px;
        font-size: 12px;
        border: 1px solid $nobel;
        background: $white;
        color: $nobel;
        opacity: 1;
        box-sizing: border-box;
        padding: 10px 20px;

        &:first-of-type {
          margin-right: 5px;
        }

        &.primary {
          background-color: $pomegranateapprox;
          color: $white;
          border: none;
        }
      }
    }
    &.close {
      animation-name: shrink;
      animation-duration: 0.6s;
      animation-fill-mode: both;
      animation-timing-function: ease;
    }
  }
  .center {
    text-align: center;
  }
}

@keyframes grow {
  from {
    transform: scale(0);
  }

  to {
    transform: scale(1);
  }
}
@keyframes shrink {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(0);
  }
}
</style>
