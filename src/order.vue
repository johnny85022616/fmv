<template>
  <div class="order">
    <navigation v-if="!hiddenNavigation" :windowY="200" />
    <div class="order__notice">
      <p>提醒您:本公司不會主動打電話告知您任何有關付款修改的問題，若接到可疑電話請拒絕回應。</p>
    </div>
    <div v-if="isNewYearNoticeShow" class="order__newYearNotice">
      <p>春節前夕貨運繁忙，商品配達時間視物流商配送狀況，請耐心等候，謝謝。<a target="blank" href="https://go.shopping.friday.tw/event/202501/20250119-yearnotice/index.html">(春節公告)</a></p>
    </div>
    <a v-if="isFridaySite" target="_blank" href="https://go.shopping.friday.tw/event/202307/20230701-promotecard/index.html" class="co_branded_card">
      <p>【必備神卡】 friDay聯名卡</p>
      <i class="icon-next"></i>
    </a>
    <div class="order__list">
      <template v-if="orderData && orderData.length > 0">
        <ul class="bigOrder">
          <li :class="['bigOrderWrap', {'returnOrder': isNegative(order.dealId)}]" v-for="(order,index) of orderData" :key="index">
            <div class="head">
              <template v-if="!isNegative(order.dealId)">
                <p>交易編號：{{order.dealId}}</p>
                <p>訂購時間：{{order.orderDate }} {{order.orderTime }}</p>
                <p>配送方式：{{order.shippingType}}</p>
                <p>付款方式：{{order.payType}} ({{order.payment.status}})</p>
                <p v-if="order.bankInfo">&emsp;&emsp;&emsp;&emsp;&emsp;{{order.bankInfo}}</p>
                <p v-if="order.rePayPayload" class="linePayAgain" @click="linePayAgain(order.rePayPayload)">&emsp;&emsp;&emsp;&emsp;&emsp;(再次付款)</p>
                <div class="flex">
                  <p class="red">實付金額：${{productPrice(order.dealPayAmount)}}</p>
                  <div class="detail-link">
                    <a href="" @click="(e)=>priceInfoSwitch(e, index , order.dealId, isNegative(order.dealId))">折抵明細</a>
                    <a v-if="order.invoiceUrl" href="#" @click.prevent="seeInvoiceUrl(order.invoiceUrl)">看發票</a>
                  </div>
                </div>
                <div class="showBlock" v-if="order.isDiscountInfoOpen">
                  <p class="box-title">折抵明細</p>
                  <p v-for="(detail,index) in order.discountInfoDetail" :key="index">{{detail.amountItem}}：{{detail.amount}} </p>
                </div>
                <div class="mb10">
                  <div class="flex">
                    <p>收件人資訊：</p>
                    (<a href="" @click="(e)=>consigneeInfoSwitch(e ,index , order.productData[0].orderId)">詳</a>)
                  </div>
                  <div v-if="order.isCoinsigneeInfoOpen">
                    <template v-if="order.pickupStoreName">
                      <p v-if="order.consigneeNameDetail">收貨人：{{order.consigneeNameDetail}}</p>
                      <p v-if="order.pickupStoreName">門市名稱：{{order.pickupStoreName}}</p>
                      <p v-if="order.pickupStoreAdress">門市地址：{{order.pickupStoreAdress}}</p>
                    </template>
                    <template v-else>
                      <p v-if="order.consigneeNameDetail">收貨人：{{order.consigneeNameDetail}}</p>
                      <p v-if="order.consigneeAddrDetail">收貨人地址：{{order.consigneeAddrDetail}}</p>
                    </template>
                  </div>
                </div>
                <div class="switch">
                  <div>
                    <p @click="openDetailBlock(index)">展合明細</p><span :class="['next_arrow', {active: order.isDetilOpen}] "></span>
                  </div>
                  <div>
                    <a v-if="order.canReturn" href="" @click="(e)=>openRefundDialog(e , order.productData , order.dealId , order.memberId, order)">退訂</a>
                    <a href="" @click="(e)=>openQaDialog(e, null ,order)">交易提問</a>
                  </div>
                </div>
              </template>
              <template v-else>
                <p>退訂編號：{{order.dealId}}</p>
                <p>退訂時間：{{order.orderDate }} {{order.orderTime }}</p>
                <p>退訂方式：{{order.shippingType }}</p>
                <div class="flex ">
                  <p>退款方式：{{order.payType}}</p>
                  <p v-if="order.payment.status" class="gray">({{order.payment.status}})</p>
                </div>
                <div class="mb10 flex">
                  <p class="mb10 red">退款金額：${{productPrice(order.dealPayAmount)}}</p>
                  <div class="detail-link">
                    <a href="" @click="(e)=>priceInfoSwitch(e, index , order.dealId , isNegative(order.dealId))">退款明細</a>
                  </div>
                </div>
                <div class="showBlock mb10" v-if="order.isDiscountInfoOpen">
                  <p class="box-title">退款明細</p>
                  <p v-for="(detail,index) in order.discountInfoDetail" :key="index">{{detail.amountItem}}：{{detail.amount}} </p>
                </div>
                <div class="mb10">
                  <div class="flex">
                    <p>收件人資訊：</p>
                    (<a href="" @click="(e)=>consigneeInfoSwitch(e ,index , order.productData[0].orderId)">詳</a>)
                  </div>
                  <div v-if="order.isCoinsigneeInfoOpen">
                    <template v-if="order.pickupStoreName">
                      <p v-if="order.consigneeNameDetail">收貨人：{{order.consigneeNameDetail}}</p>
                      <p v-if="order.pickupStoreName">門市名稱：{{order.pickupStoreName}}</p>
                      <p v-if="order.pickupStoreAdress">門市地址：{{order.pickupStoreAdress}}</p>
                    </template>
                    <template v-else>
                      <p v-if="order.consigneeNameDetail">收貨人：{{order.consigneeNameDetail}}</p>
                      <p v-if="order.consigneeAddrDetail">收貨人地址：{{order.consigneeAddrDetail}}</p>
                    </template>
                  </div>
                </div>
                <div class="switch">
                  <div>
                    <p @click="openDetailBlock(index)">展合明細</p><span :class="['next_arrow', {active: order.isDetilOpen}] "></span>
                  </div>
                  <div><a href="" @click="(e)=>openQaDialog(e, null,order)">交易提問</a></div>
                </div>
              </template>
            </div>
            <div class="body" v-if="order.isDetilOpen">
              <ul class="smallOrder">
                <li class="smallOrderWrap" v-for="(product,idx) of order.productData" :key="idx">
                  <div :class="['productArea'] ">
                    <div class="mainPrd flex flex-space-between flex-align-center">
                      <a class="flex" :href="`/product/${product.productId}`">
                        <img :src="product.images" alt="">
                      </a>
                      <div class="info">
                        <div class="top flex flex-space-between mb5">
                          <p>
                            <a class="flex" :href="`/product/${product.productId}`">
                              {{product.productName}}
                            </a>
                          </p>
                          <a v-if="!siteData" href="" @click="(e)=>openQaDialog(e, product,order)">問問題</a>
                        </div>
                        <div class="flex flex-space-between">
                          <p v-if="product.colorName">規格： {{product.colorName}}</p>
                        </div>
                      </div>
                    </div>
                    <template v-if="product.giftdata">
                      <p class="giftBox" v-for="(item, idx) in product.giftdata" :key="idx">
                        <span class="giftTag">贈品</span>{{ item.productName }}
                      </p>
                    </template>
                    <template v-if="product.combodata && product.combodata.length>0">
                      <p class="comboText">-組合商品-</p>
                      <div class="comboPrd flex flex-space-between flex-align-center mb10" v-for="(comboPrd, idx) in product.combodata" :key="idx">
                        <a class="flex" :href="`/product/${comboPrd.productId}`">
                          <img :src="comboPrd.images" alt="">
                        </a>
                        <div class="info">
                          <div class="top flex flex-space-between">
                            <p>{{comboPrd.productName}}</p>
                          </div>
                          <div class="flex flex-space-between">
                            <p v-if="comboPrd.colorName">規格： {{comboPrd.colorName}}</p>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                  <div class="detail-bar">
                    <a v-if="!isNegative(order.dealId)" href="#" @click.prevent="goProofUrl(product.proofUrl)">購買證明</a>
                    <div v-if="product.productDiscount">
                      <p>單價：{{tools.priceFormat(product.productDiscountedPrice)}}</p>
                      <p class="gray">(折扣後)</p>
                    </div>
                    <p v-else>單價：{{tools.priceFormat(product.price)}}</p>
                    <p>數量：{{tools.priceFormat(product.quantity)}}</p>
                  </div>
                  <!-- <div class="iconArea">
                  <span class="storeIcon">超商取貨</span>
                </div> -->
                  <div v-if="order.isShowProcessStatusBar && product.deliverProcess" class="statusBar">
                    <div v-for="(item,idx) of product.deliverProcess" :key="idx">
                      <div :class="{act: item.active}">
                        <div class="status">
                          <div :class="[{transparent: idx===0}]"></div>
                          <div :class="['circle', {green: item.active}]"></div>
                          <div :class="[{transparent: idx===product.deliverProcess.length-1}]"></div>
                        </div>
                        <p>{{ item.text }}<br>{{ item.time }}</p>
                      </div>
                    </div>
                  </div>
                  <div v-if="!isNegative(order.dealId) && product.isShowShippingDetail && product.isIntangible === '0'" class="bottom-bar">
                    <div class="flex flex-space-between">
                      <p>運貨單：</p>
                      <template v-if="product.logisticName">
                        <p>{{product.logisticName}}</p>
                      </template>
                      <div v-if="product.logisticUrl">
                        <a v-if="product.logisticUrl" @click="e => goLogisticUrl(e ,product.deliveryNo ,product.logisticUrl)" href="" target="_blank">{{product.deliveryNo}}配送詳情>></a>
                        <p class="gray">(點擊連結複製貨運單號)</p>
                      </div>
                      <p v-else>{{product.deliveryNo}}</p>
                    </div>
                  </div>
                  <!-- 電子序號區塊(咖啡券不顯示) -->
                  <div v-else-if="!isNegative(order.dealId) && product.isIntangible === '1' && ![7863457,7863324,7863465].includes(product.productId) " class="elecTicket-bar">
                    <template v-if="product.isTicketOpen">
                      <p class="label">序號：</p>
                      <ul v-if="product.tickets">
                        <li v-for="(ticket,idx) of product.tickets" :key="idx">
                          <a :href="api.tools.parseUrl(`/member/tickets?dealId=${order.dealId}&productId=${product.productId}&sn=${ticket.sn}`)">{{ticket.sn}}</a>
                        </li>
                      </ul>
                      <p v-else>查無序號</p>
                    </template>
                    <a v-else href="" @click.prevent="openTicketArea(order,product)">查看序號</a>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
        <refundDialog v-if="isRefundDialogOpen" @closeRefundDialog="closeRefundDialog" :products="choseRefundProduct" :dealId="choseDealId" :memberId="choseMemberId" :order="choseOrder" @refreshOrder="refreshOrder"></refundDialog>
        <qaDialog v-if="isQaRecordDialogOpen" @closeQaDialog="closeQaDialog" :choseProduct="choseProduct" :choseOrder="choseOrder"></qaDialog>
        <p class="bottomText" v-if="isBottomTextShow">- 已經到底摟 -</p>
        <div id="aiPromotionBottomLine"></div>
      </template>
      <p v-else-if="orderData && orderData.length === 0" class="noDataMessage">查無訂單資料</p>
    </div>
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import refundDialog from "./components/order/refundDialog.vue";
import qaDialog from "./components/order/qaDialog.vue";

