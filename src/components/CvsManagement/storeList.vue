<template>
  <div>
    <popupDialog v-if="isDeletePopupShow" @closeCenterDialog="closeCenterDialog" :callback="deleteStore">是否刪除此門市</popupDialog>
    <ul class="storeList">
      <li v-for="item in data" :key="item.expressCheckoutId" class="storeList__item">
        <div class="top">
          <div class="top__radio">
            <i v-if="item.isDefault === 'Y'" class="top__radio--on" @click="updateStore(item.storeId)"></i>
            <i v-else class="top__radio--off" @click="updateStore(item.storeId)"></i>
          </div>
          <div class="top__content">
            <i :class="`store_type_${item.storeType}`"></i>
            <span v-if="item.storeType===1 || item.storeType===2">{{getStoreTypeName(item.storeType)}}</span>
            <span>{{item.storeName}}</span>
            <span v-if="item.isDefault === 'Y'" class="red">[預設]</span>
          </div>
          <div class="top__trashBtn" @click="openCenterDialog(item.storeSeq)">
            <i></i>
          </div>
        </div>
        <div class="gray">
          <span>{{item.name}}</span>
          <span>{{item.mobile}}</span>
          <span>{{item.email}}</span>
          <p>{{item.storeAddress}}</p>
        </div>
        <div v-if="item.isEffect === 0" class="expireMask" @click="openCenterDialog(item.storeSeq)">
          <i></i>
        </div>
        <p></p>
      </li>
      <p v-if="data.length >= 10" class="storeList__limit">已達可新增門市上限</p>
    </ul>
  </div>
</template>

<script>
import popupDialog from "../common/popupDialog.vue";
export default {
  data() {
    return {
      isDeletePopupShow: false, //控制刪除視窗
      isCreateDialogShow: false, // 控制新增視窗
      deleteExpressCheckoutId: null, //要刪除的信用卡id
    };
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    popupDialog,
  },
  methods: {
    getStoreTypeName(storeType) {
      switch (storeType) {
        case 1:
          return "7-11";
        case 2:
          return "全家";
      }
    },
    async updateStore(storeId) {
      const isOk = await this.api.member.updateDefaultStore(storeId);
      if (isOk) {
        this.$emit("updateDataList"); //觸發父類別更新data
      }
    },
    //刪除門市
    async deleteStore() {
      const isOk = await this.api.member.deleteStore(
        this.deleteExpressCheckoutId
      );
      if (isOk) {
        this.$emit("updateDataList"); //觸發父類別更新data
        return true;
      }
    },
    openCenterDialog(expressCheckoutId) {
      this.isDeletePopupShow = true;
      this.deleteExpressCheckoutId = expressCheckoutId;
    },
    closeCenterDialog() {
      this.isDeletePopupShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";

.storeList {
  list-style-type: none;

  &__item {
    min-height: 94px;
    margin: 0 0 10px 0;
    padding: 10px;
    border-radius: 8px;
    background-color: $white;
    box-sizing: border-box;
    position: relative;

    .top {
      display: flex;

      &__radio {
        i {
          width: 20px;
          height: 20px;
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

      &__content {
        flex-grow: 1;
        display: flex;
        align-items: center;

        span {
          margin-left: 10px;
        }

        i {
          width: 24px;
          height: 24px;
          margin-left: 10px;
        }
      }

      &__trashBtn {
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
  }

  &__limit {
    color: $sliver;
  }

  .red {
    color: $pomegranateapprox;
  }

  .gray {
    color: $sliver;
    text-align: left;
    margin-top: 10px;
    span {
      margin-right: 10px;
    }
  }

  .expireMask {
    width: 96%;
    position: absolute;
    top: 0px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      cursor: pointer;
      width: 60px;
      height: 60px;
      background: url(../../images/icons/exp.svg) center/60px no-repeat;
    }
  }
}
</style>
