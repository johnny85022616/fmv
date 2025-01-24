<template>
<div>
  <navigation
      :windowY="200"
      v-on:stopBodyScroll="stopBodyScroll"
      />

  <div class="campaign-container">
    <div>
      <i @click="backAction" class="angle-left"></i>
      <span>超值活動</span>
    </div>
    <div>
      <ul>
        <li
          v-for="(item, index) of tabsData"
          :key="index"
          :class="[{ active: index === nowSelectedIndex }]"
          @click="swapTabs(index)">
          <span>
            {{ item.title }}({{ item.count }})
          </span>
        </li>
      </ul>
    </div>
    <div>
      <div
        v-for="(item, index) of items"
        :key="index">
        <a @click="goBanner($event, index, item.url)" :href="item.url">
          <img :src="item.img" />
          <span>
            {{ item.title }}
          </span>
        </a>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列

export default {
  name: "Promotion",
  components: {
    navigation,
  },
  data() {
    return {
      cid: null,
      mid: 1,
      sid: null,
      currentY: 0,
      isStopScrolling: false,
      isShowRedTop: true,
      windowY: 0,
      nowSelectedIndex: 0,
      tabsData: [],
      itemData: [],
    };
  },
  created() {
    const urlParams = this.tools.urlSearchToObj()
    let {
      cid,
      sid,
      mid
    } = urlParams

    // 取得Campaign ID
    if (/promotion\/category\/(\d+)$/i.test(location.pathname)) {
      const pathAry = location.pathname.match(/(\d+)$/)
      cid = pathAry[1]
    }

    this.cid = cid
    this.mid = mid
    this.sid = sid

    window.addEventListener(
      "scroll",
      () => {
        const wy = window.scrollY;
        this.windowY = wy;
        this.currentY = wy !== 70 && wy !== 0 ? wy : this.currentY;
        this.isShowRedTop = wy > 0 ? false : true;
      }, {
        passive: true,
      }
    );

    this.getCamapign()
  },
  methods: {
    getCamapign() {
      this.axios
        .get(`api/promotion/category?cid=${this.cid}`)
        .then((res) => {
          const data = res.data;
          if (data.code === 1) {
            if (data.payload && data.payload[0]) {
              const payload = data.payload[0];
              this.itemData = payload.eventLables
              this.tabsData = payload.eventLables.map(v => {
                return {
                  title: v.lableName,
                  count: v.eventList.length
                }
              })
            }
          }
        });
    },
    backAction() {
      history.go(-1);
    },
    swapTabs(i) {
      this.nowSelectedIndex = i
    },
    stopBodyScroll(action, jumpCurrentY = true) {
      const body = document.body;
      if (!this.isStopScrolling) {
        body.style = "padding:0;margin:0;overflow:hidden;height:100%";
        this.isStopScrolling = !this.isStopScrolling;
      }
      if (action === "close") {
        body.style = "padding:0;margin:0;";
        if (jumpCurrentY) {
          setTimeout(() => {
            window.scrollTo(0, this.currentY);
          }, 0);
        }
        this.isStopScrolling = false;
      }
    },
  },
  computed: {
    items() {
      return this.itemData[this.nowSelectedIndex] ? this.itemData[this.nowSelectedIndex].eventList.map(v => {
        return {
          url: v.eventUrl,
          img: v.eventImg,
          title: v.eventName
        }
      }) : []
    }
  }
};
</script>

<style lang="scss">
@import "./style/reset.module.scss";
@import "./style/flex.module.scss";
@import "./style/rwd.module.scss";
@import "./style/icons.module.scss";
@import "./style/global.module.scss";
</style>

<style lang="sass" scoped>
@import 'style/color.scss'
@import 'style/mixin.scss'

.campaign-container
  >div
    &:first-child
      position: relative
      line-height: 45px
      border-bottom: 1px solid $line
      text-align: center
      span
        color: $web_main
        font-size: 1.8rem
    &:nth-child(2)
      width: 100%
      padding: 12px 20px
      box-sizing: border-box
      border-bottom: 1px solid $line
      overflow-x: scroll
      color: $web_main
      -webkit-overflow-scrolling: touch
      &::-webkit-scrollbar
        display: none
      ul
        display: flex
        font-size: 15px
        white-space: nowrap
      li
        display: inline-block
        padding: 5px 10px
        color: $web_minor
        &.active
          color: $red
          span
            border-bottom: 2px solid $red
    &:last-child
      padding: 10px 20px
      background-color: $background
      a
        display: inline-block
        margin-bottom: 10px
        border: 1px solid $web_border
        border-radius: 10px
        color: $web_main
        font-size: 1.3rem
        text-decoration: none
        img
          width: 100%
          border-top-left-radius: 10px
          border-top-right-radius: 10px
          object-fit: cover
        span
          display: inline-block
          height: 30px
          line-height: 25px
          padding: 0 10px
          box-sizing: border-box
          @include font-break(1)
</style>
