<template>
  <div class="qaDialog">
    <fullscreenDialog @closeDialog="closeDialog">
      <template v-slot:header></template>
      <template v-slot:body>
        <section class="qaRecord">
          <div v-if="choseProduct && !isMessageOpen" class="productArea">
            <div class="mainPrd">
              <img :src="choseProduct.images" alt="">
              <div class="info">
                <p class="dealId">交易編號： {{choseOrder.dealId}}</p>
                <p class="name line-clamp-1">品名： {{choseProduct.productName}}</p>
                <div class="spec" v-if="true">
                  <p class="line-clamp-1">規格： {{choseProduct.colorName}}</p>
                  <p>x{{choseProduct.quantity}}</p>
                </div>
              </div>
            </div>
          </div>
          <section v-if="!isMessageOpen" :class="['input__box']">
            <div class="categoryBlock">
              <select id="category" name="category" class="selbox" v-model="qaCategory">
                <option value="9">請選擇類別</option>
                <option v-for="(item, idx) in categoryList" :value="item.categoryId" :key="idx">{{item.categoryName}}</option>
              </select>
              <p>(選擇類別，有助於平台回答問題)</p>
            </div>
            <div class="textAreaBlock">
              <textarea v-model="clientInput" ref="autoGrowTextarea" rows="1" @keypress="handleKeydown" placeholder="請輸入問題"></textarea>
              <button class="sendBtn" @click="submitQuestion">送出</button>
            </div>
          </section>
          <div class="switch" @click="setSwitchStatus">
            <img src="../../images/icons/communications.png" alt="">
            <p>問答紀錄</p>
          </div>
          <section v-if="isMessageOpen" class="content">
            <template v-if="conversationInfo && conversationInfo.length>0">
              <div aria-autocomplete="" v-for="(v, idx) in conversationInfo" :key="idx" class="content__box">
                <div v-if="v.replyId && v.reply" class="content__box-service">
                  <img src="../../images/icons/xiuwu.png" />
                  <p>{{ v.reply }}<span>{{ v.formatDate }}</span></p>
                </div>
                <div v-else-if="!v.replyId && v.question" class="content__box-client">
                  <p>{{ v.question }}<span>{{ v.formatDate }}</span></p>
                </div>
              </div>
            </template>
            <p class="content__noCoversation" v-else>查無問答紀錄</p>
          </section>
          <section v-if="!isMessageOpen" class="notice">
            <p class="notice__title">特別提醒您：</p>
            <p>遠傳friDay購物不會主動以電話通知您因誤設分期，要求您提供信用卡卡號/銀行資料，或要求您前往ATM操作設定，若接到可疑電話，請拒絕回應... <a href="https://shopping.friday.tw/ec2/anti_grift">了解更多</a></p>
            <div class="fridayNotice">
              <p>注意事項</p>
              <ul>
                <li>問答紀錄保留您近6個月發問內容及回覆結果。</li>
                <li>如有其他需要服務之處，您可再次發問。</li>
              </ul>
            </div>
          </section>
          <popup v-if="isPopupAlertOpen" :isShowHeader="false" :hasMask="true">
            <template v-slot:body>
              <div class="sendPopup">
                <p>感謝您對friDay購物的支持與愛護，我們會盡快回覆您</p>
                <div class="buttonBlock">
                  <button @click="confirmClick">確定</button>
                </div>
              </div>
            </template>
          </popup>
        </section>
      </template>
    </fullscreenDialog>
  </div>
</template>

