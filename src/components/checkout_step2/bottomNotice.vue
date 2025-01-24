<template>
  <div class="bottomNotice">
    <div>
      <p class="headIcon">注意事項</p>
      <ul>
        <li><b>遠時數位科技股份有限公司有保留接受訂單與否的權利。</b></li>
        <li><b>使用信用卡一次付清 / 信用卡紅利折抵 / 信用卡分期付款。</b>
          <ul>
            <li>信用卡付款目前僅接受VISA/MASTER/JCB卡別進行刷卡消費。</li>
            <li>信用卡分期付款請確認是否為可接受的銀行名單內，以避免授權失敗。</li>
            <li>信用卡紅利折抵點數及金額由發卡銀行決定，如有相關疑問建議您可聯絡發卡銀行。</li>
          </ul>
        </li>
        <li><b>使用ATM轉帳/網路ATM轉帳付款。</b>
          <ul>
            <li>ATM轉帳將提供一組(009 彰化商業銀行)虛擬轉帳帳號，轉帳金額需與訂單實付金額相符。</li>
            <li> 網路ATM轉帳為玉山銀行WebATM功能，訂購完成後會將畫面導至玉山銀行，您可以直接插入您的晶片金融卡立即完成付款。 </li>
            <li>提醒您，friDay購物不會以任何方式通知您改至ATM轉帳，請提防受騙。</li>
          </ul>
        </li>
        <li><b>使用行動支付付款。</b>
          <ul>
            <li> LINE Pay付款可使用LINE Points抵扣消費金額，當您選擇LINE Pay按下「確認送出」，於LINE Pay付款頁面確認金額並輸入付款密碼後即可完成。 </li>
            <li> HAPPY GO Pay付款訂購完成後，按下「確認送出」，於HAPPY GO Pay的付款頁面確認金額及輸入付款密碼後即可完成付款。 </li>
          </ul>
        </li>
        <li><b>遠傳幣、購物金、HappyGo點數無法折抵運費。</b></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "bottomNotice",
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/_color.scss";
.bottomNotice {
  padding-top: 40px;
  background-color: $white;
  padding-bottom: 60px;
  div {
    position: relative;
    padding: 30px 10px;
    border: 1px solid $alto;
    border-radius: 5px;
    width: 98%;
    box-sizing: border-box;
    margin: 0 auto;
    .headIcon {
      background-color: $emperor;
      position: absolute;
      top: -15px;
      left: 15px;
      padding: 4px 12px;
      color: $white;
      font-size: 1.3rem;
    }
    ul {
      font-size: 1.4rem;
      li {
        line-height: 22px;
        margin-left: 5%;
        ul {
          font-size: 1.3rem;
          list-style-type: disc;
          li {
            line-height: 18px;
          }
        }
      }
    }
  }
}
</style>
