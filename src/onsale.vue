<template>
<div class="aiCategoryProduct">
  <navigation :directShowSearchInput="true" />
  <div class="hourly-hours">
    <span class="first" @click="changeNowSelected(0)">{{ hourData[0] }}</span>
    <div>
      <span v-for="(h, i) in hourData.slice(1)" :key="i" :class="[{active: (i+1) === nowSelectedIdx}]" @click="changeNowSelected(i+1)">
        {{h}}
      </span>
    </div>
  </div>
  <div class="hourly-products">
    <ul>
      <li
        v-for="(v, i) in items"
        :key="i"
        @touchstart="handleStart($event)"
        @touchmove="handleMove($event)"
        @touchend="handleEnd($event)">
        <img v-lazy="v.image_url" :alt="v.name" @click="tools.goProductPage($event, v.pid, v)">
        <div
          v-if="nowSelectedIdx === 0"
          @click="tools.goProductPage($event, v.pid, v)">
          <span class="name">{{v.name}}</span>
          <div>
            <span class="list_price">{{tools.priceFormat(v.price)}}</span>
            <!-- <span class="after_discount">{{tools.priceFormat(v.after_discount)}}</span> -->
            <span class="discount">{{v.discount}}</span>
            <button>搶 購</button>
          </div>
        </div>
        <div v-else>
          <span class="name" @click="tools.goProductPage($event, v.pid, v)">{{v.name}}</span>
          <div>
            <span class="list_price">{{tools.priceFormat(v.price)}}</span>
            <span class="ontime">整點折</span>
            <span></span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列

export default {
  name: 'aiCategoryProduct',
  data() {
    return {
      windowY: 0,
      items: [],
      allItems: [],
      hourData: [],
      nowSelectedIdx: 0,
      clientX: 0,
      clientMoveX: 0,
      isScrolling: false
    }
  },
  created() {
    this.getProductData()

    // 監聽window scroll
    let scrollTimer = null
    window.addEventListener('scroll', () => {
      this.isScrolling = true

      if (scrollTimer !== null) {
        clearTimeout(scrollTimer)
      }
      scrollTimer = setTimeout(() => {
        this.isScrolling = false
      }, 250)
    }, {
      passive: false
    })
  },
  props: {

  },
  methods: {
    async getProductData() {
      const siteData = this.siteData ? '&siteId=' + this.siteData.siteId : ''
      const data = await fetch(this.configs.hoursApiPath() + 'personal/discount/products/hours?pseudoId=' + this.tools.aiUserId() + siteData).then(res => res.json())

      if (data.code === 1 && data.data.length > 0) {
        this.parseData(data)
      }
    },
    parseData(data) {
      this.allItems = data.data
      this.items = data.data[0].products.map(v => this.reformat(v))
      this.hourData = data.data.map(v => v.onSaleDisplayTime)
      const cookieDomain = this.siteData ? '.ysdt.com.tw' : '.friday.tw'
      document.cookie = `AI_HS=${data.data[0].jsonWebToken};path=/;max-age=${86400};domain=${cookieDomain};secure`;
    },
    changeNowSelected(idx) {
      this.nowSelectedIdx = idx
      this.items = this.allItems[idx].products.map(v => this.reformat(v))
    },
    reformat(v) {
      return {
        pid: v.pid,
        name: v.name,
        image_url: v.imageUrl,
        discount: v.discount,
        after_discount: v.afterDiscount,
        list_price: v.listPrice,
        price: v.price,
        id3: 'MWEBA1_AI'
      }
    },
    handleStart(e) {
      this.clientX = e.touches[0].clientX
    },
    handleMove(e) {
      this.clientMoveX = e.touches[0].clientX
    },
    handleEnd() {
      if (Math.abs(this.clientMoveX) > 100 && !this.isScrolling) {
        const nowidx = this.nowSelectedIdx
        if (this.clientMoveX < this.clientX) {
          if (nowidx < this.allItems.length - 1) {
            this.changeNowSelected(nowidx + 1)
          }
        } else {
          if (nowidx !== 0) {
            this.changeNowSelected(nowidx - 1)
          }
        }
      }
      this.clientX = this.clientMoveX = 0
    },
  },
  watch: {},
  components: {
    navigation,
  }
}
</script>

<style lang="scss">
@import "./style/reset.module.scss";
@import "./style/flex.module.scss";
@import "./style/rwd.module.scss";
@import "./style/icons.module.scss";
@import "./style/global.module.scss";
</style>

<style lang="scss" scoped>
@import './style/color';
@import './style/mixin';

.hourly-products {
  margin-bottom: 75px;
  ul {
    padding: 0px 10px;
    li {
      display: flex;
      margin-bottom: 10px; 
      padding-bottom: 10px;
      border-bottom: 1px solid $web_border;
      color: $web_main;
      img {
        width: 30%;
        aspect-ratio: 1/1;
        border: 1px solid $web_border;
        border-radius: 5px;
        object-fit: cover;
      }
      >div {
        position: relative;
        padding: 2px 5px;
        width: 100%;
        .name {
          width: 100%;
          padding: 0 5px;
          box-sizing: border-box;
          font-size: 1.4rem;
          @include font-break(3);
          min-height: 40px;
        }
        >div {
          position: absolute;
          bottom: 0;
          width: 100%;
          padding: 0 5px;
          box-sizing: border-box;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }
        .list_price {
          font-size: 2rem;
          color: #777;
          &::before {
            content: '$'
          }
          &:after {
            content: '網路價';
            font-size: 1.1rem;
            position: absolute;
            top: -7px;
            left: 5px;
          }
        }
        .after_discount {
          font-size: 1.1rem;
          color: $special;
          text-decoration-line: line-through;
          &::before {
            content: '$'
          }
        }
        .discount {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 80px;
          height: 35px;
          font-size: 1.5rem;
          color: #ee6262;
          background: #f5c5c5 url(https://turn.shopping.friday.tw/images/cupn_frame.svg) no-repeat center center;
          border: 1px solid #f5c5c5;
          box-sizing: border-box;
          &::before {
            content: '$'
          }
          &:after {
            content: '個人對品折價卷';
            font-size: 0.7rem;
            position: absolute;
            top: -15px;
          }
        }
        .ontime {
          font-size: 1.3rem;
          width: 55px;
          height: 30px;
          color: $white;
          background-color: $nobel;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        button {
          padding: 7px 10px;
          background-color: $red;
          font-size: 1.5rem;
          color: $white;
          border: 0px;
          border-radius: 5px;
        }
      }
    }
  }
}

.hourly-hours {
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: 2px 4px 2px 10px;
  height: 38px;
  margin-bottom: 10px;
  
  >div {
    width: 100%;
    overflow: scroll;
    display: flex;
    align-items: center;
    -webkit-overflow-scrolling: touch;
    border-left: 1px solid #ccc;
    padding-left: 5px;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  span {
    text-align: center;
    min-width: 45px;
    margin-right: 5px;
    padding: 3px 5px;
    border-radius: 15px;
    color: #aaa;
    font-size: 1.3rem;
    background-color: #eee;
    border: 1px solid #ddd;
    &.first {
      color: $white;
      background-color: $red;
    }
    &.active {
      color: $white;
      background-color: $dodger-blue;
      opacity: .7;
    }
  }
}
</style>
