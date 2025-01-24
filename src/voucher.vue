<template>
  <div class="voucher">
    <navigation :isShowRedTop="isShowRedTop" :windowY="200" />
    <div class="head">
      <p class="title">查詢購物金</p>
      <div v-if="isVoucherNoticeShow" class="red voucherNotice">會員權益變動通知：我們於2024/3/27將帳戶中「遠傳幣」轉變為等值「friDay購物金」，未來將不定期推出各種優惠服務<span class="blue moreDetail" @click="openCenterDialog"> (詳)</span></div>
      <div class="overage">
        <div>
          <p>購物金餘額</p>
          <p class="red">${{ tools.priceFormat(voucherOverage) }}</p>
        </div>
      </div>
    </div>

    <ul v-if="voucherData && voucherData.length>0" class="tablist">
      <li v-for="(data, idx) in voucherData" :key="idx">
        <div class="bar">
          <p class="cdate">{{ data.cdate }}</p>
          <p class="item"></p>
          <p :class="['amount', 'red', { green: checkNegative(data.amount) }]">{{ checkNegative(data.amount)
      ? '-' : '' }}${{ Math.abs(data.amount) }}</p>
        </div>
        <div class="description mr10">
          {{ data.remark }} <span class="enddate">{{ endDateNotify(data) }}</span>
        </div>
      </li>
    </ul>
    <button v-if="voucherTotalCount>0 && voucherParam.page < voucherMaxPage-1" class="voucherLookMoreBtn" @click="lookMore">看更多</button>

    <div v-if="recItems" class="voucher__rec-items">
      <i></i>
      <h3>熱門商品</h3>
      <aiProductItem :itemList="recItems" />
      <button @click="goHome()">再去看看更多商品</button>
    </div>

    <div v-else-if="isNoData" class="noData">目前查無資料</div>
    <popupDialog v-if="isDetailPopupOpen" :title="'friDay購物會員權益變動說明'" @closeCenterDialog="closeCenterDialog" :isSimple="true">
      <ul class="voucherNotice">
        <li>【遠傳幣】將以1:1的比例，轉換為【friDay購物金】<span class="small">(下稱：購物金)</span>。因應此次權益轉變，將另贈送原遠傳幣之金額20%購物金(最高贈送上限100元購物金)。
          EX：原帳戶擁有100遠傳幣，透過此次專屬升級服務，將轉換為100元並加贈20元購物金，共計120元購物金。</li><br>
        <li>friDay購物金1元可在每次購物直接折抵消費金額1元</li><br>
        <li>可與折價券、折扣碼、HAPPY GO點數同時使用<span class="small">（以賣場結帳頁面為準）</span>
        </li><br>
        <li>
          購物金有效期間：<br>
          每筆消費回饋及活動贈送之遠傳幣有效期限，請依 friDay 購物系統呈現為主，若未於有效期間屆滿前使用完畢，購物金皆於使用效期屆滿後立即失效，會員不得以任何理由要求本公司回補購物金與其他補償措施，您可前往「我的帳戶」內查詢。
        </li>
      </ul>
    </popupDialog>
  </div>
</template>

<script>
import navigation from "./components/common/navigation.vue"; // 共用天的導覽列
import aiProductItem from "./components/common/aiProductItem.vue"; // 推薦商品
import popupDialog from "./components/common/popupDialog.vue";