export default {
  name: "order",
  data() {
    return {
      isFridaySite: true, // 是否為friDay 主站 OR B網
      orderData: null,
      isRateButtonShow: true,
      isApiOk: true,
      isAtBottom: false,
      page: 0,
      isBottomTextShow: false,
      isRefundDialogOpen: false,
      choseRefundProduct: null, //選擇要退訂的商品
      choseOrder: null, //供退訂popup使用
      choseDealId: null,
      choseMemberId: null,
      choseProduct: null, //供問答使用
      hiddenNavigation: false, // 是否隱藏頁頭天
      isQaRecordDialogOpen: false, //是否開啟問答紀錄popup
      isNewYearNoticeShow: false, //是否顯示春節公告
    };
  },
  components: {
    navigation,
    refundDialog,
    qaDialog,
  },
  async created() {
    if (!this.api.member.isLogin) {
      window.location.href = this.api.member.loginUrl();
      return;
    }

    if (this.siteData) {
      this.isFridaySite = false;
    }

    //春節公告設定
    this.isNewYearNoticeShow =
      new Date().getTime() < new Date("2025/2/3").getTime();

    // 隱藏共用天
    this.hiddenNavigation = /gohappyapp/i.test(navigator.userAgent);

    await this.getOrderData();
    this.openDetailBlock(0); //預設開啟第一筆product區塊
    this.initScrollEvent();

    this.seo.common();
  },
  watch: {
    async isAtBottom(newVal) {
      // gData.length > 0 為取得集合目錄資料
      if (
        this.orderData.length > 0 &&
        this.isApiOk &&
        newVal &&
        !this.isBottomTextShow
      ) {
        this.getOrderData();
      }
    },
  },
  methods: {
    async openTicketArea(order, product) {
      product.isTicketOpen = true;
      const singleTicketInfo = {
        dealId: order.dealId,
        productId: product.productId,
      };
      console.log(singleTicketInfo);
      let tickets = await this.api.member.getElectronicTicket(
        this.page,
        10,
        singleTicketInfo
      );
      if (tickets && tickets.length > 0) {
        product.tickets = tickets;
      }
    },
    // 購買證明
    goProofUrl(url) {
      if (/^https/i.test(url)) {
        window.open(url);
      } else {
        this.api.ui.alert.getFadeAlert(url);
      }
    },
    //滾動打api事件
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
    //複製
    copyNumber(content) {
      navigator.clipboard.writeText(content).then(() => {
        alert(`已複製${content}至剪貼簿`);
      });
    },
    goLogisticUrl(e, num, url) {
      e.preventDefault();
      this.copyNumber(num);
      window.open(url);
    },
    productPrice(price) {
      return new Intl.NumberFormat().format(price);
    },
    // 決定退貨還是取消
    composeModType(shipConfirmDate) {
      let type = "CANCEL";
      if (shipConfirmDate) {
        type = "REFUND";
      }
      return type;
    },
    //取訂單資料
    async getOrderData() {
      this.page += 1;
      this.isApiOk = false;
      let data = await this.api.order.getOrders(this.page, 5);
      data = data.map((ele) => {
        ele.productData.forEach((mainPrd) => {
          mainPrd.images = null;
          mainPrd.isTicketOpen = false;
          mainPrd.tickets = null;
          if (mainPrd.combodata) {
            mainPrd.combodata.forEach((comboPrd) => {
              comboPrd.images = null;
            });
          }
        });
        return {
          ...ele,
          isDetilOpen: false, //小訂單區塊是否開啟
          isCoinsigneeInfoOpen: false, //info區是否開啟
          consigneeNameDetail: null, //收貨人姓名
          consigneeAddrDetail: null, //收貨人地址
          isDiscountInfoOpen: false, //折抵明細是否開啟
          discountInfoDetail: null, //折抵明細
          isGetImgAlready: false, //是否已經取得過商品圖片
        };
      });
      if (data) {
        if (this.orderData) {
          this.orderData = this.orderData.concat(data);
        } else {
          this.orderData = data;
        }
        this.$nextTick(() => {
          this.isApiOk = true;
          this.isAtBottom = false;
        });
      } else {
        this.isBottomTextShow = true;
      }
    },
    //退訂成功後刷新訂單資料
    async refreshOrder() {
      this.page = 0;
      this.orderData = null;
      await this.getOrderData();
      this.openDetailBlock(0); //預設開啟第一筆product區塊
    },
    //收貨人姓名詳
    async consigneeInfoSwitch(e, idx, orderId) {
      e.preventDefault();
      const order = this.orderData[idx];
      order.isCoinsigneeInfoOpen = true;
      //姓名
      if (!order.consigneeNameDetail) {
        const consigneeName = await this.api.order.getConsigneeDecode(
          orderId,
          4
        );
        order.consigneeNameDetail = consigneeName;
      }

      //宅配取得收貨人地址(非宅配)
      if (!order.pickupStoreAdress && !order.consigneeAddrDetail) {
        const consigneeAddr = await this.api.order.getConsigneeDecode(
          orderId,
          6
        );
        order.consigneeAddrDetail = consigneeAddr;
      }
    },
    //折抵＆退款明細詳
    async priceInfoSwitch(e, idx, dealId, isNegative) {
      e.preventDefault();
      const order = this.orderData[idx];
      order.isDiscountInfoOpen = true;
      let discountInfo = order.discountInfoDetail;
      if (!discountInfo && !isNegative) {
        discountInfo = await this.api.order.getOrderDiscounts(dealId);
      }
      if (!discountInfo && isNegative) {
        discountInfo = await this.api.order.getRefundOrderDiscounts(dealId);
      }
      order.discountInfoDetail = discountInfo;
    },
    //展合明細控制
    async openDetailBlock(index) {
      if (!this.orderData || (this.orderData && this.orderData.length === 0))
        return;
      const order = this.orderData[index];
      order.isDetilOpen = !order.isDetilOpen;
      if (!order.isGetImgAlready) {
        for (let mainPrd of order.productData) {
          const prdInfo = await this.api.product.getProducts([
            mainPrd.productId,
          ]);
          mainPrd.proofUrl = await this.api.order.getOrderProductProof(
            order.dealId,
            mainPrd.productId,
            mainPrd.sizeId
          );
          if (prdInfo && prdInfo[mainPrd.productId]) {
            mainPrd.images = prdInfo[mainPrd.productId].images;
          }
          if (mainPrd.combodata) {
            for (let comboPrd of mainPrd.combodata) {
              const comboPrdInfo = await this.api.product.getProducts([
                comboPrd.productId,
              ]);
              if (comboPrdInfo && comboPrdInfo[comboPrd.productId]) {
                comboPrd.images = comboPrdInfo[comboPrd.productId].images;
              }
            }
          }
        }
        order.isGetImgAlready = true;
      }
    },
    //linepay在次付款轉頁
    async linePayAgain(rePayPayload) {
      const url = await this.api.order.getThirdPartyRePayUrl(rePayPayload);
      if (url) {
        location.href = url;
      }
    },
    //是否為負向單
    isNegative(dealId) {
      return /^R/i.test(dealId);
    },
    openRefundDialog(e, products, dealId, memberId, order) {
      e.preventDefault();
      this.setChoseRefundProduct(products);
      this.setChoseDealId(dealId, memberId);
      this.setChoseOrder(order);
      this.isRefundDialogOpen = true;
    },
    closeRefundDialog() {
      this.isRefundDialogOpen = false;
    },
    openQaDialog(e, choseProduct, order) {
      e.preventDefault();
      this.setChoseOrder(order);
      this.setChoseProduct(choseProduct);
      this.isQaRecordDialogOpen = true;
    },
    closeQaDialog() {
      this.isQaRecordDialogOpen = false;
    },
    setChoseRefundProduct(products) {
      this.choseRefundProduct = products;
    },
    setChoseDealId(dealId, memberId) {
      this.choseDealId = dealId;
      this.choseMemberId = memberId;
    },
    setChoseOrder(order) {
      this.choseOrder = order;
    },
    setChoseProduct(product) {
      this.choseProduct = product;
    },
    seeInvoiceUrl(url) {
      window.open(url, "invoice");
    },
  },
};
</script>
  
  <style lang="scss">
