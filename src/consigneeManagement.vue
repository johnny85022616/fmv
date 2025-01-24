<template>
  <div class="consigneeManagement">
    <navigation :isShowRedTop="isShowRedTop" :windowY="200" v-on:stopBodyScroll="stopBodyScroll" />
    <createDialog v-if="isFullscreendialogShow" @closeCreateDialog="closeCreateDialog" @getConsignee="getConsignee" :choseData="choseData" />
    <div class="consigneeManagement__head">
      <i class="consigneeManagement__head-back" @click="historyBack"></i>
      <p class="consigneeManagement__head-title">收貨人通訊錄管理</p>
      <span class="consigneeManagement__head-add" @click="openCreateDialog(null)">新增</span>
    </div>
    <consigneeList v-if="consigneeData && consigneeData.length !== 0" :consigneeData="consigneeData" @getConsignee="getConsignee" @openCreateDialog="openCreateDialog" />
    <div v-else-if="consigneeData && consigneeData.length === 0" class="consigneeManagement__noConsignee">
      <i></i>
      <p>你沒有任何已儲存的收貨人資訊</p>
    </div>
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import consigneeList from "./components/consignee/consigneeList.vue"; //收貨人列表
import createDialog from "./components/consignee/createDialog.vue"; //新增收貨人popup
export default {
  name: "consigneeManagement",
  data() {
    return {
      isShowRedTop: true,
      windowY: 0,
      isStopScrolling: false,
      consigneeData: null, //收貨人資料
      isFullscreendialogShow: false, //新增修改dialog狀態
      choseData: null, //選擇修改的那筆收貨人資料
    };
  },
  components: {
    navigation,
    consigneeList,
    createDialog,
  },
  methods: {
    stopBodyScroll(action, jumpCurrentY = true) {
      const body = document.body;
      if (!this.isStopScrolling) {
        body.style = "padding:0;margin:0;overflow:hidden;height:100%";
        this.isStopScrolling = !this.isStopScrolling;
      }
      if (action === "close") {
        body.style = "padding:0;margin:0;";
        if (jumpCurrentY) {
          setTimeout(() => {
            window.scrollTo(0, this.currentY);
          }, 0);
        }
        this.isStopScrolling = false;
      }
    },
    //取得收貨人資料
    getConsignee() {
      this.api.member.getConsignee().then((data) => {
        if (data) {
          this.consigneeData = data;
        }
      });
    },

    //開啟dialog(有id為修改，沒有id為新增)
    openCreateDialog(choseData) {
      this.isFullscreendialogShow = true;
      this.choseData = null; //default set
      if (choseData) {
        this.choseData = choseData;
      }
    },
    //關閉dialog
    closeCreateDialog() {
      this.isFullscreendialogShow = false;
    },

    //點擊上一頁
    historyBack() {
      window.history.back();
    },
  },
  created() {
    window.addEventListener(
      "scroll",
      () => {
        const wy = window.scrollY;
        this.windowY = wy;
        this.currentY = wy !== 70 && wy !== 0 ? wy : this.currentY;
        this.isShowRedTop = wy > 0 ? false : true;
      },
      {
        passive: true,
      }
    );
    this.getConsignee();
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

.consigneeManagement {
  &__head {
    width: 100%;
    line-height: 50px;
    text-align: center;
    border-bottom: 1px solid $alto;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    &-back {
      width: 44px;
      height: 44px;
      background: url(./images/icons/icon-nav-back.svg) center/44px no-repeat;
    }

    &-title {
      font-size: 18px;
      font-weight: 500;
      color: $mine-shaft;
    }
    &-add {
      font-size: 15px;
      color: $mine-shaft;
      font-weight: 500;
      margin-right: 20px;
    }
  }
  &__addBtn {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid #e0e0e0;
    background-color: $white;

    // box-shadow:3px 0 12px $gray;
    span {
      width: 80%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 1.5rem;
      border: 2px solid $scorpion;
      border-radius: 5px;
    }
  }

  &__noConsignee {
    padding-top: 40px;
    text-align: center;
    background-color: $background;
    min-height: calc(100vh - 110px);
    i {
      width: 335px;
      height: 180px;
      background: url(./images/icons/noConsignee.jpg) center/335px 180px
        no-repeat;
      margin-bottom: 20px;
    }

    p {
      font-size: 1.6rem;
      color: $sliver;
    }
  }
}
</style>
