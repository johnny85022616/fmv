<template>
<div class="add_plus wrap"><label>加價購</label>
  <div v-for="(item, index) of itemsFilter" :key="index">
    <div :class="['plusitem', 'd-flex', {'soldout': item.quota === 0}]">
      <div class="addimg">
        <img :src="item.images[0]" :alt="item.name">
      </div>
      <div class="additem">
        <span class="pname text-break-2">{{item.name}}</span>
        <div class="additem_price d-flex">
          <span>{{item.memberPrice}}</span>
          <span>{{item.marketPrice}}</span>
        </div>
        <div v-if="!item.isSoldOut && item.quota !== 0" class="Quantity">
          <i @click="minus(index)" :class="['minus', {'active': buyItems[index].qty !== 0}]"></i>
          <input type="text" :value="buyItems[index].qty" class="QuantityNum" />
          <i @click="plus(index)" :class="['plus', {'active': buyItems[index].qty < item.quota}]"></i>
        </div>
        <div v-else class="SaleOut">
          <a title="已售完" class="Btn BtnGray">已售完</a>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "buyadditional",
  data() {
    return {
      buyItems: [],
      savePlusQty: 0
    }
  },
  props: {
    items: {
      type: Array
    }
  },
  created() {
    this.buyItems = this.items.map(v => {
      return {
        aid: v.aid,
        qty: 0,
        price: v.memberPrice
      }
    });
  },
  computed: {
    itemsFilter() {
      return this.items;
    }
  },
  methods: {
    minus(idx) {
      if (this.buyItems[idx].qty === 0) {
        return
      }
      this.buyItems[idx].qty -= 1

      this.$emit('sendAdditional', this.buyItems.filter(v => v.qty > 0))
    },
    plus(idx) {
      // 判斷是否超過最大可販售數量
      if (this.buyItems[idx].qty >= this.items[idx].quota) {
        return
      }
      this.buyItems[idx].qty += 1
      this.savePlusQty = this.buyItems[idx].qty
      this.$emit('sendAdditional', this.buyItems.filter(v => v.qty > 0))
    },
  },
};
</script>

<style lang="scss" scoped>
label {
  color: #adadad;
  font-size: 1.4rem;
  line-height: 30px;
}

.add_plus {
  .plusitem {
    margin-bottom: 12px;

    &.soldout {
      border-radius: 10px;
      background-color: #f4f4f4;

      img,
      span {
        opacity: .5;
      }
    }

    .QuantityNum {
      width: 50px;
      height: 24px;
      border: 0 none;
      font-size: 1.6rem;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      text-align: center;
      cursor: text;
      border-radius: 0;
      vertical-align: middle;

      &:focus {
        outline: 0;
      }
    }

    .Quantity {
      display: flex;
    }

    .Quantity,
    .SaleOut {
      position: absolute;
      right: 0;
      bottom: 0;
    }

    .SaleOut {
      width: 100px;
      height: 24px;
      bottom: 5px;

      a {
        display: inline-block;
        width: 100%;
        border-radius: 5px;
        color: #ffffff;
        font-size: 14px;
        text-align: center;
        background-color: #e0e0e0;
        padding: 2px 0;
      }
    }

    .addimg {
      width: 100px;
      flex-basis: 100px;
      max-width: 100px;

      img {
        width: 100%;
        display: block;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        background-color: #d8d8d8;
      }
    }

    .additem {
      width: 70%;
      max-width: 68%;
      padding: 10px 6px;
      font-size: 1.4rem;
      position: relative;

      .pname {
        height: 40px;
      }

      p {
        font-size: 15px;
      }

      .additem_price {
        padding: 4px 0;
        align-items: center;
        justify-content: flex-start;

        span {
          &:first-child {
            font-size: 1.6rem;
            color: #f34f59;
            margin-right: 3px;

            &:before {
              content: "$";
              display: inline-block;
              font-size: 13px;
            }
          }

          &:last-child {
            text-decoration: line-through;
            font-size: 1.2rem;
            color: #adadad;

          }
        }
      }
    }
  }
}
</style>