@import "./style/reset.module.scss";
@import "./style/flex.module.scss";
@import "./style/rwd.module.scss";
@import "./style/icons.module.scss";
@import "./style/global.module.scss";
@import "./style/_color.scss";
.red {
  color: $red;
}
.gray {
  color: $sliver;
}
.mr5 {
  margin-right: 5px;
}
.mb5 {
  margin-bottom: 5px;
}
.mb10 {
  margin-bottom: 10px;
}
.flex {
  display: flex;
}
.flex-col {
  flex-direction: column;
}
.flex-justify-center {
  justify-content: center;
}
.flex-space-between {
  justify-content: space-between;
}
.flex-align-center {
  align-items: center;
}
.next_arrow {
  width: 12px;
  height: 12px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAAGWB6gOAAAAAXNSR0IArs4c6QAAAa5JREFUWAntllFOwzAMQJPuMJyg6UoPgNR9cQR+kNAkhPjiszfgjw0JTdwAITQVLsDoehq+h1octExtmmZJ42pUWn/S2I79asdpCNE9fuAvlPpWhdLaVegzv9z5qE12UnixYjI2bg3HQ2uVVTbtO3gptAZC2a+hJ8LIIyV0Lstqc8bYQ00gT9wNGh4D9i3LOs/5ZjDOrUmUATiElgqC4MLka5Q2fOvvLaty5VZ4eAc6usPoWMjOoSqXNtGVbRufxa9FWTz6Y//KxpnSNkkSj1fr6EyZHqXw/+aMjdktr6YS21QIm/SGO4GHmq5p2B2dNFJCUHIShuGpc3WabAOVWG3QvzOuIPw6UxKPTPOvfIb93coTuy0IB5jEkxGh5JkAGNS1QDmIKwGtMlRZR/gpt0yXT5ArfpNAy1hnIAGHDeYMhA2GBoQFhg7kCtYbUCvYiMT5Kn8Xenm0ant5sck8TdPrbSfCaUHn68/1h25dbxniPzG4fd7z4AAyy7JsSinde+VAB+oKIrKGBuQKggaEBeIMhA3SGagvkE5AURSdbH42b9A2L9kquzPpGhFosOMvTuwJmnDV5VQAAAAASUVORK5CYII=)
    center/12px no-repeat;
  margin-left: 5px;
  &.active {
    transform: rotate(90deg);
  }
}
.box-title {
  font-size: 1.4rem;
  font-weight: bold;
}
</style>
  
