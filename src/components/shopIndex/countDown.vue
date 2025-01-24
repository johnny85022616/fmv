<template>
<div class="countDown">
  <div class="countDown__clock">
    <span class="countDown__clock-icon"></span>
    <span>{{day}}天</span>
    <span>{{hours}}時</span>
    <span>{{min}}分</span>
    <span>{{sec}}秒</span>
  </div>
</div>
</template>

<script>
export default {
  name: "countDown",
  props: {
    endTime: String
  },
  data() {
    return {
      countDownTime: 0,
      day: 0,
      hours: 0,
      min: 0,
      sec: 0
    };
  },
  created() {
    const startTime = new Date().getTime();
    const endTime = new Date(this.endTime)
    this.countDownTime = (endTime - startTime) / 1000
    setInterval(this.cal, 1000)
  },
  methods: {
    cal() {
      this.countDownTime--;
      if (this.countDownTime >= 0) { //避免產生負的
        this.day = Math.floor(this.countDownTime / (24 * 3600));
        this.hours = Math.floor((this.countDownTime % (24 * 3600)) / 3600);
        this.min = Math.floor((this.countDownTime % 3600) / (60));
        this.sec = Math.floor(this.countDownTime % 60);
      } else {
        this.day = 0
        this.hours = 0
        this.min = 0
        this.sec = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.countDown {
  text-align: right;
  padding-right: 6px;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  background-color: #a1a1a1;
  color: #fff;
  margin-top: 1px;

  &__clock {
    &-icon {
      width: 13px;
      height: 13px;
      margin-right: 3px;
      vertical-align: middle;
      display: inline-block;
      background: url(../../images/icons/tokei.png) no-repeat;
      background-size: 100%;
    }

    span {
      margin-left: 4px;
    }
  }
}
</style>
