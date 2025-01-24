<template>
<div>
  <div class="wrap">
    <div
      class="items square"
      v-for="(item, index) in itemList"
      :key="index">
      <!-- {{isOrder(item.pid,comboGroup)}} -->
      <!-- <div :class="['items-wrap',{'soldout':item.measure.sold_out}]"> -->
      <div :class="['items-wrap',{'soldout':item.measure.sold_out, 'ordered': isOrder(item.pid, comboGroup) == true}]">
        <span class="status"></span>
        <img v-if="item.restricted" src="/static/images/18+.svg">
        <img v-else :src="item.image_url" @click="productDetail(item.pid)">
        <div class="items-txt">
          <span class="pname" v-html="item.name"></span>
        </div>
        <div class="btnWrapper">
          <p
            class="soldout"
            v-if="item.measure.sold_out">已售完</p>
          <button v-else-if="!item.measure.sold_out" @click="orderItem(item,comboGroup)" :isOrder="isOrder(item.pid,comboGroup)">選購</button>
          <div
            class="qty-container"
            :id="item.pid">
            <div
              class="ficon ficon-minus minus"
              @click="qtyMinus(item.pid,comboGroup,item)"></div>
            <input class="product-count" :value="qtyVal(item.pid,item)">
            <div
              class="ficon ficon-plus plus"
              @click="qtyPlus(item.pid,comboGroup,item)"></div>
          </div>
        </div>

      </div>
    </div>
  </div>
  <buyitem
    :pid="pid"
    :cid="cid"
    :combinedPd="combinedPd"
    :comboGroup="comboGroup"
    v-if="showCartDialog"
    v-on:closeBuyItem="closeBuyItem"
    v-on:getSpecOrder="getSpecOrder"
    :isCombo="isCombo"
    :measure="measure"
    :isProdPage="!fullInfoStyle" />

  <div v-if="showDialog">
    <fullscreendialog
      :isFullscreen="true"
      :closeDialog="closeDialog"
      v-on:closeDialog="closeDialog">
      <template v-slot:header>商品詳細說明</template>
      <template v-slot:body>
        <div class="container">
          <div class="prdName"></div>
          <div class="prdPidArea">商品訂購代號：<span class="prdPid"></span></div>
          <div class="content"></div>
          <div class="content"></div>
        </div>
      </template>
    </fullscreendialog>
  </div>

</div>
</template>

<script>
import buyitem from "../product/buyitem";
import fullscreendialog from "./fullscreenDialog.vue"; // 全畫面蓋版提示框
export default {
  name: "comboItem",
  data() {
    return {
      showCartDialog: false,
      fullInfoStyle: false,
      isCombo: true,
      orderItems: {},
      measure: [],
      combinedPd: [],
      showDialog: false,
      productDescTxt: ''
    };
  },
  components: {
    buyitem,
    fullscreendialog
  },
  props: {
    itemList: {
      type: Array,
    },
    pid: {
      type: Number,
      default: 0
    },
    cid: {
      type: Number,
      default: 0
    },
    comboGroup: {
      type: String
    },
    orderItemsAll: {
      type: Array,
      default: () => []
    }
  },
  created() {
    this.imgWidth = (window.innerWidth - 20) / 2;
  },
  watch: {

  },
  methods: {
    productDetail(pid) {
      this.showDialog = true;
      this.axios.get(`productDesc?pid=${pid}`).then(res => {
        const data = res.data.payload
        document.querySelector('.container .prdName').innerHTML = data.productName
        document.querySelector('.container .prdPidArea .prdPid').textContent = pid
        document.querySelectorAll('.container .content').forEach((e, i) => {
          switch (i) {
            case 0:
              e.innerHTML = data.productDescVO.strDescDescription;
              break;
            case 1:
              e.innerHTML = data.productDescVO.strDescSpecification;
              break;
          }

        })

      })
    },
    closeDialog() {
      this.showDialog = false
    },
    qtyPlus(pid, comboGroup, i) {
      const spec = Object.prototype.hasOwnProperty.call(i.measure[0], 'spec');
      if (spec) {
        this.combinedPd = []
        this.showCartDialog = true;
        this.measure = i
        this.orderItemsAll.forEach(e => {
          if (e.pid == pid) {
            this.combinedPd.push(e)
          }
        })
      } else {
        this.orderItems[comboGroup].forEach(el => {
          if (el.pid == pid) {
            if (el.buyQty < el.buyMaxQty) {
              el.buyQty = Number(el.buyQty) + 1
            }
          }
        })
      }
    },
    qtyMinus(pid, comboGroup, i) {
      const spec = Object.prototype.hasOwnProperty.call(i.measure[0], 'spec');
      if (spec) {
        this.$emit('showOrderMenu', true)
      } else {
        this.orderItems[comboGroup].forEach((item, inx) => {
          if (item.pid == pid) {
            if (item.buyQty > 1) {
              item.buyQty = item.buyQty - 1
            } else {
              this.orderItems[comboGroup].splice(inx, 1)
              this.$emit('removeOrder', comboGroup)
            }
          }
        })
      }
    },
    qtyVal(pid) {
      // 目前所選區是否有已選購商品
      if (Object.prototype.hasOwnProperty.call(this.orderItems, this.comboGroup)) {
        let buyQty = 0;
        this.orderItems[this.comboGroup].forEach((item) => {
          if (item.pid == pid) {
            buyQty = item.buyQty
            this.$emit('areaOrderQty', buyQty, this.comboGroup)
          }
        })
        return buyQty
      } else {
        return 0
      }
    },
    orderItem(i, comboGroup) {
      const spec = Object.prototype.hasOwnProperty.call(i.measure[0], 'spec');
      if (spec) {
        this.showCartDialog = true;
        this.measure = i
      } else {
        const item = {
          pid: i.pid,
          name: i.name,
          image: i.image_url,
          buyQty: 1,
          buyMaxQty: i.measure[0].purchase_qty,
          comboGroup: this.comboGroup
        }
        if (!Object.prototype.hasOwnProperty.call(this.orderItems, this.comboGroup)) {
          this.$set(this.orderItems, this.comboGroup, [item]);
        } else {
          this.orderItems[this.comboGroup].push(item)
        }
      }
      this.isOrder(i.pid, comboGroup)
      this.$emit('getOrder', this.orderItems)
    },
    getSpecOrder(item, n) {
      if (!Object.prototype.hasOwnProperty.call(this.orderItems, n)) {
        this.$set(this.orderItems, n, [item[n]]);
        this.isOrder(item[n].pid, n)
      } else {
        let isExit = false
        let i = '';
        this.orderItems[this.comboGroup].forEach((e, inx) => {
          if (e.pid == item[this.comboGroup].pid) {
            isExit = true
            i = inx
          }
        });
        if (!isExit) {
          this.orderItems[this.comboGroup].push(item[this.comboGroup]);
        } else {
          // this.orderItems[this.comboGroup][i] = item[this.comboGroup]
          this.$set(this.orderItems[this.comboGroup], i, item[this.comboGroup]);
        }
        this.isOrder(item[n].pid, n);
      }
      this.$emit('getOrder', this.orderItems)
    },
    closeBuyItem() {
      this.showCartDialog = false
    },

  },
  computed: {
    isOrder() {
      return function (pid, n) {
        let isOrder = false
        if (this.orderItems[n]) {
          this.orderItems[n].forEach(o => {
            if (pid == o.pid) {
              isOrder = true
            }
          })
        }
        return isOrder
      }
    }
  },
};
</script>