<style lang="scss" scoped>
@import "./style/_color.scss";
@import "./style/_mixin.scss";

.order {
  font-size: 1.5rem;
  margin-bottom: 80px;
  &__notice {
    padding: 10px;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    p {
      color: $red;
      font-size: 1.2rem;
      width: 74%;
    }
    .errorReporting {
      color: $sliver;
      font-size: 1.3rem;
      text-decoration: underline;
      padding: 3px 7px;
      border: 1px solid $sliver;
      border-radius: 7px;
      background-color: $white;
      box-sizing: border-box;
      width: 25%;
    }
  }
  &__newYearNotice {
    padding: 0 10px 10px 10px;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    p {
      color: $red;
      font-size: 1.2rem;
    }
    a {
      color: $dark-blue;
    }
  }
  &__list {
    background-color: $background;
    .bigOrder {
      .bigOrderWrap {
        background-color: $white;
        margin: 15px 10px;
        border-radius: 10px;
        box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.3);
        &.returnOrder {
          background-color: $concretesolid;
        }
        &:first-of-type {
          margin-top: 0;
        }
        .head {
          padding: 15px;
          color: $heavy-metal;
          .box {
            margin-bottom: 10px;
          }
          p,
          > a {
            margin-bottom: 3px;
          }
          .linePayAgain {
            color: $dodger-blue;
          }
          .detail-link {
            margin-left: 10px;
            a {
              &:first-of-type {
                margin-right: 10px;
              }
            }
          }
          .switch {
            margin-top: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            > div {
              display: flex;
              align-items: center;
            }
            p {
              color: $sliver;
              margin-bottom: 0;
            }
            a {
              &:nth-child(2) {
                margin-left: 5px;
              }
            }
          }
          .showBlock {
            @include arrowBorder();
          }
        }
        .body {
          border-top: 1px solid $alto;
          .smallOrder {
            .smallOrderWrap {
              padding: 5px 0 5px 0;
              border-top: 1px solid $alto;
              &:first-of-type {
                border-top: unset;
              }
              .head {
                padding: 12px 10px;
                font-size: 14px;
                font-weight: unset;
                justify-content: space-between;
                align-items: center;
                border: 0;
              }
              .productArea {
                position: relative;
                padding: 15px;
                .mainPrd,
                .comboPrd {
                  > a {
                    max-width: 20%;
                    width: 20%;
                    aspect-ratio: 69 / 43;
                    img {
                      width: 100%;
                    }
                  }
                  .info {
                    width: 78%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .top {
                      p {
                        width: 80%;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        line-clamp: 2;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        font-weight: normal;
                        a {
                          color: $heavy-metal;
                          text-decoration: none;
                        }
                      }
                    }
                  }
                }
                .comboPrd {
                  margin-bottom: 10px;
                }
                .comboText {
                  color: $sliver;
                  font-weight: bold;
                  font-size: 1.4rem;
                  margin: 10px 0;
                }
              }
              .detail-bar {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                padding: 10px;
                p,
                a {
                  text-align: center;
                }
              }
            }
          }
        }
        .iconArea {
          margin-top: 10px;
          .storeIcon {
            background-color: #90b772;
            color: #fff;
            border-radius: 5px;
            padding: 3px 8px;
            margin: 5px 10px;
          }
        }
      }
    }
    .noDataMessage {
      display: flex;
      justify-content: center;
      margin-top: 100px;
      font-size: 2rem;
      font-weight: bold;
      background-color: $white;
    }
    .bottomText {
      background-color: $white;
      text-align: center;
      color: $sliver;
      font-size: 1.8rem;
      padding-top: 20px;
      background-color: $background;
      padding-bottom: 80px;
    }
  }
}

