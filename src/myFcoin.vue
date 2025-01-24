<template>
  <div class="queryFcoin">
    <navigation :windowY="200" />
    <div class="header">
      <img src="./images/icons/fcoin1.png" alt="">
      <p>查詢遠傳幣</p>
    </div>
    <p class="fcoin">遠傳幣餘額：<span>$ {{fcoin}}</span></p>
    <section class="mainContent">
      <p>遠傳幣為遠傳所發放的兌換幣</p>
      <p>若您需要查詢明細，請 <a href="https://ecare.fetnet.net/DigService/personalAreaController/Fcoin" target="_blank">點選前往查詢</a></p>
    </section>
    <!-- <p class="redNotice">本站增減清單(不包含遠傳其他服務資料)</p>
    <div v-if="isNoData" class="isNoData">
      目前無遠傳幣交易紀錄
    </div>
    <ul v-else class="fcoinRecoodList">
      <li v-for="(item,idx) in fcoinList" :key="idx">
        <div class="top">
          <p class="date">{{item.cdate}}</p>
          <p class="black">{{item.item}}</p>
          <p :class="['amount',{green: item.amount<0}]">{{item.formatedAmount}}</p>
        </div>
        <a v-if="item.dealId" class="middle" href="/member/myOrder">{{item.description}}</a>
        <p v-else class="middle">{{item.description}}</p>
        <p v-if="item.effectEndDate" class="bottom">到期日期：{{item.effectEndDate}}</p>
      </li>
    </ul>
    <p v-if="page === 2" class="bottomContent">近20筆資料</p>
    <div id="aiPromotionBottomLine"></div> -->
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
export default {
  name: "queryFcoin",
  data() {
    return {
      fcoinList: null,
      isNoData: false,
      isApiOk: false,
      isAtBottom: false,
      page: 0,
      isMaxPage: false, //找不到資料算最大頁數
      fcoin: 0,
    };
  },
  components: {
    navigation,
  },
  methods: {
    //查詢遠傳幣餘額
    queryFcoin() {
      this.api.member.getFetCoins().then((data) => (this.fcoin = data));
    },
    initScrollEvent() {
      window.addEventListener(
        "scroll",
        () => {
          const aiPromotionBottomLine = document.querySelector(
            "#aiPromotionBottomLine"
          );
          if (
            this.isApiOk &&
            aiPromotionBottomLine.getBoundingClientRect().top <
              window.innerHeight + window.innerHeight / 2
          ) {
            this.isAtBottom = true;
          } else {
            this.isAtBottom = false;
          }
        },
        {
          passive: true,
        }
      );
    },
    async getFcoinData() {
      if (this.isMaxPage) return;
      this.isApiOk = false;
      let data = await this.api.member.queryFcoinHistory(this.page, 10);
      if (data && data.length > 0) {
        data = data.map((ele) => ({
          ...ele,
          formatedAmount: this.formatAmount(ele.amount),
        }));
        if (this.fcoinList) {
          this.fcoinList = this.fcoinList.concat(data);
        } else {
          this.fcoinList = data;
        }
      } else {
        //如果打api找不到資料當作已經到達最大頁數
        this.isMaxPage = true;
      }
      this.$nextTick(() => {
        this.isApiOk = true;
        this.isAtBottom = false;
        this.page += 1;
      });
    },
    formatAmount(price) {
      if (!typeof price === Number) return "";
      const isNegative = price < 0;
      price = this.tools.priceFormat(Math.abs(price));
      if (isNegative) {
        return `-$${price}`;
      }
      return `$${price}`;
    },
  },

  async created() {
    this.queryFcoin();
    // await this.getFcoinData();
    // if (!this.fcoinList) {
    //   this.isNoData = true;
    //   return;
    // }
    // this.initScrollEvent();
  },
  watch: {
    isAtBottom(newVal) {
      if (this.fcoinList.length > 0 && newVal && this.page < 2) {
        this.getFcoinData();
      }
    },
  },
};
</script>

<style lang="scss">
@import "./style/reset.module.scss";
@import "./style/flex.module.scss";
@import "./style/rwd.module.scss";
@import "./style/icons.module.scss";
@import "./style/global.module.scss";
</style>

<style lang="scss" scoped>
@import "./style/_color.scss";
.queryFcoin {
  margin-bottom: 60px;
  .header {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    img {
      width: 10%;
      margin-right: 5px;
    }
    p {
      font-size: 2rem;
      color: $chilean-fire;
    }
  }
  .fcoin {
    font-size: 2.2rem;
    padding: 20px;
    text-align: center;
    span {
      color: $red;
    }
  }
  .mainContent {
    padding: 20px 40px;
    text-align: center;
    font-size: 1.6rem;
    color: $sliver;
  }
  .redNotice {
    color: $red;
    padding: 0 20px;
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
  .isNoData {
    display: flex;
    justify-content: center;
    margin-top: 100px;
    font-size: 2rem;
  }
  ul {
    padding: 0 20px;
    list-style-type: none;
    font-size: 1.4rem;
    li {
      color: $dove-gray;
      border-bottom: 1px solid $sliver;
      padding: 10px 0;
      .top {
        margin-bottom: 10px;
        display: flex;
        justify-content: flex-start;
        .date {
          margin-right: 10px;
        }
        .black {
          color: $black;
          flex-grow: 1;
          font-weight: bold;
        }
        .amount {
          color: $red;
          &.green {
            color: $la-palma;
          }
        }
      }
      a {
        display: inline-block;
      }
    }
  }
  .top,
  .middle {
    margin-bottom: 10px;
  }
  .bottomContent {
    padding: 20px;
    font-size: 1.5rem;
    text-align: center;
    color: $sliver;
  }
}

.black {
  color: black;
}
</style>