<style lang="scss">
.container {
  padding-bottom: 20px;

  img {
    width: 100%;
    max-width: 120%;
    height: auto;
  }

  .prdName {
    font-size: 16px;
    font-weight: 500;
    color: #353635;
  }
}

</style>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  background-color: #f4f4f4;

  * {
    box-sizing: border-box;
  }

  .items {
    flex: 0 0 50%;
    display: flex;
    padding: 7px 7.5px 20px 20px;
    box-sizing: border-box;

    .items-wrap {
      width: 100%;
      vertical-align: top;
      text-align: left;
      padding: 0 0 10px 0;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      position: relative;

      .qty-container {
        display: none;
      }

      .status {
        // display: none;
        width: 80px;
        height: 80px;
        margin: 0 auto;
        text-align: center;
        background-color: #000;
        position: absolute;
        border-radius: 50%;
        color: #fff;
        display: none;
        justify-content: center;
        align-items: center;
      }

      &.soldout {
        opacity: .5;

        .status {
          display: flex;

          &:after {
            content: '補貨中'
          }
        }
      }

      img {
        border-radius: 10px 10px 0 0;
        --widthA: calc(100%);
        width: var(--widthA);
        --heighA: calc(100vw - 54px);
        --heighB: calc(var(--heighA)/2);
        height: var(--heighB);
      }

      .btnWrapper {
        text-align: right;
        margin-top: 10px;

        button {
          padding: 1px 5px;
          font-size: 1.3rem;
          border: 1px solid #3c3c3c;
          border-radius: 5px;
          margin-right: 10px;
          display: inline-block;
        }

        .soldout {
          width: 100%;
          background-color: #e0e0e0;
          color: #fff;
          border-radius: 5px;
          text-align: center;
          padding: 2px 0;
          font-size: 1.4rem;
        }
      }

      &.ordered {
        button {
          display: none;
        }

        .status {
          display: flex;
          left: 50%;
          top: 80px;
          transform: translate(-50%, -50%);
          background-color: rgba(0, 0, 0, 0.6);

          &:after {
            content: '已選購'
          }
        }

        .qty-container {
          display: flex;
          justify-content: center;
          margin-top: 10px;
          line-height: 0;

          &.slideInRight {
            animation: slideInRight .5s both;
          }

          .ficon {
            width: 20px;
            height: 20px;
            font-size: 20px;
            margin: 0 5px;
          }

          .product-count {
            width: 80px;
            margin: 0 10px;
            font-size: 1.6rem;
            text-align: center;
            border: 1px solid #adadad;
            border-radius: 5px;
            padding: 2px 0;
          }

          .ficon,
          .product-count {
            display: inline-block;
            vertical-align: middle
          }
        }
      }

      .pname {
        color: #3c3c3c;
        font-size: 1.4rem;
        height: 4rem;
        line-height: 2rem;
        padding: 0 10px;
        box-sizing: border-box;
        overflow: hidden;
        text-align: left;
        word-break: break-all;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        text-overflow: ellipsis;
      }

    }
  }

  .items.square:nth-child(even) {
    padding: 7px 20px 20px 7px;
  }
}

@keyframes slideInRight {
  0% {
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
    visibility: visible
  }

  to {
    -webkit-transform: translateZ(0);
    transform: translateZ(0)
  }
}

@media screen and (max-width: 320px) {}

@media screen and (min-width: 412px) {}
</style>