.co_branded_card {
  height: 50px;
  background-color: #f4f4f4;
  padding: 0 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
}
.co_branded_card p {
  color: #3c3c3c;
  display: flex;
  align-items: center;
}
.co_branded_card p::after {
  content: "8%遠傳幣回饋";
  font-size: 16px;
  color: #f34f59;
  margin-left: 3px;
  line-height: 16px;
  vertical-align: middle;
}
.co_branded_card a {
  height: 18px;
}
.icon-next {
  cursor: pointer;
  display: inline-block;
  width: 18px;
  height: 18px;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGNpcmNsZSBmaWxsPSIjRjM0RjU5IiBjeD0iOSIgY3k9IjkiIHI9IjkiLz4KICAgICAgICA8cGF0aCBkPSJNNy4zMzUgMTMuODIzYy4wOS4wOS4yMDMuMTM1LjMxNS4xMzVhLjQ0NS40NDUgMCAwIDAgLjMxNi0uMTM1bDQuMjc4LTQuMjc5Yy4xOC0uMTguMTgtLjQ1IDAtLjYzTDcuOTY2IDQuNjM1YS40MzUuNDM1IDAgMCAwLS42MyAwYy0uMTgxLjE4LS4xODEuNDUgMCAuNjNsMy45NjIgMy45NjQtMy45NjMgMy45NGEuNDYyLjQ2MiAwIDAgMCAwIC42NTR6IiBmaWxsPSIjRkZGIiBzdHJva2U9IiNGRkYiIHN0cm9rZS13aWR0aD0iLjUiLz4KICAgIDwvZz4KPC9zdmc+Cg==");
}

