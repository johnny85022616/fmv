<template>
  <div>
    <counterRedBar />
    <div class="brandNav">
      <div class="logo">
        <a :href="logoUrl" target="_blank">
          <img :src="supplierData.logoMobile" :style="{ backgroundColor: `${supplierData.headerColor ? supplierData.headerColor : '#ddd5cc'}`}">
        </a>
      </div>
      <div class="search">
        <p>櫃內搜尋</p>
        <div class="input">
          <input type="text" placeholder="搜尋櫃內商品" v-model="inputVal" @keydown="goSearchByEnter">
          <img data-v-deb93296="" src="https://event.shopping.friday.tw/event/CP/common/mobile_icon/search-gy.svg" @click="goSearch">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import counterRedBar from "../brandPromotion/counterRedBar.vue";
export default {
  name: "brandNav",
  data() {
    return {
      inputVal: "",
      keyword: "",
    };
  },
  props: {
    supplierData: {
      type: Object,
    },
  },
  components: {
    counterRedBar,
  },
  async created() {},

  methods: {
    //搜尋框點擊事件
    goSearch() {
      this.keyword = this.inputVal; //按下enter或點擊時才送出關鍵字(避免美輸入一個字就做一次搜尋)
      location.href = `/shop/${this.supplierData.urlSuffix}/search?kw=${this.keyword}`;
    },
    //搜尋框enter事件
    goSearchByEnter(evt) {
      if (evt && evt.keyCode === 13) {
        evt.preventDefault();
        this.goSearch();
        evt.stopPropagation();
      }
    },
  },

  computed: {
    logoUrl() {
      return this.configs.ysdtDomain() + "/" + this.supplierData.urlSuffix;
    },
  },
};
</script>


<style lang="scss" scoped>
@import "../../style/_color.scss";
.brandNav {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  position: sticky;
  top: 87px;
  z-index: 1;
  background-color: $white;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.16);
  .logo {
    margin-right: 20px;
    border-radius: 5px;
    img {
      width: auto;
      max-height: 40px;
      object-fit: contain;
      border-radius: 5px;
      vertical-align: top;
    }
  }
  .search {
    flex: 1 1 70%;
    margin: 5px 0;
    display: flex;
    align-items: center;
    p {
      font-size: 14px;
      margin-right: 5px;
      min-width: 60px;
    }
    .input {
      width: 100%;
      position: relative;
      input {
        width: 100%;
        box-sizing: border-box;
        padding: 0 10px;
        height: 40px;
        border-radius: 10px;
        background-color: #fff;
        border: 1px solid $sliver;
      }
      img {
        position: absolute;
        top: 8px;
        right: 15px;
      }
    }
  }
}
</style>