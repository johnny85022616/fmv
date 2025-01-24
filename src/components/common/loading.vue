<template>
  <div class="loading">
    Loading<span class="dot">。</span><span class="dot">。</span><span class="dot">。</span>
  </div>
</template>

<script>
export default {
  name: "loading",
  data() {
    return {};
  },
  created() {},
};
</script>

<style lang="scss" scoped>
@import "../../style/color";

.loading {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $white;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5); /* 半透明白色 */
  font-size: 1.7rem;
}
.dot {
  display: inline-block;
  animation: wave 1s infinite;
  letter-spacing: -5px;
  &:nth-of-type(1) {
    animation-delay: 0s;
  }
  &:nth-of-type(2) {
    animation-delay: 0.2s;
  }
  &:nth-of-type(3) {
    animation-delay: 0.4s;
  }
}

@keyframes wave {
  0% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-3px);
  }
  50% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(3px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
