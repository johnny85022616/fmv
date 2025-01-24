<template>
  <div>
    <div class="additional-box control-bar tab-section" data-tab="加購">
      <div class="control-bar-title">加購</div>
      <i
        v-if="itemData.length > 4"
        class="arrow-right"
        @click="openListDialog()"
      ></i>
      <div class="items">
        <span
          :class="{ 'items-list': true, 'sold-out': item.isSoldOut }"
          v-for="(item, index) of itemData"
          :key="index"
          @click="openDialog(item)"
        >
          <img
            :src="item.images[0]"
            :alt="item.name"
            :class="{ 'sold-out': item.isSoldOut }"
          />
          <span class="sold-out-txt">
            <font>補貨中</font>
          </span>
          <font class="price">${{ formatPrice(item.memberPrice) }}</font>
        </span>
      </div>
    </div>

    <autoscreendialog
      v-if="isShowDetailDialog"
      v-on:closeDialog="closeDialog"
      :zIndex="1000"
    >
      <template v-slot:header>商品詳細說明</template>
      <template v-slot:body>
        <div class="product-addition-detail">
          <div>
            <img :src="dialogData.images[0]" alt="" />
          </div>
          <div>
            {{ dialogData.name }}
          </div>
          <div>
            <font>加購價 $</font>
            <font>{{ formatPrice(dialogData.memberPrice) }}</font>
            <font>{{ formatPrice(dialogData.marketPrice) }}</font>
          </div>
        </div>
      </template>
    </autoscreendialog>

    <autoscreendialog
      v-if="isShowListDialog"
      v-on:closeDialog="closeListDialog"
    >
      <template v-slot:header>加購商品</template>
      <template v-slot:body>
        <div class="product-addition-box">
          <div
            v-for="(item, index) of itemData"
            :key="index"
            :class="['product-list-box', { soldout: item.isSoldOut }]"
            @click="openDialog(item)"
          >
            <div>
              <img :src="item.images[0]" :alt="item.name" />
              <span v-if="item.isSoldOut" class="circlemask">
                <font>補貨中</font>
              </span>
            </div>
            <div>
              <span>{{ item.name }}</span>
              <span class="product-list-box__price">
                <font>${{ formatPrice(item.memberPrice) }}</font>
                <font>{{ formatPrice(item.marketPrice) }}</font>
              </span>
            </div>
          </div>
        </div>
      </template>
    </autoscreendialog>
  </div>
</template>

<script>
import autoscreendialog from "../common/autoscreenDialog.vue"; // 蓋版提示框

export default {
  name: "additional",
  components: {
    autoscreendialog,
  },
  data() {
    return {
      isShowDetailDialog: false,
      isShowListDialog: false,
      dialogData: {},
    };
  },
  props: {
    itemData: {
      type: Array,
    },
  },
  methods: {
    formatPrice(p) {
      return this.tools.priceFormat(p);
    },
    openDialog(obj) {
      this.dialogData = obj;
      this.isShowDetailDialog = true;
      this.$emit("stopBodyScroll");
    },
    closeDialog() {
      this.isShowDetailDialog = false;
      this.$emit("stopBodyScroll", "close");
    },
    openListDialog() {
      this.isShowListDialog = true;
    },
    closeListDialog() {
      this.isShowListDialog = false;
    },
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
@import "../../style/color.scss";
@import "../../style/mixin.scss";

.product-addition-box {
  padding: 15px;
  background-color: $background;

  .product-list-box {
    padding: unset;
    margin-bottom: 10px;
    border-radius: 10px;
    background-color: $white;
    &__price {
      display: inline-block !important;
      line-height: 20px;
      vertical-align: middle;
      font {
        &:first-of-type {
          display: inline-block !important;
          margin-right: 5px;
          overflow: unset !important;
          color: $red !important;
          font-size: 1.6rem !important;
        }
        &:last-of-type {
          display: inline-block !important;
          color: $special;
          font-size: 1.2rem;
          text-decoration: line-through;
        }
      }
    }
  }
}

.additional-box {
  box-sizing: border-box;
  font-size: 1.4rem;
  white-space: nowrap;

  .items {
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    padding-left: 20px;
    box-sizing: border-box;

    .items-list {
      position: relative;
      display: inline-block;
      padding: 0 5px 10px 5px;

      &.sold-out {
        .sold-out-txt {
          display: block;
        }

        .price {
          color: $sliver;
        }
      }

      font {
        display: block;
      }

      img {
        border: 1px solid $web_border;
        width: 90px;
        height: 90px;
        border-radius: 10px;
        background-color: $background;

        &.sold-out {
          opacity: 0.5;
        }
      }

      .sold-out-txt {
        display: none;
        position: absolute;
        left: 20px;
        top: 15px;
        width: 60px;
        height: 60px;
        line-height: 60px;
        border-radius: 50px;
        background-color: $black;
        opacity: 0.6;
        text-align: center;

        font {
          font-size: 1.3rem;
          color: $white;
        }
      }
    }
  }
}

.product-addition-detail {
  padding: 10px;
  > div {
    &:first-of-type {
      img {
        width: 100%;
        border-radius: 10px;
        object-fit: cover;
      }
    }
    &:nth-of-type(2) {
      font-size: 1.6rem;
      color: $web_main;
      @include font-break(2);
    }
    &:nth-of-type(3) {
      padding-bottom: 10px;
      font {
        &:nth-child(1) {
          color: $red;
          font-size: 1.4rem;
        }
        &:nth-child(2) {
          margin-right: 5px;
          color: $red;
          font-size: 2.2rem;
        }
        &:nth-child(3) {
          color: $web_minor;
          font-size: 1.2rem;
          text-decoration: line-through;
        }
      }
    }
    &:nth-of-type(4) {
      padding-top: 10px;
      label {
        display: block;
        margin-bottom: 10px;
        color: $web_minor;
        font-size: 1.4rem;
      }
    }
  }
}
</style>