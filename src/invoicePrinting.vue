<template>
  <div v-if="invoiceData.length > 0" class="container">
    <div v-for="(v1, d1) of invoiceData" :key="d1" class="receipt_print">
      <div v-if="v1.invoiceDetail" class="receipt_title">
        <div>
          <span v-if="v1.invoiceDetail.invType === '5'">個人雲端發票</span>
          <span v-if="v1.invoiceDetail.vehicle">手機條碼載具{{ v1.invoiceDetail.vehicle }}</span>
        </div>
        <div>發票號碼 {{ v1.invoiceDetail.invoiceNo }}</div>
        <div>開立日期 {{ v1.invoiceDate }}</div>
      </div>
      <div v-for="(v2, d2) of v1.listinvo" :key="d2">
        <div v-html="v2.strHtml"></div>
      </div>
    </div>

    <button @click="printImage()">下載圖檔</button>
  </div>
</template>

<script>

export default {
  name: 'invoicePrinting',
  data() {
    return {
      invoiceData: [],
      isOnlinePrints: false,
    };
  },
  created() {
    this.api.order.getOrderInvoice().then(r => {
      if (r.code === 0) {
        this.invoiceData = r.data;

        // 公司列印3聯發票才有的參數
        if (r.data?.[0]?.isOnlinePrints) {
          this.isOnlinePrints = true;
        }
      } else {
        alert(r.msg);
        window.close();
      }
    });
  },
  methods: {
    printImage() {
      const element = document.body;
      const container = document.querySelector('.container');
      const imgWidth = container.offsetWidth;
      const imgHeight = container.offsetHeight + 30;
      container.querySelector('button').style.display = 'none';
      const { dealId } = Object.fromEntries(new URLSearchParams(location.search).entries());
      window.htmlToImage.toJpeg(element, {
        backgroundColor: '#fff',
        width: imgWidth,
        canvasWidth: imgWidth,
        height: imgHeight,
        canvasHeight: imgHeight
      })
        .then(dataUrl => {
          window.download(dataUrl, `${dealId.replace(/^GH/i, '')}.jpeg`);
        })
    }
  },
  components: {
  },
};
</script>

<style lang="scss">
.container {
  position: relative;
  width: 1078px !important;
  margin: auto !important;
  button {
    position: absolute;
    top: 10px;
    right: 0px;
    width: 120px;
    height: 40px;
    border: 1px solid #3c3c3c;
    border-radius: 10px;
    outline: none;
    color: #3c3c3c;
    font-size: 16px;
    font-weight: bold;
    background-color: #ffffff;
    cursor: pointer;
  }
}

.detailArea th {
  font-size: 12px;
  font-weight: normal;
  line-height: 15px;
  border-bottom: 2px solid #000000;
  white-space: nowrap;
}

.copy {
  color: #FFABAB;
  font-size: 75px;
  white-space: nowrap;
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translate(-50%);
}

#invoiceTable {
  position: relative;
}

.summaryArea {
  position: absolute;
  right: 0px;
  bottom: 10px;

  .class12 {
    text-align: left !important;
  }
}

table {
  border-collapse: unset !important;
}

.detailArea {
  >thead {
    >tr {
      th {
        padding: 15px 10px;
        font-size: 15px;
        font-weight: bold;
      }
    }
  }
}

.receipt_title {
  padding: 10px 20px;
  >div {
    &:first-child {
      font-weight: bold;
      span {
        margin-right: 10px;
      }
    }
  }
}

.class20 {
  font-size: 20px;
  line-height: 30px;
  font-weight: bold;
  font-family: Meiryo;
  vertical-align: bottom;
}

.class26 {
  font-size: 26px;
  line-height: 30px;
}

.class30 {
  font-size: 30px;
  line-height: 30px;
  font-weight: bold;
}


/* 發票列印 */
$fontSize1: 6mm;
$fontSize2: 5mm;
$fontSize3: 4mm;
$tableLine2: 2px solid #000000;
$tableLine1: 1px solid #000000;

h1 {
  font-size: $fontSize1;
}
h2 {
  font-size: $fontSize2;
}
h3 {
  font-size: $fontSize3;
}
.mb-1 {
  margin-bottom: 10px;
}
.mb-2 {
  margin-bottom: 20px;
}
.main {
  text-align: center;
  margin: 0px auto;
  // width: 315mm;
  // height: 445mm;
  padding-top: 20px;
  background: #FFF;
  border: solid 0px #A00;
  padding: 0px;
  .title-box {
    margin-bottom: 30px;
    height: 24mm;
    width: 252mm;
    border: solid 0px #00A;
    margin: 10mm auto 0px;
  }
  .buyer-box {
    position: relative;
    padding: 0 20px;
    text-align: left;
    margin-bottom: 10px;
    width: 252mm;
    border: solid 0px #A00;
    margin: 0px auto;
    p {
      font-size: $fontSize3;
      margin-bottom: 5px;
      line-height: 120%;
    }
    span {
      position: absolute;
      right: 20px;
      bottom: -5px;
    }
  }
  .copy-mask {
    position: absolute;
    top: 400px;
    left: 230px;
    display: inline-block;
    width: 200px;
    height: 150px;
    background: url('https://ec2-stage.shopping.friday.tw/static/images/member/watermark-copy.png') no-repeat center/200px;
    print-color-adjust: exact;
  }
  .receipt-table {
    width: 252mm;
    margin: 0 auto;
    padding: 0px;
    .main-table {
      margin: 0px auto;
      padding: 0px;
      width: 252mm;
      border: $tableLine2;
      font-size: $fontSize3;
      #trTable {
        td {
          font-size: 4mm;
          line-height: 200%;
          vertical-align: baseline;
          &:last-child {
            padding: 0 2px;
          }
        }
      }
      th {
        height: 9mm;
        border: $tableLine1;
        line-height: 200%;
        font-size: $fontSize2;
        &:first-child {
          width: 190px;
        }
        &:nth-of-type(2) {
          width: 78px;
        }
        &:nth-of-type(3),
        &:nth-of-type(4) {
          width: 96px;
        }
        &:last-child {
          width: 160px;
        }
      }
      td {
        text-align: left;
        border: $tableLine1;
        padding: 5px 2px;
        word-break: keep-all;
        &.inner {
          padding: 0;
        }
        &.tr {
          text-align: right;
        }
      }
    }
    .prd-table {
      width: 100%;
      height: 280mm;
      line-height: 150%;
      tr {
        &:last-child {
          height: 100%;
        }
      }
      td {
        line-height: 15%;
        border-top: 0;
        border-bottom: 0;
        word-break: break-all;
        padding: 5px 2px;
        &:first-child {
          border-left: 0;
          padding: 0 5px;
          width: 200px;
        }
        &:nth-of-type(2) {
          width: 75px;
          text-align: right;
        }
        &:nth-of-type(3),
        &:nth-of-type(4) {
          width: 93px;
          text-align: right;
        }
        &:last-child {
          border-right: 0;
        }
      }
    }
    .inner-table {
      border: none !important;
      width: 100%;
      td {
        border-top: 0;
        border-bottom: 0;
        border-right: 0;
        &:first-child {
          border-left: 0;
        }
        &:first-of-type {
          width: 120px !important;
        }
        &:nth-of-type(even) {
          text-align: center;
          width: 50px;
        }
        &:nth-of-type(odd) {
          text-align: center;
          width: 30px;
        }
      }
    }
  }
}
</style>