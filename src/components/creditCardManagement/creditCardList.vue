<template>
  <div>
    <ul class="creditCardList">
      <li v-for="(item , index) in data" :key="item.expressCheckoutId" class="creditCardList__item">
        <div class="creditCardList__item-radio">
          <i v-if="item.isChose" class="creditCardList__item-radio--on" @click="updateCreditCard(item.expressCheckoutId , index)"></i>
          <i v-else class="creditCardList__item-radio--off" @click="updateCreditCard(item.expressCheckoutId)"></i>
        </div>
        <div class="creditCardList__item-content">
          <div>
            <span>{{item.bankName}}</span>
            <span v-if="item.isChose" class="red">[預設]</span>
          </div>
          <div>
            <span class="gray">**** {{item.lastFourDigits}} {{item.expiration.substr(4)}}/{{item.expiration.substr(2, 2)}} </span>
            <i :class="`creditCardType${item.creditCardType}`"></i>
          </div>
          <div>
            <span class="gray">{{item.name}}</span>
          </div>
        </div>
        <div class="creditCardList__item-trashBtn" @click="deleteCreditCard(item.expressCheckoutId)">
          <i></i>
        </div>
      </li>
      <p v-if="data.length >= 5" class="creditCardList__limit">儲存的卡片已達上限</p>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    data: Array,
    default: () => [],
  },
  components: {},
  methods: {
    updateCreditCard(expressCheckoutId) {
      this.$emit("updateCreditCard", expressCheckoutId);
    },
    deleteCreditCard(expressCheckoutId) {
      this.$emit("openDialog", expressCheckoutId);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";
.creditCardList {
  list-style-type: none;

  &__item {
    display: flex;
    min-height: 80px;
    margin: 0 0 10px 0;
    padding: 10px;
    border-radius: 8px;
    background-color: $white;
    box-sizing: border-box;

    &-radio {
      i {
        width: 20px;
        height: 20px;
        margin: 0 10px;
      }

      &--on {
        background: url(../../images/icons/double-circle.png) center/20px
          no-repeat;
      }

      &--off {
        background: url(../../images/icons/circle-line-gy.png) center/20px
          no-repeat;
      }
    }

    &-content {
      flex-grow: 1;

      div {
        display: flex;
        align-items: center;

        span {
          &:nth-of-type(2n + 1) {
            margin-right: 5px;
          }
        }

        i {
          width: 26px;
          height: 16px;
        }

        .creditCardType1 {
          background: url(../../images/icons/visa.png) center/26px 16px
            no-repeat;
        }

        .creditCardType2 {
          background: url(../../images/icons/mastercard.png) center/26px 16px
            no-repeat;
        }

        .creditCardType4 {
          background: url(../../images/icons/jcb.png) center/26px 16px no-repeat;
        }
      }
    }

    &-trashBtn {
      width: 7%;
      height: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;

      i {
        width: 20px;
        height: 20px;
        background: url(../../images/icons/icon-delete.png) center/20px
          no-repeat;
      }
    }
  }

  &__limit {
    color: $sliver;
  }

  .red {
    color: $pomegranateapprox;
  }

  .gray {
    color: $sliver;
  }
}
</style>
