<template>
  <div class="storeBox">
    <div v-if="true" class="storeBox_head">
      <h3 class="title">取貨門市資訊</h3>
      <span v-if="store" @click="openStoreListDialog">變更</span>
      <span v-else @click="openCreateStoreDialog">變更</span>
    </div>
    <div class="form" v-if="store">
      <div class="top">
        <i :class="`store_type_${store.storeType}`"></i>
        <p>{{parseStoreTypeToName(store.storeType)}}{{store.storeName}}</p>
      </div>
      <div>{{store.name}} {{store.mobile}} {{store.email||''}}</div>
      <div>{{store.storeAddress}}</div>
    </div>
    <div v-else class="noStore">
      <p>尚未設定取貨門市資訊</p>
    </div>
    <modifyStoreDialog v-if="isStoreListPopupOpen && store" @closeStoreListDialog="closeStoreListDialog" @refreshStoreData="refreshStoreData" @refreshStoreDataFromModify="refreshStoreDataFromModify" />
    <createStoreDialog v-else-if="isCreateStoreDialogOpen && !store" @closeCreateStoreDialog="closeCreateStoreDialog" @refreshStoreData="refreshStoreData" />
  </div>
</template>

<script>
import modifyStoreDialog from "./modifyStoreDialog.vue";
import createStoreDialog from "./createStoreDialog.vue";
export default {
  name: "storeBox",
  data() {
    return {
      isStoreListPopupOpen: false,
      isCreateStoreDialogOpen: false,
      store: null,
    };
  },
  methods: {
    async getStore() {
      const store = await this.api.member.getStoreInfos();
      if (store) {
        const { info } = store;
        this.store = info && info.length > 0 ? info[0] : null;
      }
    },
    parseStoreTypeToName(storeType) {
      const storeTypeToName = {
        1: "7-11",
        2: "全家",
        4: "全家",
      };
      return storeTypeToName[storeType];
    },
    openStoreListDialog() {
      this.isStoreListPopupOpen = true;
    },
    closeStoreListDialog() {
      this.isStoreListPopupOpen = false;
    },
    //開啟新增門市popup
    openCreateStoreDialog() {
      this.isCreateStoreDialogOpen = true;
    },
    //關閉新增門市popup
    closeCreateStoreDialog() {
      this.isCreateStoreDialogOpen = false;
    },
    //設定新增取貨門市設定值
    refreshStoreData() {
      this.getStore();
    },
    //修改取貨門市設定值
    refreshStoreDataFromModify(choseData) {
      this.store = choseData;
    },
    parseSubmitData() {
      const { storeId, storeType, storeName, storeAddress, name, mobile } =
        this.store;
      return {
        storeId,
        storeType,
        storeName,
        storeAddress,
        consigneeName: name,
        phoneNumber: mobile,
      };
    },
    submit() {
      if (this.store) {
        return this.parseSubmitData();
      }
    },
  },
  async created() {
    await this.getStore();
  },
  components: {
    modifyStoreDialog,
    createStoreDialog,
  },
  watch: {
    store(val) {
      this.$emit("getShipFeeForOrders", val.storeType);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";
.storeBox {
  background-color: $white;
  .title {
    display: flex;
    position: relative;
    align-items: center;
    margin: 0 20px;
    padding: 10px 0;
    color: #353635;
    font-weight: bold;
    font-size: 14px;
    letter-spacing: 0.2px;
    &::before {
      content: "";
      display: inline-block;
      width: 3px;
      height: 20px;
      background-color: #f34f59;
      position: absolute;
      left: -20px;
      top: 10px;
    }
  }
  .storeBox_head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      margin-right: 25px;
      font-size: 13px;
      font-weight: 600;
      color: $special;
    }
  }
  .form {
    margin: 0 20px;
    border-bottom: 1px solid $alto;
    padding-bottom: 10px;
    .top {
      display: flex;
      align-items: center;
      i {
        margin-right: 5px;
      }
    }
    > div {
      color: $sliver;
      font-size: 14px;
      margin-bottom: 3px;
    }
  }
  .noStore {
    color: $sliver;
    font-size: 14px;
    margin: 0 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid $alto;
  }
}
</style>
