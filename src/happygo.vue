<template>
  <div class="wrap">
    <navigation />
    <div class="happygoIntro">
      <h2><img src="https://shopping.friday.tw/static/images/member/happy-go-card.png" alt="">HAPPY GO 點數說明</h2>
      <ul>
        <li>
          <p>什麼是HAPPY GO點數？</p>
          <div>HAPPY GO點數是特別回饋給HAPPY GO卡友的一項服務，只要卡友在HAPPY GO卡指定的任何地方消費付款金額達到查網回饋條件，就可以依您訂購金額獲得HAPPY GO點數。
            <br>
            所累積的<span>HAPPY GO點數將於點數入帳日後之六個月到期</span>，期滿將無法使用。例如：2022/1/1累積之點數，將於2022/7/1到期。
          </div>
        </li>
        <li>
          <p>如何獲得HAPPY GO點數？</p>
          <div>累點規則說明如下：
            <br>
            消費集點計算方式：每筆消費滿NT$100可累一點，其中電腦 / 筆電 / 電玩 / 相機、手機 / 配件 / 穿戴 / 耳機、家電 / 電視 / 冷氣 / 冰箱、健身 / 旅行 / 戶外 / 汽百、餐劵 / 票劵為每筆消費滿NT$200累一點。
            <br>
            在訂單出貨完成後第14天，點數即會自動進入您的有效HAPPY GO帳戶。
            <br>
            退貨/取消訂單時，消費所獲得的點數會自動扣除。
            <br>
            本網站會不定期舉辦各式購物回饋活動，給予網站會員驚喜集點優惠！
          </div>
        </li>
        <li>
          <p>如何使用HAPPY GO點數？</p>
          <div>累點規則說明如下：
            <br>
            只要您有足夠的HAPPY GO點數，即可在friDay購物選擇適用點數折抵金額之商品，也可以用點數全額兌換商品。
            <br>
            消費結帳時，您可填寫本次購物想要使用點數折抵消費之金額，系統將自動計算本次交易可折抵的HAPPY GO點數，訂購完成頁會顯示實際折抵金額和最後應付金額。
            <br>
            原則上每筆消費可用快樂購卡點數40點折抵10元，點數折抵計算，係依每張訂單佔該交易編號實付金額比例分攤，消費折抵無上限，若您消費金額未超過10元，則無法於本次消費折抵點數。
            <br>
            點數折抵舉例說明:
            <br>
            同一交易編號有3張訂單，總金額為3,800元，以HAPPY GO點數80點折抵20元，實際付款金額為3,780元。
            <br>
            每一訂單HAPPY GO點數折抵金額，依訂單金額佔該交易編號金額比例計算。
            <br>
            <table>
              <tbody>
                <tr>
                  <td>訂單(同一交易編號)</td>
                  <td>原始訂單金額(元)</td>
                  <td>點數折抵金額(元/四捨五入)</td>
                  <td>實際付款金額(元)</td>
                </tr>
                <tr>
                  <td> 訂單1</td>
                  <td>500</td>
                  <td>(500/3800)*20=3</td>
                  <td>497</td>
                </tr>
                <tr>
                  <td>訂單2</td>
                  <td>1000</td>
                  <td>(1000/3800)*20=5</td>
                  <td>995</td>
                </tr>
                <tr>
                  <td>訂單3</td>
                  <td>2300</td>
                  <td>(2300/3800)*20=12</td>
                  <td>2288</td>
                </tr>
                <tr>
                  <td>合計</td>
                  <td>3800</td>
                  <td>20</td>
                  <td>3780</td>
                </tr>
              </tbody>
            </table>
          </div>
        </li>
        <li>
          <p>取消訂單，退貨點數處理</p>
          <div>
            取消訂單或退貨點數處理規則：
            <br>
            訂單未成立：當您付款不成功時，系統將於3小時內歸還您該筆交易已使用的點數；如遇系統維護時間，系統將於48小時內歸還您該筆交易使用之HAPPY GO點數。
            <br>
            取消訂單：當您申請「取消訂單」時，系統將於取消訂單成功後3天內，歸還您該筆交易使用之HAPPY GO點數(該筆訂單將不會回饋HAPPY GO點數)。
            <br>
            申請退貨：當您申請「退貨」時，系統將於退款完成後3天內，歸還您該筆交易使用之HAPPY GO點數(該筆訂單將不會回饋HAPPY GO點數)。
            <br>
            就已消費並贈送HAPPY GO點數之商品或服務退換貨時，依規定將扣回該商品贈送之快樂 購卡點數，如點數不足扣回者，需繳還點數處理成本費用（計算公式：不足之點數*NT$ 0.4）。
          </div>
        </li>
        <li>
          <p>注意事項</p>
          <div>
            如有HAPPY GO卡片使用及點數相關問題，請您於服務時間聯繫HAPPY GO客服中心，將有專人即時為您服務。
            <br>
            HAPPYGO客服中心電話：02-77166888
            <br>
            服務時間：周一至週五 09:00~18:00。
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue";

export default {
  name: "happygoIntro",
  components: {
    navigation,
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
@import "./style/color";
.wrap {
  background-color: $white;
}

.happygoIntro {
  color: $dune;
  width: 900px;
  margin: 0 auto;
  margin-bottom: 100px;

  h2 {
    font-size: revert;
    font-weight: normal;
    margin-top: 40px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;

    img {
      height: 30px;
      margin-right: 10px;
    }
  }

  ul {
    font-size: 18px;
    line-height: 1;

    li {
      list-style-type: none;

      p {
        font-size: 16px;
        font-weight: 500;
        margin: 10px 0;
        padding: 5px 0;
        border-bottom: 1px solid $silver1;
      }

      div {
        font-size: 13px;
        line-height: 1.8;
        letter-spacing: 1px;

        span {
          color: #d00;
        }

        table {
          border-collapse: collapse;
          border-spacing: 0;
          margin-bottom: 17px;
          margin-top: 5px;
          td {
            padding: 3px;
            border: 1px solid $silver1;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 900px) {
  .happygoIntro {
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
  }
  ul {
    padding: 0 5px;
  }
}
</style>