<template>
  <div>
    <navigation :windowY="200" />
    <createDialog v-if="isFullscreenDialogShow" :showDialog="isFullscreenDialogShow" @closeDialog="closeDialog" @updateDataList="getMemberStore"></createDialog>
    <div class="cvs">
      <div class="cvs__head">
        <p class="cvs__head-content">
          取貨門市管理
        </p>
        <span v-if="!data || (data && data.length < limit)" class="cvs__head-addBtn" @click="openDialog">新增</span>
      </div>
      <div v-if="isApiOk" class="cvs__info">
        <storeList v-if="data && data.length > 0" :data="data" @updateDataList="getMemberStore" />
        <div v-else class="noStore">
          <i class="noStore__img" />
          <p>你沒有任何已儲存的取貨門市</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import storeList from "./components/CvsManagement/storeList.vue";
import createDialog from "./components/CvsManagement/createDialog.vue";
export default {
  name: "cvsManagement",
  data() {
    return {
      data: null, //門市資訊物件
      limit: null, //系統設定信用卡儲存上限筆數
      isFullscreenDialogShow: false, // 控制新增門市視窗
      isApiOk: false, //是否已取得門市資料
    };
  },
  components: {
    navigation,
    storeList,
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
    async getMemberStore() {
      const store = await this.api.member.getStoreInfos();
      this.isApiOk = true;
      if (store) {
        const { info, limit } = store;
        this.data = info;
        this.limit = limit;
      }
    },
    openDialog() {
      //開啟新增門市視窗
      this.isFullscreenDialogShow = true;
    },
    closeDialog() {
      // 關閉新增門市視窗
      this.isFullscreenDialogShow = false;
    },
  },
  created() {
    this.getMemberStore();
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

.cvs {
  text-align: center;
  background-color: $background;
  min-height: 100vh;
  margin-bottom: 60px;
  &__head {
    background-color: $white;
    color: $mine-shaft;
    font-weight: 500;
    border-bottom: 1px solid $alto;
    position: relative;

    &-content {
      font-size: 1.8rem;
      line-height: 50px;
      text-align: center;
    }

    &-addBtn {
      position: absolute;
      right: 19px;
      top: 0px;
      bottom: 0px;
      font-size: 15px;
      line-height: 50px;
    }
  }

  &__info {
    font-size: 1.4rem;
    color: $heavy-metal;
    padding: 10px;
    min-height: 300px;

    .noStore {
      margin-top: 20px;
      min-height: 300px;

      &__img {
        margin: 20px 0;
        width: 212px;
        height: 163px;
        background: url(./images/icons/store_manage_big_img.png) no-repeat;
      }

      p {
        font-size: 1.6rem;
        color: $sliver;
      }
    }
  }
}
</style>
