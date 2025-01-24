<template>
  <div>
    <downloadapp v-on:downloadAppOpened="downloadAppOpened" />
    <navigation :isShowRedTop="isShowRedTop" :windowY="200" v-on:stopBodyScroll="stopBodyScroll" />
    <div v-if="data" class="creditCard">
      <div class="creditCard__head">
        <p class="creditCard__head-content">
          信用卡管理
        </p>
        <span v-if="data.length < 5" class="creditCard__head-addBtn" @click="openCreateDialog()">新增</span>
      </div>
      <div class="creditCard__info">
        <creditCardList v-if="data.length > 0" :data="data" @updateCreditCard="updateCreditCard" @openDialog="openDialog"></creditCardList>
        <div v-else class="noCreditCard">
          <i class="noCreditCard__img" />
          <p>你沒有任何已儲存的信用卡</p>
          <p>快來新增信用卡，以節省您結帳的時間</p>
        </div>
      </div>
    </div>
    <fadeAlert v-if="isfadeAlertOpen" :message="'您已變更預設的信用卡'" @closeFadeAlert="closeFadeAlert" />
    <popupDialog @closeCenterDialog="closeDialog" :callback="deleteCreditCard" v-if="popupShow">是否刪除此信用卡？</popupDialog>
    <createDialog v-if="isFullscreendialogShow" @closeCreateDialog="closeCreateDialog" @insertCreditCard="insertCreditCard" />
  </div>
</template>

<script>
import downloadapp from "./components/common/downloadapp.vue"; // 頁面最上方的app下載提示
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import creditCardList from "./components/creditCardManagement/creditCardList.vue";
import fadeAlert from "./components/common/fadeAlert.vue";
import popupDialog from "./components/common/popupDialog.vue";
import createDialog from "./components/creditCardManagement/createDialog.vue";

export default {
  name: "creditCardManagement",
  data() {
    return {
      isDownloadAppOpened: false,
      isShowRedTop: true,
      windowY: 0,
      isStopScrolling: false,
      data: null,
      isfadeAlertOpen: false,
      popupShow: false,
      deleteId: null,
      isFullscreendialogShow: false, //新增修改dialog狀態
    };
  },
  components: {
    downloadapp,
    navigation,
    creditCardList,
    fadeAlert,
    popupDialog,
    createDialog,
  },
  methods: {
    downloadAppOpened() {
      this.isDownloadAppOpened = !this.isDownloadAppOpened;
    },
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
    //取得信用卡列表
    async getCreditCardData() {
      const data = await this.api.creditCard.getCreditCard();
      if (data) {
        this.data = data.map((ele) => {
          return { ...ele, isChose: ele.isDefault === "Y" };
        });
      }
    },
    //更新信用卡
    async updateCreditCard(expressCheckoutId) {
      const data = await this.api.creditCard.updateCreditCard({
        expressCheckoutId,
        isDefault: "Y",
      });
      if (data) {
        this.getCreditCardData();
        this.api.ui.alert.getFadeAlert("您已變更預設的信用卡");
      }
    },
    //刪除信用卡
    async deleteCreditCard() {
      const pass = await this.api.creditCard.deleteCreditCard(this.deleteId);
      if (pass) {
        this.getCreditCardData();
        this.api.ui.alert.getFadeAlert("已刪除信用卡");
      }
      return true;
    },
    //新增信用卡
    async insertCreditCard(insertInfo) {
      const addCreditData = await this.api.creditCard.addCreditCard(insertInfo);
      if (addCreditData) {
        this.getCreditCardData();
        this.closeCreateDialog();
      }
    },
    closeFadeAlert() {
      this.isfadeAlertOpen = false;
    },
    //刪除彈跳框
    openDialog(expressCheckoutId) {
      this.deleteId = expressCheckoutId; //設定要刪除的信用卡
      this.popupShow = true;
    },
    closeDialog() {
      this.popupShow = false;
    },
    //開啟dialog(有id為修改，沒有id為新增)
    openCreateDialog() {
      this.isFullscreendialogShow = true;
    },
    //關閉dialog
    closeCreateDialog() {
      this.isFullscreendialogShow = false;
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
    this.getCreditCardData();
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
.creditCard {
  text-align: center;
  &__head {
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
    background-color: $background;
    font-size: 1.4rem;
    color: $heavy-metal;
    padding: 10px;
    min-height: calc(100vh - 110px);
    .noCreditCard {
      margin-top: 20px;
      min-height: 300px;
      &__img {
        margin: 20px 0;
        width: 212px;
        height: 163px;
        background: url(./images/icons/credit_manage_big_img.png) no-repeat;
      }
      p {
        font-size: 1.6rem;
        color: $sliver;
      }
    }
  }
}
</style>
