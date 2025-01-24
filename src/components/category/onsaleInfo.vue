<template>
<div>
  <div
    v-if="rebateInfo"
    class="fcoin_rebate"
    v-html="rebateInfo"
  ></div>
  <div class="wrap">
  <h1>{{title}}</h1>
  <p>{{promotionData.promotionTime}}</p>
  <h3 v-if="orderinfo" class="order_info">{{orderinfo}}</h3>
  <div
    class="content"
    v-html="content"
  ></div>
  </div>
</div>
</template>

<script>
export default {
  name: 'onsaleInfo',
  data() {
    return {
      rebateInfo: ''
    }
  },
  props: {
    title: {
      type: String,
      default: () => ''
    },
    content: {
      type: String,
      default: () => ''
    },
    orderinfo: {
      type: String,
      default:() => ''
    },
    promotionData: {
      type: Object,
      default:() => ''
    }
  },
  created() {
    let info = this.tools.getCookie('FEEC-B2C-INFO');
    if (info) {
      info = JSON.parse(info)
      const rebate = info.data.rebateInfo ? info.data.rebateInfo : null
      if (rebate && rebate.hasRebate) {
        this.rebateInfo = `<i class="fcoinwhite"></i>最高再享回饋${info.data.rebateInfo.rebateRate}%`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  padding: 10px 15px;
  font-size: 1.4rem;
  color: #353635;
  background-color: white;
  .order_info {
    font-size: 1.2rem;
    letter-spacing: -0.62px;
    margin-bottom: 3px;
  }
}

h1 {
  font-size: 1.6rem;
  font-weight: 500;
  color: #f5281e;
}

p {
  font-size: 1.2rem;
  margin: 10px 0 
}
</style>

<style lang="scss">
.fcoin_rebate {
  width: 100%;
  color: #ffffff;
  font-weight: 500;
  font-size: 1.8rem;
  line-height: 40px;
  background-color: #ffaf00;
  padding-left: 10px;
  box-sizing: border-box;
  .rebate {
    color: #ffaf00;
    margin: 0 3px;
  }
  i {
    vertical-align: sub;
    margin-right: 3px;
    position: relative;
    top: -1px;
  }
}
</style>
