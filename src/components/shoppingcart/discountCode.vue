<template>
  <div class="drawDiscountBox">
    <a href="#" @click.prevent="openPopup">如您有折扣碼</a>&nbsp;<i class="checkbox" @click.prevent="openPopup"></i>

    <div v-if="isShowPopup" class="disCountCode">
      <popup @closePopup="closePopup">
        <template v-slot:header>
          <p>輸入折扣碼領優惠</p>
        </template>
        <template v-slot:body>
          <div>
            <div>
              <input type="text" v-model="discountCode" placeholder="">
              <div>
                <button @click="drawDiscount">確定</button>
              </div>
            </div>
          </div>
        </template>
      </popup>
    </div>


  </div>
</template>

<script>
import popup from "../common/popup.vue";

export default {
  name: "discountCode",
  components: {
    popup,
  },
  data() {
    return {
      isShowPopup: false,
      discountCode: ''
    };
  },
  created() { },
  methods: {
    // 開啟Popup
    openPopup() {
      this.isShowPopup = true;
    },
    closePopup() {
      this.isShowPopup = false;
    },
    // 領取折價卷
    async drawDiscount() {
      const disCode = this.discountCode;
      if (!disCode) return;

      // 領取
      const drawResult = await this.api.campaign.drawDiscountCode(disCode);
      if (drawResult.status === 0) {
        alert(drawResult.msg);
        this.discountCode = '';
        return;
      }

      // 成功 清空
      this.discountCode = '';
      this.isShowPopup = false;
      alert(drawResult.msg);

      // 重跑購物車
      this.$emit('initCart');
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/color.scss";

.drawDiscountBox {
  position: absolute;
  top: 50px;
  left: 30px;
  width: 80%;
  display: flex;
}

.disCountCode {
  p {
    font-size: 1.5rem;
    text-align: center;
    padding-bottom: 5px;
    border-bottom: 1px solid $special;
    line-height: 45px;
  }

  >div {
    padding: 10px 0;
    text-align: center;
  }

  input {
    width: 100%;
    text-align: center;
    font-size: 1.5rem;
    border: 1px solid $sliver;
    padding: 8px;
    border-radius: 3px;
    margin: 30px 0 15px;
    letter-spacing: 0.8rem;
    box-sizing: border-box;

  }

  button {
    font-size: 1.5rem;
    padding: 5px 8px;
    background-color: $dodger-blue;
    color: $white;
    letter-spacing: 3px;
    text-indent: 3px;
    border-radius: 5px;
  }
}
</style>