.statusBar {
  font-size: 1.3rem;
  color: #adadad;
  padding: 10px;
  display: flex;
  word-break: keep-all;
  > div {
    flex-basis: 25%;
    text-align: center;
    flex-grow: 1;
  }

  .act > p {
    color: #3c3c3c;
  }

  .status {
    display: flex;
    align-items: center;
    div {
      &:first-of-type,
      &:last-of-type {
        width: calc((100% - 10px) / 2);
        height: 1px;
        background-color: $sliver;
        &.transparent {
          opacity: 0;
        }
      }
    }
    .circle {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: $sliver;
      display: flex;
    }
  }
  .act {
    .status {
      .circle {
        background-color: $green;
      }
      div {
        background-color: $green;
      }
    }
  }
}

.bottom-bar {
  padding: 0 15px;
  margin-top: 10px;
  > div {
    padding: 5px;
    border: 1px solid $alto;
    border-radius: 5px;
    box-sizing: border-box;
    .copy {
      font-size: 1.2rem;
    }
  }
  > a {
    margin-top: 15px;
    text-align: right;
    display: flex;
    justify-content: flex-end;
  }
}
.elecTicket-bar {
  margin: 10px;
  padding: 10px;
  display: flex;
  border: 1px solid $alto;
  border-radius: 5px;
  box-sizing: border-box;
  a {
    margin: 0 auto;
  }
  .label {
    width: 18%;
  }
  ul {
    width: 82%;
    list-style-type: none;
    li {
      a {
        display: inline-block;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

.giftTag {
  @include customTag(#21a02b);
  font-size: 1rem;
  margin-right: 5px;
}
</style>
