<template>
  <div class="brandSearch">
    <div class="brandNav">
      <div class="logo">
        <a :href="logoUrl">
          <img :src="supplierData.logoMobile"
            :style="{ backgroundColor: `${supplierData.headerColor ? supplierData.headerColor : '#ddd5cc'}` }">
        </a>
      </div>
      <div class="search">
        <p>櫃內搜尋</p>
        <div class="input">
          <input type="text" placeholder="搜尋櫃內商品" v-model="inputVal" @keydown="goSearchByEnter">
          <img data-v-deb93296="" src="https://event.shopping.friday.tw/event/CP/common/mobile_icon/search-gy.svg"
            @click="goSearch">
        </div>
      </div>
    </div>
    <productFilterList v-if="data" :filterData="data" @setSorting="setSorting" />
  </div>
</template>

<script>
import productFilterList from "../brandPromotion/productFilterList.vue";
export default {
  name: "brandSearch",
  data() {
    return {
      data: null,
      inputVal: "",
      keyword: "",
      apiParams: {
        target_value: this.api.ai.aiUserId(),
        remote: /friday\.tw/.test(location.hostname) ? "w" : "yw",
        sorting: "RELEVANT",
        and_brand: "",
        supplier: "",
        kws: "",
        kws64: "",
        page: 1,
        size: 99,
        limit_cnts: 99,
      },
      isApiLoaded: false,
    };
  },
  props: {
    supplierData: {
      type: Object,
    },
  },
  async created() {
    const { kw } = this.tools.urlSearchToObj();
    this.inputVal = kw;
    this.keyword = kw;
    this.getSearchApi();
  },
  methods: {
    // 取得搜尋資料
    async getSearchApi() {
      const {
        b4Info,
        supplierId,
        unShowSupplierIds,
      } = this.supplierData;
      const postData = {};
      this.isApiLoaded = false;

      this.apiParams.kws = this.keyword;
      this.apiParams.kws64 = this.tools.base64Encode(this.keyword);

      const supplierIds = b4Info ? b4Info.supplierIds : "";
      const supId = supplierIds ? supplierIds.toString() : supplierId;
      const unshownSupIds = unShowSupplierIds
        ? unShowSupplierIds.toString()
        : "";
      const prodType = b4Info ? b4Info.prodFlag : "";

      postData.filter = this.api.ai.composeBListFilter(
        supId,
        unshownSupIds,
        this.bid,
        this.keyword,
        "",
        "",
        prodType
      );

      const data = await this.api.ai.getSearchData({
        ...this.apiParams,
        ...postData,
      });

      if (data && data.results && data.results.length > 0) {
        this.data = data.results.map((e) => {
          return {
            image_url: e.images,
            name: e.name,
            price: e.price,
            pid: e.pid,
            new_date: e.new_date,
            kids: e.kids_show,
            isStore: e.isStore,
            soldout: !e.isQuantity,
          };
        });
      } else {
        this.data = [];
      }

      this.isApiLoaded = true;
    },
    // 過濾搜尋排序
    setSorting(payload) {
      this.apiParams = Object.assign(this.apiParams, { page: 1 }, payload);
      this.data = [];
      this.nextPage = true;
      this.getSearchApi(true);
    },
    //搜尋框點擊事件
    goSearch() {
      location.href = `/shop/${this.supplierData.urlSuffix}/search?kw=${this.inputVal}`;
    },
    //搜尋框enter事件
    goSearchByEnter(evt) {
      if (evt) {
        if (evt.keyCode === 13) {
          this.goSearch();
        }
        evt.stopPropagation();
      }
    },
  },
  computed: {
    logoUrl() {
      return `/shop/${this.supplierData.urlSuffix}`;
    }
  },
  components: {
    productFilterList,
  },
};
</script>

<style lang="scss" scoped>
@import "../../style/color";

.brandSearch {
  .brandNav {
    display: flex;
    align-items: center;
    padding: 5px 10px;
    position: sticky;
    top: 87px;
    z-index: 1;
    background-color: $white;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.16);

    .logo {
      margin-right: 5px;
      border-radius: 5px;

      img {
        width: auto;
        max-height: 40px;
        object-fit: contain;
        border-radius: 5px;
        vertical-align: top;
      }
    }

    .search {
      flex: 1 1 70%;
      margin: 5px 0;
      display: flex;
      align-items: center;

      p {
        font-size: 14px;
        margin-right: 5px;
        min-width: 60px;
      }

      .input {
        width: 100%;
        position: relative;

        input {
          width: 100%;
          box-sizing: border-box;
          padding: 0 10px;
          height: 40px;
          border-radius: 10px;
          background-color: #fff;
          border: 1px solid $sliver;
        }

        img {
          position: absolute;
          top: 8px;
          right: 15px;
        }
      }
    }
  }
}
</style>
