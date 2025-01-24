<template>
<div :class="['wrap', {'dark': isDarkMode}]">
  <div v-if="!isDarkMode">
    <span class="num">{{ d }}</span>
    <span class="colon">：</span>
    <span class="num">{{ h }}</span>
    <span class="colon">：</span>
    <span class="num">{{ m }}</span>
    <span class="colon">：</span>
    <span class="num">{{ s }}</span>
  </div>
  <div v-else>
    <span>
      {{timerPrefixText}}
      <font class="num">{{ d }}</font>
      天
      <font class="num">{{ h }}</font>
      時
      <font class="num">{{ m }}</font>
      分
      <font class="num">{{ s }}</font>
      秒
    </span>
  </div>
</div>
</template>

<script>
export default {
  name: 'countdown',
  data() {
    return {
      d: '',
      h: '',
      m: '',
      s: '',
      timestamp: 0, // countdown timestamp
      cdTimer: '', // setTimeout object
      timeInterval: '', // countdown time vs now time 
      timeIntervalVal: '',
      days: 24 * 60 * 60,
      hours: 60 * 60,
      minutes: 60
    }
  },
  props: {
    isDarkMode: {
      type: Boolean,
      default: () => false
    },
    timerPrefixText: {
      type: String,
      default: () => '優惠倒數'
    },
    endTime: {
      type: Number,
      required: false
    }
  },
  created() {
    this.timestamp = this.endTime
    this.tick()
  },
  methods: {
    tick() {
      this.countdown()
    },
    countdown() {
      this.timeInterval = Math.floor((this.timestamp - (new Date())) / 1000)
      if (this.timeInterval < 0) {
        this.timeInterval = 0
      }

      this.timeIntervalVal = this.timeInterval
      // Number of days left
      this.d = this.zeroAppend(Math.floor(this.timeInterval / this.days))
      this.timeInterval -= this.d * this.days
      // Number of hours left
      this.h = this.zeroAppend(Math.floor(this.timeInterval / this.hours))
      this.timeInterval -= this.h * this.hours
      // Number of minutes timeInterval
      this.m = this.zeroAppend(Math.floor(this.timeInterval / this.minutes))
      this.timeInterval -= this.m * this.minutes
      // Number of seconds timeInterval
      this.s = this.zeroAppend(this.timeInterval)

      if (this.timeIntervalVal > 0) {
        this.cdTimer = setTimeout(this.tick, 1000)
      } else {
        // timesup
      }
    },
    zeroAppend(n) {
      let s = n + '';
      while (s.length < 2) s = '0' + s;
      return s;
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  text-align: center;
  font-size: 1.6rem;
  font-weight: 500;
  margin: 10px 0 10px 0;

  .num {
    width: 30px;
    height: 24px;
    color: #ffffff;
    border-radius: 5px;
    background-color: #f34f59;
    padding: 0 3px;
  }

  &.dark {
    text-align: left;
    background-color: #000000;
    font-size: 1.3rem;
    color: #ffffff;
    padding-left: 10px;
    line-height: 32px;
    height: 32px;
    margin: 0;

    .num {
      font-size: 2rem;
      color: #ffe400;
      background-color: #000000;
      padding: 0;
    }
  }

}
</style>