<script>
import fullscreenDialog from "../../components/common/fullscreenDialog.vue";
import popup from "../../components/common/popup.vue";
export default {
  data() {
    return {
      clientInput: "",
      conversationInfo: null,
      isMessageOpen: false,
      categoryList: null,
      qaCategory: "9",
      isPopupAlertOpen: false,
    };
  },
  props: {
    choseProduct: {
      type: Object,
    },
    choseOrder: {
      type: Object,
    },
  },
  async created() {
    this.getConversationInfo();
    this.getCategoryData();
  },
  methods: {
    //取得category資料
    async getCategoryData() {
      const data = await this.api.order.getQuestionTypeCategory();
      this.categoryList = data || [];
    },
    //取得問答紀錄
    async getConversationInfo() {
      const data = await this.api.order.queryQaRecord(
        this.formatDealId(this.choseOrder.dealId),
        this.choseProduct?.sizeId
      );
      if (data) {
        this.conversationInfo = data;
      }
    },
    //關閉popup
    closeDialog() {
      this.$emit("closeQaDialog");
    },
    //手動按下問答紀錄switch
    setSwitchStatus() {
      this.isMessageOpen = !this.isMessageOpen;
      if (this.isMessageOpen) {
        this.getConversationInfo();
      }
    },
    handleKeydown(event) {
      // shift+enter不送出
      if (event.key === "Enter") {
        if (!event.shiftKey) {
          event.preventDefault();
          this.submitQuestion();
        }
      }
    },
    // adjustHeight() {
    //   // 根據使用者輸入判斷輸入框高度
    //   const textarea = this.$refs.autoGrowTextarea;
    //   if (this.clientInput === "") {
    //     // 清空輸入框的同時將高度初始化
    //     textarea.style.height = `30px`;
    //   } else {
    //     textarea.style.height = `${textarea.scrollHeight}px`;
    //   }
    // },
    // 送出問題
    submitQuestion() {
      if (this.clientInput === "") return;
      const now = new Date();
      const formatDate = now.toLocaleString("zh-TW", {
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      });
      //手動加入
      this.conversationInfo.unshift({
        question: this.clientInput,
        formatDate,
      });
      //api加入問答紀錄
      this.api.order.addQA({
        question: this.clientInput,
        dealId: this.formatDealId(this.choseOrder.dealId),
        // orderId: this.choseProduct.orderId,
        email: "",
        name: "",
        phone: "",
        sizeId: this.choseProduct?.sizeId,
        category: this.qaCategory,
      });
      this.clientInput = ""; // 清空輸入框內容
      this.qaCategory = "9"; //問題類型下拉選單改為預設
      this.isPopupAlertOpen = true;
    },
    scrollToBottom() {
      const element = this.$refs.content;
      element.scrollTop = element.scrollHeight;
    },
    formatDealId(dealId) {
      if (dealId && !/^R/.test(dealId)) return dealId;
      let result = dealId.slice(1);
      result = result.split("-")?.[0] || dealId;
      return result;
    },
    confirmClick() {
      this.closeDialog();
    },
  },
  watch: {
    // clientInput() {
    //   this.adjustHeight();
    // },
  },
  components: {
    fullscreenDialog,
    popup,
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/color";
@import "../../style/tailwind.module.scss";
* {
  color: $web_main;
  box-sizing: border-box;
}
.notice {
  background: $white;
  font-size: 1.3rem;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  &__title {
    border-bottom: 1px solid $sliver;
    margin-bottom: 10px;
    padding-bottom: 5px;
  }
  p {
    color: $sliver;
  }
  a {
    color: $dodger-blue;
  }
  .fridayNotice {
    margin-top: 10px;
    p {
      font-size: 1.4rem;
    }
    ul {
      list-style-type: disc;
      list-style-position: inside;
      margin-top: 3px;
      color: $sliver;
      li {
        color: $sliver;
      }
    }
  }
}
.sendPopup {
  .buttonBlock {
    display: flex;
    justify-content: center;
    button {
      border: 0;
      border-radius: 5px;
      padding: 5px 20px;
      background-color: #4792fb;
      color: #ffffff;
      margin-top: 20px;
    }
  }
}
.productArea {
  margin-bottom: 10px;
  .mainPrd {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: $concretesolid;
    img {
      width: 20%;
      aspect-ratio: 1 / 1;
      border: 1px solid $alto;
      margin-right: 10px;
    }
    .info {
      width: 78%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .spec {
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
.qaRecord {
  position: relative;
  height: calc(100vh - 46px - 10px);
  .content {
    box-sizing: border-box;
    padding: 0px 18px 10px 18px;
    height: 83.5vh;
    overflow: auto;
    margin-top: 10px;
    border-radius: 5px;
    border: 1px solid $gray;
    background-color: $white;
    position: relative;
    &__box {
      padding: 10px 0;
      &-service {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        img {
          width: 10%;
          margin-right: 15px;
        }
        p {
          background-color: $concretesolid;
          box-shadow: 1px 2px 3px $sliver;
          position: relative;
          &::before {
            background-color: $concretesolid;
            left: -12px;
            -webkit-clip-path: polygon(100% 0, 0 50%, 100% 100%);
            clip-path: polygon(100% 0, 0 50%, 100% 100%);
          }
          span {
            right: 0;
          }
        }
      }
      &-client {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        p {
          background-color: $light-blue;
          box-shadow: -1px 2px 3px $sliver;
          &::before {
            background-color: $light-blue;
            right: -12px;
            -webkit-clip-path: polygon(0 0, 100% 50%, 0 100%);
            clip-path: polygon(0 0, 100% 50%, 0 100%);
            box-shadow: 1px 1px 5px $sliver;
          }
          span {
            right: 0px;
          }
        }
      }
      &-service,
      &-client {
        position: relative;
        width: 100%;
        margin-top: 15px;
        p {
          position: relative;
          word-break: break-all;
          max-width: 70%;
          padding: 10px 15px;
          border-radius: 8px;
          &::before {
            content: "";
            position: absolute;
            top: 6px;
            width: 15px;
            height: 15px;
          }
          span {
            position: absolute;
            bottom: -18px;
            font-size: 10px;
            min-width: 100px;
            text-align: right;
          }
        }
      }
    }
    &__noCoversation {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%);
      font-size: 1.8rem;
    }
  }
  .input__box {
    width: 100%;
    background-color: #e2e2e2;
    padding: 20px 15px;
    .categoryBlock {
      margin-bottom: 10px;
      .selbox {
        padding: 5px;
        border-radius: 5px;
        width: 63%;
        margin-bottom: 5px;
        text-align: center;
      }
      p {
        color: $gray;
      }
    }
    .textAreaBlock {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      p {
        writing-mode: vertical-rl;
        align-self: center;
      }
      textarea {
        min-height: 100px;
        overflow: scroll;
        width: 80%;
        box-sizing: border-box;
        padding: 5px 10px;
      }
      .sendBtn {
        width: 15%;
        border: 0;
        border-radius: 5px;
        padding: 5px;
        background-color: $dodger-blue;
        color: $white;
      }
    }
  }
  .switch {
    display: inline-flex;
    align-items: center;
    margin-top: 10px;
    p {
      color: $dodger-blue;
    }
    img {
      margin-right: 5px;
      width: 20px;
      height: 20px;
    }
  }
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>


