<template>
  <div class="modifyStoreDialog">
    <fullscreendialog :isFullscreen="true" :backgroundColor="'#f4f4f4'" @closeDialog="closeStoreListDialog">
      <template v-slot:header>選擇門市</template>
      <template v-slot:body>
        <ul class="storeList">
          <li v-for="(item , idx) in storeList" class="storeList__item" :key="idx">
            <div class="radio">
              <i :class="['icon-radio', {active: item.isChose}]" @click="setStoreChose(idx)"></i>
            </div>
            <div class="info">
              <div class="top">
                <i :class="`store_type_${item.storeType}`"></i>
                <p>{{item.storeTypeName}} {{item.storeName}}</p>
                <p v-if="item.isDefault === 'Y'" class="red">[預設]</p>
              </div>
              <div>{{item.name}} {{item.mobile}} {{item.email|| ''}}</div>
              <div>{{item.storeAddress}}</div>
            </div>
          </li>
        </ul>
        <div class="submitBtn">
          <div class="createType" v-if="storeList && storeList.length < 10">
            <span class="createBtn" @click="openCreateStoreDialog">新增</span>
            <span @click="confirmClick">確認</span>
          </div>
          <span v-else @click="confirmClick">確認</span>
        </div>
        <createStoreDialog v-if="isCreateStoreDialogOpen" @closeCreateStoreDialog="closeCreateStoreDialog" @refreshStoreData="refreshStoreData" />
      </template>
    </fullscreendialog>
  </div>
</template>

<script>
import fullscreendialog from "../common/fullscreenDialog.vue"; // 全畫面蓋版提示框
import createStoreDialog from "./createStoreDialog.vue";

export default {
  name: "modifyStoreDialog",
  data() {
    return {
      storeList: null,
      isCreateStoreDialogOpen: false,
    };
  },
  props: {},
  methods: {
    async getStoreListData() {
      let storeList;
      const store = await this.api.member.getStoreInfos();
      if (store) {
        const { info } = store;
        storeList = info;
      }
      if (storeList && storeList.length > 0) {
        this.storeList = storeList.map((ele, idx) => {
          if (idx !== 0) {
            return { ...ele, isChose: false };
          }
          return { ...ele, isChose: true };
        });
      }
    },
    parseStoreTypeToName() {
      const storeTypeToName = {
        1: "7-11",
        2: "全家",
        4: "全家",
      };
      this.storeList = this.storeList.map((ele) => {
        return { ...ele, storeTypeName: storeTypeToName[ele.storeType] };
      });
    },
    //radio選取狀態變換
    setStoreChose(idx) {
      this.storeList.forEach((ele, index) => {
        if (idx === index) {
          ele.isChose = true;
        } else {
          ele.isChose = false;
        }
      });
    },
    //關閉選擇門市popup
    closeStoreListDialog() {
      this.$emit("closeStoreListDialog");
    },
    //更新store list(createDialog按下確認後呼叫)
    refreshStoreData() {
      this.$emit("refreshStoreData");
      this.closeStoreListDialog();
    },
    //確定按鈕
    confirmClick() {
      const storeData = this.storeList.filter((ele) => ele.isChose);
      if (storeData && storeData.length > 0) {
        this.$emit("refreshStoreDataFromModify", storeData[0]);
        this.closeStoreListDialog();
      }
    },
    //開啟新增門市popup
    openCreateStoreDialog() {
      this.isCreateStoreDialogOpen = true;
    },
    //關閉新增門市popup
    closeCreateStoreDialog() {
      this.isCreateStoreDialogOpen = false;
    },
  },
  async created() {
    await this.getStoreListData();
    this.parseStoreTypeToName();
  },

  components: {
    fullscreendialog,
    createStoreDialog,
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";

.modifyStoreDialog {
  .storeList {
    margin-bottom: 60px;
    &__item {
      display: flex;
      align-items: center;
      border-radius: 8px;
      border: 1px solid $alto;
      background-color: $white;
      padding: 10px;
      margin-bottom: 10px;
      .info {
        margin-left: 15px;
        color: $sliver;
        > div {
          margin-bottom: 5px;
        }
        .top {
          display: flex;
          align-items: center;
          color: $tundora;
          i {
            margin-right: 5px;
          }
        }
      }
    }
  }
  .submitBtn {
    width: 100%;
    height: 60px;
    line-height: 60px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: $white;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #e0e0e0;
    span {
      display: inline-block;
      width: 92%;
      height: 40px;
      background-color: $red;
      color: $white;
      line-height: 40px;
      text-align: center;
      border-radius: 10px;
    }
    .createType {
      width: 100%;
      display: flex;
      justify-content: space-around;
      span {
        width: 45%;
        &:first-of-type {
          background-color: $white;
          border: 1px solid $red;
          color: $red;
        }
      }
    }
  }
  .red {
    color: $red;
  }
}
</style>
