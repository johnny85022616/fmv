<template>
  <div>
    <ul class="consigneeList">
      <li v-for="item in consigneeData" class="consigneeList__item" :key="item.id">
        <div class="consigneeList__item-left">
          <div>
            <radioButton :isActive="item.isDefault" :callBack="() => updateDefaultConsignee(item.id)" />
            <p>{{item.name}}</p>
            <p v-if="item.isDefault">(預設)</p>
          </div>
          <p>{{item.mobile}}</p>
          <p>{{item.addr?.fullAddress}}</p>
        </div>
        <div class="consigneeList__item-right">
          <!-- <i @click="openCreateDialog(item.id)"></i> -->
          <i @click="openCenterDialog(item.id)"></i>
        </div>
      </li>
    </ul>
    <popupDialog v-if="isDeletePopupShow" @closeCenterDialog="closeCenterDialog" :callback="deleteConsignee">是否刪除此收貨人？</popupDialog>
  </div>
</template>

<script>
import popupDialog from "../common/popupDialog.vue";
import radioButton from "../common/radioButton.vue";
export default {
  name: "consigneeList",
  data() {
    return {
      isDeletePopupShow: false, //刪除popup狀態
      deleteId: null, //選擇需要刪除的收件人id
      choseData: null, //點擊修改按鈕或radioButton時取得選取的資料
    };
  },
  props: {
    consigneeData: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    //刪除收貨人
    async deleteConsignee() {
      const pass = await this.api.member.deleteConsignee(this.deleteId);
      if (pass) {
        this.$emit("getConsignee");
        return true;
      } else {
        return false;
      }
    },
    //開啟刪除popup
    openCenterDialog(id) {
      this.isDeletePopupShow = true;
      this.deleteId = id;
    },
    //關閉刪除popup
    closeCenterDialog() {
      this.isDeletePopupShow = false;
    },

    //選擇修改打開新增/修改dialog
    openCreateDialog(id) {
      this.getChoseData(id);
      this.$emit("openCreateDialog", this.choseData);
    },
    //更新預設收貨人
    async updateDefaultConsignee(id) {
      const pass = await this.api.member.updateDefaultConsignee(id);
      if (!pass) return;
      this.$emit("getConsignee");
    },

    //取得使用者選取的收貨人資料
    // getChoseData(id) {
    //   let choseData = this.consigneeData.filter((ele) => ele.id === id);
    //   if (choseData.length > 0) {
    //     this.choseData = choseData[0];
    //   }
    // },

    //點擊radioButton
    // updateClick(id) {
    //   console.log("id", id);
    //   this.getChoseData(id);
    // },
  },
  components: {
    popupDialog,
    radioButton,
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";

.consigneeList {
  background-color: $background;
  min-height: 100vh;
  list-style-type: none;
  padding: 10px 0;
  margin-bottom: 60px;
  &__item {
    background-color: $white;
    display: flex;
    justify-content: space-between;
    padding: 15px 10px;
    margin: 10px 10px;
    border-radius: 8px;
    &:first-of-type {
      margin-top: 0px;
    }
    &-left {
      > p {
        font-size: 1.4rem;
        margin-bottom: 5px;
        color: $sliver;
        font-weight: bold;
        &:last-of-type {
          margin-bottom: 8px;
        }
      }
      > div {
        display: flex;
        margin-bottom: 5px;
        p {
          font-size: 1.5rem;
          font-weight: bold;
          color: $black;
        }
      }
    }
    &-right {
      i {
        width: 20px;
        height: 20px;
        // &:first-child {
        //   background: url(../../images/icons/edit.svg) center/20px no-repeat;
        //   margin-right: 20px;
        // }
        &:nth-of-type(1) {
          background: url(../../images/icons/delete.svg) center/20px no-repeat;
        }
      }
    }
  }
}
</style>