export default {
  name: "voucher",
  data() {
    return {
      isShowRedTop: true,
      windowY: 0,
      voucherOverage: 0,
      voucherData: [],
      voucherProcessData: null,
      nowData: null,
      isNoData: false,
      recItems: null,
      isDetailPopupOpen: false,
      isVoucherNoticeShow: false,
      voucherTotalCount: 0,
      voucherMaxPage: 0,
      voucherParam: {
        page: 0,
        rows: 5,
      },
    };
  },
  async created() {
    this.queryVoucherBalance();
    this.getAlist();
    this.checkFetLife();
    await this.getlistData();
    this.calcMaxPage();
  },
  methods: {
    goHome() {
      window.location.href = "/";
    },
    async getAlist() {
      const postData = {
        type: 3,
        q1_x: 0.5,
        supplier_y: 1,
        list_num: 15,
        filter: this.api.ai.composeBListFilter(),
      };
      const items = await this.api.ai.getAiData("getalist", postData);
      this.recItems = items.filter((v) => v.isQuantity).splice(0, 12);
    },
    async getlistData() {
      const data = await this.api.member.queryVoucherList(this.voucherParam.page, this.voucherParam.rows);
      if (data) {
        this.voucherTotalCount = data.totalCount;
        this.voucherData = this.voucherData.concat(data.content);
      }
    },
    async lookMore() {
      this.voucherParam.page += 1;
      await this.getlistData();
    },
    async queryVoucherBalance() {
      this.voucherOverage = await this.api.member.queryVoucherBalance();
    },
    checkNegative(num) {
      let isNegative = false;
      if (num < 0) {
        isNegative = true;
      }
      return isNegative;
    },
    checkFetLife() {
      const feecInfo = this.tools.getCookie("FEEC-B2C-INFO");
      const fetLife = feecInfo?.data?.fetLife;
      if (fetLife == 0) {
        this.isVoucherNoticeShow = true;
      }
    },
    openCenterDialog() {
      this.isDetailPopupOpen = true;
    },
    closeCenterDialog() {
      this.isDetailPopupOpen = false;
    },
    calcMaxPage() {
      this.voucherMaxPage =
        this.voucherTotalCount % this.voucherParam.rows !== 0
          ? Math.floor(this.voucherTotalCount / this.voucherParam.rows + 1)
          : Math.floor(this.voucherTotalCount / this.voucherParam.rows);
    },
    endDateNotify(data) {
      return data.amount > 0 ? "(到期日：" + data.effectEndDate + ")" : "";
    },
  },
  components: {
    navigation,
    aiProductItem,
    popupDialog,
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

.voucher {
  .head {
    padding: 20px 20px 0;

    .title {
      font-size: 20px;
      color: #fe7501;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAAAXNSR0IArs4c6QAAA61JREFUOBF1VGloVFcU/u6bMTM2GYnYKQoiccGCRTSxGsUtLohLSE1QROOGwdbUioWKP0LVX4JBbbHigqJBxSVaaBtja9GgiYJLkmlwobVoJLU24BiXjCYzk5kcz7l33nsm0MfMvWf57rnnfufcC/BHNYeSMistvHhi4VE9lPbsmEsyg1rutMus6PsiQqxDZLaeKSPtogOriO5fISqfr/GpxfNY4d+XJ4D9K1ikxBJZQvHoIxNAYvAW1Po36Zni2eLwau/DW3pCeUGIumJRRYl4FFcrfGj4Cej3EdD+DJbypvkxfXVIQ9mAERM5Sd4Ie5efQccrE8IeN1XF9IKUbqFyqwF5+gDf/AIM+xRYfxKyDTWeT/C+jYJVOuXvFg7TCzecBvYuBSzO84ujQJzpOLJOu7wqzT9cJD5kNkK/17PoQXcCqN4JTFmuQTJohhyNBd6qE7s/8zs2PggKt2zTOh89TBd/IDr7LdGzx+1EXdMcYErwUmckil0FPsfR3BBAcGgtp5KrVNpt225hz2ID+vpHYBnnJV/4MfAmUmMUM5oyiBx5zv8wUMTpvH0B3KjMoEhbBBmBWRLZBTYwh3klwJ5FbqBQVQancYtznm4he4FxtDQB+5YZuXgXUHrcyJJG+N9qC3NKi5HLUXLygUTcOH3pgCy0v6tHAg6PRFSN8nkmvJTRHwCSTPyDa8DY+bDsRUqpfB1ZDM0NzHy3AYk+e91zByg68lYXOzn/WatN2HhOuihomjyZ3MoNUIYLu314eNMAeo9y6JmfR+H1lCjlPdXbbevS4WH8vP1D2K0vHjn0xMXAy1bgrzrutk4bD32MKStCqo9vnGt0JQuXD/YMNjwXWLOfi9kGtD5wg2UOYqYLgPT+vNHTMUKm7mA3lpaUNKAmrYeDmZjK93vIaGDgSKDpV6C2wi2bjVVM7YQixq6MwWOtESqUdDOOlnKtUp+AFpbxTRzPgX4Dag7aHjNn8Qvhz2AqrrNOrk84nrG22UJwcD5f5Si3nHFKeVvuAPcu9ww2YAiw+YK5xcSBlK6nG/AP9l07nuVYmY8JSNABRN+MROfrvmi66EGoyl0gkpcv1vhCYFQeEAgCxzYwn/+5mKyc1OPGptSd1JXTZE9aUofQeT7be8cq3MKc8ovSzad4+RTo0M+wG3Dy0oiToWs1ks44iToc2+jT97s34H39g0xg7eEY/H1X/W9AG6+fn65kBV61BnH3Ujra/rF0hpkDgU9mRDDoY6nwV1zhSlnzDvuWgENfomcKAAAAAElFTkSuQmCC)
        no-repeat;
      background-size: 30px 30px;
      padding-left: 35px;
      font-weight: bold;
      margin-bottom: 10px;
      line-height: 30px;
    }

    .voucherNotice {
      font-size: 15px;
      margin-bottom: 20px;
      color: $red;
      .moreDetail {
        color: $blue;
      }
    }

    .overage {
      width: 100%;
      padding: 15px 0 0;
      box-sizing: border-box;
      color: $tundora;
      font-size: 17px;

      > div {
        display: flex;
        justify-content: center;
        font-weight: bold;

        p {
          &:first-of-type {
            margin-right: 3px;
          }
        }
      }
    }
  }

  .tablist {
    list-style-type: none;
    padding: 5px 20px;
    color: $dove-gray;
    font-size: 14px;

    li {
      border-bottom: 1px solid $swirl;
      padding: 10px 0;

      .bar {
        display: flex;

        .cdate {
          width: 33%;
        }

        .item {
          width: 42%;
          color: $black;
        }

        .amount {
          text-align: right;
          justify-self: end;
          width: 25%;

          &.green {
            color: $la-palma;
          }
        }
      }

      .description {
        a {
          color: $dove-gray;
        }
        .enddate {
          color: $sliver;
        }
      }
    }
  }

  .voucherLookMoreBtn {
    display: block;
    font-size: 15px;
    padding: 5px 10px;
    color: $dove-gray;
    border-radius: 15px;
    border: 1px solid $dove-gray;
    margin: 20px auto;
  }

  .noData {
    font-size: 18px;
    margin-top: 80px;
    color: $tundora;
    display: flex;
    justify-content: center;
  }

  .mr10 {
    margin-top: 10px;
  }

  .red {
    color: $pomegranate;
  }
  padding-bottom: 60px;
}

.voucher__rec-items {
  padding: 30px 20px 0;
  h3 {
    display: inline-block;
    font-size: 15px;
    font-weight: normal;
    margin-bottom: 5px;
  }
  i {
    margin-right: 2px;
    display: inline-block;
    width: 15px;
    height: 15px;
    background-repeat: no-repeat;
    line-height: 15px;
    vertical-align: sub;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMSAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik04LjMyNC4zMTUgNC4wNjQgMTAuOThhLjUuNSAwIDAgMCAuNDY1LjY4NmgyLjc2M2EuNS41IDAgMCAxIC40OC42NGwtMS43MjcgNS44NjdhLjUuNSAwIDAgMCAuODI4LjVsOS43NjUtOS40ODNhLjUuNSAwIDAgMC0uMzQ4LS44NThoLTMuODc2YS41LjUgMCAwIDEtLjQ0Ni0uNzI2TDE1LjQ0LjcyNUEuNS41IDAgMCAwIDE0Ljk5NCAwSDguNzg4YS41LjUgMCAwIDAtLjQ2NC4zMTV6IiBmaWxsPSIjMDZjIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+Cg==");
    background-size: 18px;
  }
  button {
    display: block;
    font-size: 15px;
    padding: 5px 10px;
    color: white;
    background-color: #f34f59;
    border-radius: 15px;
    border: 0;
    margin: 20px auto;
  }
}

.voucherNotice {
  list-style-type: none;
  font-size: 1.4rem;
  li {
    &::before {
      content: "•";
      font-size: 15px;
      margin-right: 5px;
    }
  }
}
</style>
