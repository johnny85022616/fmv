<template>
  <div class="electronicTicket">
    <navigation :windowY="200"></navigation>
    <div class="title">
      <p>我的序號夾</p>
      <a :href="api.tools.parseUrl('/campaign/DO_241206140440221')">去逛逛</a>
    </div>
    <div v-if="isNoData" class="isNoData">
      目前無電子序號
    </div>
    <div v-else class="electronicTicketList">
      <ul>
        <li class="ticket-card" v-for="(ticket, index) of ticketList" :key="index">
          <p class="ticket-header">{{ticket.productName}}</p>
          <div class="ticket-body">
            <div class="info">
              <div class="content">
                <p>交易編號：{{ticket.dealId}}</p>
                <p>商品代碼：{{ticket.productId}}</p>
                <p>序號：{{ticket.sn}}</p>
                <p>有效期限：{{ticket.formatedPeriod}}</p>
              </div>
              <div class="image">
                <img :src="ticket.images" alt="">
              </div>
            </div>
            <div class="barcode" :id="`barcode-container-${ticket.dealId}-${ticket.sn}-${ticket.barcode}`">
            </div>
          </div>
        </li>
      </ul>
      <div v-if="isLookAllBtnShow" class="lookAllBtn">
        <a :href="api.tools.parseUrl('/member/tickets')">看我的全部序號</a>
      </div>
    </div>
    <div id="aiPromotionBottomLine"></div>
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import JsBarcode from "jsbarcode";
export default {
  name: "electronicTicket",
  data() {
    return {
      ticketList: null,
      isNoData: false,
      isApiOk: false,
      isAtBottom: false,
      page: 0,
      isMaxPage: false, //找不到資料算最大頁數
      isLookAllBtnShow: false, //看所有票券Btn
    };
  },
  components: { navigation },
  async created() {
    await this.getTicket();
    //如果第一次找不到資料顯示無資料
    if (!this.ticketList) this.isNoData = true;
    this.initScrollEvent();
    this.seo.common();
  },
  methods: {
    initScrollEvent() {
      window.addEventListener(
        "scroll",
        () => {
          const aiPromotionBottomLine = document.querySelector(
            "#aiPromotionBottomLine"
          );
          if (
            this.isApiOk &&
            aiPromotionBottomLine.getBoundingClientRect().top <
              window.innerHeight + window.innerHeight / 2
          ) {
            this.isAtBottom = true;
          } else {
            this.isAtBottom = false;
          }
        },
        {
          passive: true,
        }
      );
    },
    async getTicket() {
      //達到maxPage不打api
      if (this.isMaxPage) return;
      //若為訂單頁途徑則組單一票券資料
      const { dealId, productId, sn } = this.tools.urlSearchToObj();
      let singleTicketInfo;
      if (dealId && productId && sn) {
        //直接設定到最大頁面避免下滑再出現
        this.isMaxPage = true;
        this.isLookAllBtnShow = true;
        singleTicketInfo = { dealId, productId, sn };
      }

      this.page += 1;
      this.isApiOk = false;

      let tickets = await this.api.member.getElectronicTicket(
        this.page,
        10,
        singleTicketInfo
      );
      if (tickets && tickets.length > 0) {
        tickets = tickets.map((ele) => ({
          ...ele,
          formatedPeriod: this.formatPeriod(ele.period),
          barcodeArr:
            ele.barcode?.split(",")?.filter((bc) => bc.trim() !== "") || [],
          formatBarcode: ["SVN", "FAM"].includes(ele.manufacturerCode)
            ? "CODE128"
            : "CODE39",
        }));

        if (this.ticketList) {
          this.ticketList = this.ticketList.concat(tickets);
        } else {
          this.ticketList = tickets;
        }
      } else {
        //如果打api找不到資料當作已經到達最大頁數
        this.isMaxPage = true;
      }
      this.$nextTick(() => {
        this.appendBarCodeToTicket(tickets);
        this.isApiOk = true;
        this.isAtBottom = false;
      });
    },
    //取到期
    formatPeriod(period) {
      if (!period) return "";
      return period?.split("-")?.[1] || period;
    },
    //每張票券加入barCode(傳入本次api取得的ticket)
    appendBarCodeToTicket(tickets) {
      if (!tickets) return;
      tickets.forEach((ticket) => {
        const barcodeContainer = document.getElementById(
          `barcode-container-${ticket.dealId}-${ticket.sn}-${ticket.barcode}`
        );
        ticket.barcodeArr.forEach((barcode) => {
          const canvas = document.createElement("canvas");
          barcodeContainer.appendChild(canvas);

          JsBarcode(canvas, barcode, {
            format: ticket.formatBarcode,
            displayValue: true,
            fontSize: 12,
            lineColor: "#000",
            width: 1.3, // 適合的條碼線寬
            height: 35, // 預設高度
            margin: 15, // 條碼四周間距
          });
        });
      });
    },
  },
  watch: {
    async isAtBottom(newVal) {
      if (this.ticketList.length > 0 && newVal) {
        this.getTicket();
      }
    },
  },
};
</script>

<style lang="scss">
@import "./style/reset.module.scss";
@import "./style/flex.module.scss";
@import "./style/rwd.module.scss";
@import "./style/global.module.scss";
</style>

<style lang="scss" scoped>
@import "./style/color";
@import "./style/tailwind.module.scss";

.electronicTicket {
  margin-bottom: 100px;
  .title {
    background-color: $fcoin;
    color: $white;
    text-align: center;
    border-radius: 12px;
    margin: 20px 10px 10px 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    padding: 15px;
    position: relative;
    p {
      font-size: 2.5rem;
    }
    a {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 20px;
      background: linear-gradient(to bottom, $silver1, $dove-gray);
      color: white;
      font-weight: bold;
      padding: 8px 12px;
      border-radius: 8px;
      text-decoration: none;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
      font-size: 1.3rem;
    }
  }
  .isNoData {
    display: flex;
    justify-content: center;
    margin-top: 100px;
    font-size: 2rem;
    font-weight: bold;
  }
  .electronicTicketList {
    margin-top: 20px;
    ul {
      .ticket-card {
        max-width: 95%;
        margin: 10px auto;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        overflow: hidden;
        background: $white;
        margin-bottom: 20px;
        .ticket-header {
          background-color: $azure-radiance;
          color: white;
          padding: 10px;
          text-align: center;
          font-weight: bold;
          font-size: 1.6rem;
        }
        .ticket-body {
          padding: 15px;
          font-size: 1.25rem;
          font-weight: bold;
          .info {
            display: flex;
            justify-content: space-between;
            .content {
              width: 60%;
              p {
                margin-bottom: 5px;
              }
            }
            .image {
              width: 32%;
              img {
                width: 100%;
              }
            }
          }

          .barcode {
            margin-top: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column; /* 確保多個條碼垂直排列 */
          }
        }
      }
    }
    .lookAllBtn {
      display: flex;
      justify-content: center;
      a {
        background: linear-gradient(to bottom, $silver1, $dove-gray);
        color: white;
        font-weight: bold;
        padding: 8px 12px;
        border-radius: 8px;
        text-decoration: none;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        font-size: 1.5rem;
      }
    }
  }
}
</style>
